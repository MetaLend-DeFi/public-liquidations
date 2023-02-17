import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

/**
 * @notice this class provides access to our API to query shortfall borrowers and get their appraisal
 */

axios.defaults.withCredentials = true;

const axiosApi = axios.create({
  baseURL: process.env.API_URL,
  timeout: 15000,
  headers: {
    "Content-type": "application/json",
  },
});

const setupAxios = () => {
  axiosApi.interceptors.request.use(function (request) {
    const token = process.env.API_KEY;

    if (token) {
      request.headers["Authorization"] = token;
    } else {
      throw "No API key - contact us to request one";
    }

    return request;
  });

  axiosApi.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response) {
        throw error.response.data.message;
      } else if (error.request) {
        // The request was made but no response was received
        throw error.request;
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error.message;
      }
    }
  );
};

class Api {
  constructor() {
    setupAxios();
  }

  /**
   * @returns `address => tokenKind => tokenId => tokenValue` for all shortfall borrowers
   */
  async getAll() {
    return await axiosApi.get(`/get-all`);
  }

  /**
   * @returns `addresses`
   */
  async getBorrowers() {
    return await axiosApi.get(`/get-borrowers`);
  }

  /**
   * @param {string} address of the borrower
   * @returns `tokenKind => tokenId => tokenValue` for given address
   */
  async getTokensForBorrower(address) {
    return await axiosApi.get(`/get-tokens-for-borrower?address=${address}`);
  }

  /**
   * @param {string} address of the borrower
   * @returns `appraisalStruct` for liquidation, this struct must be passed as parameter to function when interacting with contract
   */
  async getAppraisal(address) {
    return await axiosApi.get(`/get-appraisal?address=${address}`);
  }

  /**
   * @dev please do not edit this function
   * @param {string} txHash transaction hash
   * @returns `appraisalStruct` for liquidation, this struct must be passed as parameter to function when interacting with contract
   */
  async registerTransaction(txHash) {
    await axiosApi.post(`/register`, {
      hash: txHash,
      chainKind: "RONIN",
    });
  }
}

export const api = new Api();
