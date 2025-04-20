import dbConnect from "@/lib/dbConnect";
import { getServerSession, User } from "next-auth";
import { errorResponse, successResponse } from "@/utils/response";
import mongoose from "mongoose";
import UserModel from "@/models/User.model";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function GET() {
   await dbConnect();

   const session = await getServerSession(authOptions);
   const user: User = session?.user as User;

   if (!session || !session.user) {
      return errorResponse("Not Authenticated", 401);
   }

   const userId = new mongoose.Types.ObjectId(user._id);
   try {
      const user = await UserModel.aggregate([
         { $match: { id: userId } },
         { $unwind: "$messages" },
         { $sort: { "messages.createAt": -1 } },
         { $group: { _id: "$_id", messages: { $push: "$messages" } } },
      ]);
      if (!user || user.length === 0) {
         return errorResponse("User not found", 401);
      }

      return successResponse({
         message: "Successfully get messages",
         data: {
            messages: user[0].messages
         },
         status: 200
      });
   } catch (error) {
      console.error("Something is wrong in get messages!", error);
      return errorResponse("Something is wrong in get messages!", 500);
   }
}
