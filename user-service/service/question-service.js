import questionModel from '../model/question/question-model.js';

export async function createQuestion(params) {
    const difficulty = params.difficulty;
    const question = params.question;
    let newQuestion = await questionModel.create({
        difficulty: difficulty, 
        question: question,
    });
    return newQuestion;
}

export async function getQuestion(params) {
    const id = params.id;
    let question = await questionModel.findById(id);
    return question;
}

export async function getQuestionsByDifficulty(params) {
    const difficulty = params.difficulty;
    let questions = await questionModel.findWhere((question) => question.difficulty == difficulty);
    return questions;
}

