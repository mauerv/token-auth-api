const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Web3 = require("web3");
var cors = require("cors");
var jwt = require("jsonwebtoken");
var ethUtil = require("ethereumjs-util");
require("dotenv").config();

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://mainnet.infura.io/v3/${process.env.INFURA_SECRET}`
  )
);

const port = 5000;

app.use(cors());
app.use(bodyParser.json());

function checkSig(req, res) {
  var sig = req.body.sig;
  var owner = req.body.owner;
  // Message data
  var data = "0x123123";
  var message = ethUtil.toBuffer(data);
  var msgHash = ethUtil.hashPersonalMessage(message);
  // Get the address of whoever signed this message
  var signature = ethUtil.toBuffer(sig);
  var sigParams = ethUtil.fromRpcSig(signature);
  var publicKey = ethUtil.ecrecover(
    msgHash,
    sigParams.v,
    sigParams.r,
    sigParams.s
  );
  var sender = ethUtil.publicToAddress(publicKey);
  var addr = ethUtil.bufferToHex(sender);

  // Determine if it is the same address as 'owner'
  var match = false;
  if (addr == owner) {
    match = true;
  }

  if (match) {
    // If the signature matches the owner supplied, create a
    // JSON web token for the owner that expires in 24 hours.
    var token = jwt.sign({ user: req.body.addr }, "0x234234", {
      expiresIn: "1d",
    });
    res.send(200, { success: 1, token: token });
  } else {
    // If the signature doesn"t match, error out
    res.send(500, { err: "Signature did not match." });
  }
}

function auth(req, res, next) {
  jwt.verify(req.body.token, "i am another string", function (err, decoded) {
    if (err) {
      res.send(500, { error: "Failed to authenticate token." });
    } else {
      req.user = decoded.user;
      next();
    }
  });
}

app.post("/validate", async (req, res) => {
  const { owner, message, messageHash, signature } = req.body;

  res.end();
});

app.get("/echo", (req, res) => {
  res.send("Hello");
});

app.listen(port, () =>
  console.log(`Signature validation running in port ${port}`)
);
