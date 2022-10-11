import matchModel from '../model/match-model.js';
import questionModel from '../model/question-model.js';

export async function getHistory(params) {
    const user = params.user;
    if (!user) {
        throw 'invalid user id!';
    }
    let matches = await matchModel.find({
        $or: [
            { userOne: user } ,
            { userTwo: user },
        ]
    })
    let history = [];
    for (let i = 0; i < matches.length; i++) {
        if (!matches[i]['question'].match(/^[0-9a-fA-F]{24}$/)) {
            continue;
        }
        let question = await questionModel.findById({
            _id: matches[i]['question']
        })
        if (question != null) {
            history.push({
            user: user,
            question: question['title'],
            question_id: question['_id'],
            difficulty: question['difficulty'],
            attemptedAt: matches[i]['createdAt'],
            })
        }
    }
    return history;
}
