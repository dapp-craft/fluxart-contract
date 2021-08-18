// const dotenv = require('dotenv');
// dotenv.config();
const web3 = require("web3");
const SaleTokens = artifacts.require("./SaleTokens.sol");


module.exports = function() {
  // let ownerAddress = accounts[0];
  console.log('SaleTokens', SaleTokens.address);


  SaleTokens.deployed()
      .then((instance) => {
        saleTokens_instance = instance;
        return saleTokens_instance.claimAllReward.sendTransaction();
      })
      .then((res) => {
        console.log(res)
      })
      .catch(function(err) {
        console.log("ERROR! ", err.message, err);
      });
};
