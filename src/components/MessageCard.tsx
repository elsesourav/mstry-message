import {
   Card,
   CardContent,
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
import { Message } from "@/models/Message.model";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type MessageCardProps = {
   message: Message;
   onMessageDelete: (messageId: string) => void;
}

export default function MessageCard({ message, onMessageDelete }: MessageCardProps) {

   const handleDeleteConfirm = async () => {
      const response = await axios.delete<ApiResponse>(`/api/message/delete/${message._id}`)
      toast.success(response.data.message);
      onMessageDelete(message._id);
   };

   return (
      <Card>
         <CardHeader>
            <CardTitle>Card Title</CardTitle>

            <AlertDialog>
               <AlertDialogTrigger asChild>
                  <Button variant="destructive">
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

            <CardDescription>Card Description</CardDescription>
         </CardHeader>
         <CardContent></CardContent>
      </Card>
   );
}
