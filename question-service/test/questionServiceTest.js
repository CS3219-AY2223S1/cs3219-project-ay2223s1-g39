// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
import userServiceIndex from "../../user-service/index.js";
import jwt from 'jsonwebtoken'
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Test Question Service", function () {

  const validToken = jwt.sign(
    { user_id: "123" },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  let testQuestion = {
    difficulty: "medium",
    title: "This is a test title",
    question: "This question is not meant for production",
    examples: [
      ["Input: x = 1", "Output: x = 1"],
      ["Input: x = 2", "Output: x = 2"],
    ],
    constraints: ["x < 1000000", "I don't know what else there are"],
    token: validToken
  };

  describe("Test createQuestion function /api/question/create", function () {
    it("should create real question", (done) => {
      chai
        .request(index)
        .post("/api/question/create")
        .send(testQuestion)
        .end((err, res) => {
          expect(res).to.have.status(201);
          testQuestion["id"] = res.body.question._id;
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal(
            "Created new question successfully"
          );
          done();
        });
    }),
      it("should not create question with missing difficulty", (done) => {
        chai
          .request(index)
          .post("/api/question/create")
          .send({
            title: "This is a test title",
            question: "This question is not meant for production",
            examples: [
              ["Input: x = 1", "Output: x = 1"],
              ["Input: x = 2", "Output: x = 2"],
            ],
            constraints: ["x < 1000000", "I don't know what else there are"],
            token: `${validToken}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Difficulty and/or question is missing!"
            );
            done();
          });
      }),
      it("should not create question with missing title", (done) => {
        chai
          .request(index)
          .post("/api/question/create")
          .send({
            difficulty: "medium",
            question: "This question is not meant for production",
            examples: [
              ["Input: x = 1", "Output: x = 1"],
              ["Input: x = 2", "Output: x = 2"],
            ],
            constraints: ["x < 1000000", "I don't know what else there are"],
            token: `${validToken}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Difficulty and/or question is missing!"
            );
            done();
          });
      }),
      it("should not create question with missing question", (done) => {
        chai
          .request(index)
          .post("/api/question/create")
          .send({
            difficulty: "medium",
            title: "This is a test title",
            examples: [
              ["Input: x = 1", "Output: x = 1"],
              ["Input: x = 2", "Output: x = 2"],
            ],
            constraints: ["x < 1000000", "I don't know what else there are"],
            token: `${validToken}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Difficulty and/or question is missing!"
            );
            done();
          });
      });
  });

  describe("Test getQuestion function /api/question/", function () {
    it("should get test question", (done) => {
      chai
        .request(index)
        .get("/api/question/")
        .send(testQuestion)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Got question successfully");
          done();
        });
    }),
      it("should not get question that is not in database", (done) => {
        chai
          .request(index)
          .get("/api/question/")
          .send({
            id: `000000000000`,
            token: validToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Question does not exist!");
            done();
          });
      }),
      it("should not get question with invalid jwt token", (done) => {
        chai
          .request(index)
          .get("/api/question/")
          .send({
            id: `${testQuestion.id}`,
            token: `whatever`,
          })
          .end((err, res) => {
            expect(res).to.have.status(401);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Invalid Token");
            done();
          });
      }),
      it("should not get question with missing jwt token", (done) => {
        chai
          .request(index)
          .get("/api/question/")
          .send({
            id: `${testQuestion.id}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(403);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "A token is required for authentication"
            );
            done();
          });
      });
  });

  describe("Test getQuestionsByDifficulty function /api/question/difficulty", function () {
    it("should not get questions with invalid difficulty", (done) => {
        chai
          .request(index)
          .get("/api/question/difficulty")
          .send({
            difficulty: "Whatever",
            token: validToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Invalid difficulty given!"
            );
            done();
          });
      }),
      it("should get questions with medium difficulty", (done) => {
        chai
          .request(index)
          .get("/api/question/difficulty?difficulty=medium")
          .send({
            difficulty: `medium`,
            token: validToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Got questions successfully"
            );
            done();
          });
      });
  });

  describe("Test deleteQuestion function /api/question/delete", function () {
    it("should not delete any questions with invalid id", (done) => {
      chai
        .request(index)
        .delete("/api/question/delete")
        .send({
          id: `000000000000`,
          token: validToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("No such question found!");
          done();
        });
    }),
      it("should delete question", (done) => {
        chai
          .request(index)
          .delete("/api/question/delete")
          .send(testQuestion)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Question deleted successfully!");
            done();
          });
      });
  });
});
