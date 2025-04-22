import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import { errorResponse, successResponse } from "@/utils/response";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
   await dbConnect();

   try {
      const { username, email, password } = await request.json();
      const existingUserVerifiedByUsername = await UserModel.findOne({
         username,
         isVerified: true,
      });

      if (existingUserVerifiedByUsername) {
         return errorResponse("Username is already taken", 400);
      }

      const existingUserByEmail = await UserModel.findOne({ email });
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

      if (existingUserByEmail) {
         if (existingUserByEmail.isVerified) {
            return errorResponse("User already exist with this email", 400);
         } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCode;
            existingUserByEmail.verifyCodeExpiry = expiryDate;
            await existingUserByEmail.save();
         }
      } else {
         const hashedPassword = await bcrypt.hash(password, 10);
         const expiryDate = new Date();
         expiryDate.setHours(expiryDate.getHours() + 1);
         const newUser = new UserModel({
            username,
            email,
            password: hashedPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerified: false,
            isAdmin: false,
            isAcceptingMessages: false,
            messages: [],
         });

         await newUser.save();
      }

      // send verification email
      const emailResponse = await sendVerificationEmail(
         email,
         username,
         verifyCode
      );

      if (!emailResponse.success) {
         return errorResponse(emailResponse.message, 400);
      }
      return successResponse(
         "User registered successfully. Please verify you email",
         201
      );
   } catch (error) {
      console.error("Error Registering user", error);
      return errorResponse("Error Registering user", 500);
   }
}
