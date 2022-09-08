import { createMatch, deleteMatch } from '../model/repository.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateMatch(userOne, userTwo, difficulty, question) {
    try {
        const newMatch = await createMatch({userOne: userOne, userTwo: userTwo, difficulty: difficulty, question: question});
        console.log(newMatch)
        return newMatch;
    } catch (err) {
        return { err: err };
    }
}

export async function ormDeleteMatch(roomid) {
    try {
        const match = await deleteMatch({roomid: roomid})
        return match
    } catch (err) {
        return {err: err}
    }
}