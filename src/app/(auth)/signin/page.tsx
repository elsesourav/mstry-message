"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { signInSchema } from "@/schemas/signin.schema";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { signIn } from "next-auth/react";

export default function SignIn() {
   const router = useRouter();
   const [isSubmitted, setIsSubmitted] = useState(false);

   const form = useForm<z.infer<typeof signInSchema>>({
      resolver: zodResolver(signInSchema),
      defaultValues: {
         identifier: "",
         password: "",
      },
   });

   const onSubmit = async (data: z.infer<typeof signInSchema>) => {
      setIsSubmitted(true);

      try {
         const response = await signIn("credentials", {
            redirect: false,
            identifier: data.identifier,
            password: data.password,
         })

         if (response?.error) {
            if (response.error == "CredentialsSignin") {
               toast.error("Incorrect username or password");
            } else {
               toast.error(response.error);
            }
         }
 
         if (response?.url) {
            toast.success("Sign In Successfully");
            router.replace("/dashboard");
         }


      } catch (error) {
         console.error("Error in signin of user: ", error);
         toast.error("Signin failed");
      } finally {
         setIsSubmitted(false);
      }
   };

   return (
      <div className="flex flex-col min-h-svh justify-center items-center">
         <div className="w-full max-w-md p-8 space-y-8 rounded-lg shadow-md">
            <div className="text-center">
               <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl md-6">
                  Join Mystery Message
               </h1>
               <p className="md-4">Sign In to start your anonymous adventure</p>
            </div>
            <Form {...form}>
               <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
               >
                  <FormField
                     control={form.control}
                     name="identifier"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel>Username or Email</FormLabel>
                           <FormControl>
                              <Input
                                 type="text"
                                 placeholder="Username/Email"
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
                        "Sign In"
                     )}
                  </Button>
               </form>
            </Form>
            <div className="text-center mt-4">
               <p>
                  Are you new?{" "}
                  <Link
                     href="/signup"
                     className="text-blue-600 hover:text-blue-800"
                  >
                     Sign Up
                  </Link>
               </p>
            </div>
         </div>
      </div>
   );
}
