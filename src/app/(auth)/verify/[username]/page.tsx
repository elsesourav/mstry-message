"use client";

import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verify.schema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function VerifyUsername() {
   const router = useRouter();
   const [isSubmitted, setIsSubmitted] = useState(false);
   const params = useParams<{ username: string }>();

   const form = useForm<z.infer<typeof verifySchema>>({
      resolver: zodResolver(verifySchema),
      defaultValues: {
         code: ""
      },
   });

   const onSubmit = async (data: z.infer<typeof verifySchema>) => {
      setIsSubmitted(true);

      try {
         const response = await axios.post("/api/verify/code", {
            username: params.username,
            code: data.code,
         });

         toast.success(response.data.message);
         router.replace("/signin");
      } catch (error) {
         console.error("Error in signup of user: ", error);
         const axiosError = error as AxiosError<ApiResponse>;
         const errorMessage = axiosError.response?.data.message;
         toast.error(errorMessage);
      } finally {
         setIsSubmitted(false);
      }
   };

   return (
      <div className="flex flex-col min-h-svh justify-center items-center bg-gray-100">
         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl md-6">
                  Verify Your Account
               </h1>
               <p className="md-4">
                  Enter the verification code send to your email
               </p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="code"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Code</FormLabel>
                           <FormControl>
                              <Input type="text" placeholder="Enter Code" {...field} />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button
                     type="submit"
                     className="w-full text-center h-10 cursor-pointer"
                     disabled={isSubmitted}
                  >
                     {isSubmitted ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                           Please Wait
                        </>
                     ) : (
                        "Submit"
                     )}
                  </Button>
               </form>
            </Form>
         </div>
      </div>
   );
}
