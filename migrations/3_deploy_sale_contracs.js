const web3 = require("web3");
const SaleTokens = artifacts.require("./SaleTokens.sol");
const FluxArtNFT = artifacts.require("./FluxArtNFT.sol");


module.exports = function(deployer, network, accounts) {
  let ownerAddress = accounts[0];
  console.log('Using account', ownerAddress, 'NFT Collection', FluxArtNFT.address);

  const price = web3.utils.toWei('0.1', "ether");
    let fluxArtNFT_instance;

  deployer.deploy(SaleTokens,
      FluxArtNFT.address,
      [
          // '0xF0D193D8524eC55fe2F5159aaD2BA1A264993605', '0xf308239230Dd2965fBA141B164967E80069C4246', // test
          '0xfB462272cf88268786545abB5eA18446f1D326C9','0x3cf368FaeCdb4a4E542c0efD17850ae133688C2a', // main
          '0x27b09d167d8ed88563d81ed766cbd280c8b434c5','0xB74DD5a45490D29c18f63788Aa3bBeE573D3bCB0','0x5e470E0c9865a6207642161D55403b64c44844A3','0xcf9741bbce8ba8ec2b0dc8f23399a0bcf5c019d5','0x908b770a12816b29796B1635bD2b5Cc50E30982f','0xB5f869331da2A1c93a5A7D7CeF46F430F2a2f8e0','0xa13E3b2eee863966c6703Fe56ca60A4221c42CD6','0xd03072838feec992c647406a9a51190fe6322075','0xf91569595bcdaf780c3f1662f204e157949af8b2'],
      [8250,400,150,150,150,150,150,150,150,150,150],
      price,
      // '0xF0D193D8524eC55fe2F5159aaD2BA1A264993605'
    '0xf49056577a9266cd6CFd1B8f6ac151D9BB3671d7' // main
  )
      .then((res) => {
          return FluxArtNFT.deployed();
      })
      .then((instance) => {
          fluxArtNFT_instance = instance;
          return fluxArtNFT_instance.MINTER_ROLE.call();
      })
      .then((minter_role) => {
          console.log('grantRole', SaleTokens.address, minter_role);
          return fluxArtNFT_instance.grantRole.sendTransaction(minter_role, SaleTokens.address);
      })
      .catch(function(err) {
        console.log("ERROR! ", err.message);
      });
};
