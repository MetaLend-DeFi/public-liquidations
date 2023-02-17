import { ethers } from "ethers";
import { metalendComptrollerAddress } from "../../lib/constants.js";
import { providerReadonly } from "../ethersManager.js";

/**
 * @notice this class serves as a read only comptroller contract - manages the protocol
 * @dev currently unused
 */

const abiReadonly = [
  {
    constant: true,
    inputs: [],
    name: "getAllMarkets",
    outputs: [
      {
        internalType: "contract CTokenInterface[]",
        name: "",
        type: "address[]",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];

class Comptroller {
  constructor() {
    this.contractReadonly = new ethers.Contract(
      metalendComptrollerAddress,
      abiReadonly,
      providerReadonly
    );
  }

  /**
   * this function returns all borrow/lend markets supported in MetaLend
   * @returns address array
   */
  async getAllErc20Markets() {
    return await this.contractReadonly.getAllMarkets();
  }
}

export const comptrollerContract = new Comptroller();
