import dotenv from "dotenv";
dotenv.config();

/**
 * @dev these env variables are included in .env.example for mainnet ronin
 */

export const roninWethAddress = process.env.RONIN_WETH_ADDRESS;

export const metalendComptrollerAddress =
  process.env.METALEND_COMPTROLLER_ADDRESS;
export const metalendCollateralAxieAddress =
  process.env.METALEND_COLLATERAL_AXIE_ADDRESS;
export const metalendCollateralAxieLandAddress =
  process.env.METALEND_COLLATERAL_AXIE_LAND_ADDRESS;
export const metalendMarketWethAddress =
  process.env.METALEND_MARKET_WETH_ADDRESS;
export const metalendLiquidityAssessorAddress =
  process.env.METALEND_LIQUIDITY_ASSESSOR_ADDRESS;
