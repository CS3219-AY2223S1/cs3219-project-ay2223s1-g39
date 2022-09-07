import express from 'express';
import cors from 'cors';
import { createServer } from 'http';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createMatch, deleteMatch } from './controller/match-controller.js';
const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from matching-service'))
router.post('/signup', createMatch)
router.delete('/delete', deleteMatch)

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

// app.get('/', (req, res) => {
//     res.send('Hello World from matching-service');
// });

// const httpServer = createServer(app)

// httpServer.listen(8001);
app.listen(8001, () => console.log('user-service listening on port 8001'));
