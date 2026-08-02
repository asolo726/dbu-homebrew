import searchUser from "../../app/api/auth/searchUser/route";
import postUser from "../../app/api/auth/postUser/route";
/**
 * Checks MONGODB for existing user. If a user exists, returns false.
 * If a user does not exist, creates a new user in MongoDB and returns true.
 * @param {*} session
 * @returns
 */
export default async function newUserCheck(session) {
  const result = await searchUser(session);
  if (result === "No User Found") {
    await postUser(session);
    return true;
  } else {
    console.log("User Found");
    return false;
  }
}
