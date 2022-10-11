// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Test Question Service", function () {
  let testMatch = {
    userOne: "testMatchingServiceUser1",
    userTwo: "testMatchingServiceUser2",
    difficulty: "Medium",
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
    });
  }),
    describe("Test deleteMatch function /api/match/", function () {
      it("should create delete match", (done) => {
        chai
          .request(index)
          .delete("/api/match/")
          .send(testMatch)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Match deleted successfully!"
            );
            done();
          });
      });
    });
});
