import { getHistory } from '../service/history-service.js';

export async function ormGetHistory(user) {
    try {
        const history = await getHistory({user : user})
        return history
    } catch (err) {
        return {err: err};
    }
}