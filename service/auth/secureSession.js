import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import crypto from "crypto";
const Schema = mongoose.Schema;

const model = new Schema({
  sessionId: String,
  userId: String,
  createdAt: String,
  expiresAt: String,
  device: String,
  location: String,
});

const SessureSession = mongoose.model("sessureSession", model);

class SecureSessionApi {
  constructor() {
    this.ACCCESS_TOKEN_EXPIRATION_FOR_COOKIE = 15 * 60 * 1000; //15 min;
    this.ACCCESS_TOKEN_EXPIRATION_FOR_JWT = "15m"; //15 min;
    this.SESSION_TOKEN_EXPIRATION_FOR_COOKIE = 90 * 24 * 60 * 60 * 1000; // 90 days

    this.ACCESS_TOKEN_FOR_COOKIE_CONFIG = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/", // also needed
      maxAge: this.ACCCESS_TOKEN_EXPIRATION_FOR_COOKIE,
    };

    this.SESSION_TOKEN_FOR_COOKIE_CONFIG = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      path: "/",
      maxAge: this.SESSION_TOKEN_EXPIRATION_FOR_COOKIE,
    };
  }

  async createSecureLoginSesionToken(userAccount) {
    const accessToken = jwt.sign(userAccount, process.env.TOKEN_SECRET, {
      expiresIn: this.ACCCESS_TOKEN_EXPIRATION_FOR_JWT,
    });
    const sessionId = crypto.randomUUID();
    await SessureSession.create({
      sessionId,
      userId: userAccount.userId,
      location:userAccount.location,
      device:userAccount.device
    });
    const secureSession = {
      accessToken,
      sessionId,
    };
    return secureSession;
  }

  async canRefreshToken(sessionId) {
    const secureSession = await SessureSession.findOne({
      sessionId,
    });
    const isSessionValid = secureSession != null;

    return { isSessionValid, secureSession };
  }

  async generateAccessToken(userData) {
    const accessToken = jwt.sign(userData, process.env.TOKEN_SECRET, {
      expiresIn: this.ACCCESS_TOKEN_EXPIRATION_FOR_JWT,
    });
    return accessToken;
  }

  async deleteSecureSession(sessionId) {
    await SessureSession.deleteOne({
      sessionId,
    });
    return true;
  }
  async getUserFromAccessToken(access_token) {
    try {
      const user = jwt.verify(access_token, process.env.TOKEN_SECRET);
      return user;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return null;
    }
  }
  async deleteAllUserSessions(userId) {
    await SessureSession.deleteMany({
      userId,
    });
    return true;
  }
}

export const secureSessionApi = new SecureSessionApi();
