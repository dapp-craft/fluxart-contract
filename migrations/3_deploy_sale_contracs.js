const web3 = require("web3");
const SaleTokens = artifacts.require("./SaleTokens.sol");
const FluxArtNFT = artifacts.require("./FluxArtNFT.sol");


module.exports = function(deployer, network, accounts) {
  let ownerAddress = accounts[0];
  console.log('Using account', ownerAddress, 'NFT Collection', FluxArtNFT.address);

  const price = web3.utils.toWei('0.015', "ether");
    let fluxArtNFT_instance;

  deployer.deploy(SaleTokens,
      FluxArtNFT.address,
      ['0xF0D193D8524eC55fe2F5159aaD2BA1A264993605', ownerAddress],
      [9900,100],
      price,

      {from: ownerAddress})
      .then((res) => {
          return FluxArtNFT.deployed();
      })
      .then((instance) => {
          fluxArtNFT_instance = instance;
          return fluxArtNFT_instance.MINTER_ROLE.call();
      })
      .then((minter_role) => {
          console.log('grantRole', SaleTokens.address, minter_role);
          return fluxArtNFT_instance.grantRole.sendTransaction(minter_role, SaleTokens.address, {from: ownerAddress});
      })
      .catch(function(err) {
        console.log("ERROR! ", err.message);
      });
};
