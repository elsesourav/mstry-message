"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useDebounceCallback } from "usehooks-ts";
import { signUpSchema } from "@/schemas/signup.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";

export default function SignUp() {
   const router = useRouter();
   const [username, setUsername] = useState("");
   const [isCheckingUsername, setIsCheckingUsername] = useState(false);
   const [isSubmitted, setIsSubmitted] = useState(false);
   const [responseMessage, seResponseMessage] = useState("");
   const [responseSuccess, seResponseSuccess] = useState(false);

   const debounce = useDebounceCallback(setUsername, 500);

   const form = useForm<z.infer<typeof signUpSchema>>({
      resolver: zodResolver(signUpSchema),
      defaultValues: {
         username: "",
         email: "",
         password: "",
      },
   });

   useEffect(() => {
      const isUniqueUsername = async () => {
         if (username) {
            setIsCheckingUsername(true);
            seResponseMessage("");
            seResponseSuccess(false);

            try {
               const response = await axios.get(
                  `api/verify/username?username=${username}`
               );
               seResponseMessage(response.data.message);
               seResponseSuccess(response.data.success);
            } catch (error) {
               const axiosError = error as AxiosError<ApiResponse>;
               seResponseMessage(
                  axiosError.response?.data.message ?? "Error checking username"
               );
               seResponseSuccess(false);
            } finally {
               setIsCheckingUsername(false);
            }
         } else {
            seResponseMessage("");
         }
      };
      isUniqueUsername();
   }, [username]);

   const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
      setIsSubmitted(true);
      
      try {
         const response = await axios.post<ApiResponse>("/api/signup", data);
         toast.success(response.data.message);

         router.replace(`/verify/${username}`);
      } catch (error) {
         console.error("Error in signup of user: ", error);
         const axiosError = error as AxiosError<ApiResponse>;
         toast.error("Signup failed");
         seResponseMessage(
            axiosError.response?.data.message ?? "Error checking username"
         );
         seResponseSuccess(false);
      } finally {
         setIsSubmitted(false);
      }
   };

   return (
      <div className="flex flex-col min-h-svh justify-center items-center bg-gray-100">
         <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl md-6">
                  Join Mystery Message
               </h1>
               <p className="md-4">Sign up to start your anonymous adventure</p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="username"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Username</FormLabel>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="Username"
                                 {...field}
                                 onChange={(e) => {
                                    field.onChange(e);
                                    debounce(e.target.value);
                                 }}
                              />
                           </FormControl>
                           {isCheckingUsername && (
                              <Loader2 className="animate-spin" />
                           )}
                           <p
                              className={`text-sm ${responseSuccess ? "text-green-500" : "text-red-500"}`}
                           >
                              {responseMessage}
                           </p>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="email"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Email</FormLabel>
                           <FormControl>
                              <Input
                                 type="email"
                                 placeholder="Email"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <FormField
                     control={form.control}
                     name="password"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Password</FormLabel>
                           <FormControl>
                              <Input
                                 type="password"
                                 placeholder="Password"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
                  <Button type="submit" className="w-full text-center h-10 cursor-pointer" disabled={isSubmitted}>
                     {isSubmitted ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                           Please Wait
                        </>
                     ) : (
                        "Sign Up"
                     )}
                  </Button>
               </form>
            </Form>
            <div className="text-center mt-4">
               <p>
                  Already a member?{" "}
                  <Link
                     href="/signin"
                     className="text-blue-600 hover:text-blue-800"
                  >
                     Sign In
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
