import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ormCreateMatch as createMatch, ormDeleteMatch as deleteMatch, ormUpdateMatch as updateMatch} from './service/match-orm.js'

const app = express();
const server = createServer(app);

app.use(cors()) // config cors so that front-end can use
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.options('*', cors())

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Link for frontend client
    methods: ["GET", "POST", "DELETE"]
  }
});

const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send("Hello world from matching-service!"));
router.post('/', (req, res) => createMatch(req, res));
router.delete('/', (req, res) => createMatch(req, res));

app.use('/api/match', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

let rooms = {
  Easy: {
    hasWaitingUser: false,
    waitingRoomSocket: null,
    waitingRoom: null,
    matchFailure: null
  },
  Medium: {
    hasWaitingUser: false,
    waitingRoomSocket: null,
    waitingRoom: null,
    matchFailure: null
  }, 
  Hard: {
    hasWaitingUser: false,
    waitingRoomSocket: null,
    waitingRoom: null,
    matchFailure: null
  }
};

const alertMatchFailure = (rooms, difficulty) => {
  const room = rooms[difficulty]
  rooms[difficulty] = {
    hasWaitingUser: false,
    waitingRoomSocket: null,
    waitingRoom: null
  };
  deleteMatch(room.waitingRoom._id.toString());
  room.waitingRoomSocket.emit("matchFailure");
}

io.on('connection', (socket) => {
  // Client queuing for match
  socket.on('createPendingMatch', (data) => {
    const {username, difficulty} = data;
    const room = rooms[difficulty];
    
    if (!room.hasWaitingUser) {
      const newMatch = createMatch(username, "testuser", difficulty, 'testQuestion')
      newMatch.then((match) => {
        socket.emit('createRoom', {message: "Finding match...", roomId: match._id});
        room.hasWaitingUser = true;
        room.waitingRoomSocket = socket;
        room.waitingRoom = match;
      });
      room.matchFailure = setTimeout(() => alertMatchFailure(rooms, difficulty), 10000);
    } else {
      socket.emit('matchSuccess', {message: "Match Found!", roomId: room.waitingRoom._id, socketId: room.waitingRoomSocket.id});
      room.waitingRoomSocket.emit('matchSuccess', {message: "Match Found!", roomId: room.waitingRoom._id, socketId: socket.id})
      updateMatch(room.waitingRoom._id, {userTwo: username});
      clearTimeout(room.matchFailure);
      room.hasWaitingUser = false;
      room.waitingRoomSocket = null;
      room.waitingRoom = null;
      room.matchFailure = null;
    }
  })
})

server.listen(8001, () => console.log('match-service listening on port 8001'));
