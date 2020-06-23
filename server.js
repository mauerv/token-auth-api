const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Web3 = require("web3");
require("dotenv").config();

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://mainnet.infura.io/v3/${INFURA_SECRET}`
  )
);

const port = 5000;

app.use(bodyParser.json());

app.post("/validate", async (req, res) => {
  // const { owner, message, signature } = req.body;
  // const owner = "0x1d076fcf1598C285D1c2f0685202AfaCdBcB0832";
  // const message = "Some text";
  // const signature = "0x80b13f77f158dffe364120af782498c799d8f5a7c283df49be6f178c9e7ea4517cc35ab622f37c6672ef3b242fa75c2b35e415124cafeb129ca0f5188f7c30081b";

  res.end();
});

app.listen(port, () =>
  console.log(`Signature validation running in port ${port}`)
);
