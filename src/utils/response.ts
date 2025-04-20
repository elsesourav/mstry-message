/* eslint-disable @typescript-eslint/no-explicit-any */
type SuccessResponseOptions = {
   message?: string;
   status?: number;
   data?: any;
};

type ErrorResponseOptions = {
   message?: string;
   status?: number;
   errors?: Record<string, any>;
};

function isObject(val: any): val is Record<string, any> {
   return typeof val === "object" && val !== null && !Array.isArray(val);
}

export function successResponse(
   messageOrOptions: string | SuccessResponseOptions,
   status = 200,
   data: any = {},
): Response {
   let message = "Success";

   if (isObject(messageOrOptions)) {
      const {
         message: msg = "Success",
         data: d = {},
         status: s = 200,
      } = messageOrOptions;
      message = msg;
      data = d;
      status = s;
   } else {
      message = messageOrOptions;
   }

   return Response.json(
      {
         success: true,
         message,
         data,
      },
      { status }
   );
}

export function errorResponse(
   messageOrOptions: string | ErrorResponseOptions,
   status = 400,
   errors: Record<string, any> = {}
): Response {
   let message = "Something went wrong";

   if (isObject(messageOrOptions)) {
      const {
         message: msg = "Something went wrong",
         status: s = 400,
         errors: e = {},
      } = messageOrOptions;
      message = msg;
      status = s;
      errors = e;
   } else {
      message = messageOrOptions;
   }

   const responseBody: {
      success: false;
      message: string;
      errors?: Record<string, any>;
   } = {
      success: false,
      message,
   };

   if (Object.keys(errors).length > 0) {
      responseBody.errors = errors;
   }

   return Response.json(responseBody, { status });
}

/* ========================= HOW TO USE ==============================

import { errorResponse, successResponse } from "@/utils/response";

return errorResponse("Invalid verification code");
return successResponse("User created", { data: 1 });
return successResponse("User created", { data: 1 }, 200);

return errorResponse({
   message: "Validation failed",
   status: 422,
   errors: { email: "Email already in use" },
});

====================================================================== */