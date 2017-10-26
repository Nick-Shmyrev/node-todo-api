// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB Server');
  }

  console.log('Connected to MongoDB Server')

  // deleteMany
  // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // });

  // deleteOne
  // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
  //   console.log(JSON.stringify(result.result, undefined, 2));
  // });


  // findOneAndDelete
  // db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
  //   console.log(result);
  // });

  db.collection('Users').deleteMany({name: 'Nick'}).then((result) => {
    console.log(JSON.stringify(result.result, undefined, 2));
  });

  db.collection('Users').findOneAndDelete({_id: '123'}).then((result) => {
    console.log(result);
  });

  // closes connection
  // db.close();
});
