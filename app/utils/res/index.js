class Response {
  constructor(status, statusCode, message, data) {
    this.status = status;
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }

  setMessage(message) {
    this.message = message;
  }

  getMessage() {
    return this.message;
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }

  setData(data) {
    this.data = data;
  }

  getData() {
    return this.data;
  }

  setStatusCode(statusCode) {
    this.statusCode = statusCode;
  }

  getStatusCode() {
    return this.statusCode;
  }

  toJSON() {
    return {
      status: this.status,
      statusCode: this.statusCode,
      message: this.message,
      data: this.data,
    };
  }
}

module.exports = Response;
