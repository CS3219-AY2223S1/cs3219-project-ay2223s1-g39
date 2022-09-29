// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("Test User Service", function () {
  let token;

  let defaultUser = {
    username: "admin0",
    password: "admin0123",
  };

  before("Signup default valid user", (done) => {
    chai
      .request(index)
      .post("/api/user/signup")
      .set("Accept", "application/json")
      .send(defaultUser)
      .end((err, res) => {
        // res.should.have.status(201);
        done();
      });
  });

  before("Login default valid user", async () => {
    const response = await chai
      .request(index)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .send(defaultUser);
    token = response.body.user.token;
  });

  describe("Test updatePassword function /api/user/update-password", function () {
    it("should update userPassword successfully", (done) => {
      chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: "admin0",
          oldPassword: "admin0123",
          newPassword: "admin01234",
          token: token
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          done();
        });
    });
  });

  describe("Test deleteUser function /api/user/delete", function () {
    it("should delete user successfully", (done) => {
      chai
        .request(index)
        .delete("/api/user/delete")
        .send({
          username: "admin0",
          password: "admin01234",
          token: token
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          done();
        });
    });
  });

});
