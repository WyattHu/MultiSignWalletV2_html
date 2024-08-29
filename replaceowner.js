import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_replaceowner = document.getElementById("btn_replaceowner");

btn_connect.onclick = connect;
btn_replaceowner.onclick = ReplaceOwner;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}
async function ReplaceOwner() {
  if (typeof window.ethereum != "undefined") {
    const address = document.getElementById("owner").value;
    const newaddress = document.getElementById("newowner").value;

    console.log("ReplaceOwner...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const Data = contract.interface.encodeFunctionData("replaceOwner", [
      address,
      newaddress,
    ]);
    const transActionResponse = await contract.submitTransaction(
      contractAddress,
      0,
      Data
    );
    await listenForTransactionMine(transActionResponse, provider);
    console.log("ReplaceOwner Finished");
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
