import { createQuestion, deleteQuestion, getQuestion, getQuestionsByDifficulty } from '../service/question-service.js';

//need to separate orm functions from repository to decouple business logic from persistence
export async function ormCreateQuestion(difficulty, title, question, examples, constraints) {
    try {
        console.log(constraints);
        const newQuestion = await createQuestion({difficulty: difficulty, title: title, question: question, examples: examples, constraints: constraints});
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

export async function ormDeleteQuestion(id) {
    try {
        console.log(constraints);
        const question = await deleteQuestion({id: id});
        return question;
    } catch (err) {
        return { err: err };
    }
}