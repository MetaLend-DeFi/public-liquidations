/////////////////////////////////////////////////////////////////////////////
/**
 * @notice this script liquidates selected tokens
 * @dev ensure to change the following input params based on your situation, choose token ids and borrower you want to liquidate
 */
const borrowerAddress = "0x0000000000000000000000000000000000000000"; // address of the borrower in string format
const tokenKind = TokenKind.AXIE; // TokenKind.AXIE, TokenKind.AXIE_LAND
const tokenIds = ["123", "1"]; // token ids in string format which belong to the specified tokenKind
/////////////////////////////////////////////////////////////////////////////

import {
  checkUserPermission,
  getAppraisalForTokenId,
  getCollateralTokenAddressByTokenKind,
  sanitizeAddress,
  TokenKind,
} from "./lib/utils.js";
import { BigNumber } from "ethers";
import { api } from "./api/api.js";
import { getCollateralContractByTokenKind } from "./protocol/contract/collateralErc721.js";
import { getActiveMarket } from "./protocol/contract/marketErc20.js";
import { liquidityAssessorContract } from "./protocol/contract/liquidityAssessor.js";
import { formatEther } from "ethers/lib/utils.js";
import { wethContract } from "./protocol/contract/erc20.js";
import { signer } from "./protocol/ethersManager.js";

async function run() {
  /**
   * @notice construct params
   * @param address the borrower in shortfall to be liquidated
   * @param tokenKindAddress the collateral Erc721 market in which to seize collateral from the borrower
   * @param bigNumberTokenIds the tokenIds to seize
   * @param repayAmount the amount of the underlying borrowed asset to repay. It equals to 90% of appraised value of selected token ids
   * @param appraisal the appraisal of Erc721 assets
   * @param market the market contract to execute liquidation
   */
  const addressBorrower = sanitizeAddress(borrowerAddress);
  const tokenKindAddress = getCollateralTokenAddressByTokenKind[tokenKind];
  const bigNumberTokenIds = tokenIds.map((id) => BigNumber.from(id));
  let repayAmount = BigNumber.from("0"); // calculated further from appraisal
  const appraisal = await api.getAppraisal(addressBorrower);
  const market = await getActiveMarket(addressBorrower);

  /**
   * @notice sanity checks
   */

  /**
   * @notice first check if given borrower holds given token ids
   */
  const collateralContract = getCollateralContractByTokenKind[tokenKind];
  const borrowerTokens = await collateralContract.getAccountTokens(
    addressBorrower
  );
  const borrowerTokensString = borrowerTokens.map(function (value) {
    return value.toString();
  });
  const allValuesIncluded = bigNumberTokenIds.every((value) =>
    borrowerTokensString.includes(value.toString())
  );
  if (!allValuesIncluded)
    throw "Given address does not own given token ids for this token kind, please double check your input. It is possible the borrower repaid their loan and is no longer in shortfall. We update the request results each 30 minutes and plan to upgrade the interval";

  /**
   * @notice second calculate repay amount and check if liquidation is allowed to happen
   * with given parameters according to conditions described in readme
   */
  let totalValue = BigNumber.from("0");
  for (let i = 0; i < bigNumberTokenIds.length; i++) {
    const token = bigNumberTokenIds[i];
    totalValue = totalValue.add(
      getAppraisalForTokenId(appraisal, tokenKindAddress, token)
    );
  }
  const discount = BigNumber.from("900000000000000000"); // 0.9
  const ethMantissa = BigNumber.from("1000000000000000000"); // 1.0
  repayAmount = totalValue.mul(discount).div(ethMantissa).div(ethMantissa);
  const allowed = await liquidityAssessorContract.isLiquidationAllowed(
    market.contractReadonly.address,
    tokenKindAddress,
    addressBorrower,
    repayAmount,
    bigNumberTokenIds,
    appraisal
  );
  if (Number(allowed.toString()) === 17) {
    throw "Liquidating these token ids would overliquidate the borrower. Please choose fewer tokens. Double check the borrower's shortfall";
  } else if (Number(allowed.toString()) === 3) {
    throw "Borrower is no longer in shortfall. Please choose a different token ids and borrower";
  } else if (Number(allowed.toString()) !== 0) {
    throw "Liquidation is not allowed to happen with given parameters, unknown error, please try again with different token ids";
  }

  /**
   * @notice third ask liquidator if they wanna proceed with given amount and token ids
   * if yes, continue script and approve transfer of Erc20 assets from liquidator wallet to market
   * @dev press `y` for yes or `n` for no
   */
  const question = `Liquidation of token ids ${tokenIds} will cost you ${formatEther(
    repayAmount
  )} WETH`;
  await checkUserPermission(question);
  const balanceLiquidator = await wethContract.balanceOf(signer.address);
  if (balanceLiquidator.lt(repayAmount))
    throw "Your balance is not high enough to proceed with liquidation";
  await wethContract.approve(market.contractReadonly.address, repayAmount);

  /**
   * @notice finally execute liquidation
   * @dev this send a transaction to market contract liquidating borrower, tokens will be transferred to liquidators address
   */
  let txHash;
  if (tokenKind == TokenKind.AXIE) {
    const tx = await market.liquidateAxie(
      addressBorrower,
      repayAmount,
      tokenKindAddress,
      bigNumberTokenIds,
      appraisal
    );
    const receipt = await tx.wait();
    txHash = receipt.transactionHash;
  } else if (tokenKind == TokenKind.AXIE_LAND) {
    const tx = await market.liquidateAxieLand(
      addressBorrower,
      repayAmount,
      tokenKindAddress,
      bigNumberTokenIds,
      appraisal
    );
    const receipt = await tx.wait();
    txHash = receipt.transactionHash;
  }

  /**
   * @notice please, do not remove this line. It only registers the transaction hash into our backend so we can process it,
   * modify database state and adjust the results you will be getting from our API
   */
  await api.registerTransaction(txHash);

  console.log("Success, tokens are now in your wallet");
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
