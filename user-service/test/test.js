// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;
let should = chai.should();

// Configure chai
chai.use(chaiHttp);
chai.should();

describe("User Service", function () {
  let defaultUser = {
    username: "admin0",
    password: "admin0123",
  };
  
  let token = "";
  before("Signup user", (done) => {
    chai
      .request(index)
      .post("/api/user/signup")
      .set("Accept", "application/json")
      .send(defaultUser)
      .end((err, res) => {
        // res.should.have.status(200);
        done();
      });
  });

  before("Login user", async () => {
    const response = await chai
      .request(index)
      .post("/api/user/login")
      .set("Accept", "application/json")
      .send(defaultUser);
    token = response.body.user.token;
  });

  it("should delete user successfully", (done) => {
    chai
      .request(index)
      .delete("/api/user/delete")
      .send({
        username: "admin0",
        password: "admin0123",
        token: token
      })
      .set("x-auth-token", token)
      .auth(token, { type: "bearer" })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("object");
        done();
      });
  });
});
