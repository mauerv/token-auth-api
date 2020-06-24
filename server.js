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

// function checkSig(req, res) {
//   var sig = req.body.sig;
//   var owner = req.body.owner;
//   // Message data
//   var data = "0x123123";
//   var message = ethUtil.toBuffer(data);
//   var msgHash = ethUtil.hashPersonalMessage(message);
//   // Get the address of whoever signed this message
//   var signature = ethUtil.toBuffer(sig);
//   var sigParams = ethUtil.fromRpcSig(signature);
//   var publicKey = ethUtil.ecrecover(
//     msgHash,
//     sigParams.v,
//     sigParams.r,
//     sigParams.s
//   );
//   var sender = ethUtil.publicToAddress(publicKey);
//   var addr = ethUtil.bufferToHex(sender);

//   // Determine if it is the same address as 'owner'
//   var match = false;
//   if (addr == owner) {
//     match = true;
//   }

//   if (match) {
//     // If the signature matches the owner supplied, create a
//     // JSON web token for the owner that expires in 24 hours.
//     var token = jwt.sign({ user: req.body.addr }, "0x234234", {
//       expiresIn: "1d",
//     });
//     res.send(200, { success: 1, token: token });
//   } else {
//     // If the signature doesn"t match, error out
//     res.send(500, { err: "Signature did not match." });
//   }
// }

// function auth(req, res, next) {
//   jwt.verify(req.body.token, "i am another string", function (err, decoded) {
//     if (err) {
//       res.send(500, { error: "Failed to authenticate token." });
//     } else {
//       req.user = decoded.user;
//       next();
//     }
//   });
// }

app.post("/validate-signature", async (req, res) => {
  let { owner, sig } = req.body;
  owner = owner.toLowerCase();
  const rawData = "Alohomora";
  const data = web3.utils.toHex(rawData);

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
