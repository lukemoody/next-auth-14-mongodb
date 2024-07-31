import mongoose, { Schema } from "mongoose";

const mongoDbUri = process.env.MONGODB_URI;

if (!mongoDbUri) {
  throw new Error("MONGODB_URI environment variable is not defined");
}

mongoose.connect(mongoDbUri);
mongoose.Promise = global.Promise;

// Setup the User Schema
const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true, unique: true },
  },
  {
    timestamps: true, // This adds timestamps for createdAt and updatedAt
  }
);

// Create User model OR create model if it's already defined
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
