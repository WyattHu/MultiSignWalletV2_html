import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_confirm = document.getElementById("btn_confirm");
const btn_revoke = document.getElementById("btn_revoke");
const btn_execute = document.getElementById("btn_execute");

btn_connect.onclick = connect;
btn_confirm.onclick = Confirm;
btn_revoke.onclick = Revoke;
btn_execute.onclick = Execute;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}

async function Confirm() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("txidx").value;
    console.log("Confirming...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.confirmTransaction(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Confirm Finished");
    console.log(transActionResponse);
  } else {
    console.log("No metamask!!!");
  }
}

async function Revoke() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("txidx").value;
    console.log("Revoking...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.revokeConfirmation(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Revoke Finished");
    console.log(transActionResponse);
  } else {
    console.log("No metamask!!!");
  }
}

async function Execute() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("txidx").value;
    console.log("Executing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.executeTransaction(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Execute Finished");
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
