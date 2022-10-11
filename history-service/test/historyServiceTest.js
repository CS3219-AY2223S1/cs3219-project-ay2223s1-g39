// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
import jwt from "jsonwebtoken";
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Test History Service", function () {
  const validToken = jwt.sign(
    { user_id: "123" },
    process.env.TOKEN_KEY,
    {
      expiresIn: "2h",
    }
  );

  let testHistory = {
    user: "TESTHISTORYSERVICEUSER1",
    token: validToken,
  };
  describe("Test getHistory function /api/history/", function () {
    it("should get history", (done) => {
      chai
        .request(index)
        .get(`/api/history/`)
        .send(testHistory)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Got history successfully");
          done();
        });
    });
  });
});
