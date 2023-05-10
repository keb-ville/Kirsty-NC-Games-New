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
      console.log(body, "BODYYYYY");
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
