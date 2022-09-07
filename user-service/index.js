import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())
import { createUser, login, updatePassword, deleteUser } from './controller/user-controller.js';
import {verifyToken} from './middleware/auth.js';
const router = express.Router()

// Controller will contain all the User-defined Routes
router.get('/', (_, res) => res.send('Hello World from user-service'))
router.post('/signup', createUser)
router.post('/login', login)
router.put('/update-password', verifyToken, updatePassword)
router.delete('/delete', verifyToken, deleteUser)
 
app.get("/health-check", (req, res) => {
    res.json({
        status:"ok",
    });
});

app.use('/api/user', router).all((_, res) => {
    res.setHeader('content-type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
})

app.listen(8000, () => console.log('user-service listening on port 8000'));