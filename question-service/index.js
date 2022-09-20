import express from 'express';
import cors from 'cors';



const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import {verifyToken} from './middleware/auth.js';
const router = express.Router()



// APIs related to questions
import {createQuestion, getQuestion, getQuestionsByDifficulty } from './question-controller.js';
router.post('/create', verifyToken, createQuestion)
router.get('/', verifyToken, getQuestion)
router.get('/difficulty', verifyToken, getQuestionsByDifficulty)



app.use('/api/question', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(5000, () => console.log('question-service listening on port 5000'));

import 'dotenv/config'
import mongoose from 'mongoose';

//Set up mongoose connection
let mongoDB = process.env.ENV == "PROD" ? process.env.DB_CLOUD_URI : process.env.DB_LOCAL_URI;


mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true});

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once("open", function () {
  console.log("Connected successfully");
});