import mongoose, { Document, Schema } from "mongoose";
import { Message, MessageSchema } from "./Message.model";

export interface User extends Document {
   username: string;
   email: string;
   password: string;
   verifyCode: string;
   verifyCodeExpiry: Date;
   isVerified: boolean;
   isAdmin: boolean;
   isAcceptingMessages: boolean;
   messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
   username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
      unique: true,
      match: [/^[a-zA-Z0-9_]{3,20}$/, "Please provide a valid username"],
   },
   email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please provide a valid email"],
   },
   password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
   },
   verifyCode: {
      type: String,
      required: [true, "Verify code is required"],
   },
   verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code Expiry is required"],
   },
   isVerified: {
      type: Boolean,
      default: false,
   },
   isAdmin: {
      type: Boolean,
      default: false,
   },
   isAcceptingMessages: {
      type: Boolean,
      default: true,
   },
   messages: [MessageSchema],
});

const UserModel =
   (mongoose.models.User as mongoose.Model<User>) ||
   mongoose.model<User>("User", UserSchema);

export default UserModel;
