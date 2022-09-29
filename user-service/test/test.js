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
        expect(res).to.have.status(201);
        done();
      });
  });

  before("Login default valid user", (done) => {
    chai
      .request(index)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .send(defaultUser)
      .end((err, res) => {
        token = res.body.user.token;
        expect(res).to.have.status(200);
        done();
      });
  });

  describe("Test createUser function /api/user/signup", function () {
    it("should return error 400 for invalid username", (done) => {
      chai
        .request(index)
        .post("/api/user/signup")
        .send({
          username: "",
          password: "admin0123"
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Username and/or Password are missing!");
          done();
        });
    }),
    
    it("should return error 400 for invalid password", (done) => {
      chai
        .request(index)
        .post("/api/user/signup")
        .send({
          username: "testuser500",
          password: ""
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Username and/or Password are missing!");
          done();
        });
    })
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
