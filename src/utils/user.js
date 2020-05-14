import ServerRequest from "./ServerRequest";

/** 
    Verifies if the token is valid
    @returns a boolean value
  */
export const checkToken = async (token) => {
  const req = new ServerRequest("/auth/verifyToken", "POST", undefined, {
    input: token,
  }).useJsonBody();
  const response = await req.send();
  const data = await response.json();
  return data.success;
};

/** 
    Gets the details of the authenticated user
    @returns an object containing the details if the token is valid
    @returns false otherwise
  */
export const getUserDetails = async () => {
  const req = new ServerRequest("/user/details").useAuthorization();
  const response = await req.send();
  if (response.status === 200) {
    return await response.json();
  } else return false;
};
