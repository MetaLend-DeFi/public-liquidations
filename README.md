# MetaLend Public Liquidations
The MetaLend protocol is a fork of the Compound Protocol with the addition of ERC721 tokens. This node project exposes liquidations to the public, anyone can use this project to liquidate shortfall borrowers. However, the liquidation function requires borrower's appraisals which is generated and signed by the MetaLend backend. 

Liquidation Incentive - Shortfall NFTs are available to liquidators at a 10% discount to their appraised value. This is currently a global incentive across all ERC-721 assets, but we’ll be adding different discounts by asset soon.

With this repository and an API key it's possible to get all the information needed to perform liquidations from your own liquidator wallet without sharing your private keys or signing external transactions.

## How liquidations work
Liquidating a borrower happens by interacting with the market with their active borrow. Each borrower can have only one active market at a time. Meaning as soon as USDC and RON markets are launched, borrowers can choose any market they want to borrow from, but they cannot borrow from two markets at a time. Borrowers can increase or decrease their borrow in their current market. As soon as they fully repay their loan they can pick a different market to borrow from.

During liquidation, the liquidator must repay in the same currency as the borrower's active loan. We only allow liquidating one token kind (Axie, Axie Land) at a time per transaction, but it is possible to liquidate multiple token ids in a single transaction. 

Borrowers cannot be over liquidated, meaning if someone tries to liquidate more tokens than required, the transaction gets reverted. Liquidations go in linear order from left to right of the token id array. The transaction sums up the token values to liquidate and if there are still tokens left in the array when the borrower is brought out of shortfall, the transaction fails. 

However, there is no block for total value of assets during liquidation, so it is possible to liquidate a user’s highest value NFT even if the borrower is in shortfall by a small shortfall. 

If a liquidation pays for the entirety of a borrower's loan, the overpaid amount is converted into lending pool assets for the borrower.

## Updates
This repository will receive updates to contain new markets to liquidate from and new discounts. You can update with `git pull` or by re-downloading the repository/release. We will share updates on social media.

## Setup
* get `nodejs` - https://nodejs.org/en/download/
* or (recommended) you can install NVM (Node Version Manager) to be able to select any version of node
  * https://github.com/nvm-sh/nvm
  * `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`
  * once installed you can run `nvm install node` (latest) or `nvm install <version>`
  * you can switch between version by `nvm use <version>` or in root directory of this project by `nvm use`. This will select node version 16 specified in .nvmrc (or ask you to install it)
* `npm` is installed alongise node, however recommended package manager is yarn
  * installation differs between platforms, see `docs/installing-node.md` for more details
* open project in your favourite IDE (VS code) and open terminal
* in terminal run `yarn install` or `npm install` to install modules
* you need API key and private key
  * rename file `.env.example` to to `.env` and put the keys there instead of the `...`
  * contact us to get an API key
  * the only place we use private key is when initializing `signer` with `ethersjs library`
  * you can search for `process.env.PRIVATE_KEY`
  * this is to allow trigerring and signing liquidation transactions for you in scripts
  * the project does not use the private key in any other form and is completely safe, however, since the private key is still saved in one of your local files, we recommend having a proper system security and use a unique wallet for liquidations - from which you can then transfer liquidated assets out to main wallets

## Liquidation process
* you can get all shortfall borrowers and their tokens with values by running
  * `npm run getTokens` or `node src/getAllBorrowersAndTokens.js` and checking newly created /listings directory `all.json` file
* you can get the shortfall amount of each borrower by running
  * `npm run getBorrowers` or `node src/getBorrowers.js` and checking /listings directory `borrowers.json` file
  * this shortfall usually corresponds to how many assets can be liquidated from borrower if you go for low value Axies. If you liquidate high value asset it usually brings person out of shortfall at once.
* liquidating borrower
  * once you select token id(s) you want to liquidate with discount, open file `src/liquidateTokenIds.js`
  * in the top of the file fill in
    * `borrowerAddress` - only one borrower can be liquidated at a time in one transaction
    * `tokenKind` - (AXIE / AXIE_LAND) - only one token kind can be liquidated in one transaction
    * `tokenIds` - example: ["1", "2", "3"]
  * save the file and run `npm run liquidate` or `node src/liquidateTokenIds.js`
  * the script contains error messages and before liquidation occurs, it will show how much you are required to pay for given token ids and prompt you to select `y` or `n` to either continue or not. If you continue, it will automatically approve the amount you're required to pay so the market contract can transfer it and then trigger a liquidation transaction which repays the amount for borrower and transfers selected token ids to your liquidator wallet.
  * liquidating one asset at a time almost always works. There are a few exceptions such as our cache from which we serve the API responses has not been updated yet if user repaid their loan and escaped shortfall. Of any such situation, you will be informed during the script execution and no transactions from your side will be send.
  * liquidating multiple token ids is a little tricky, because you cannot overliquidate the borrower. So we recommend checking borrower's shortfall and then sum the values of the token ids you want to liquidate modified by 90% discount and comparing this to the shortfall. If a situation during which overliquidation would happen, the script will stop and inform you so you can correct the selected token ids.

## Concise process
* get `nodejs`
* run `yarn install` (recommended) or `npm install`
* rename `.env.example` to `.env` and put your keys (API and private) to the top of the file
* run `npm run getTokens` to see all shortfall borrowers with their token ids and values
* run `npm run getBorrowers` to see shortfall amount of each borrower
* modify `src/liquidateTokenIds.js` with `borrowerAddress`, `tokenKind` and `tokenIds` and then run `npm run liquidate` to trigger liquidation

## If you need any help, do not hesitate to contact us 
