require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

const NODE_API_KEY = process.env.INFURA_KEY || process.env.ALCHEMY_KEY;
const isInfura = !!process.env.INFURA_KEY;

if (!NODE_API_KEY) {
  console.error("Please set a mnemonic and ALCHEMY_KEY or INFURA_KEY.");
  process.exit(0);
}

const rinkebyNodeUrl = isInfura
    ? "https://rinkeby.infura.io/v3/" + NODE_API_KEY
    : "https://eth-rinkeby.alchemyapi.io/v2/" + NODE_API_KEY;

const mainnetNodeUrl = isInfura
    ? "https://mainnet.infura.io/v3/" + NODE_API_KEY
    : "https://eth-mainnet.alchemyapi.io/v2/" + NODE_API_KEY;

const GAS_PRICE = parseFloat(process.env.GAS_PRICE) * 1e9;
const GAS_LIMIT = parseFloat(process.env.GAS_LIMIT);

const MainProvider = new HDWalletProvider(process.env.MAIN_NET_PRIVATE_KEY.split(','), mainnetNodeUrl);
const RinkebyProvider = new HDWalletProvider(process.env.RINKEBY_PRIVATE_KEY.split(','), rinkebyNodeUrl);

module.exports = {
  api_keys: {
    etherscan: process.env.ETHERSAN_API_KEY
  },
  plugins: [
    'truffle-plugin-verify'
  ],
  mocha: {
    timeout: 100000,
    reporter: 'eth-gas-reporter',
    reporterOptions : {
      currency: 'USD',
      gasPrice: 100
    }
  },
  compilers: {
    solc: {
      version: "0.8.0",
    },

  },
  networks: {
    development: {
      host: "localhost",
      port: 7545,
      network_id: "*"
    },
    rinkeby: {
      provider: RinkebyProvider,
      network_id: '4',
      skipDryRun: true,
      gasPrice: 3000000000,
      gas: GAS_LIMIT
    },
    live: {
      gas: GAS_LIMIT,
      provider: MainProvider,
      from: MainProvider.address,
      gasPrice: GAS_PRICE,
      network_id: 1
    }
  }
};
