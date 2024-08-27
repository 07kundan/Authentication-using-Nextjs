import mongoose, { Document, Schema } from "mongoose";

export interface Message extends Document {
  content: string;
  created_at: Date;
}

const MessageSchenma: Schema<Message> = new Schema({
  content: {
    type: String, //Mongoose String first letter must be in capital
    required: true,
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now(),
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyCode: string;
  verigyCodeExpiry: Date;
  isAcceptingMessage: boolean;
  messages: Message[];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    trim: true,
    unique: true,
    match: [/.+@.+\..+/, "please use a valid email"],
  },
  password: {
    type: String,
    required: [true, "password is required"],
  },
  verifyCode: {
    type: String,
    required: [true, "verify code is required"],
  },
  verigyCodeExpiry: {
    type: Date,
    required: [true, "verifyExpiry code is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchenma],
});

// mostly things run in nextjs at the edge therefore first case check if there document is already created and in second case we are creating model
const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
