// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;
let should = chai.should();
let defaultUser = {
  username: "admin0",
  password: "admin0123"
};

let token;

// Configure chai
chai.use(chaiHttp);
chai.should();



describe("User Service", function () {

  beforeEach(done => {
    chai
      .request(index)
      .post("/api/user/signup")
      .send(defaultUser)
      .end((err, res) => {
        // res.should.have.status(200);
        done();
      });
  });

  // before('Login user', async () => {
  //   const response = await chai.request(server)
  //     .post('api/v1/account')
  //     .set('Accept', 'application/json')
  //     .send({ "email": "john@gmail.com", "password": "123456" })
  //   token = res.body.token;
  // });
  beforeEach(done => {
    chai
      .request(index)
      .post("api/user/login")
      .send(defaultUser)
      .end((err, res) => {
        token = res.token;
        res.should.have.status(200);
        done();
      });
  });

  describe("Delete test user", () => {
    it("should delete user successfully", (done) => {
      chai
        .request(index)
        .delete("api/user/delete")
        .send(defaultUser)
        .end((err, res) => {
          console.log(err)
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });


});
