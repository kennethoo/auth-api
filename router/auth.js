import express from "express";
const router = express.Router();
import Session from "../models/session.js";
import { authApi } from "../service/auth/authApi.js";
import { secureSessionApi } from "../service/auth/secureSession.js";
import checkSession from "../checkUserSession/checkUserSession.js";

router.post("/api/auth/logout", async (req, res) => {
  const accessToken =
    req.headers["x-access-token"] || req.cookies?.access_token;
  const sessionId = req.headers["x-session-id"] || req.cookies?.session_id;

  await authApi.logoutUser({
    accessToken,
    sessionId,
  });
  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.clearCookie("session_id", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.status(200).json({ message: "Logged out" });
});

router.post("/api/auth/login", async (req, res) => {
  const result = await authApi.logUserIn(req.body);
  if (result.isLogIn) {
    // Send access token in a secure cookie
    const secureSession = result.secureSession;
    const { accessToken, sessionId } = secureSession;

    // Generate The session

    // Store access_token in HttpOnly cookie
    res.cookie(
      "access_token",
      accessToken,
      secureSessionApi.ACCESS_TOKEN_FOR_COOKIE_CONFIG,
    );

    // Store session ID in HttpOnly cookie
    res.cookie(
      "session_id",
      sessionId,
      secureSessionApi.SESSION_TOKEN_FOR_COOKIE_CONFIG,
    );
  }

  res.status(200).json(result);
});

router.get("/api/auth/check-login", async (req, res) => {
  const accessToken =
    req.headers["x-access-token"] || req.cookies?.access_token;
  const sessionId = req.headers["x-session-id"] || req.cookies?.session_id;

  const result = await authApi.isUserLogin({
    access_token: accessToken,
    session_id: sessionId,
  });

  if (result.isTokenRefresh) {
    res.cookie(
      "access_token",
      result.newAccessToken,
      secureSessionApi.ACCESS_TOKEN_FOR_COOKIE_CONFIG,
    );
  }
  res.status(200).json(result);
});

router.post("/api/auth/requestaccountcreation", async (req, res) => {
  const result = await authApi.requestUserAccount(req.body);
  res.json(result);
});

router.post("/api/auth/validateuseremail", async (req, res) => {
  const result = await authApi.validateUserAccount(req.body);
  res.json(result);
});

router.post("/api/auth/register", async (req, res) => {
  const result = await authApi.registerUser(req.body);
  if (!result.succeeded) {
    return res.status(200).json({ ...result });
  }
  const loginDetail = await authApi.logUserIn(req.body);
  if (!loginDetail.isLogIn) {
    return res.status(401).json({ ...loginDetail, succeeded: false });
  }
  const { accessToken, sessionId } = loginDetail.secureSession;
  res.cookie(
    "access_token",
    accessToken,
    secureSessionApi.ACCESS_TOKEN_FOR_COOKIE_CONFIG, // typo fixed
  );
  res.cookie(
    "session_id",
    sessionId,
    secureSessionApi.SESSION_TOKEN_FOR_COOKIE_CONFIG,
  );
  res.status(200).json({ ...result, ...loginDetail });
});

router.post("/api/auth/secure/token/refresh", async (req, res) => {
  const sessionId = req.headers["x-session-id"] || req.cookies?.session_id;
  const result = await authApi.refreshSecureToken(sessionId);
  if (result.isTokenRefresh) {
    res.cookie(
      "access_token",
      result.accessToken,
      secureSessionApi.ACCESS_TOKEN_FOR_COOKIE_CONFIG,
    );
  }
  res.json(result);
});

router.get("/api/auth/sessions", (req, res) => {
  if (req.session.user) {
    Session.find({ "session.user.userId": req.session.user?.userId }).then(
      (result) => {
        res.send(result);
      },
    );
  } else {
    res.send({ succeeded: false });
  }
});

router.post("/api/auth/remove/session", (req, res) => {
  if (req.session.user) {
    Session.deleteOne({ _id: req.body.id })
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        return;
      });
  } else {
    res.send({ succeeded: false });
  }
});

// Delete account
router.post("/api/auth/delete/account", checkSession, async (req, res) => {
  const result = await authApi.deleteUserAccount(req.user.userId);

  if (!result.succeeded) {
    res.status(200).json({ ...result });
  }

  res.clearCookie("access_token", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });
  res.clearCookie("session_id", {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    path: "/",
  });

  res.send(result);
});

export default router;
