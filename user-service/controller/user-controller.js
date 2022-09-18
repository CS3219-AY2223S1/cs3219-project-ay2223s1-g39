import { ormCreateUser as _createUser, ormLogin as _login, ormUpdatePassword as _updatePassword,
ormDeleteUser as _deleteUser } from '../model/user/user-orm.js'

export async function createUser(req, res) {
    try {
        const { username, password } = req.body;
        if (username && password) {
            const resp = await _createUser(username, password);
            if (resp.err) {
                return res.status(400).json( {message: resp.err} );
            } else {
                return res.status(201).json({message: `Created new user ${username} successfully!`, user: resp});
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
        return res.status(500).json({message: 'Database failure when logging in!'})
    }
}

export async function updatePassword(req, res) {
    try {
        const {username, oldPassword, newPassword } = req.body
        const uid = req.user
        const resp = await _updatePassword(uid, username, oldPassword, newPassword)
        if (resp.err) {
            return res.status(400).json({message: resp.err});
        }
        return res.status(200).json({message: "Password changed successfully!", user: resp})
    } catch (err) {
        return res.status(500).json({message: 'Database failure when updating password!'})
    }
}

export async function deleteUser(req, res) {
    try {
        const {username, password} = req.body;
        const uid = req.user
        const resp = await _deleteUser(uid, username, password)
        if (resp.err) {
            return res.status(400).json({message: resp.err});
        }
        return res.status(200).json({message: "User deleted successfully!", user: resp})
    } catch (err) {
        return res.status(500).json({message: 'Database failure when deleting user!'})
    }
}