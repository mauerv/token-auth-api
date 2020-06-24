const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
var jwt = require("jsonwebtoken");
var util = require("ethereumjs-util");
const Web3 = require("web3");
require("dotenv").config();

const port = 5000;
const web3 = new Web3();

app.use(cors());
app.use(bodyParser.json());

app.post("/validate-signature", async (req, res) => {
  let { owner, sig } = req.body;

  // Make sure owner is a valid address and is lowercase.
  if (!web3.utils.isAddress(owner)) {
    res.status(400).send(new Error(`${owner} is an invalid address.`));
  }
  owner = owner.toLowerCase();

  // The same data that the client signs in hex format.
  const rawData = "Alohomora";
  const data = web3.utils.toHex(rawData);

  // Get the same hash message that eth.personal.sign() generates with the correct prefix.
  const message = util.toBuffer(data);
  const msgHash = util.hashPersonalMessage(message);

  const signature = util.toBuffer(sig);
  const sigParams = util.fromRpcSig(signature);
  const publicKey = util.ecrecover(
    msgHash,
    sigParams.v,
    sigParams.r,
    sigParams.s
  );
  const sender = util.pubToAddress(publicKey);
  const address = util.bufferToHex(sender);

  let match = false;
  if (address === owner) {
    match = true;
  }

  res.send(match);
});

app.listen(port, () =>
  console.log(`Signature validation running in port ${port}`)
);
