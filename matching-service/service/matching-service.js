import matchModel from '../model/match-model.js';
import 'dotenv/config'
import mongoose from 'mongoose';

let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
  console.log("Connected successfully");
});

export async function createMatch(params) {
  const userOne = params.userOne
  const userTwo = params.userTwo
  const difficulty = params.difficulty
  const question = params.question

  let newModel = await matchModel.create({
    userOne: userOne,
    userTwo: userTwo,
    difficulty: difficulty,
    question: question,
  });

  return newModel;
}


export async function deleteMatch(params) {
  const roomid = params.roomid
  const removedModel = await matchModel.findOneAndDelete({_id: roomid})
  return removedModel
}