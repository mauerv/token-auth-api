var util = require("ethereumjs-util");

const owner = "0x1d076fcf1598C285D1c2f0685202AfaCdBcB0832".toLowerCase();
const msg = "Learning to sign and validate.";
const hex = "0x4c6561726e696e6720746f207369676e20616e642076616c69646174652e";
const sig =
  "0xc1d6fdce5950e0e3dae8f71118ff4b14cdacf18207bf16e339562ac22e9b50870db20f35bbd2f66eefe823b95cec78e676c1e36a5b5596142f934d12a1e1e7791b";

const message = util.toBuffer(hex);
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

console.log(match);
