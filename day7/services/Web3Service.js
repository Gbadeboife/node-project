const Web3 = require('web3');
// You can replace this with your Alchemy or Infura endpoint
const providerUrl = process.env.WEB3_PROVIDER_URL || 'https://eth-goerli.g.alchemy.com/v2/demo';
const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));

const createWallet = () => {
  const account = web3.eth.accounts.create();
  return account;
};

const signPayload = (privateKey, payload = 'Sign this payload') => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  return account.sign(payload);
};

const getBalance = async (privateKey) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const balance = await web3.eth.getBalance(account.address);
  return web3.utils.fromWei(balance, 'ether');
};

const transfer = async (privateKey, toAddress, amount) => {
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);
  const tx = {
    from: account.address,
    to: toAddress,
    value: web3.utils.toWei(amount, 'ether'),
    gas: 21000,
  };
  const signed = await account.signTransaction(tx);
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  return receipt;
};

module.exports = {
  createWallet,
  signPayload,
  getBalance,
  transfer,
}; 