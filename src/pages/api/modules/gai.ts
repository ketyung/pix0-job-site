import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import bodyParser from "body-parser";
import { getUserCompany } from '../dbs/userCompany';
import { isBlank } from '@/utils';
const jsonParser = bodyParser.json();
const fs = require('fs');


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
            await genJobDesc(res, _userId ?? "", param2);
        }else {
            res.status(400).json({text: "Invalid action!", status:-1});
        }
    }
}


async function genJobDesc(res: NextApiResponse, userId: string, jobTitle : string, jobCategory? : string,  asJson? : boolean ) {
    try {

        let company = await getUserCompany(userId);

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `Write the job description for a job titled as "${jobTitle}"${jobCategory 
            && ` and in the category of "${jobCategory}"`}${ asJson && ' structured in JSON format' } 
            for company ${company?.name} ${!isBlank(company?.industry) ? ` in the industry of ${company?.industry}` :""}
            ${!isBlank(company?.description) ? ` and with 'About Us' as "${company?.description}]"` : ""} 
            but please do NOT include To Apply section `;

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

        jsonParser(req, res, async () => {
            const { data } = req.body;
            
             if ( data !== undefined) {
                
                if ( param1 === 'checkIfImageIsSFW') {
                    await checkIfImageIsSFW(data, res);
                    //await testCheckIfImageIsSFW(res);
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


function extractMimeTypeAndData(base64Data: string): { mimeType: string; data: string } {
    // Regular expression to match the mime type and data portion
    const regex = /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.*)$/;

    // Execute the regular expression
    const matches = base64Data.match(regex);

    if (!matches || matches.length < 3) {
        throw new Error('Invalid base64 data string');
    }

    // Extract the mime type and data from the matches
    const mimeType = matches[1];
    const data = matches[2];

    return { mimeType, data };
}

async function checkIfImageIsSFW(imageData : any,  res: NextApiResponse,) {

    try {

     
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        let ext = extractMimeTypeAndData(imageData);

         //"Does this image contain any nudity and sexual content that is NSFW?";
       
        const prompt = "Does this image contain any NSFW content?"; 
        const image = {
            inlineData: {
                data: ext.data ,
                mimeType: ext.mimeType,
            },
        };

        const imageParts = [image];
        
        const result = await model.generateContent([prompt, ...imageParts]);
        const text = await result.response.text();
        //console.log("detectImageResult::", result, text );

        res.status(200).json({  text : text, status : 1});  

    }
    catch (e : any ){

        console.log("detecImageNudity.error::", e.message?.substring(0,550));
        res.status(422).json({error: e.message, status:-1});
    }
    
}


function fileToGenerativePart(path : string , mimeType : string ) {

    let bdata = Buffer.from(fs.readFileSync(path)).toString("base64");
    //console.log("bdata:::", bdata.substring(0,300));
    return {
      inlineData: {
        data: bdata,
        mimeType
      },
    };
  }

async function testCheckIfImageIsSFW(res: NextApiResponse,) {

    try {

     
        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

        const prompt = "Does this image contain any NSFW content?"; //"Does this image contain any nudity and sexual content that is NSFW?";
        const imageParts = [fileToGenerativePart("/Users/ketyung/pix0/web/pix0-job-site/src/pages/api/modules/testImg1.png", "image/png")];

        
        const result = await model.generateContent([prompt, ...imageParts]);
        const text = result.response.text();
        console.log("detectImageResult::", result.response, text, );

        res.status(200).json({  text : text, status : 1});  

    }
    catch (e : any ){

        console.log("detecImageNudity.error::", e.message?.substring(0,250));
        res.status(422).json({error: e.message, status:-1});
    }
    
}