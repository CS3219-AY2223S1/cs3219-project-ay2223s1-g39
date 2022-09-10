import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ormCreateMatch as createMatch, ormDeleteMatch as deleteMatch} from './service/match-orm.js'

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

io.on('connection', (socket) => {
  console.log(`A client connected, socketID: ${socket.id}`);

  socket.on('createMatch', (data) => {
    console.log("Creating Match!");
    const {userOne, difficulty} = data;
    createMatch(userOne, 'testUser', difficulty, 'testQuestion'); // Cannot pass empty string for null for non-existent values.
    socket.emit('pendingMatch');
  })
})

server.listen(8001, () => console.log('match-service listening on port 8001'));
