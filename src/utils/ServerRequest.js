class ServerRequest {
  constructor(path = "", method = "GET", headers = {}, body = null) {
    this.url = process.env.REACT_APP_SERVER_URL + path;
    this.method = method;
    this.headers = headers;
    this.body = body !== null ? JSON.stringify(body) : null;
    this.token =
      window.localStorage.getItem("token") ||
      window.sessionStorage.getItem("token");
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
  useAuthorization = () => {
    this.headers = {
      ...this.headers,
      Authorization: "Bearer " + this.token,
    };
  };
}

export default ServerRequest;
