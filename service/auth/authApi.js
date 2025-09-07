import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { oTPApi } from "./otpApi.js";
import sendCode from "../../emails/sendCode.js";
import { secureSessionApi } from "./secureSession.js";
import User from "../../models/user.js";

// This class manages the authentication for the Auth API

class AuthApi {
  constructor() {
    this.ACCOUNT_TYPE_EMAIL = "email";
  }

  async getUserByEmail(email) {
    const user = await User.findOne({ email });
    return user;
  }

  async isEmailTaken(email) {
    const account = await User.findOne({ email });
    if (account) {
      return true;
    }
    return false;
  }
  async isUsernameTaken(username) {
    const account = await User.findOne({ username });
    if (account) {
      return true;
    }
    return false;
  }

  async generateAndSendOTPToken(email) {
    const token = await oTPApi.createOptToken(email);
    sendCode(token);
    return token;
  }

  async validateOTpToken(token) {
    const isOTPTokenValid = await oTPApi.isOTPTokenValid(token);
    if (isOTPTokenValid) {
      return true;
    } else {
      return false;
    }
  }

  async registerUser(userData) {
    const { email, username, accountType, firstName, lastName } = userData;

    if (!email || !username || !accountType) {
      return {
        succeeded: false,
        errorMessage: "Please provide all required information (email, username, and account type).",
      };
    }
    
    // Check if email is already taken
    const isEmailTaken = await this.isEmailTaken(email);
    if (isEmailTaken) {
      return {
        succeeded: false,
        errorMessage: "This email is already registered. Please use a different email or try logging in.",
      };
    }

    // Check if username is already taken
    const isUsernameTaken = await this.isUsernameTaken(username);
    if (isUsernameTaken) {
      return {
        succeeded: false,
        errorMessage: "This username is already taken. Please choose a different username.",
      };
    }

    const user = await User.create({ ...userData });
    
    
    return {
      succeeded: true,
    };
  }

  // really important flow
  async logUserIn(payload) {
    const { accountType, email } = payload;
    if (!email || !accountType) {
      return {
        isLogIn: false,
        errorMessage: "Please provide both email and account type to log in.",
      };
    }


    if (accountType == this.ACCOUNT_TYPE_EMAIL) {
      return this.logUserWithEmail(payload);
    }

    //Should never happend but ...
    return {
      isLogIn: false,
      errorMessage: "Invalid account type. Please try again.",
    };
  }



  async logUserWithEmail(userLoginData) {
    const { email, password } = userLoginData;
    const userAccount = await this.getUserByEmail(email);
    if (!userAccount) {
      return {
        isLogIn: false,
        errorMessage: "No account found with this email. Please check your email or create a new account.",
      };
    }
    if (userAccount.accountType !== this.ACCOUNT_TYPE_EMAIL) {
      return {
        isLogIn: false,
        errorMessage: "This email is registered with a different account type. Please use the correct login method.",
      };
    }
    const isSamePassword = await bcrypt.compare(password, userAccount.password);
    if (!isSamePassword) {
      return {
        isLogIn: false,
        errorMessage: "Incorrect password. Please check your password and try again.",
      };
    }
    return this.logUserInUsingJWT({
      email: userAccount.email,
      userId: userAccount._id.toString(),
      firstName: userAccount.firstName || '',
      lastName: userAccount.lastName || '',
      username: userAccount.username,
      displayName: userAccount.username,
    });
  }

  //Now this function
  async logUserInUsingJWT(userAccount) {
    const { email, userId, firstName, lastName, username, displayName } = userAccount;
    const secureSession = await secureSessionApi.createSecureLoginSesionToken({
      email,
      userId,
      firstName,
      lastName,
      username,
      displayName,
    });
    return {
      isLogIn: true,
      secureSession,
    };
  }


  async isUserLogin({ access_token, session_id }) {
    const errorResponse = {
      isLogIn: false,
      errorMessage: "You are not logged in. Please log in to continue.",
    };
  
    // 1. Try using the provided access token
    if (access_token) {
      const user = await secureSessionApi.getUserFromAccessToken(access_token);
      if (user) {
        return { user, isLogIn: true };
      }
    }

    // 2. Try refreshing token using session_id
    if (session_id) {
      const { isTokenRefresh, accessToken: newAccessToken } =
        await this.refreshSecureToken(session_id);
      if (isTokenRefresh) {
        const user = await secureSessionApi.getUserFromAccessToken(newAccessToken);
        if (user) {
          return { user, isLogIn: true, isTokenRefresh: true, newAccessToken };
        }
      }
    }
  
    // 3. Failed both methods
    return errorResponse;
  }
  

  //ApiRoute
  async requestUserAccount({ email }) {
    console.log("Requesting user account for", email);
    const isEmailTaken = await this.isEmailTaken(email);
    if (isEmailTaken) {
      return {
        succeeded: false,
      };
    }

    const token = await this.generateAndSendOTPToken(email);
    return {
      succeeded: true,
      otpTokenId: token.otpTokenId,
    };
  }

  async validateUserAccount(verificationToken) {
    const isOptValid = await oTPApi.isOTPTokenValid(verificationToken);
    return {
      succeeded: isOptValid,
    };
  }

  async refreshSecureToken(sessionId) {
    const { isSessionValid, secureSession } =
      await secureSessionApi.canRefreshToken(sessionId);
    if (!isSessionValid) {
      return {
        isTokenRefresh: false,
      };
    }
    const { userId } = secureSession;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return {
        isTokenRefresh: false,
      };
    }

    //Generate and sign Token
    const accessToken = await secureSessionApi.generateAccessToken({
      email: user.email,
      userId: user._id,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      username: user.username,
      displayName: user.username,
    });

    return {
      isTokenRefresh: true,
      accessToken,
    };
  }

  // will make this more secure later
  async logoutUser({ accessToken, sessionId }) {
    await secureSessionApi.deleteSecureSession(sessionId);
    return { accessToken, sessionId };
  }

  //TODO: make this more secure later
  async deleteUserAccount(userId) {
    const user = await User.findOne({_id: userId});
    if (!user) {
      return { succeeded: false, errorMessage: "User not found." };
    }
    await User.deleteOne({ _id: userId });
    // Optionally, clear all user sessions or other related data
    await secureSessionApi.deleteAllUserSessions(userId.toString());
    return { succeeded: true };
  }


  async updateUserEmail({ currentEmail, newEmail }) {
    if (await this.isEmailTaken(newEmail)) {
      return { succeeded: false, errorMessage: "This email is already registered. Please use a different email address." };
    }
    const user = await User.findOneAndUpdate(
      { email: currentEmail },
      { email: newEmail },
      { new: true },
    );
    if (!user) {
      return { succeeded: false, errorMessage: "User not found. Please check the current email address." };
    }
    // Optionally, update the user profile as well
    return { succeeded: true, user };
  }
  async changePassword({ username, oldPassword, newPassword }) {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return { succeeded: false, errorMessage: "Username not found. Please check your username and try again." };
    }

    // Compare the provided old password with the stored hash
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return { succeeded: false, errorMessage: "Current password is incorrect. Please check your password and try again." };
    }

    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({ username }, { password: newHash });

    return { succeeded: true };
  }
  async updatePassword({ email, newPassword }) {
    const user = await User.findOne({ email });
    if (!user) {
      return { succeeded: false, errorMessage: "User not found. Please check the email address." };
    }
    // Hash the new password
    const newHash = await bcrypt.hash(newPassword, 10);
    // Update the user's password in the database
    await User.findOneAndUpdate({ email }, { password: newHash });
    return { succeeded: true };
  }
}
export const authApi = new AuthApi();
