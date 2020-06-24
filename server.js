const express = require("express");
const app = express();
const bodyParser = require("body-parser");
var cors = require("cors");
var jwt = require("jsonwebtoken");
var util = require("ethereumjs-util");
const Web3 = require("web3");
require("dotenv").config();

const port = 5000;
const JWT_SECRET = "You are allowed in.";
const web3 = new Web3();

app.use(cors());
app.use(bodyParser.json());

/**
 * Endpoint to validate that a user is in posesion of the private keys of a certain address.
 */
app.post("/validate-signature", async (req, res) => {
  let { owner, sig } = req.body;

  // Make sure owner is a valid address and is lowercase.
  if (!web3.utils.isAddress(owner)) {
    res.status(500).send(new Error(`${owner} is an invalid address.`));
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
  if (address === owner) match = true;

  if (match) {
    var token = jwt.sign({ user: req.body.owner }, JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send(200, { success: 1, token: token });
  } else {
    res.send(500, { err: "Signature did not match." });
  }

  res.send(match);
});

const auth = (req, res, next) => {
  jwt.verify(req.body.token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.send(500, { error: "Failed to authenticaate token." });
    } else {
      req.user = decoded.user;
      nex();
    }
  });
};

app.listen(port, () =>
  console.log(`Signature validation running in port ${port}`)
);

// Token "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiMHgxZDA3NmZjZjE1OThDMjg1RDFjMmYwNjg1MjAyQWZhQ2RCY0IwODMyIiwiaWF0IjoxNTkzMDMyNDUyLCJleHAiOjE1OTMxMTg4NTJ9.pwCPZQXJ7Sb4mNeriY906TjY6QrYMXdsVrA1PDvMp4I"
