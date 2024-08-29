import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_addowner = document.getElementById("btn_addowner");

btn_connect.onclick = connect;
btn_addowner.onclick = AddOwner;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}
async function AddOwner() {
  if (typeof window.ethereum != "undefined") {
    const address = document.getElementById("newowner").value;
    console.log("AddOwner...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const Data = contract.interface.encodeFunctionData("addOwner", [address]);
    const transActionResponse = await contract.submitTransaction(
      contractAddress,
      0,
      Data
    );
    await listenForTransactionMine(transActionResponse, provider);
    console.log(transActionResponse);
    console.log("AddOwner Finished");
  } else {
    console.log("No metamask!!!");
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}`);
  return new Promise((resolve, reject) => {
    try {
      provider.once(transactionResponse.hash, (transactionReceipt) => {
        console.log(
          `Completed with ${transactionReceipt.confirmations} confirmations. `
        );
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
