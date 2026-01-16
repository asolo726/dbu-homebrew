/**
 * Checks MONGODB for existing user. If a user exists, returns false.
 * If a user does not exist, creates a new user in MongoDB and returns true. 
 * @param {*} session 
 * @returns 
 */
export default async function newUserCheck(session) {
   const email = session.user.email;
   const baseUrl = process.env.baseURL;
   const result = await fetch(`${baseUrl}/netlify/functions/searchUser?email=${email}`);
   if (result.statusText === "No User Found") {
      const postResult = await fetch(`${baseUrl}/netlify/functions/postUser?email=${email}`);
      console.log("No User Found Res: ", postResult);
      return true;
   }
   else{
      return false
   }
}