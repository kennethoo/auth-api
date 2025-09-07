import mongoose from "mongoose";

const Schema = mongoose.Schema;

const profileSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  username: String,
  displayName: String, // New field for user-friendly display name
  lastName: String,
  firstName: String,
  profile: String,
  blocked: Boolean,
  website: String,
  bio: String,
  numberOfTournaments: Number,
  numberOfWins: Number,
  numberOfLosses: Number,
  numberOfTies: Number,
  level: Number,
  highestLevel: Number,
  points: Number,
  timeZone: String,
  email: String,
  isAdmin: Boolean,
  isProUser: Boolean,
  description: String,
  connectedAccounts: [
    {
      accountType: String,
      token: String,
      refreshToken: String,
      id: String,
      expiresIn: Number,
    },
  ],
  connectedSpace: [{ spaceId: String, isOwner: Boolean, isDefault: Boolean }],
});

export const UserProfile = mongoose.model("userProfile", profileSchema);

class UserProfileService {
  constructor() {
    this.CREATE_PROFILE = "create_profile";
    this.GET_USER_BY_ID = "get_user_by_id";
    this.FIND_USER = "find_user";
    this.SEARCH_USER = "search_user";
    this.SEARCH_USER_PROFILE = "search_user_profile";
    this.UPDATE_USER_PROFILE = "update_user_profile";
    this.DELETE_USER_PROFILE = "delete_user_profile";
    this.ASSIGN_RANDOM_DISPLAY_NAME = "assign_random_display_name";
    this.UPLOAD_PROFILE_IMAGE = "upload_profile_image";
    this.REMOVE_PROFILE_IMAGE = "remove_profile_image";
    this.UPDATE_INFO_FROM_PROFILE = "update_info_from_profile";
  }

