"use client";

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/models/Message.model";
import { acceptMessagesSchema } from "@/schemas/acceptMessage.schema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function DashBoard() {
   const [messages, setMessages] = useState<Message[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [isSwitchLoading, setIsSwitchLoading] = useState(false);
   const { data: session } = useSession();

   const handleDeleteMessage = (messageId: string) => {
      setMessages(messages.filter((message) => message._id !== messageId));
   };

   const form = useForm({
      resolver: zodResolver(acceptMessagesSchema),
   });

   const { register, watch, setValue } = form;
   const acceptMessages = watch("acceptMessages");

   const fetchAcceptMessage = useCallback(async () => {
      setIsSwitchLoading(true);
      try {
         const response = await axios.get<ApiResponse>("/api/messages/accept");

         setValue("acceptMessages", response.data.isAcceptingMessages || false);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         const errorMessage =
            axiosError.response?.data.message ||
            "Failed to fetch Message settings";
         toast.error(errorMessage);
      } finally {
         setIsSwitchLoading(false);
      }
   }, [setValue]);

   const fetchMessages = useCallback(
      async (refresh: boolean = false) => {
         setIsLoading(true);
         setIsSwitchLoading(false);

         try {
            const response = await axios.get<ApiResponse>("/api/messages/get");
            setMessages(response.data?.messages || []);
            if (refresh) {
               toast.message("Refreshed Messages", {
                  description: "Showing latest messages",
               });
            }
         } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage =
               axiosError.response?.data.message || "Failed to fetch Messages";
            toast.error(errorMessage);
         } finally {
            setIsLoading(false);
            setIsSwitchLoading(false);
         }
      },
      [setIsLoading, setMessages]
   );

   useEffect(() => {
      if (!session || !session.user) return;
      fetchAcceptMessage();
      fetchMessages();
   }, [session, setValue, fetchMessages, fetchAcceptMessage]);

   const handleSwitchChange = async () => {
      try {
         const response = await axios.post<ApiResponse>(
            "/api/messages/accept",
            {
               acceptMessages: !acceptMessages,
            }
         );
         setValue("acceptMessages", !acceptMessages);
         toast.message(response.data.message);
      } catch (error) {
         const axiosError = error as AxiosError<ApiResponse>;
         const errorMessage =
            axiosError.response?.data.message || "Failed to fetch Messages";
         toast.error(errorMessage);
      }
   };

   if (!session || !session.user) {
      return <div>Please login</div>;
   }

   const { username } = session.user as User;
   const { protocol, host } = window.location;
   const profileUrl = `${protocol}//${host}/u/${username}`;

   const copyToClipboard = () => {
      navigator.clipboard.writeText(profileUrl);
      toast.message("URL Copied", {
         description: "Profile URL has been copied to clipboard",
      });
   };

   return (
      <div className="my-8 mx-4 md:mx-4 lg:mx-auto p-6 rounded w-full max-w-6xl">
         <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
         <div className="mb-4">
            <h2 className="text-lg font-semibold mb-2">
               Copy Your Unique Link
            </h2>{" "}
            <div className="flex items-center justify-between outline-1 p-1 outline-gray-200 rounded-md">
               <Link
                  className="w-auto px-2 text-blue-600 cursor-pointer"
                  href={profileUrl}
               >
                  {profileUrl}
               </Link>
               <Button className="cursor-pointer" onClick={copyToClipboard}>
                  Copy
               </Button>
            </div>
         </div>

         <div className="mb-4">
            <Switch
               className="cursor-pointer scale-125"
               {...register("acceptMessages")}
               checked={acceptMessages}
               onCheckedChange={handleSwitchChange}
               disabled={isSwitchLoading}
            />
            <span className="ml-2">
               Accept Messages: {acceptMessages ? "On" : " Off"}
            </span>
         </div>

         <Separator />

         <Button
            className="mt-4"
            variant="outline"
            onClick={(e) => {
               e.preventDefault();
               fetchMessages(true);
            }}
         >
            {isLoading ? (
               <Loader2 className="size-4 animate-spin" />
            ) : (
               <RefreshCcw className="size-4" />
            )}
         </Button>

         <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {messages.length > 0 ? (
               messages.map((message) => (
                  <MessageCard
                     key={message._id}
                     message={message}
                     onMessageDelete={handleDeleteMessage}
                  />
               ))
            ) : (
               <p>No Messages to display.</p>
            )}
         </div>
      </div>
   );
}
