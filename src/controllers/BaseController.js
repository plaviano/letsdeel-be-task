class BaseController {
  constructor() {
    this.jsonResponse = this.jsonResponse.bind(this);
    this.unauthorized = this.unauthorized.bind(this);
    this.notFound = this.notFound.bind(this);
    this.unprocessableEntity = this.unprocessableEntity.bind(this);
  }

  jsonResponse (res, statusCode, data) {
    res.status(statusCode).json({ data });
  }

  ok (res, data) {
    return this.jsonResponse(res, 200, data);
  }

  unauthorized (res, message) {
    return this.jsonResponse(res, 401, message ? message : 'Unauthorized');
  }

  notFound(res, message) {
    return this.jsonResponse(res, 404, message ? message : 'Not Found');
  }

  unprocessableEntity(res, message) {
    return this.jsonResponse(res, 422, message ? message : 'Unprocessable Entity');
  }
}

module.exports = { BaseController };
