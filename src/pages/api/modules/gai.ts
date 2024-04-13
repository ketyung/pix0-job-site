import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import bodyParser from "body-parser";
const jsonParser = bodyParser.json();

export async function handler(req: NextApiRequest, res: NextApiResponse, userId? : string ) {

    if (req.method === 'GET') {
        await handleGet(req, res, userId);
    }else if ( req.method === "POST"){
        await handlePost(req, res, userId);
    }
}


async function handleGet (req: NextApiRequest,  res: NextApiResponse, _userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        const param2 = path[2];
        if ( param1 === 'genJobDesc') {
            await genJobDesc(res, param2);
        }else {
            res.status(400).json({text: "Invalid action!", status:-1});
        }
    }
}


async function genJobDesc(res: NextApiResponse, jobTitle : string, jobCategory? : string,  asJson? : boolean ) {
    try {

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `Write the job description for a job titled as "${jobTitle}"${jobCategory 
            && ` and in the category of "${jobCategory}"`}${ asJson && ' structured in JSON format' }`
        //console.log("prompt is::", prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.status(200).json({  text : text, status : 1});  
    }
    catch(e: any){

        console.log("errorOn@genJobDesc::", e);
        res.status(500).json({  error: e.message, status : -1});  
    }
}



async function handlePost (req: NextApiRequest,  res: NextApiResponse, _userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        console.log("parm::", param1);
        jsonParser(req, res, async () => {
            const { data } = req.body;
            
             if ( data !== undefined) {
                
                if ( param1 === 'detectImageNudity') {
                    await detectImageNudity(data, res);
                }else {
                    res.status(400).json({text: "Invalid action!", status:-1});
                }
            }
            else {
             
                res.status(400).json({message: "NO proper body data provided!"});
              
            }
        });
    }
}



async function detectImageNudity(imageData : any,  res: NextApiResponse,) {

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
        const text = result.response.text();
        console.log("detectImageResult::", result);

        res.status(200).json({  text : text, status : 1});  

    }
    catch (e : any ){

        console.log("detecImageNudity.error::", e.message?.substring(0,250));
        res.status(422).json({error: e.message, status:-1});
    }
    
}