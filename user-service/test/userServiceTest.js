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
  let testUserToken;
  let testUserToken2;

  let testUser = {
    username: "testUser1",
    password: "admin0123",
  };

  let testUser2 = {
    username: "testUser2",
    password: "password123",
  };

  before("Signup testUser", (done) => {
    chai
      .request(index)
      .post("/api/user/signup")
      .set("Accept", "application/json")
      .send(testUser)
      .end((err, res) => {
        expect(res).to.have.status(201);
        done();
      });
  });

  before("Login testUser", (done) => {
    chai
      .request(index)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .send(testUser)
      .end((err, res) => {
        testUserToken = res.body.user.token;
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
          password: "admin0123",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal(
            "Username and/or Password are missing!"
          );
          done();
        });
    }),
      it("should return error 400 for invalid password", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send({
            username: "testUser2500",
            password: "",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Username and/or Password are missing!"
            );
            done();
          });
      }),
      it("should return error 400 for invalid username length", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send({
            username: "hi",
            password: "admin0123",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a username with 5 or more characters!"
            );
            done();
          });
      }),
      it("should return error 400 for invalid password length", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send({
            username: "validusername",
            password: "hii",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a password with 5 or more characters!"
            );
            done();
          });
      }),
      it("should return error 400 for empty username", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send({
            username: "         ",
            password: "uwu",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a valid username!"
            );
            done();
          });
      }),
      it("should return error 400 for empty password", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send({
            username: "admin1000",
            password: "         ",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a valid password!"
            );
            done();
          });
      }),
      it("should return success for creating valid user", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send(testUser2)
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              `Created new user ${testUser2.username} successfully!`
            );
            done();
          });
      }),
      it("should return error 400 for signing up with existing username", (done) => {
        chai
          .request(index)
          .post("/api/user/signup")
          .send(testUser2)
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal("Username already taken!");
            done();
          });
      });
  });

  describe("Test login function /api/user/login", function () {
    it("should return error 400 for incorrect password", (done) => {
      chai
        .request(index)
        .post("/api/user/login")
        .set("Accept", "application/json")
        .send({
          username: `${testUser.username}`,
          password: "eksdeee",
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal(
            "Invalid password!"
          );
          done();
        });
    }),
      it("should return error 400 for logging in user that has not signed up", (done) => {
        chai
          .request(index)
          .post("/api/user/login")
          .set("Accept", "application/json")
          .send({
            username: "blobblobblob12",
            password: "thisisarealpassword",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "No such user found!"
            );
            done();
          });
      }),
      it("should return error 400 for invalid username", (done) => {
        chai
          .request(index)
          .post("/api/user/login")
          .set("Accept", "application/json")
          .send({
            username: "hi",
            password: "thisisarealpassword",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a valid username!"
            );
            done();
          });
      }),
      it("should return error 400 for invalid password", (done) => {
        chai
          .request(index)
          .post("/api/user/login")
          .set("Accept", "application/json")
          .send({
            username: "thisisarealusername",
            password: "hi",
          })
          .end((err, res) => {
            expect(res).to.have.status(400);
            expect(res.body).to.be.a("object");
            expect(res.body.message).to.equal(
              "Please enter a valid password!"
            );
            done();
          });
      }),
      it("should login user successfully", (done) => {
        chai
          .request(index)
          .post("/api/user/login")
          .set("Accept", "application/json")
          .send(testUser2)
          .end((err, res) => {
            testUserToken2 = res.body.user.token;
            testUser2["token"] = testUserToken2;
            expect(res).to.have.status(200);
            expect(res.body.message).to.equal("Success!");
            done();
          });
      });
  });

  describe("Test updatePassword function /api/user/update-password", function () {
    it("should return error 400 for invalid username", (done) => {
      chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: "hi",
          oldPassword: "admin0123",
          newPassword: "admin01234",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Please enter a valid username!");
          done();
        });
    }),
    it("should return error 400 for invalid old password", (done) => {
      chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: "testUser1",
          oldPassword: "0",
          newPassword: "admin01234",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Please enter a valid password!");
          done();
        });
    }),
      it("should return error 400 for invalid new password", (done) => {
        chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: "testUser1",
          oldPassword: "admin0123",
          newPassword: "why",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Please enter a password with 5 or more characters!");
          done();
          });
      }),
      it("should return error 400 for user with valid JWT but invalid username", (done) => {
        chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: "xxxxxxxxxxxx",
          oldPassword: "admin01234",
          newPassword: "zzzzzzzzzzzzz",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Username linked with JWT is different from username sent!");
          done();
          });
      }),
      it("should return error 400 for wrong old password", (done) => {
        chai
        .request(index)
        .put("/api/user/update-password")
        .send({
          username: `${testUser.username}`,
          oldPassword: "definitely a wrong password",
          newPassword: "zzzzzzzzzzzzz",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.be.a("object");
          expect(res.body.message).to.equal("Wrong password!");
          done();
          });
      }),
      it("should update userPassword successfully", (done) => {
        chai
          .request(index)
          .put("/api/user/update-password")
          .send({
            username: "testUser1",
            oldPassword: "admin0123",
            newPassword: "admin01234",
            token: testUserToken,
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            done();
          });
      });
  });

  describe("Test deleteUser function /api/user/delete", function () {
    it("should delete testUser successfully", (done) => {
      chai
        .request(index)
        .delete("/api/user/delete")
        .send({
          username: "testUser1",
          password: "admin01234",
          token: testUserToken,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.a("object");
          done();
        });
    }),
      it("should delete testUser2 successfully", (done) => {
        chai
          .request(index)
          .delete("/api/user/delete")
          .send(testUser2)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.be.a("object");
            done();
          });
      });
  });
});
