const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { app } = require("../app");
const data = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");

beforeEach(() => {
  return seed(data); // seed the db with test data
});

afterAll(() => {
  return db.end(); // close the db connection
});
//////TASK 3.5
describe("/api", () => {
  it("200: GET- responds with a JSON object containing all endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        expect(body.endpoints).toEqual(endpointsJSON);
      });
  });
});
////TASK 3
describe("/api/categories", () => {
  it("200 GET - responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then(({ body }) => {
        expect(body.categories).toBeInstanceOf(Array);
        expect(body.categories).toHaveLength(4);
        body.categories.forEach((category) => {
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
    // test("returns object containing endpoints", () => {
    //   return request(app)
    //     .get("/api")
    //     .expect(200)
    //     .then(({ body }) => {
    //       console.log(body);
    //       expect(body).toHaveProperty("GET /api");
    //       expect(body).toHaveProperty("GET /api/topics");
    //       expect(body).toHaveProperty("GET /api/articles");
    //       expect(body).toHaveProperty("GET /api/articles/article:id");
    //       expect(body).toHaveProperty("GET /api/users");
    //       expect(body).toHaveProperty("GET /api/articles/article:id/comments");
    //     });
    // });
  });
});
///////////TASK 4
describe("/api/reviews/:review_id", () => {
  test("should return a status code of 200", () => {
    return request(app).get("/api/reviews/3").expect(200);
  });
});
test("Should respond with a review object by a review_id", () => {
  return request(app)
    .get("/api/reviews/3")
    .expect(200)
    .then(({ body }) => {
      expect(body.review).toMatchObject({
        review_id: 3,
        title: expect.any(String),
        review_body: expect.any(String),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        votes: expect.any(Number),
        category: expect.any(String),
        owner: expect.any(String),
        created_at: expect.any(String),
      });
    });
});
test("GET /api/reviews responds with status 400 if endpoint is an invalid review id", () => {
  return request(app)
    .get("/api/reviews/not-an-id")
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("Invalid Request");
    });
});
test("GET /api/reviews responds with status 404 and error message if endpoint is a valid but non-existent review id", () => {
  return request(app)
    .get("/api/reviews/9999")
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe("Not Found");
    });
});
///////TASK 5
describe("/api/reviews", () => {
  test("GET /api/reviews should return 200 status code", () => {
    return request(app).get("/api/reviews").expect(200);
  });
  test('"GET /api/reviews should return an an array sorted by the date', () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  test("GET /api/reviews responds with an array of review objects with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        const body = response.body; //this is the response body from the get request
        expect(body.reviews).toBeInstanceOf(Array);
        expect(body.reviews.length).toBe(13); //check the length
        response.body.reviews.forEach((review) => {
          expect(review).toMatchObject({
            owner: expect.any(String),
            title: expect.any(String),
            review_id: expect.any(Number),
            category: expect.any(String),
            review_img_url: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            designer: expect.any(String),
            comment_count: expect.any(Number),
            //or string depending on if you used COUNT in query
          });
        });
      });
  });
  ///////TASK 6
  describe("GET /api/reviews/:review_id/comments", () => {
    test("should respond with an array of comments for the given review ID with properties which are of the correct data type", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((response) => {
          response.body.forEach((comment) => {
            expect(comment).toMatchObject({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            });
          });
        });
    });
    test("should respond with status 400 if the review ID is invalid ", () => {
      return request(app)
        .get("/api/reviews/not-an-id/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid Request");
        });
    });
    test("should respond with status 404 if the review ID is non existent ", () => {
      return request(app)
        .get("/api/reviews/9999/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toBe("Not Found");
        });
    });
    test("Responds with array of all comment descending", () => {
      return request(app)
        .get("/api/reviews/2/comments")
        .expect(200)
        .then((result) => {
          expect(result.body).toBeSortedBy("created_at", { descending: true });
        });
    });
    ///////TASK 7
    describe("POST /api/reviews/:review_id/comments", () => {
      test("should respond with a 201 and an object with properties of username and body ", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .expect(201)
          .send({ username: "bainesface", body: "I loved this game too!" })
          .then((response) => {
            expect(response.body.review_id).toBe(1);
            expect(response.body.author).toBe("bainesface");
            expect(response.body.body).toBe("I loved this game too!");
          });
      });
      test("should ignore other additional properties that are passed", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .expect(201)
          .send({
            username: "bainesface",
            body: "I loved this game too!",
            extraProp: "extra things",
          })
          .then((response) => {
            expect(response.body.review_id).toBe(1);
            expect(response.body.author).toBe("bainesface");
            expect(response.body.body).toBe("I loved this game too!");
            expect(response.body).not.toHaveProperty("extraProp");
          });
      });
      test("should respond with a status 400 when an invalid ID is passed", () => {
        return request(app)
          .post("/api/reviews/not-an-id/comments")
          .expect(400)
          .send({
            username: "bainesface",
            body: "I loved this game too!",
          })
          .then((response) => {
            expect(response.body.message).toBe("Invalid Request");
          });
      });
      test("should respond with a status 404 when a non existent ID is passed", () => {
        return request(app)
          .post("/api/reviews/9999/comments")
          .expect(404)
          .send({
            username: "bainesface",
            body: "I loved this game too!",
          })
          .then((response) => {
            expect(response.body.message).toBe("Not Found");
          });
      });
      test("should respond with a status 400 when missing required fields, e.g. no username or body properties passed", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .expect(400)
          .send({}) //can have one or none
          .then((response) => {
            expect(response.body.message).toBe("Invalid Request");
          });
      });
      test("should respond with a status 404 when username does not exist", () => {
        return request(app)
          .post("/api/reviews/1/comments")
          .expect(404)
          .send({
            username: "bananas",
            body: "Wooooooo bananas",
          })
          .then((response) => {
            expect(response.body.message).toBe("Not Found");
          });
      });
    });
    //////TASK 8
    describe("PATCH /api/reviews/:review_id", () => {
      test("should respond with a status 200 and an updated review with increased votes", () => {
        return request(app)
          .patch("/api/reviews/1")
          .expect(200)
          .send({ inc_votes: 100 })
          .then((result) => {
            expect(result.body.review_id).toBe(1);
            expect(result.body.title).toBe("Agricola");
            expect(result.body.designer).toBe("Uwe Rosenberg");
            expect(result.body.owner).toBe("mallionaire");
            expect(result.body.review_img_url).toBe(
              "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
            );
            expect(result.body.review_body).toBe("Farmyard fun!");
            expect(result.body.category).toBe("euro game");
            expect(result.body.created_at).toBe("2021-01-18T10:00:20.514Z");
            expect(result.body.votes).toBe(101);
          });
      });
      test("should respond with a status 400 when an invalid ID is passed", () => {
        return request(app)
          .patch("/api/reviews/not-an-id")
          .expect(400)
          .send({ inc_votes: 100 })
          .then((result) => {
            expect(result.body.message).toBe("Invalid Request");
          });
      })
      test("should respond with a status 404 when a non existent ID is passed", () => {
        return request(app)
          .patch("/api/reviews/9999")
          .expect(404)
          .send({ inc_votes: 100 })
          .then((result) => {
            expect(result.body.message).toBe("Not Found");
          })

      })
      test("should respond with a status 400 when incorrect body id passed", () => {
        return request(app)
          .patch("/api/reviews/1")
          .expect(400)
          .send({inc_votes: "Wooooo bananas"})
          .then((result) => {
            expect(result.body.message).toBe("Invalid Request");
          })
          })
      // test.only("should respond with 200 and not update review if inc_votes is missing and return the original review object", () => {
      //   return request(app)
      //     .patch("/api/reviews/1")
      //     .expect(200)
      //     .send({})
      //     .then((result) => {
      //       expect(result.body.review_id).toBe(1);
      //       expect(result.body.title).toBe("Agricola");
      //       expect(result.body.designer).toBe("Uwe Rosenberg");
      //       expect(result.body.owner).toBe("mallionaire");
      //       expect(result.body.review_img_url).toBe(
      //         "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
      //       );
      //       expect(result.body.review_body).toBe("Farmyard fun!");
      //       expect(result.body.category).toBe("euro game");
      //       expect(result.body.created_at).toBe("2021-01-18T10:00:20.514Z");
      //       expect(result.body.votes).toBe(1);
      //     })
      // })
    });
  });
});
/////TASK 9
describe("DELETE /api/comments", () => {
  test("should respond with a status 204 and no content", () => {
    return request(app).delete("/api/comments/5").expect(204);
  });
  test("should respond with a 404 if the comment ID does not exist", () => {
    return request(app).delete("/api/comments/9999").expect(404);
  });
  test("should respond with a status 400 if the comment ID is invalid", () => {
    return request(app).delete("/api/comments/not-an-id").expect(400);
  });
});
/////TASK 10
describe("GET /api/users", () => {
  test("should respond with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});
