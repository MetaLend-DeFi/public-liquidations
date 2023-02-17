/////////////////////////////////////////////////////////////////////////////
/**
 * @notice this script gets all addresses with their tokens and prices
 * it writes to a file in /listings directory in project root
 * @dev our appraisal is wei value scaled by e18, before writing the file
 * convert each token value value to ETH representation
 */
/////////////////////////////////////////////////////////////////////////////

import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils.js";
import { api } from "./api/api.js";
import { file } from "./lib/fs.js";

/**
 * this converts appraisal string to proper ETH representation
 * @param {string} value 
 * @returns string of token value
 */
function transform(value) {
  let val = BigNumber.from(value);
  val = val.div(BigNumber.from("1000000000000000000"));
  return `${formatEther(val)} ETH`;
}

/**
 * helper function to create a new object with token values converted
 * @param {object} input 
 * @returns data with scaled appraisal values
 */
function modifyValues(input) {
  const output = {};

  for (const borrowerAddress in input) {
    const borrowerData = input[borrowerAddress];
    const transformedData = {};
    for (const tokenKind in borrowerData) {
      const tokens = borrowerData[tokenKind];
      const transformedTokens = {};
      for (const tokenId in tokens) {
        const tokenValue = tokens[tokenId];
        const transformedValue = transform(tokenValue);
        transformedTokens[tokenId] = transformedValue;
      }
      transformedData[tokenKind] = transformedTokens;
    }
    output[borrowerAddress] = transformedData;
  }

  return output
}

async function run() {
  const { data } = await api.getAll();

  const res = modifyValues(data)
  console.log(res);
  file.writeFile("listings/all.json", JSON.stringify(res));

  console.log("Success, check /listings/all.json")
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
