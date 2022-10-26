import { ormCreateMatch as _createMatch, ormDeleteMatch as _deleteMatch} from '../model/match-orm.js'

export async function createMatch(req, res) {
    try {
        const { userOne, userTwo, difficulty, question } = req.body;
            const resp = await _createMatch(userOne, userTwo, difficulty, question);
            if (resp.err) {
                return res.status(400).json( {message: resp.err} );
            } else {
                return res.status(201).json({message: `Created new match for users ${resp.userOne} and ${resp.userTwo} successfully!`, match: resp});
            }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new match!'})
    }
}

//Not tested yet
export async function deleteMatch(req, res) {
    try {
        const roomid = req.body.roomid
        const resp = await _deleteMatch(roomid)
        if (resp.err) {
            return res.status(400).json({message: resp.err});
        }
        return res.status(200).json({message: "Match deleted successfully!", match: resp})
    } catch (err) {
        return res.status(500).json({message: 'Database failure when deleting match!'})
    }
}