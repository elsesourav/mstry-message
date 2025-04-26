import dbConnect from "@/lib/dbConnect";
import { Message } from "@/models/Message.model";
import UserModel from "@/models/User.model";
import { errorResponse, successResponse } from "@/utils/response";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
   await dbConnect();

   const { username, content } = await request.json();

   try {
      const user = await UserModel.findOne({ username });
      if (!user) {
         return errorResponse("User not found", 404);
      } 

      // is user accepting the messages
      if (!user.isAcceptingMessages) {
         return errorResponse("User not accepting message", 403);
      }

      const newMessage = { content, createdAt: new Date() };
      user.messages.push(newMessage as Message);
      await user.save();

      return successResponse("Message sent successfully", 200);
   } catch (error) {
      console.error("Error adding messages", error);
      return errorResponse("Internal Server Error!", 500);
   }
}
