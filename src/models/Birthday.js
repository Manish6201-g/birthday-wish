import mongoose from "mongoose";

const BirthdaySchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Birthday person's name is required"],
      trim: true,
    },
    nickname: {
      type: String,
      default: "",
    },
    birthdayDate: {
      type: Date,
      required: [true, "Birthday date is required"],
    },
    age: {
      type: Number,
      default: 0,
    },
    title: {
      type: String,
      default: "Time to Celebrate!",
    },
    subtitle: {
      type: String,
      default: "The countdown is over... Let's celebrate! 🎉",
    },
    welcomeMessage: {
      type: String,
      default: "🎉 It's your special day! 🎉",
    },
    celebrationMessage: {
      type: String,
      default: "Click to start the magic! ✨",
    },
    letter: {
      greeting: { type: String, default: "My Dearest Friend," },
      content: { type: String, default: "" },
      closing: { type: String, default: "With all my love," },
      signature: { type: String, default: "Your Friend 💕" },
    },
    photos: [
      {
        url: { type: String, required: true },
        caption: { type: String, default: "" },
        order: { type: Number, default: 0 },
      },
    ],
    music: {
      enabled: { type: Boolean, default: true },
      url: { type: String, default: "" },
    },
    theme: {
      themeName: { type: String, default: "Pink & Purple" },
      primaryColor: { type: String, default: "#ec4899" },
      secondaryColor: { type: String, default: "#a855f7" },
      backgroundColor: { type: String, default: "#090514" },
    },
    effects: {
      confetti: { type: Boolean, default: true },
      hearts: { type: Boolean, default: true },
      fireworks: { type: Boolean, default: true },
      particles: { type: Boolean, default: true },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Birthday || mongoose.model("Birthday", BirthdaySchema);
