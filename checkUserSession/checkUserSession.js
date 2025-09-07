import { secureSessionApi } from "../service/auth/secureSession.js";
import { authApi } from "../service/auth/authApi.js";

const checkSession = async (req, res, next) => {
  try {
    const accessToken =
      req.headers["x-access-token"] || req.cookies?.access_token;
    const sessionId = req.headers["x-session-id"] || req.cookies?.session_id;
    // 1. Try validating access token
    if (accessToken) {
      const user = await secureSessionApi.getUserFromAccessToken(accessToken);
      if (user) {
        req.user = user;
        return next();
      }
    }

    // 2. If access token fails, try refreshing via session
    if (sessionId) {
      const result = await authApi.refreshSecureToken(sessionId);
      if (result?.isTokenRefresh && result?.accessToken) {
        const user = await secureSessionApi.getUserFromAccessToken(
          result.accessToken,
        );
        if (user) {
          req.user = user;
          // optionally update cookie with new accessToken here
          return next();
        }
      }
    }
    // 3. Final fallback – unauthenticated
    return res.status(401).json({ isLogin: false });
  } catch (error) {
    console.error("checkSession error:", error.message);
    return res.status(401).json({
      isLogin: false,
      error: "Authentication failed",
    });
  }
};

export default checkSession;
