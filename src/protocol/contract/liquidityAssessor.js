import { ethers } from "ethers";
import { metalendLiquidityAssessorAddress } from "../../lib/constants.js";
import { provider } from "../ethersManager.js";

/**
 * @notice this is a read only liquidity assessor which serves to calculate liquidity of borrower and determine
 * if liquidations are allowed to happen
 */

const abiReadonly = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "cTokenBorrowed",
        type: "address",
      },
      {
        internalType: "address",
        name: "cErc721TokenCollateral",
        type: "address",
      },
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
    name: "liquidateBorrowAllowedErc721",
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

class LiquidityAssessor {
  constructor() {
    this.contractReadonly = new ethers.Contract(
      metalendLiquidityAssessorAddress,
      abiReadonly,
      provider
    );
  }

  /**
   * this function calculates if liquidation is allowed to given for this borrower and token ids
   * @param {string} borrowMarket
   * @param {string} collateralMarket
   * @param {string} borrowerAddress
   * @param {BigNumber} repayAmount
   * @param {BigNumber[]} tokenIds
   * @param {appraisalStruct} appraisal
   * @returns true/false if liquidation is allowed to happen or not (potential error code)
   */
  async isLiquidationAllowed(
    borrowMarket,
    collateralMarket,
    borrowerAddress,
    repayAmount,
    tokenIds,
    appraisal
  ) {
    return await this.contractReadonly.liquidateBorrowAllowedErc721(
      borrowMarket,
      collateralMarket,
      borrowerAddress,
      repayAmount,
      tokenIds,
      appraisal
    );
  }
}

export const liquidityAssessorContract = new LiquidityAssessor();
