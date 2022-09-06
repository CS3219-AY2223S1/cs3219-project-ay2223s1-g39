import { ormCreateUser as _createUser, ormLogin as _login } from '../service/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            console.log(resp);
            if (resp.err) {
                // return res.status(400).json({message: 'Could not create a new user!'});
                return res.status(400).json( {message: resp.err} );
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}

export async function login(req, res) {
    try {
        const {username, password } = req.body;
        const resp = await _login(username, password)
        if (resp.err) {
            return res.status(400).json({message: resp.err});
        }
        return res.status(200).json({message: "success!", user: resp})
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
}
