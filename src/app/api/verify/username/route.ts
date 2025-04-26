import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { usernameValidation } from "@/schemas/signup.schema";
import { errorResponse, successResponse } from "@/utils/response";
import { z } from "zod";
import { NextRequest } from "next/server";

const UsernameQuerySchema = z.object({
   username: usernameValidation,
});

export async function GET(request: NextRequest) {
   await dbConnect();

   try {
      const { searchParams } = new URL(request.url);
      const queryParam = {
         username: searchParams.get("username"),
      };

      // validate by zod
      const result = UsernameQuerySchema.safeParse(queryParam);
      console.log(result);

      if (!result.success) {
         const usernameError = result.error.format().username?._errors || [];
         const message =
            usernameError?.length > 0
               ? usernameError.join(", ")
               : "Invalid query parameters";

         return errorResponse(message, 400);
      }

      const { username } = result.data;
      const existingVerifiedUser = await UserModel.findOne({
         username,
         isVerified: true,
      });

      if (existingVerifiedUser) {
         return errorResponse("Username is already exists", 400);
      }

      return successResponse("Username is unique", 200);
   } catch (error) {
      console.error("Error checking username", error);
      return errorResponse("Error checking username", 500);
   }
}