import { BigNumber, ethers } from "ethers";
import { roninWethAddress } from "../../lib/constants.js";
import { provider, signer } from "../ethersManager.js";

/**
 * @notice this class serves as a read and write contract for Erc20 tokens (WETH, USDC...)
 */

const abiReadonly = [
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "who",
        type: "address",
      },
    ],
    name: "balanceOf",
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
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

class Erc20 {
  constructor(address) {
    this.contractReadonly = new ethers.Contract(address, abiReadonly, provider);
    this.contract = new ethers.Contract(address, abi, signer);
  }

  /**
   * gets the current approved amount for owner - spender
   * @param {string} owner
   * @param {string} spender
   * @returns BigNumber allowance
   */
  async allowance(owner, spender) {
    return await this.contractReadonly.allowance(owner, spender);
  }

  /**
   * approve spender to transfer amount from owner (msg.sender)
   * @param {string} spender
   * @param {BigNumber} amount
   */
  async approve(spender, amount) {
    await this.contract.approve(spender, amount, { gasLimit: 200000 });
  }

  /**
   * get balance for given address
   * @param {string} liquidator
   * @returns BigNumber balance of address
   */
  async balanceOf(liquidator) {
    return await this.contractReadonly.balanceOf(liquidator);
  }
}

export const wethContract = new Erc20(roninWethAddress);
