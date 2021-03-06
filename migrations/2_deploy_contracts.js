const FluxArtNFT = artifacts.require("./FluxArtNFT.sol");

module.exports = function(deployer, network, accounts) {
  let ownerAddress = accounts[0];
  // OpenSea proxy registry addresses for rinkeby and mainnet.
  let proxyRegistryAddress;
  if (network === 'rinkeby') {
    proxyRegistryAddress = "0xf57b2c51ded3a29e6891aba85459d600256cf317";
  } else {
    proxyRegistryAddress = "0xa5409ec958c83c3f309868babaca7c86dcb077c1";
  }

  const maxSupply = 576;
  console.log('Using account', ownerAddress, 'maxSupply', maxSupply);

  deployer.deploy(FluxArtNFT,
      proxyRegistryAddress,
      maxSupply
  )
      .catch(function(err) {
        console.log("ERROR! ", err.message);
      });
};
