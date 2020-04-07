class ServerRequest {
  constructor(path = "", method = "GET", headers = {}, body = {}) {
    this.url = process.env.REACT_APP_SERVER_URL + path;
    this.method = method;
    this.headers = headers;
    this.body = JSON.stringify(this.formatBody(body));
  }
  formatBody = (body = {}) => {
    const formattedBody = {};
    Object.keys(body).forEach((key) => {
      let formattedKey = key;
      let idx = formattedKey.search(/[A-Z]/);
      while (idx !== -1) {
        formattedKey =
          formattedKey.slice(0, idx) +
          "_" +
          formattedKey.charAt(idx).toLowerCase() +
          formattedKey.slice(idx + 1);
        idx = formattedKey.search(/[A-Z]/);
      }
      formattedBody[formattedKey] = body[key];
    });
    return formattedBody;
  };
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
