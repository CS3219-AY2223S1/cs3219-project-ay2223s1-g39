import { createQuestion, getQuestion, getQuestionsByDifficulty } from '../../service/question-service.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateQuestion(difficulty, question) {
    try {
        const newQuestion = await createQuestion({difficulty: difficulty, question: question});
        return newQuestion;
    } catch (err) {
        return { err: err };
    }
}

export async function ormGetQuestion(id) {
    try {
        const question = await getQuestion({id: id})
        return question
    } catch (err) {
        return {err: err}
    }
}

export async function ormGetQuestionsByDifficulty(difficulty) {
    try {
        const questions = await getQuestionsByDifficulty({difficulty: difficulty});
        return questions
    } catch (err) {
        return {err: err}
    }
}