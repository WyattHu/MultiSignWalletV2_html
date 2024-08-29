import { ethers } from "./ethers.js";
import { contractAddress, abi } from "./constant.js";
const btn_connect = document.getElementById("btn_connect");
const btn_submit = document.getElementById("btn_submit");

btn_connect.onclick = connect;
btn_submit.onclick = Submit;

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
    const amount = document.getElementById("amount").value;
    const toaddress = document.getElementById("toaddress").value;
    // const tokenaddress = document.getElementById("TokenAddress").value;
    console.log("Submitting...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // const Data = contract.interface.encodeFunctionData("addOwner", [address]);
    const transActionResponse = await contract.submitTransaction(
      toaddress,
      ethers.utils.parseEther(amount),
      "0x"
    );
    await listenForTransactionMine(transActionResponse, provider);
    console.log("Submit Finished");
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
