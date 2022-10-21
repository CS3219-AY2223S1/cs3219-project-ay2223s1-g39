import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { createServer } from 'https';
import { Server } from 'socket.io';
import axios from 'axios';
import {createMatch, deleteMatch } from './controller/match-controller.js';
import { ormCreateMatch } from './service/match-orm.js';

const app = express();
const server = createServer(app);

app.use(cors()) // config cors so that front-end can use
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.options('*', cors())

const io = new Server(server, {
  cors: {
    origin: process.env.URL_FRONTEND, // Link for frontend client
    methods: ["GET", "POST", "DELETE"]
  }
});

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send("Hello world from matching-service!"));
router.post('/', (req, res) => createMatch(req, res));
router.delete('/', (req, res) => deleteMatch(req, res));

app.use('/api/match', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.get('/',(_, res) => {
  res.send('Hello World from matching-service!')
})

let gameRooms = {};

let waitingRooms = {
  easy: {
    waitingUser: null,
    waitingUserSocket: null,
    question: null,
    matchFailure: null
    
  },
  medium: {
    waitingUser: null,
    waitingUserSocket: null,
    question: null,
    matchFailure: null
  }, 
  hard: {
    waitingUser: null,
    waitingUserSocket: null,
    question: null,
    matchFailure: null
  }
};

function resetWaitingRoom(room) {
  clearTimeout(room.matchFailure);
  room.waitingUser = null;
  room.waitingUserSocket = null;
  room.question = null;
  room.matchFailure = null;
}

async function generateQuestionforRoom(token, difficulty, room) {
  const params = {
    token: token,
    difficulty: difficulty
  }

  return axios.get(`${process.env.URL_QUESTION_SVC}/difficulty`, {params})
    .then((res) => res.data.question)
    .then((questions) => questions[Math.floor(Math.random() * questions.length)])
    .then((question) => (room.question = question))
    .catch((err) => console.log(err));
}

const alertMatchFailure = (waitingRooms, difficulty) => {
  const room = waitingRooms[difficulty]
  
  waitingRooms[difficulty] = {
    waitingUser: null,
    waitingUserSocket: null,
    question: null,
  };
  room.waitingUserSocket.emit("matchFailure");
}

io.on('connection', (socket) => {
  // Client queuing for match
  socket.on('createPendingMatch', async (data) => {
    const {username, difficulty, token} = data;
    const room = waitingRooms[difficulty];
    if (!room.waitingUser) {
      
      generateQuestionforRoom(token, difficulty, room);
      room.waitingUser = username;
      room.waitingUserSocket = socket;
      
      room.matchFailure = setTimeout(() => alertMatchFailure(waitingRooms, difficulty), 31000);
    
    } else {
      const newMatch = await ormCreateMatch(room.waitingUser, username, difficulty, room.question);
      socket.emit('matchSuccess', {
        message: "Match Found!", 
        roomId: newMatch._id, 
        partner: room.waitingUser, 
        difficulty: difficulty,
        question: room.question 
      });
      room.waitingUserSocket.emit('matchSuccess', {
        message: "Match Found!", 
        roomId: newMatch._id, 
        partner: username, 
        difficulty: difficulty,
        question: room.question
      })
      resetWaitingRoom(room);
    }
  })

  socket.on('joinRoom', (data) => {
    if (!gameRooms[data.roomId]) {
      gameRooms[data.roomId] = 2;
    }
    socket.join(data.roomId);
  })

  socket.on("leaveRoom", async (data) => {
    gameRooms[data.roomId] = gameRooms[data.roomId] - 1;
    if (gameRooms[data.roomId] === 0) {
      delete gameRooms[data.roomId];
    } else {
      socket.to(data.roomId).emit('alertLeaveRoom');
    }
  })

  socket.on("cancelMatch", async (data) => {
    const { difficulty } = data;
    resetWaitingRoom(waitingRooms[difficulty]);
  })

  socket.on("changeLanguage", async (data) => {
    const { roomId, lang } = data;
    socket.to(roomId).emit('handleLangChange', { 
      language : lang 
    });
  })

})

server.listen(8001, () => console.log('match-service listening on port 8001'));

export default app;