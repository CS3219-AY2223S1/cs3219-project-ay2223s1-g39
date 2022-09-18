import express from 'express';
import cors from 'cors';
import 'dotenv/config'
import mongoose from 'mongoose';
import {createQuestion, getQuestion, getQuestionsByDifficulty } from './controller/question-controller.js';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

// APIs related to questions
router.post('/question/create', verifyToken, createQuestion)
router.get('/question/', verifyToken, getQuestion)
router.get('/question/difficulty', verifyToken, getQuestionsByDifficulty)


app.use('/questions', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8002, () => console.log('question-service listening on port 8002'));

//Set up mongoose connection
let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
  console.log("Connected successfully");
});