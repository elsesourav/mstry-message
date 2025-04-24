import { ApiResponse } from "@/types/ApiResponse";
import { NextResponse } from "next/server";

export function successResponse(
   messageOrOptions: string | Partial<ApiResponse>,
   status: number = 200
): NextResponse {
   const message = "Success";
   let response: ApiResponse = {
      success: true,
      message,
      status,
   };

   if (typeof messageOrOptions === "string") {
      response.message = messageOrOptions;
   } else {
      response = {
         success: true,
         message: messageOrOptions.message ?? "Success",
         status,
         isAcceptingMessages: messageOrOptions.isAcceptingMessages,
         messages: messageOrOptions.messages,
      };
   }

   return NextResponse.json(response, { status });
}

export function errorResponse(
   messageOrOptions: string | Partial<ApiResponse>,
   status: number = 400
): NextResponse {
   const message = "Something went wrong";
   let response: ApiResponse = {
      success: false,
      message,
      status,
   };

   if (typeof messageOrOptions === "string") {
      response.message = messageOrOptions;
   } else {
      response = {
         success: false,
         message: messageOrOptions.message ?? "Something went wrong",
         status,
         errors: messageOrOptions.errors,
      };
   }

   return NextResponse.json(response, { status });
}