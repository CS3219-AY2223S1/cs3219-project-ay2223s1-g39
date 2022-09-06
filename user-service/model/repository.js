import UserModel from './user-model.js';
import 'dotenv/config'
import bcrypt from 'bcryptjs';
//Set up mongoose connection
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
  console.log("Connected successfully");
});

export async function createUser(params) {
  const username = params.username
  const pw = params.password
  const res = await db.collection('users').findOne({username: username})
  console.log(res)
  if (username == '') {
    throw "Please enter a valid username!"
  }
  if (username.length < 5) {
    throw "Please enter a username with 5 or more characters!"
  }
  if (res != null) {
    throw "Username already taken!"
  }
  if (pw == '') {
    throw "Please enter a valid password!"
  }
  if (pw.length < 5) {
    throw "Please enter a password with 5 or more characters!"
  }
  
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(pw, salt);
  const newUser = new UserModel({
    username: username,
    password: hash,
  })
  //write logic to create user here
  await db.collection('users').insertOne(newUser)
  return newUser
}

export async function loginUser(params) {
  const username = params.username;
  const pw = params.password;
  if (username.length < 5) {
    throw 'Please enter a valid username!'
  }
  const user = await db.collection('users').findOne({username: username})
  if (user == null) {
    throw "No such user found!"
  }
  const isCorrectPw = await bcrypt.compare(pw, user.password)
  if (isCorrectPw) {
    return user
  } else {
     throw 'Invalid password!'
  }
}

