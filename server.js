var util = require("ethereumjs-util");

// Sign
const owner = "0x1d076fcf1598C285D1c2f0685202AfaCdBcB0832";
const message = "Learning to sign and validate.";
const hex = "0x4c6561726e696e6720746f207369676e20616e642076616c69646174652e";
const signature =
  "0xc1d6fdce5950e0e3dae8f71118ff4b14cdacf18207bf16e339562ac22e9b50870db20f35bbd2f66eefe823b95cec78e676c1e36a5b5596142f934d12a1e1e7791b";
// Validate
const { v, r, s } = util.fromRpcSig(signature);
const prefix = new Buffer("\x19Ethereum Signed Message:\n");
const prefixedMsg = util.keccak(
  Buffer.concat([prefix, new Buffer(String(hex.length)), new Buffer(hex)])
);

// const pub = util.ecrecover(util.toBuffer(hex), v, r, s);
// console.log(pub);

/*
const prefix = "\x19Ethereum Signed Message:\n";
const prefixedMessage = "0x" + prefix + message.length + message;
const prefixedMessageBuffer = util.toBuffer(prefixedMessage);
const hashedMessage = util.keccak(prefixedMessageBuffer);
const { v, r, s } = util.fromRpcSig(signature);
*/
