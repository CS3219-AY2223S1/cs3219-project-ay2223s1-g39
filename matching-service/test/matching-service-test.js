// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Test Matching Service", function () {
  let testMatch = {
    userOne: "testMatchingServiceUser1",
    userTwo: "testMatchingServiceUser2",
    difficulty: "medium",
    question: "Test Sum",
  };

  describe("Test createMatch function /api/match/", function () {
    it("should create match", (done) => {
      chai
        .request(index)
        .post("/api/match/")
        .send(testMatch)
        .end((err, res) => {
          expect(res).to.have.status(201);
          testMatch["roomid"] = res.body.match._id;
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal(
            `Created new match for users ${testMatch.userOne} and ${testMatch.userTwo} successfully!`
          );
          done();
        });
    }),
      it("should return error 400 for missing userOne", (done) => {
        chai
          .request(index)
          .post("/api/match/")
          .send({
            userOne: " ",
            userTwo: `${testMatch.userTwo}`,
            difficulty: `${testMatch.difficulty}`,
            question: `${testMatch.question}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(`Invalid username for User One!`);
            done();
          });
      }),
      it("should return error 400 for missing userTwo", (done) => {
        chai
          .request(index)
          .post("/api/match/")
          .send({
            userOne: `${testMatch.userOne}`,
            userTwo: " ",
            difficulty: `${testMatch.difficulty}`,
            question: `${testMatch.question}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(`Invalid username for User Two!`);
            done();
          });
      }),
      it("should return error 400 for missing question", (done) => {
        chai
          .request(index)
          .post("/api/match/")
          .send({
            userOne: `${testMatch.userOne}`,
            userTwo: `${testMatch.userTwo}`,
            difficulty: `${testMatch.difficulty}`,
            question: " ",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(`Invalid question returned!`);
            done();
          });
      }),
      it("should return error 400 for missing difficulty", (done) => {
        chai
          .request(index)
          .post("/api/match/")
          .send({
            userOne: `${testMatch.userOne}`,
            userTwo: `${testMatch.userTwo}`,
            difficulty: " ",
            question: `${testMatch.question}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(`Invalid difficulty returned!`);
            done();
          });
      }),
      it("should return error 400 for incorrect difficulty", (done) => {
        chai
          .request(index)
          .post("/api/match/")
          .send({
            userOne: `${testMatch.userOne}`,
            userTwo: `${testMatch.userTwo}`,
            difficulty: "ReallyEasy",
            question: `${testMatch.question}`,
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(`Unknown difficulty level returned!`);
            done();
          });
      });
  }),
    describe("Test deleteMatch function /api/match/", function () {
      it("should create delete match", (done) => {
        it("should return error 400 for empty roomid", (done) => {
          chai
            .request(index)
            .post("/api/match/")
            .send({
              roomid: " "
            })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.a("object");
              expect(res.body.message).to.equal(`Invalid room found!`);
              done();
            });
        }),
        it("should return error 400 for invalid roomid", (done) => {
          chai
            .request(index)
            .post("/api/match/")
            .send({
              roomid: "abcde"
            })
            .end((err, res) => {
              expect(res).to.have.status(400);
              expect(res.body).to.be.a("object");
              expect(res.body.message).to.equal(`No such room found!`);
              done();
            });
        }),
        chai
          .request(index)
          .delete("/api/match/")
          .send(testMatch)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Match deleted successfully!");
            done();
          });
      });
    });
});
