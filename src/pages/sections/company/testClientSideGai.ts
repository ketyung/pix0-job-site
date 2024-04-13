const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
// refer here https://ai.google.dev/tutorials/get_started_node
export async function dImage(imageData : any) {

    try {

     
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = "Does this image contain any nudity and sexual content that is NSFW?";
        const image = {
            inlineData: {
                data: imageData ,
                mimeType: "image/jpeg",
            },
        };

        
        const result = await model.generateContent([prompt, image]);
        //const text = result.response.text();
        console.log("detectImageResult::", result);

        //res.status(200).json({  text : text, status : 1});  

    }
    catch (e : any ){

        console.log("detecImageNudity.error::", e.message?.substring(0,450));
        //res.status(422).json({error: e.message, status:-1});
    }
    
}