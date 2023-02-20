import { ethers } from "ethers";
import {
  metalendCollateralAxieAddress,
  metalendCollateralAxieLandAddress,
} from "../../lib/constants.js";
import { provider } from "../ethersManager.js";

/**
 * @notice this class serves as a read only collateral contract - Axie and AxieLand
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
    name: "getAccountTokens",
    outputs: [
      {
        internalType: "uint256[]",
        name: "",
        type: "uint256[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

class CollateralErc721 {
  constructor(address) {
    this.contractReadonly = new ethers.Contract(
      address,
      abiReadonly,
      provider
    );
  }

  /**
   * readonly function of all token ids by token kind for given address
   * @param address of the borrower
   * @returns BigNumber array for account token ids
   */
  async getAccountTokens(address) {
    return await this.contractReadonly.getAccountTokens(address);
  }
}

export const collateralAxieContract = new CollateralErc721(
  metalendCollateralAxieAddress
);
export const collateralAxieLandContract = new CollateralErc721(
  metalendCollateralAxieLandAddress
);

/**
 * get given collateral contract for token kind
 */
export const getCollateralContractByTokenKind = {
  AXIE: collateralAxieContract,
  AXIE_LAND: collateralAxieLandContract,
};
