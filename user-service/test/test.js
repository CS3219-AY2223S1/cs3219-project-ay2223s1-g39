// Import the dependencies for testing
import chai from "chai";
import chaiHttp from "chai-http";
import index from "../index.js";
const expect = chai.expect;

// Configure chai
chai.use(chaiHttp);
chai.should();



describe("User Service", function () {
  describe(
    "GET /api/user",
    function () {
      // Test for successful GET call
      it("should return successful GET call", (done) => {
        chai
          .request(index)
          .get("/api/user")
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });

      // Test for unsuccessful GET call
      it("should return unsuccessful GET call", (done) => {
        const id = 5;
        chai
          .request(index)
          .get(`/${id}`)
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
      });
    },

    describe(
      "POST /api/user/signup",
      function () {
        // Test for successful POST call
        // it("should return successful POST call", (done) => {
        //   const newTestUser = {
        //     username: "testuser",
        //     password: "abc123123",
        //   }
        //   chai
        //     .request(index)
        //     .post("/api/user/signup")
        //     .send(newTestUser)
        //     .end((err, res) => {
        //       // expect(res.should.have.status(200));
        //       // expect(res.body.should.be.a("object"));
        //       expect(res.body.message).to.equal('Username already taken!');
        //       done();
        //     });
        // });

        var agent = chai.request.agent(index);
        agent
          .post("/api/user/signup")
          .send({ username: "me", password: "123" })
          .then(function (res) {
            expect(res).to.have.cookie("sessionid");
            // The `agent` now has the sessionid cookie saved, and will send it
            // back to the server in the next request:
            return agent.get("/user/me").then(function (res) {
              expect(res).to.have.status(200);
            });
          });

        // // Test for unsuccessful GET call
        // it("should return unsuccessful GET call", (done) => {
        //   const id = 5;
        //   chai
        //     .request(index)
        //     .get(`/${id}`)
        //     .end((err, res) => {
        //       res.should.have.status(404);
        //       done();
        //     });
        // });
      },

      describe("DELETE /api/user/delete", function () {
        // Test for successful DELETE call
        it("should return successful DELETE call", (done) => {
          const newTestUser = {
            username: "testuser",
            password: "abc123123",
            token: token
          };
          chai
            .request(index)
            .delete("/api/user/delete")
            .send(newTestUser)

            .end((err, res) => {
              expect(res.should.have.status(200));
              // expect(res.body.should.be.a("object"));
              done();
            });
        });

        // // Test for unsuccessful GET call
        // it("should return unsuccessful GET call", (done) => {
        //   const id = 5;
        //   chai
        //     .request(index)
        //     .get(`/${id}`)
        //     .end((err, res) => {
        //       res.should.have.status(404);
        //       done();
        //     });
        // });
      })
    )
  );
});
