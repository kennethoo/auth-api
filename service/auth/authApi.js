import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { oTPApi } from "./otpApi.js";
import sendCode from "../../emails/sendCode.js";
import sendMorpionAIWelcomeEmail from "../../emails/morpionaiWelcome.js";
import { userProfileService } from "../userProfileService.js";
import { secureSessionApi } from "./secureSession.js";
import { OAuth2Client } from 'google-auth-library';


const ADMIN_EMAIL = "kcgandonou19@gmail.com";
// This class manage the whole Auth of MorpionAi.it
const Schema = mongoose.Schema;
const model = new Schema({
  email: String,
  password: String,
  username: String,
  accountType: String,
});
model.pre("save", function (next) {
  const user = this;
  bcrypt.hash(user.password, 10, (error, hash) => {
    user.password = hash;
    next();
  });
});

const User = mongoose.model("user", model);

class AuthApi {
  constructor() {
    this.ACCOUNT_TYPE_GOOGLE = "google";
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
    const { email, username, accountType, firstName, lastName, displayName } = userData;

    const uniqueName = userProfileService.generateRandomDisplayName();
    if (!email || !username || !accountType) {
      return {
        succeeded: false,
        errorMessage: "Please provide all required information (email, username, and account type).",
      };
    }
    // add later a password validation function
    const isEmailTaken = await this.isEmailTaken(email);
    if (isEmailTaken) {
      return {
        succeeded: false,
        errorMessage: "This email is already registered. Please use a different email or try logging in.",
      };
    }

    // const isUsernameTaken = await this.isUsernameTaken(uniqueName);
    // if (isUsernameTaken) {
    //   return {
    //     succeeded: false,
    //     errorMessage: "This username is already taken. Please choose a different username.",
    //   };
    // }
    const user = await User.create({ ...userData, username: uniqueName });
    const userProfileData = {
      userId: user.id,
      username: uniqueName,
      displayName: uniqueName, // Use provided displayName or generate random one
      blocked: false,
      email: user.email,
      firstName,
      lastName,
      isAdmin: user.email === ADMIN_EMAIL,
      numberOfWins: 0,
      numberOfLosses: 0,
      numberOfTies: 0,
      level: 0,
      points: 0,
    };
    await userProfileService.createUserProfile(userProfileData);
    
    // Send welcome email to the new user
    try {
      await sendMorpionAIWelcomeEmail({
        email: user.email,
        username: uniqueName
      });
    } catch (error) {
      console.error('Error sending welcome email:', error);
      // Don't fail registration if email fails
    }
    
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


    if (accountType == this.ACCOUNT_TYPE_GOOGLE) {
      return this.logUserWithGoogleAccount(payload);
    }
    if (accountType == this.ACCOUNT_TYPE_EMAIL) {
      return this.logUserWithSplitAccount(payload);
    }

    //Should never happend but ...
    return {
      isLogIn: false,
      errorMessage: "Invalid account type. Please try again.",
    };
  }

  async verifyGoogleToken(accessToken) {
    try {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const ticket = await client.verifyIdToken({
        idToken: accessToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      return {
        succeeded: true,
        email: payload.email,
        firstName: payload.given_name,
        lastName: payload.family_name,
        picture: payload.picture,
        googleId: payload.sub,
      };
    } catch (error) {
      console.error('Google token verification failed:', error);
      return {
        succeeded: false,
        errorMessage: 'Invalid Google token',
      };
    }
  }

  async logUserWithGoogleAccount(userLoginData) {
    const { email } = userLoginData;
    const userAccount = await this.getUserByEmail(email);
    if (!userAccount) {
      return {
        isLogIn: false,
        errorMessage: "No account found with this email. Please check your email or create a new account.",
      };
    }
    const userProfile =  await userProfileService.getByEmail(email)
    return this.logUserInUsingJWT({
      email: userAccount.email,
      userId: userAccount._id.toString(),
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      username: userAccount.username,
      displayName: userProfile.displayName,
    });
  }

  async logUserWithSplitAccount(userLoginData) {
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
    const userProfile =  await userProfileService.getByEmail(email)
    return this.logUserInUsingJWT({
      email: userAccount.email,
      userId: userAccount._id.toString(),
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      username: userAccount.username,
      displayName: userProfile.displayName,
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

  async googleOAuthLogin(accessToken) {
    try {
      // Verify the Google token
      const tokenVerification = await this.verifyGoogleToken(accessToken);
      if (!tokenVerification.succeeded) {
        return {
          isLogIn: false,
          errorMessage: tokenVerification.errorMessage,
        };
      }

      const { email, firstName, lastName, picture, googleId } = tokenVerification;

      // Check if user exists
      let userAccount = await this.getUserByEmail(email);
      
      if (!userAccount) {
        // User doesn't exist, create new account
        const username = `${firstName}_${lastName}_${Math.floor(Math.random() * 1000)}`.toLowerCase();
        const displayName = userProfileService.generateRandomDisplayName();
        
        const userData = {
          email,
          username,
          accountType: this.ACCOUNT_TYPE_GOOGLE,
          firstName,
          lastName,
          displayName,
          googleId,
        };

        const registrationResult = await this.registerUser(userData);
        if (!registrationResult.succeeded) {
          return {
            isLogIn: false,
            errorMessage: registrationResult.errorMessage,
          };
        }

        userAccount = await this.getUserByEmail(email);
      } else if (userAccount.accountType !== this.ACCOUNT_TYPE_GOOGLE) {
        // User exists but with different account type
        return {
          isLogIn: false,
          errorMessage: "This email is registered with a different account type. Please use the correct login method.",
        };
      }

      // Get user profile
      const userProfile = await userProfileService.getByEmail(email);
      
      // Log the user in
      return this.logUserInUsingJWT({
        email: userAccount.email,
        userId: userAccount._id.toString(),
        firstName: userProfile?.firstName || firstName,
        lastName: userProfile?.lastName || lastName,
        username: userAccount.username,
        displayName: userProfile?.displayName,
      });
    } catch (error) {
      console.error('Google OAuth login error:', error);
      return {
        isLogIn: false,
        errorMessage: 'Failed to process Google login. Please try again.',
      };
    }
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
    const userProfileResult = await userProfileService.getByUserId(userId)
    if (!user || !userProfileResult.succeeded) {
      return {
        isTokenRefresh: false,
      };
    }

    const userProfile = userProfileResult.userProfile;

    //Generate and sign Tokenatuh
    const accessToken = await secureSessionApi.generateAccessToken({
      email: user.email,
      userId: user._id,
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      username: user.username,
      displayName: userProfile.displayName,
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
