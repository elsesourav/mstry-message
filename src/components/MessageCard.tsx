import {
   Card,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";
import { MessageCardProps } from "@/types/Base";

export default function MessageCard({
   message,
   onMessageDelete,
}: MessageCardProps) {
   const handleDeleteConfirm = async () => {
      const response = await axios.delete<ApiResponse>(
         `/api/message/delete/${message._id}`
      );
      toast.success(response.data.message);
      onMessageDelete(message._id);
   };

   return (
      <Card className="relative">
         <CardHeader>
            <CardTitle>{message.content}</CardTitle>

            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button className="absolute right-1 top-1 rounded-md size-7 cursor-pointer bg-[#f00a]" variant="destructive">
                     <X className="size-5" />
                  </Button>
               </AlertDialogTrigger>
               <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>
                        Are you absolutely sure?
                     </AlertDialogTitle>
                     <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                     </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                     <AlertDialogCancel>Cancel</AlertDialogCancel>
                     <AlertDialogAction onClick={handleDeleteConfirm}>
                        Continue
                     </AlertDialogAction>
                  </AlertDialogFooter>
               </AlertDialogContent>
            </AlertDialog>

            <CardDescription>
               {new Date(message.createdAt).toLocaleString()}
            </CardDescription>
         </CardHeader>
      </Card>
   );
}
