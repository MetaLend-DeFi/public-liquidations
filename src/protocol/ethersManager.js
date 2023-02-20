import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config();

/**
 * @notice initialize ronin provider
 */
export const provider = new ethers.providers.JsonRpcProvider(
  process.env.RONIN_RPC_URL
);

/**
 * @notice Load private key from the environment variable
 * @dev private key is used only in this file to initialize signer
 */
const privateKey = process.env.PRIVATE_KEY;
if (privateKey === undefined) {
  throw "Must use private key in .env file";
}

/**
 * @notice Create a wallet object from the private key and connect it to the provider
 */
export const signer = new ethers.Wallet(privateKey, provider);
