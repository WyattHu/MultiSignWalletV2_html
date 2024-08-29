import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_removeowner = document.getElementById("btn_removeowner");

btn_connect.onclick = connect;
btn_removeowner.onclick = RemoveOwner;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}
async function RemoveOwner() {
  if (typeof window.ethereum != "undefined") {
    const address = document.getElementById("owner").value;
    console.log("RemoveOwner...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const Data = contract.interface.encodeFunctionData("removeOwner", [
      address,
    ]);
    const transActionResponse = await contract.submitTransaction(
      contractAddress,
      0,
      Data
    );
    await listenForTransactionMine(transActionResponse, provider);
    console.log("RemoveOwner Finished");
    console.log(transActionResponse);
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
