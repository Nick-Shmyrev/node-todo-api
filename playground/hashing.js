var {SHA256} = require('crypto-js');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');


var password = '123abc!';

bcrypt.genSalt(10, (err, salt) => {
  console.log(`Salt: ${salt}`);
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash);
  })
});

var hashedPsw1 = '$2a$10$DSMWV9uFMMU63xU8wqDPhemC7JexxeBa1ew270eY2NXnvmsfLQ7fC';
var hashedPsw2 = '$2a$10$V7u2WbQgkxjYSuc3FaMgveKcY4p550zFHO1/AQajPzAXUAIdHSXDa';

bcrypt.compare(password, hashedPsw1, (err, res) => {
  console.log(`The ${password} is identical to hashed value: ${res}`);
});
bcrypt.compare(password, hashedPsw2, (err, res) => {
  console.log(`The ${password} is identical to hashed value: ${res}`);
});

// var data = {
//   id: 10
// }
//
// var token = jwt.sign(data, '123abc');
// console.log(token);
// var decoded = jwt.verify(token, '123abc');
// console.log('decoded: ', decoded);

// var message = "I'm a user #33";
// var hash = SHA256(message);
// console.log(hash);
// console.log(hash.toString());
//
// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// }
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
//
// console.log(`Hash: ${SHA256(JSON.stringify(data)).toString()}; Salt: ${SHA256('somesecret').toString()}`);
// console.log();
// console.log(`TokenHash:\t${token.hash}`);
// console.log(`ResultHash:\t${resultHash}`);
// console.log();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed');
// }
