import { BigNumber, ethers } from "ethers";
import { metalendMarketWethAddress } from "../../lib/constants.js";
import { provider, signer } from "../ethersManager.js";

/**
 * @notice this class serves as a read and write contract for borrower/lend market where liquidations happen
 */

const abiReadonly = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "borrowBalanceStored",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

const abi = [
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        internalType: "contract CErc721Interface",
        name: "cErc721TokenCollateral",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "address[]",
            name: "appraisalTokens",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalLengths",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalTokenIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalValues",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "appraisalGoodUntil",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct AppraisalStruct.Wire",
        name: "appraisal",
        type: "tuple",
      },
    ],
    name: "liquidateBorrowAndRedeemErc721Mainchain",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "borrower",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "repayAmount",
        type: "uint256",
      },
      {
        internalType: "contract CErc721Interface",
        name: "cErc721TokenCollateral",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "tokenIds",
        type: "uint256[]",
      },
      {
        components: [
          {
            internalType: "address[]",
            name: "appraisalTokens",
            type: "address[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalLengths",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalTokenIds",
            type: "uint256[]",
          },
          {
            internalType: "uint256[]",
            name: "appraisalValues",
            type: "uint256[]",
          },
          {
            internalType: "uint256",
            name: "appraisalGoodUntil",
            type: "uint256",
          },
          {
            internalType: "bytes",
            name: "signature",
            type: "bytes",
          },
        ],
        internalType: "struct AppraisalStruct.Wire",
        name: "appraisal",
        type: "tuple",
      },
    ],
    name: "liquidateBorrowAndRedeemErc721Staking",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

class MarketErc20 {
  constructor(address) {
    this.contractReadonly = new ethers.Contract(address, abiReadonly, provider);
    this.contract = new ethers.Contract(address, abi, signer);
  }

  /**
   * get borrow balance of borrower
   * @param {string} address
   * @returns BigNumber borrow balance
   */
  async getBorrowBalance(address) {
    return await this.contractReadonly.borrowBalanceStored(address);
  }

  /**
   * liquidate selected Axie token ids from borrower
   * @param {string} borrowerAddress
   * @param {BigNumber} repayAmount
   * @param {string} collateralMarket
   * @param {BigNumber[]} tokenIds
   * @param {appraisalStruct} appraisal
   */
  async liquidateAxie(
    borrowerAddress,
    repayAmount,
    collateralMarket,
    tokenIds,
    appraisal
  ) {
    return await this.contract.liquidateBorrowAndRedeemErc721Mainchain(
      borrowerAddress,
      repayAmount,
      collateralMarket,
      tokenIds,
      appraisal,
      { gasLimit: 20000000 }
    );
  }

  /**
   * liquidate selected AxieLand token ids from borrower
   * @param {string} borrowerAddress
   * @param {BigNumber} repayAmount
   * @param {string} collateralMarket
   * @param {BigNumber[]} tokenIds
   * @param {appraisalStruct} appraisal
   */
  async liquidateAxieLand(
    borrowerAddress,
    repayAmount,
    collateralMarket,
    tokenIds,
    appraisal
  ) {
    return await this.contract.liquidateBorrowAndRedeemErc721Staking(
      borrowerAddress,
      repayAmount,
      collateralMarket,
      tokenIds,
      appraisal,
      { gasLimit: 20000000 }
    );
  }
}

export const marketWethContract = new MarketErc20(metalendMarketWethAddress);
const markets = [marketWethContract];

/**
 * borrower can only have one active market borrow at a time, find which one
 * @param {string} borrowerAddress
 * @returns an active market for borrower
 */
export async function getActiveMarket(borrowerAddress) {
  for (let i = 0; i < markets.length; i++) {
    const market = markets[i];
    const borrow = await market.getBorrowBalance(borrowerAddress);
    if (borrow.gt(BigNumber.from("0"))) {
      return market;
    }
  }
  throw "Wrong address, borrower has no active borrow, choose a different one. It is possible the borrower repaid their loan and is no longer in shortfall. We update the request results each 30 minutes and plan to upgrade the interval";
}
