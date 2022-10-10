import questionModel from "../model/question-model.js";

export async function createQuestion(params) {
  const difficulty = params.difficulty;
  const title = params.title;
  const question = params.question;
  const examples = params.examples;
  const constraints = params.constraints;
  console.log(constraints);
  let newQuestion = await questionModel.create({
    difficulty: difficulty,
    title: title,
    question: question,
    examples: examples,
    constraints: constraints,
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
  let questions = await questionModel.find({ difficulty: difficulty });
  return questions;
}

export async function deleteQuestion(params) {
  const id = params.id;
  const questionToBeDeleted = await questionModel.findOne({ _id: id });
  if (questionToBeDeleted == null) {
    throw "No such question found!";
  }
  const questions = await questionModel.findOneAndDelete({ _id: id });
  return questions;
}