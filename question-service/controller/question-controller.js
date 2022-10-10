import { ormCreateQuestion as _createQuestion, 
    ormGetQuestion as _getQuestion, 
    ormGetQuestionsByDifficulty as _getQuestionsByDifficulty ,
    ormDeleteQuestion as _deleteQuestion
  } from '../model/question-orm.js'
  
  export async function createQuestion(req, res) {
      try {
          
          const { difficulty, title, question, examples, constraints } = req.body;
          if (difficulty && question && title) {
              const resp = await _createQuestion(difficulty, title, question, examples, constraints);
              if (resp.err) {
                  return res.status(400).json({message: resp.err});
              } else {
                  return res.status(201).json({message: `Created new question successfully`, question: resp});
              }
          } else {
              return res.status(400).json({message: 'Difficulty and/or question is missing!'});
          }
      } catch (err) {
          console.log(err)
          return res.status(500).json({message: 'Database failure when creating new question! '})
      }
  }
  
  export async function getQuestion(req, res) {
      try {
          const { id } = req.query;
          const resp = await _getQuestion(id);
          if (resp == null) {
              return res.status(404).json({message: 'Question does not exist!'})
          }
          if (resp.err) {
              return res.status(400).json({message: resp.err});
          }
          return res.status(200).json({message: 'Got question successfully', question: resp});
  
      } catch (err) {
          return res.status(500).json({message: 'Database failure when getting question!'})
      }
  }
  
  export async function getQuestionsByDifficulty(req, res) {
      try {
            const { difficulty } = req.query;
            if (difficulty != 'easy' && difficulty != 'medium' && difficulty != 'hard') {
              return res.status(400).json({message: "Invalid difficulty given!"})
          }
            const resp = await _getQuestionsByDifficulty(difficulty);
            if (resp.err) {
                return res.status(400).json({message: resp.err});
            }
            return res.status(200).json({message: 'Got questions successfully', question: resp});
        } catch (err) {
            console.log(err);
            return res.status(500).json({message: 'Database failure when getting questions!'})
        }
    }
  
    export async function deleteQuestion(req, res) {
      try {
          const { id } = req.body;
          const resp = await _deleteQuestion(id);
          if (resp.err) {
              return res.status(400).json({message: resp.err});
          }
          return res.status(200).json({message: "Question deleted successfully!", question: resp})
      } catch (err) {
          return res.status(500).json({message: 'Database failure when deleting question!'})
      }
  }