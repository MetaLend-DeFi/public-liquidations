import * as fs from "fs";
import * as path from "path";

/**
 * @notice this class serves for writing API request results to files
 */

class File {
  /**
   * writes content to file in filePath
   * @param {string} filePath 
   * @param {string} content 
   */
  writeFile(filePath, content) {
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
    fs.writeFileSync(filePath, content);
  }
}

export const file = new File();
