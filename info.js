import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_submit = document.getElementById("btn_submit");
const btn_confirm = document.getElementById("btn_confirm");
const btn_revoke = document.getElementById("btn_revoke");
const btn_execute = document.getElementById("btn_execute");
const btn_getowner = document.getElementById("btn_getowner");
const btn_getTXCount = document.getElementById("btn_getTXCount");
const btn_getTX = document.getElementById("btn_getTX");

btn_connect.onclick = connect;
btn_submit.onclick = Submit;
btn_confirm.onclick = Confirm;
btn_revoke.onclick = Revoke;
btn_execute.onclick = Execute;
btn_getowner.onclick = GetOwner;
btn_getTXCount.onclick = GetTXCount;
btn_getTX.onclick = GetTX;

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Connecting to metamask...");
    await window.ethereum.request({ method: "eth_requestAccounts" });
    console.log("Connected");
  } else {
    console.log("No metamask!!!");
  }
}
async function Submit() {
  if (typeof window.ethereum != "undefined") {
    const ethAmount = document.getElementById("ethAmount").value;
    const address = document.getElementById("Address").value;
    const tokenaddress = document.getElementById("TokenAddress").value;
    console.log("Submitting...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.submitTransaction(
      address,
      ethers.utils.parseEther(ethAmount),
      tokenaddress
    );
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Submit Finished");
  } else {
    console.log("No metamask!!!");
  }
}
async function Confirm() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("Index").value;
    console.log("Confirming...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.confirmTransaction(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Confirm Finished");
  } else {
    console.log("No metamask!!!");
  }
}

async function Revoke() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("Index").value;
    console.log("Revoking...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.revokeConfirmation(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Revoke Finished");
  } else {
    console.log("No metamask!!!");
  }
}

async function Execute() {
  if (typeof window.ethereum != "undefined") {
    const Index = document.getElementById("Index").value;
    console.log("Executing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.executeTransaction(Index);
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Execute Finished");
  } else {
    console.log("No metamask!!!");
  }
}

async function GetOwner() {
  if (typeof window.ethereum != "undefined") {
    console.log("Getting Owner...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.getOwners();
    // await listenForTransactionMine(transActionResponse, provider);
    console.log(transActionResponse);
    console.log("Getting Owner Finished");
  } else {
    console.log("No metamask!!!");
  }
}

async function GetTXCount() {
  if (typeof window.ethereum != "undefined") {
    console.log("Getting TXCount...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.getTransactionCount();
    // await listenForTransactionMine(transActionResponse, provider);
    console.log(transActionResponse);
    console.log("Getting TXCount Finished");
  } else {
    console.log("No metamask!!!");
  }
}

async function GetTX() {
  if (typeof window.ethereum != "undefined") {
    console.log("Getting TX...");
    const Index = document.getElementById("Index").value;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transActionResponse = await contract.getTransaction(Index);
    // await listenForTransactionMine(transActionResponse, provider);
    console.log(transActionResponse);
    console.log("Getting TX Finished");
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
