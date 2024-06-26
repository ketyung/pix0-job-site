import { NextApiRequest, NextApiResponse } from 'next';
const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
import bodyParser from "body-parser";
import { getUserCompany } from '../dbs/userCompany';
import { isBlank } from '@/utils';
import { JobPost } from '@prisma/client';
import { ResumeData } from '@/models';
import { getUser } from '../dbs/user';
import { getJobPostWithAppls } from '../dbs/jobPost';
import { updateJobApplForScore } from '../dbs/jobApplication';

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
        }
        else if ( param1 === 'analyzeAppls') {
            await generateScoresForJobAppls(param2, res, _userId);
        }
        else {
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
                }
                else if ( param1 === 'checkJobPostInfo') {
                    await checkIfJobPostInfoProper(data, res);
                }
                else if ( param1 === 'generateResume') {
                    await generateResume(data, res, _userId);
                }
              
                else {
                    res.status(400).json({text: "Invalid action!", status:-1});
                }
            }
            else {
             
                res.status(400).json({message: "NO proper body data provided!"});
              
            }
        });
    }
}



async function checkIfJobPostInfoProper(jobPost : JobPost,  res: NextApiResponse,) {

    try {

        const safetySettings = [
            {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
            },
            {
                category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
                threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
            },
        ];

        const model = genAI.getGenerativeModel({ model: "gemini-pro", safetySettings});

        const prompt = `Please review the following job post and determine if it is appropriate:

        Job Post JSON:
        ${JSON.stringify(jobPost, null, 2)}
        
        Is this job post appropriate and free from NSFW (Not Safe for Work) content, harmful or offensive language, and insulting or discriminatory remarks? 
        (Please answer with "yes" or "no")`;
        
        

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //console.log("return.x.text::", text);

        res.status(200).json({  text : text, status : 1});  


    }
    catch (e : any ){

        console.log("detectJobPostInfo.error::", e.message?.substring(0,550));
        res.status(422).json({error: e.message, status:-1});
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
       
        //const prompt = "Does this image contain any NSFW content?"; 

        const prompt = "Please analyze the image and determine if it contains any NSFW (Not Safe for Work) content. (Please answer with 'yes' or 'no')";

        const image = {
            inlineData: {
                data: ext.data ,
                mimeType: ext.mimeType,
            },
        };

        const imageParts = [image];
        
        const result = await model.generateContent([prompt, ...imageParts]);
        const text = await result.response.text();
        
        //console.log("detectImageResult::", text );

        res.status(200).json({  text : text, status : 1});  

    }
    catch (e : any ){

        console.log("detecImageNudity.error::", e.message?.substring(0,550));
        res.status(422).json({error: e.message, status:-1});
    }
    
}



async function generateResume(data : ResumeData,  res: NextApiResponse, userId? : string ) {

    try {

        if ( userId === undefined) {
            res.status(404).json({  text : "Not Found", status : -1});
            return;  
        }
        let user = await getUser(userId, true);

        let userInfo = {firstName : user?.firstName, lastName : user?.lastName, phoneNumber : user?.phoneNumber,
            email : user?.email, photoUrl: user?.photoUrl, 
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro"});

        const prompt = `Please generate a resume in Markdown format based on the following data in JSON:

        Resume's JSON:
        ${JSON.stringify(data, null, 2)}
        
        Personal Info's JSON:
        ${JSON.stringify(userInfo, null, 2)}

        Please also insert the photo of the person on top of the personal info as an image with a 
        max size of 100x100 contained in the photoUrl in the Personal's Info JSON
        `;
        
        

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        //console.log("return.x.text::", text);

        res.status(200).json({  text : text, status : 1});  


    }
    catch (e : any ){

        console.log("detectJobPostInfo.error::", e.message?.substring(0,550));
        res.status(422).json({error: e.message, status:-1});
    }
    
}

function splitArrayIntoGroups(arr: any[], maxNumberInEach : number = 2): any[][] {
    const result: any[][] = [];
    for (let i = 0; i < arr.length; i += maxNumberInEach) {
        result.push(arr.slice(i, i + maxNumberInEach));
    }
    return result;
}

async function generateScoresForJobAppls(jobId : string ,  res: NextApiResponse, userId? : string ) {

    try {

        if ( userId === undefined) {
            res.status(404).json({  text : "Not Found", status : -1});
            return;  
        }

        let job : any = await getJobPostWithAppls(userId , jobId);

        const model = genAI.getGenerativeModel({ model: "gemini-pro", generationConfig: {
            temperature: 0.1, // make it deterministic
        }});


        let allAppls = splitArrayIntoGroups(job?.application, 3); // split into each group having three applicants only
                                                               // to reduce text prompt size
        for (let g =0; g < allAppls.length; g++) {

            let appls :any = allAppls[g].map((a : any )=>{
                return {id: a.id, userId : a.user.id, resumeId : a.resume.id, resumeContent: a.resume.resumeText, score: "", reason : ""}
            })
    
    
            const prompt = `Below is the list of Job Applications in JSON:
    
            Job Applications JSON:
            ${JSON.stringify(appls , null, 2)}
            
            Job Post's JSON:
            ${JSON.stringify({title : job.title, description : job.description, employer : job.company.name}, null, 2)}
    
            Please check the list of applications for each that has best match with the job
            and return the score (1 is lowest and 10 is highest) and reason for each in the Job Application List in JSON format too
            `;
            
    
            //console.log("prompt:::", prompt);
            
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
    
            try {
    
                const jsonStartIndex = text.indexOf('[');
                const jsonEndIndex = text.lastIndexOf(']') + 1;
                const jsonPart = text.substring(jsonStartIndex, jsonEndIndex);
        
              
                const jsonArray = JSON.parse(jsonPart);
              
                jsonArray.forEach(async (a : any, i :number)=>{
    
                    //console.log(i+1, ". ", a.id, a.score);
                    try {

                        let aScore = parseFloat(a.score);
                        aScore = isNaN(aScore) ? 1 : aScore;
                        await updateJobApplForScore(a.userId, a.id, aScore, a.reason);
                    }catch(e:any){
                        //ignore the error if failed to update
                        console.log("error@updateJobApplForScore::", e.message?.substring(0,550));
                    }
                })
           
          
            }catch(e : any){
                console.log("generateScoresForJobAppls::", e.message?.substring(0,550));
                res.status(422).json({  error: e.message, status:-1}); 
                return;  
            }
           
    

        }

        res.status(200).json({  text : "Updated score and reason for Job Applications", status : 1});  
    
       
    }
    catch (e : any ){

        console.log("generateScoresForJobAppls::", e.message?.substring(0,550));
        res.status(422).json({error: e.message, status:-1});
    }
    
}
