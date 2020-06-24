var ethUtil = require("ethereumjs-util");

var data = "0x123414141";

var message = ethUtil.toBuffer(data);
var msgHash = ethUtil.hashPersonalMessage(message);
var sig = ethUtil.ecsign(msgHash, privateKey);    

console.log("Message", message);
console.log("Message Hash", msgHash);
