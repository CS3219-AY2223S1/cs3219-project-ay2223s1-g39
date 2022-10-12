import { ormGetHistory as _getHistory } from '../model/history-orm.js';

export async function getHistory(req, res) {
    console.log(req.body);
    try {
        const { user } = req.body;
        const resp = await _getHistory(user);
        if (resp.err) {
            return res.status(400).json({message: resp.err});
        } else {
            return res.status(200).json({message: 'Got history successfully', history: resp});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when getting history!'})
    }
}