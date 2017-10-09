// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
  	dev: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      from: "0x5ad856c4c5d542ba6580a29f9044b9598686b4f3", // default address to use for any transaction Truffle makes during migrations
      network_id: "*",
      gas: 4612388 // Gas limit used for deploys
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8547,
      from: "0x0c1A5e96679d1C7D82888641D5F2Df88108CE349", // default address to use for any transaction Truffle makes during migrations
      network_id: 4,
      gas: 4612388 // Gas limit used for deploys
    },
    mainnet: {
      host: "localhost", // Connect to geth on the specified
      port: 8546,
      from: "0x2992d108628Dc832e239A8e243712679c9443404", // default address to use for any transaction Truffle makes during migrations
      gas: 4612388 // Gas limit used for deploys
    }
  }
}
