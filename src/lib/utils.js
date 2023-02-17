import { BigNumber, ethers } from "ethers";
import {
  metalendCollateralAxieAddress,
  metalendCollateralAxieLandAddress,
} from "./constants.js";
import * as readline from "readline";

/**
 * ensures address input is in correct format to operate with, otherwise throws
 * @param {string} address 
 * @returns address string
 */
export function sanitizeAddress(address) {
  if (address.substring(0, 5) === "ronin") {
    address = "0x" + address.substring(6);
  }
  if (!ethers.utils.isAddress(address)) {
    throw "Incorrect address input";
  }
  return address.toLowerCase();
}

/**
 * enum for token kinds
 */
export const TokenKind = {
  AXIE: "AXIE",
  AXIE_LAND: "AXIE_LAND",
};

/**
 * returns address of collateral market based on token kind input
 */
export const getCollateralTokenAddressByTokenKind = {
  AXIE: metalendCollateralAxieAddress,
  AXIE_LAND: metalendCollateralAxieLandAddress,
};

/**
 * @notice do not modify this function
 * @dev this returns value of given token id from appraisal struct
 * @param {appraisalStruct} appraisal 
 * @param {string} tokenKind address
 * @param {BigNumber} tokenId 
 * @returns value of token id in BigNumber format
 */
export function getAppraisalForTokenId(appraisal, tokenKind, tokenId) {
  let cursor = 0;

  for (let i = 0; i < appraisal.appraisalTokens.length; i++) {
    let tokenKind_ = appraisal.appraisalTokens[i];

    for (let j = 0; j < appraisal.appraisalLengths[i]; j++) {
      let tokenId_ = appraisal.appraisalTokenIds[cursor];

      if (tokenId_ === tokenId.toString() && tokenKind_ === tokenKind) {
        let e = appraisal.appraisalValues[cursor];

        return BigNumber.from(
          e.toLocaleString("fullwide", {
            useGrouping: false,
          })
        ).div(ethers.BigNumber.from("1000000000000000000"));
      }

      cursor++;
    }
  }

  // nothing found
  throw "Token id does not exist in borrowers appraisal, please try again with different token ids";
}

/**
 * @notice this serves to ask user for confirmation for given actions
 * @param {*} stringQuestion 
 */
export async function checkUserPermission(stringQuestion) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  let answer = "";
  while (answer !== "y" && answer !== "n") {
    answer = await new Promise((resolve) => {
      console.log(stringQuestion);
      rl.question("Would you like to proceed? [y/n] ", resolve);
    });

    if (answer === "y") {
      console.log("Continuing...");
    } else if (answer === "n") {
      console.log("Cancelled.");
      process.exit(0);
    } else {
      console.log("Invalid input. Please enter y or n.");
    }
  }

  rl.close();
}
