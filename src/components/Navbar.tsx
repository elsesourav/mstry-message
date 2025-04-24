"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { User } from "next-auth";
import { Button } from "./ui/button";

export default function Navbar() {
   const { data: session } = useSession();

   const user: User = session?.user as User;

   return (
      <nav className="p-4 md:p-6 shadow-md">
         <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
            <Link className="text-xl font-extrabold mb-4 md:mb-0" href="/">
               Mystery Message
            </Link>
            {session ? (
               <>
                  <span className="mr-4">
                     Welcome, {user?.username || user?.email}{" "}
                  </span>

                  <Link href="/dashboard">
                     <Button className="cursor-pointer">Dashboard</Button>
                  </Link>
                  <Button
                     className="w-full md:w-auto cursor-pointer"
                     onClick={() => signOut()}
                  >
                     Logout
                  </Button>
               </>
            ) : (
               <>
                  <Link href="/signin">
                     <Button className="w-full md:w-auto cursor-pointer">
                        Login
                     </Button>
                  </Link>
               </>
            )}
         </div>
      </nav>
   );
}
