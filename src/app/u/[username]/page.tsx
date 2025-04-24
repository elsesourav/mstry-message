"use client";

import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCw, Send } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export default function UserPage() {
   const [messages, setMessages] = useState([
      "Hi! I’m glad we’re connected. Hope we can be good friends. 😊",
      "Hello! Nice to meet you. Let me know how I can help you.",
      "Hey bro, just wanted to say hi. Hope you're doing well.",
      "Hi… just wanted to talk to you. You seem really special. ❤️",
   ]);
   const [username, setUsername] = useState("Username");
   const [inputMessage, setInputMessage] = useState("");
   const [isSending, setIsSending] = useState(false);
   const [isMessageLoading, setIsMessageLoading] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);


   const params = useParams<{ username: string }>();

   useEffect(() => {
      setUsername(params.username);
   }, [params]);

   const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputMessage(e.target.value);

      const el = textareaRef.current;
      if (el) {
         el.style.height = "auto";
         el.style.height = el.scrollHeight + "px";
      }
   };

   const getAiSuggestMessage = async () => {
      setIsMessageLoading(true);
      try {
         const response = await axios.get("/api/messages/suggest");
         const newMessages = JSON.parse(response.data.message);
         setMessages(newMessages);

      } catch (error) {
         console.error("Error in loading message: ", error);
         const axiosError = error as AxiosError<ApiResponse>;
         const axiosMessage =
            axiosError.response?.data.message ?? "Server Error";
         toast.error(axiosMessage);
      } finally {
         setIsMessageLoading(false);
      }
   };

   const sendMessage = async () => {
      setIsSending(true);
      try {
         await axios.post("/api/messages/send", {
            username,
            content: inputMessage,
         });

         toast("Message Sended", {
            description: new Date().toLocaleString(),
         });
         setInputMessage("");

      } catch (error) {
         console.error("Error in send message: ", error);
         const axiosError = error as AxiosError<ApiResponse>;
         const axiosMessage =
            axiosError.response?.data.message ?? "Server Error";
         toast.error(axiosMessage);
      } finally {
         setIsSending(false);
      }
   };

   const setSuggestMessage = (index: number) => {
      setInputMessage(messages[index]);
   };

   return (
      <div className="relative h-auto flex flex-col justify-center items-center mt-3 md:mt-4">
         <main className="bg-gray-50 rounded shadow-md min-w-[90%] mx-2 md:min-w-3xl lg:min-w-4xl p-3 pb-6 md:pb-8 md:p-4">
            <h1 className="text-3xl md:text-4xl mb-3 font-bold text-center">
               Public Profile Link
            </h1>
            <p className="font-bold mt-8 flex gap-1">
               Send Anonymous Message to{" "}
               <span className="text-[#008cff]">@{username}</span>
               {isSending && <Loader2 className="size-4 animate-spin" />}
            </p>
            <div className="my-2 relative grid grid-cols-[1fr_50px] gap-2">
               <textarea
                  ref={textareaRef}
                  className="w-full h-[50px] resize-none px-2 py-1 rounded outline outline-gray-400 overflow-hidden"
                  placeholder="Write your anonymous message here"
                  value={inputMessage}
                  onChange={handleChange}
               ></textarea>
               <Button
                  className="cursor-pointer size-[50px] bottom-0 mt-auto"
                  onClick={sendMessage}
                  disabled={isSending}
               >
                  <Send />
               </Button>
            </div>
            <div className="mt-6 relative grid grid-rows-[50px_auto_50px] outline-1 rounded-md">
               <h2 className="w-full pl-4 grid items-center text-xl font-semibold">
                  Suggested Message
               </h2>
               <div className="relative w-full h-auto border border-x-0 flex flex-col gap-3 py-3">
                  {messages.map((message, index) => (
                     <div
                        className="relative w-full grid place-items-center"
                        key={index}
                     >
                        <button
                           className="relative w-[min(90%,calc(100%-8px))] cursor-pointer py-1 outline-1 rounded-lg"
                           onClick={() => setSuggestMessage(index)}
                        >
                           {message}
                        </button>
                     </div>
                  ))}
               </div>
               <div className="w-full grid place-items-center">
                  <Button
                     className="cursor-pointer"
                     disabled={isMessageLoading}
                     onClick={getAiSuggestMessage}
                  >
                     AI Suggested Messages <RefreshCw />
                  </Button>
               </div>
            </div>
         </main>
      </div>
   );
}
