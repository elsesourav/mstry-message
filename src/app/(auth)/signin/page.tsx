"use client";

import { useSession } from "next-auth/react";

export default function SignIn() {
   const { data: session } = useSession();
   if (session) {
      return (
         <div className="flex flex-col min-h-svh justify-center items-center">
            <h1>Sign In as {session.user.email}</h1>
            <br />
            <button>Sign Out</button>
         </div>
      );
   }

   return (
      <div className="flex flex-col min-h-svh justify-center items-center">
         <h1>Not Sign In</h1>
         <br />
         <button className="bg-amber-400 rounded px-5 py-2">Sign In</button>
      </div>
   );
}
