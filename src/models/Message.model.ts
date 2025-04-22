import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
   content: string;
   createdAt: Date;
   _id: string;
}

export const MessageSchema: Schema<Message> = new Schema({
   content: {
      type: String,
      required: [true, "Please Provide content"],
   },
   createdAt: {
      type: Date,
      required: true,
      default: Date.now,
   }
});

const MessageModel =
   (mongoose.models.Message as mongoose.Model<Message>) ||
   mongoose.model<Message>("Message", MessageSchema);

export default MessageModel;
