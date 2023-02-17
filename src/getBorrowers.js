/////////////////////////////////////////////////////////////////////////////
/**
 * @notice this script gets all addresses for shortfall borrowers and their shortfall
 */
/////////////////////////////////////////////////////////////////////////////

import { formatEther } from "ethers/lib/utils.js";
import { api } from "./api/api.js";
import { file } from "./lib/fs.js";

/**
 * 
 * @param {object} obj 
 * @returns borrowers with shortfall in ETH
 */
function transformShortfallValues(obj) {
  const transformedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      transformedObj[key] = `${formatEther(obj[key])} ETH`;
    }
  }
  return transformedObj;
}

async function run() {
  const { data } = await api.getBorrowers()

  const res = transformShortfallValues(data)
  
  console.log(red)
  file.writeFile("listings/borrowers.json", JSON.stringify(res))

  console.log("Success, check /listings/borrowers.json")
}

run().catch(error => {
  console.error(error);
  process.exitCode = 1;
});