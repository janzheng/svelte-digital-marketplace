require("@nomiclabs/hardhat-waffle");
const fs = require('fs');
// const privateKey = fs.readFileSync(".secret").toString().trim() || "01234567890123456789";
// const infuraId = fs.readFileSync(".infuraid").toString().trim() || "";
var dotenvConfig = require("dotenv")
dotenvConfig.config()




module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      // Infura
      // url: `https://polygon-mumbai.infura.io/v3/${infuraId}`
      // url: "https://rpc-mumbai.matic.today",
      // accounts: [privateKey],
      url: `${process.env.MUMBAI}`,
      // accounts: [`0x${process.env.ACCT_PRIV_KEY}`]
      accounts: [`${process.env.ACCT_PRIV_KEY}`]
    },
    matic: {
      url: `${process.env.MATIC}`,
      accounts: [`${process.env.ACCT_PRIV_KEY}`]
    },
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