  // Generate a random display name for new users
  generateRandomDisplayName() {
    const adjectives = [
      "Swift", "Mighty", "Shadow", "Golden", "Silver", "Crimson", "Azure", "Emerald",
      "Thunder", "Lightning", "Frost", "Blaze", "Storm", "Void", "Cosmic", "Lunar",
      "Solar", "Stellar", "Nebula", "Phoenix", "Dragon", "Wolf", "Eagle", "Lion",
      "Tiger", "Bear", "Shark", "Viper", "Cobra", "Falcon", "Hawk", "Raven",
      "Ghost", "Phantom", "Wraith", "Specter", "Demon", "Angel", "Valkyrie", "Knight",
      "Warrior", "Mage", "Archer", "Rogue", "Paladin", "Wizard", "Ninja", "Samurai",
      "Viking", "Gladiator", "Champion", "Hero", "Legend", "Myth", "Epic", "Divine"
    ];

    const nouns = [
      "Striker", "Slayer", "Hunter", "Seeker", "Runner", "Jumper", "Fighter", "Warrior",
      "Mage", "Wizard", "Archer", "Rogue", "Knight", "Paladin", "Crusader", "Guardian",
      "Protector", "Defender", "Avenger", "Vengeance", "Justice", "Honor", "Glory",
      "Victory", "Triumph", "Conquest", "Dominion", "Empire", "Kingdom", "Realm",
      "Dimension", "Universe", "Galaxy", "Star", "Planet", "Moon", "Sun", "Comet",
      "Meteor", "Asteroid", "Nebula", "BlackHole", "Wormhole", "Portal", "Gateway",
      "Path", "Road", "Trail", "Journey", "Quest", "Adventure", "Expedition", "Voyage"
    ];

    const numbers = [
      "X", "Z", "Alpha", "Beta", "Omega", "Prime", "Ultra", "Mega", "Super", "Hyper",
      "Neo", "Cyber", "Digital", "Virtual", "Quantum", "Atomic", "Nuclear", "Plasma",
      "Fusion", "Fission", "Gravity", "Magnetic", "Electric", "Sonic", "Sonic", "Sonic"
    ];

    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    const randomNum = Math.floor(Math.random() * 999) + 1;

    // Create different name patterns
    const patterns = [
      `${adjective}${noun}`,
      `${adjective}${noun}${randomNum}`,
      `${adjective}${number}`,
      `${number}${adjective}`,
      `${adjective}The${noun}`,
      `${adjective}${noun}${number}`,
      `${adjective}${number}${noun}`,
      `${number}${adjective}${noun}`
    ];

    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  async getByEmail(email) {
    return await UserProfile.findOne({ email });
  }

  async getByUserId(userId) {
    try {
      if (!userId) {
        return {
          succeeded: false,
          errorMessage: "Please provide a userId or username.",
        };
      }

      const userProfile = await UserProfile.findOne({ userId });
      if (!userProfile) {
        return {
          succeeded: false,
          errorMessage: "User profile not found. Please check the user ID.",
        };
      }

      return {
        succeeded: true,
        userProfile,
      };
    } catch (error) {
      console.error("Error getting user profile by userId:", error);
      return {
        succeeded: false,
        errorMessage: "Failed to retrieve user profile. Please try again.",
      };
    }
  }

  async getByUsername(username) {
    return await UserProfile.findOne({ username });
  }

  async updateUserProfile(userId, updates) {
    try {
      if (!userId || !updates) {
        return {
          succeeded: false,
          errorMessage: "Please provide both userId and update data.",
        };
      }

      const userProfile = await UserProfile.findOneAndUpdate(
        { userId },
        updates,
        { new: true }
      );

      if (!userProfile) {
        return {
          succeeded: false,
          errorMessage: "User profile not found. Please check the user ID.",
        };
      }

      return {
        succeeded: true,
        userProfile,
      };
    } catch (error) {
      console.error("Error updating user profile:", error);
      return {
        succeeded: false,
        errorMessage: "Failed to update user profile. Please try again.",
      };
    }
  }

  async updateUserProfileByEmail(email, updates) {
    return await UserProfile.findOneAndUpdate({ email }, updates, {
      new: true,
    });
  }

  async createUserProfile(userProfileData) {
    return await UserProfile.create(userProfileData);
  }

  async removeProfileImage(userId) {
    return await UserProfile.findOneAndUpdate(
      { userId },
      { profile: "" },
      { new: true }
    );
  }

  async removeBannerImage(userId) {
    return await UserProfile.findOneAndUpdate(
      { userId },
      { banner: "" },
      { new: true }
    );
  }

  async searchUserProfileByUserIdOrUsername(query) {
    const { username, userId } = query;

    if (!username && !userId) {
      return {
        succeeded: false,
        errorMessage: "Please provide a userId or username.",
      };
    }

    let user;
    if (username) {
      user = await this.getByUsername(username);
    } else {
      const result = await this.getByUserId(userId);
      if (!result.succeeded) {
        return {
          succeeded: false,
          errorMessage: "User not found.",
        };
      }
      user = result.userProfile;
    }

    if (!user) {
      return {
        succeeded: false,
        errorMessage: "User not found.",
      };
    }

    return {
      succeeded: true,
      username: user.username,
      timeZone: user.timeZone,
      email: user.email,
      isAdmin: user.isAdmin,
      profile: user.profile,
      bio: user.bio,
      userId: user.userId,
    };
  }

  // Regex-based search across username, displayName and email (case-insensitive)
  async searchUserProfilesRegex(payload) {
    const { text, limit = 10 } = payload || {};
    if (!text || typeof text !== "string") {
      return [];
    }
    const escaped = text.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const result = await UserProfile.find(
      {
        $or: [
          { username: { $regex: escaped, $options: "i" } },
          { displayName: { $regex: escaped, $options: "i" } },
          { email: { $regex: escaped, $options: "i" } },
        ],
      },
      {
        userId: 1,
        username: 1,
        displayName: 1,
        email: 1,
        profile: 1,
      }
    ).limit(limit);
    return result;
  }

  async updateInfoFromMyProfile({userId ,lastName,firstName, bio, displayName }) {
    if(!userId||!lastName||!firstName){
      return { succeeded: false, errorMessage: "Something is missing" };
    }
    const result = await this.getByUserId(userId);
    if (!result.succeeded) {
      return { succeeded: false, errorMessage: "User not found." };
    }
    
    const user = result.userProfile;
    user.firstName = firstName;
    user.displayName = displayName;
    user.lastName = lastName;
    user.bio = bio;
    await user.save();
    return { succeeded: true, profile: user };
  }

  async uploadProfileImage(userId, profileUrl) {
    const updated = await UserProfile.findOneAndUpdate(
      { userId },
      { profile: profileUrl },
      { new: true }
    );
    return updated;
  }

  // Generate and assign random display name to user if they don't have one
  async assignRandomDisplayName(userId) {
    try {
      const result = await this.getByUserId(userId);
      if (!result.succeeded) {
        return { succeeded: false, errorMessage: "User not found" };
      }

      const user = result.userProfile;
      if (!user.displayName || user.displayName.trim() === '') {
        const randomDisplayName = this.generateRandomDisplayName();
        const updated = await UserProfile.findOneAndUpdate(
          { userId },
          { displayName: randomDisplayName },
          { new: true }
        );
        return { succeeded: true, displayName: randomDisplayName, user: updated };
      }

      return { succeeded: true, displayName: user.displayName, user };
    } catch (error) {
      console.error("Error assigning random display name:", error);
      return { succeeded: false, errorMessage: "Failed to assign display name" };
    }
  }

  // Handle GET actions (external router or controller)
  handleGetAction = async (actionPayload) => {
    const { action, payload } = actionPayload;

    if (action === this.GET_USER_BY_ID) {
      return this.getByUserId(payload.userId);
    }

    if (action === this.FIND_USER) {
      const { username, userId } = payload;
      if (username) {
        const user = await this.getByUsername(username);
        return user 
          ? { succeeded: true, user }
          : { succeeded: false, errorMessage: "User not found" };
      } else if (userId) {
        return this.getByUserId(userId);
      }
      return { succeeded: false, errorMessage: "Provide a userId or username" };
    }

    if (action === this.SEARCH_USER) {
      return this.searchUserProfileByUserIdOrUsername(payload);
    }
    
    if (action === this.SEARCH_USER_PROFILE) {
      return this.searchUserProfilesRegex(payload);
    }

    return { succeeded: false, errorMessage: "Invalid GET action" };
  };

  // Handle POST actions (external router or controller)
  handlePostAction = async (actionPayload) => {
    const { action, payload } = actionPayload;

    if (action === this.CREATE_PROFILE) {
      return this.createUserProfile(payload);
    }

    if (action === this.UPDATE_USER_PROFILE) {
      return this.updateUserProfile(payload.userId, payload);
    }

    if (action === this.ASSIGN_RANDOM_DISPLAY_NAME) {
      return this.assignRandomDisplayName(payload.userId);
    }

    if (action === this.UPLOAD_PROFILE_IMAGE) {
      const result = await this.uploadProfileImage(payload.userId, payload.profileUrl);
      return { succeeded: true, profile: result };
    }

    if (action === this.REMOVE_PROFILE_IMAGE) {
      const result = await this.removeProfileImage(payload.userId);
      return { succeeded: true, result };
    }

    if (action === this.UPDATE_INFO_FROM_PROFILE) {
      return this.updateInfoFromMyProfile(payload);
    }

    return { succeeded: false, errorMessage: "Invalid POST action" };
  };
}

export const userProfileService = new UserProfileService();
