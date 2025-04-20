import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { errorResponse, successResponse } from "@/utils/response";

export async function GET(request: Response) {
   await dbConnect();

   try {
      const { username, code } = await request.json();
      const user = await UserModel.findOne({ username });
      if (!user) {
         return errorResponse("User not found", 400);
      }

      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpire = new Date(user.verifyCodeExpiry) > new Date();

      if (isCodeValid && isCodeNotExpire) {
         user.isVerified = true;
         await user.save();
         return successResponse("Account verified successfully", 200);
      } else if (!!isCodeNotExpire) {
         return errorResponse(
            "Verification code expired, Please signup again to get a new code",
            400
         );
      } else {
         return errorResponse("Invalid verification code", 400);
      }
   } catch (error) {
      console.error("Error verifying code", error);
      return errorResponse("Error verifying code", 500);
   }
}
