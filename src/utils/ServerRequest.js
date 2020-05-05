class ServerRequest {
  constructor(path = "", method = "GET", headers = {}, body = {}) {
    this.url = process.env.REACT_APP_SERVER_URL + path;
    this.method = method;
    this.headers = headers;
    this.body = body !== null ? JSON.stringify(body) : null;
  }
  check = () => {
    console.log(this);
  };
  send = async () => {
    const response = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
    });
    return response;
  };
}

export default ServerRequest;
