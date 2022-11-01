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
  if (userOne.trim() == '') {
    throw "Invalid username for User One!"
  }
  if (userTwo.trim() == '') {
    throw "Invalid username for User Two!"
  }
  if (question.trim() == '') {
    throw "Invalid question returned!"
  }
  if (difficulty.trim() == '') {
    throw "Invalid difficulty returned!"
  }
  if (difficulty != 'easy' && difficulty != 'medium' && difficulty != 'hard') {
    throw "Unknown difficulty level returned!"
  }
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
  if (roomid.trim() == '') {
    throw "Invalid room found!"
  }
  const room = await matchModel.findOne({_id: roomid})
  if (room == null) {
    throw "No such room found!"
  }
  const updatedModel = await matchModel.findOneAndDelete({_id: roomid})
  return updatedModel
}