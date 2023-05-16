const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { app } = require("../app");
const data = require("../db/data/test-data");
const endpointsJSON = require("../endpoints.json");
// require("jest-sorted");

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
        ///////TASK 6
      });
  });
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
  });
});
