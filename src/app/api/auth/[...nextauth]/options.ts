import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
   providers: [
      CredentialsProvider({
         id: "credentials",
         name: "Credentials",
         credentials: {
            email: {
               label: "Email",
               type: "text",
               placeholder: "Enter Email",
            },
            password: {
               label: "Password",
               type: "password",
               placeholder: "Enter Password",
            },
         },

         // eslint-disable-next-line @typescript-eslint/no-explicit-any
         async authorize(credentials: any): Promise<any> {
            await dbConnect();

            const user = await UserModel.findOne({
               $or: [
                  { email: credentials.identifier },
                  { username: credentials.identifier },
               ],
            });

            if (!user) {
               throw new Error("No user found with this email or username");
            }

            if (!user.isVerified) {
               throw new Error("Please verify your account first before login");
            }

            const isPasswordCorrect = await bcrypt.compare(
               credentials!.password,
               user.password
            );
            if (!isPasswordCorrect) {
               throw new Error("Invalid password");
            }

            return user;
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user) {
            token._id = user._id?.toString();
            token.username = user.username?.toString();
            token.isVerified = user.isVerified;
            token.isAdmin = user.isAdmin;
            token.isAcceptingMessages = user.isAcceptingMessages;
         }
         return token;
      },
      async session({ session, token }) {
         if (token) {
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
            session.user.isAdmin = token.isAdmin;
            session.user.isAcceptingMessages = token.isAcceptingMessages;
         }
         return session;
      },
   },
   pages: {
      signIn: "/signin",
   },
   session: {
      strategy: "jwt",
   },
   secret: process.env.NEXT_AUTH_SECRET,
};
