// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server');
  }

  console.log('Connected to MongoDB Server')

  // db.collection('Todos').findOneAndUpdate(
  //   { _id: new ObjectID('59f141f04351edf64ee4bf60') },
  //   { $set: {completed: true} },
  //   { returnOriginal: false}
  // ).then((result) => {
  //   console.log(JSON.stringify(result, undefined, 2));
  // });

  db.collection('Users').findOneAndUpdate(
    { _id: new ObjectID('59f107c34e419800e02833c6') },
    {
      $set: {name: 'Nick'},
      $inc: {age: 1}
    },
    { returnOriginal: false }
  ).then((result) => {
    console.log(JSON.stringify(result, undefined, 2));
  });

  // closes connection
  // db.close();
});
