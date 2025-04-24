import { errorResponse, successResponse } from "@/utils/response";
import OpenAI from "openai";

export async function GET() {
   const prompt = `Generate a JSON array of 4 friendly and positive chat messages.
Each message should be between 8 to 15 words long and include at least one emoji.
The tone should be energetic yet polite, suitable for messaging someone you don’t know personally.
Avoid slang or overly casual language—keep it warm, welcoming, and universally appealing.
Return the result as a plain JSON array of strings, no extra formatting.`;

   const apiKey = process.env.NEMOTRON_API_KEY;
   const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1",
      apiKey,
   });

   try {
      const completion = await openai.chat.completions.create({
         model: "nvidia/llama-3.3-nemotron-super-49b-v1:free",
         messages: [
            {
               role: "assistant",
               content: prompt,
            },
         ],
      });
      
      const message = completion.choices?.[0]?.message?.content;

      if (!(message && message !== "")) {
         return successResponse({
            message: "Server are busy!",
            status: 504,
         });
      }

      return successResponse({
         message: message.toString(),
         status: 200,
      });
   } catch (error) {
      console.error("Error generating questions:", error);
      return errorResponse("Failed to generate questions", 500);
   }
}
