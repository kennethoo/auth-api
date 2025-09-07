// import promotingMeettumEmail from "../emails/promotingMeettumEmail.js";

// import Recover from "../models/recover.js";
// // import { userManager } from "../application/user.js";

// async function reachout() {
//   const emails = await getAllUserEmails();

//   for (const { email, username } of emails) {
//     if (email.length) {
//       promotingMeettumEmail({ email, username });
//     }
//   }
// }
// export default reachout;

// async function getAllUserEmails() {
//   const result = [];
//   const allUserEmails = await Recover.find({});
//   const { users } = await userManager.internalGetUsers({});

//   const mapOfAllRegisterUser = new Set([]);
//   // for (const user of users) {
//   //   mapOfAllRegisterUser.add(user.email);
//   // }

//   for (const user of users) {
//     result.push({ email: user.email, username: user.username });
//   }
//   return result;
// }
