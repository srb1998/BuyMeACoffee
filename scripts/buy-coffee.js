const hre = require("hardhat");

// Returns the Ether Balance of the input address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

//Log the ether balances for a list of addresses.
async function printBalances(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `,await getBalance(address));
    idx++;
  }
}

async function printMemos(memos) {
  for(const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`)
  }
}


async function main() {

   //get example accounts.
    const [owner,tipper,tipper2,tipper3] = await hre.ethers.getSigners();

   //Get the contract to deploy and deploy
    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

   //Check balances before the cofee purchase.
    const addresses = [owner.address, tipper.address, buyMeACoffee.address]
    console.log("=======Start========")
    await printBalances(addresses);
   //Buy the owner a few coffees.
    const tip = {value: hre.ethers.utils.parseEther("1")};
    await buyMeACoffee.connect(tipper).buyCoffee("Asif","gg",tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Akshay","Wp",tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Dhruv","gl",tip);

   //Check balances after coffeee purchase.
    console.log("=======Bought Coffee========");
    await printBalances(addresses);

   //Withdraw Funds
    await buyMeACoffee.connect(owner).withdrawTips();

   //Check balance after withdraw
    console.log("=====After WithdrawTips=====");
    await printBalances(addresses);

   //Read all the memos left for the owner
    console.log("=====After WithdrawTips=====");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
