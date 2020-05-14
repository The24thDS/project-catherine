class ServerRequest {
  constructor(path = "", method = "GET", headers = {}, body = {}) {
    this.url = process.env.REACT_APP_SERVER_URL + path;
    this.method = method;
    this.headers = headers;
    this.body =
      body instanceof FormData
        ? body
        : Object.keys(body).length
        ? JSON.stringify(body)
        : null;
    this.token =
      window.localStorage.getItem("token") ||
      window.sessionStorage.getItem("token");
  }
  check = () => {
    console.log(this);
  };
  /** 
    Sends the requests
    @returns a Response object
  */
  send = async () => {
    const response = await fetch(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body,
    });
    return response;
  };
  /** 
    Sets "Authorization" header to "Bearer + token"
    @returns this
  */
  useAuthorization = () => {
    this.headers = {
      ...this.headers,
      Authorization: "Bearer " + this.token,
    };
    return this;
  };
  /** 
    Sets "Content-Type" header to "application/json"
    @returns this
  */
  useJsonBody = () => {
    this.headers = {
      ...this.headers,
      "Content-Type": "application/json",
    };
    return this;
  };
}

export default ServerRequest;
