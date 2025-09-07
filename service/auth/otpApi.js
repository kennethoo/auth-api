import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const Schema = mongoose.Schema;

const model = new Schema({
  email: String,
  code: Number,
  otpTokenId: String,
});

const OTPCollection = mongoose.model("otp", model);

class OTPApi {
  constructor() {}

  async createOptToken(email) {
    const code = Math.floor(100000 + Math.random() * 900000);
    const token = await OTPCollection.create({
      email,
      code,
      otpTokenId: uuidv4(),
    });
    return token;
  }

  async isOTPTokenValid({ otpTokenId, code }) {
    if (!otpTokenId || !code) {
      return false;
    }
    const token = await OTPCollection.findOne({
      otpTokenId,
    });
    if (!token) {
      return false;
    }

    if (token.code !== code) {
      return false;
    }
    return true;
  }
}

export const oTPApi = new OTPApi();
