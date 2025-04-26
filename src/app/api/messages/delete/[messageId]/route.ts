import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { errorResponse, successResponse } from "@/utils/response";
import { getServerSession, User } from "next-auth";
import { NextRequest } from "next/server";


export async function DELETE(
   req: NextRequest,
   context: { params: { messageId: string } }
) {
   const { messageId } = context.params;
   await dbConnect();

   const session = await getServerSession(authOptions);
   const user: User = session?.user as User;

   if (!session || !session.user) {
      return errorResponse("Not Authenticated", 401);
   }

   try {
      const result = await UserModel.updateOne(
         { _id: user._id },
         { $pull: { messages: { _id: messageId } } }
      );

      if (result.modifiedCount === 0) {
         return errorResponse("Message not found or already deleted", 404);
      }

      return successResponse("Message Deleted", 200);
   } catch (error) {
      console.error("Error in delete message route", error);
      return errorResponse("Error deleting message", 500);
   }
}
