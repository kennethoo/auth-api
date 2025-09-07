import express from "express";
const router = express.Router();
import User from "../models/signup.js";
import { userProfileService } from "../service/userProfileService.js"; // updated
import checkSession from "../checkUserSession/checkUserSession.js";
import AWS from "aws-sdk";
import multer from "multer";
import multerS3 from "multer-s3";
import { v4 as uuidv4 } from "uuid";
import { authApi } from "../service/auth/authApi.js";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET_KEY,
});

const upload = multer({
  storage: multerS3({
    s3,
    bucket: "meettumdev",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `${uuidv4()}.${file.mimetype.split("/")[1]}`);
    },
  }),
});

// Generate random display name (for testing/admin use)
router.get("/api/auth/generate-display-name", async (req, res) => {
  try {
    const displayName = userProfileService.generateRandomDisplayName();
    res.json({ 
      succeeded: true, 
      displayName,
      message: "Random display name generated successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      succeeded: false, 
      errorMessage: "Failed to generate display name" 
    });
  }
});

// Assign random display name to user
router.post("/api/auth/assign-random-display-name/:userId", async (req, res) => {
  try {
    const result = await userProfileService.assignRandomDisplayName(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      succeeded: false, 
      errorMessage: "Failed to assign random display name" 
    });
  }
});

// Update Username
router.post("/api/auth/update-username", async (req, res) => {
  try {
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.send({ succeeded: false, message: "change it" });
    }
    await User.findOneAndUpdate({ email: req.body.email }, { username: req.body.username });
    await userProfileService.updateUserProfileByEmail(req.body.email, { username: req.body.username });

    res.send({ succeeded: true, username: req.body.username });
  } catch (err) {
    res.send({ succeeded: false, errorMessage: err.message });
  }
});

// Check full name
router.get("/api/auth/check-in-about-him/her/:id/:data", checkSession, async (req, res) => {
  try {
    const result = await userProfileService.getByUserId(req.params.id);
    if (result.succeeded) res.send({ fullName: result.userProfile.fullName });
    else res.sendStatus(404);
  } catch (err) {
    res.sendStatus(500);
  }
});

// Get profile image
router.get("/api/auth/icon/:id", async (req, res) => {
  const result = await userProfileService.getByUserId(req.params.id);
  if (result.succeeded) res.send(result.userProfile.profile);
  else res.send({ succeeded: false });
});

// User info
router.get("/api/auth/userinfo/:id", async (req, res) => {
  const result = await userProfileService.getByUserId(req.params.id);
  if (result.succeeded) {
    res.send({
      succeeded: true,
      username: result.userProfile.username,
      timeZone: result.userProfile.timeZone,
      email: result.userProfile.email,
      isAdmin: result.userProfile.isAdmin,
      profile: result.userProfile.profile,
      bio: result.userProfile.bio,
      fullName: result.userProfile.fullName,
    });
  } else {
    res.send({ succeeded: false, errorMessage: "User not found. Please check the user ID." });
  }
});

// Search
router.get("/api/auth/v1/search/user/:query", async (req, res) => {
  const query = JSON.parse(req.params.query);
  const result = await userProfileService.searchUserProfileByUserIdOrUsername(query);
  res.send(result);
});

// Get profile by ID/Name
router.get("/api/auth/getid/:id", async (req, res) => {
  const result = await userProfileService.getByUserId(req.params.id);
  res.send(result);
});
router.get("/api/auth/profile/:name", async (req, res) => {
  const result = await userProfileService.getByUserId(req.params.name);
  res.send(result);
});
router.get("/api/auth/recentProfile/:id", async (req, res) => {
  const result = await userProfileService.getByUserId(req.params.id);
  res.send(result);
});

// Update profile fields
router.post("/api/auth/edit/update-profile", async (req, res) => {
  const userId = req.session.user?.userId;
  const { username, bio, website } = req.body;
  const result = await userProfileService.updateUserProfileByUserId(userId, { username, bio, website });
  res.send(result);
});

// Account check
router.get("/api/auth/accountt/:id", async (req, res) => {
  if (req.session.user) {
    const result = await userProfileService.getByUsername(req.params.id);
    if (result) res.send(result);
    else res.send("No user");
  } else {
    res.sendStatus(401);
  }
});

// Remove profile or banner
router.post("/api/auth/remove-profile", checkSession, async (req, res) => {
  const result = await userProfileService.removeProfileImage(req.body.userId);
  res.send(result);
});
router.post("/api/auth/remove-banner", async (req, res) => {
  const result = await userProfileService.removeBannerImage(req.body.userId);
  res.send(result);
});

// Delete account - Moved to auth.js router
// router.post("/api/auth/v1/delete/account", checkSession, async (req, res) => {
//   const result = await authApi.deleteUserAccount(req.user._id);
//   res.send(result);
// });

// Upload image
router.post("/api/auth/profile/image", upload.single("file"), async (req, res) => {
  const file = req.file.location;
  const updated = await userProfileService.uploadProfileImage(req.body.userId, file);
  res.send({ succeeded: true, profileUrl: updated.profile });
});

// Remove profile via session
router.post("/api/auth/profile/remove", checkSession, async (req, res) => {
  try {
    await userProfileService.removeProfileImage(req.session?.user?.userId);
    res.send({ succeeded: true });
  } catch (error) {
    res.send({ succeeded: false, errorMessage: error.message });
  }
});



// Start the new APi building 

router.post("/api/auth/profile/update", async (req, res) => {
  const result = await userProfileService.updateInfoFromMyProfile(req.body);
  res.send(result);
});

// Generate random display name (for testing/admin use)
router.get("/api/auth/generate-display-name", async (req, res) => {
  try {
    const displayName = userProfileService.generateRandomDisplayName();
    res.json({ 
      succeeded: true, 
      displayName,
      message: "Random display name generated successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      succeeded: false, 
      errorMessage: "Failed to generate display name" 
    });
  }
});

// Assign random display name to user
router.post("/api/auth/assign-random-display-name/:userId", async (req, res) => {
  try {
    const result = await userProfileService.assignRandomDisplayName(req.params.userId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      succeeded: false, 
      errorMessage: "Failed to assign random display name" 
    });
  }
});

// Action-based API endpoints
// GET /api/auth/userprofile - Handle all GET actions via query parameters
router.get(
  "/api/auth/userprofile",
  checkSession,
  async (req, res) => {
    try {
      const requestBody = {
        action: req.query.action,
        payload: JSON.parse(req.query.payload),
      };
      const result = await userProfileService.handleGetAction(requestBody);
      res.json(result);
    } catch (error) {
      console.error("UserProfile GET Action Error:", error);
      res.status(500).json({ 
        succeeded: false, 
        errorMessage: "Failed to process GET action" 
      });
    }
  }
);

// POST /api/auth/userprofile - Handle all POST actions via request body
router.post(
  "/api/auth/userprofile",
  checkSession,
  async (req, res) => {
    try {
      const result = await userProfileService.handlePostAction(req.body);
      res.json(result);
    } catch (error) {
      console.error("UserProfile POST Action Error:", error);
      res.status(500).json({ 
        succeeded: false, 
        errorMessage: "Failed to process POST action" 
      });
    }
  }
);

export default router;
