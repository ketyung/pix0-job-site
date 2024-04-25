import { NextApiRequest, NextApiResponse } from 'next';
import { AuthType, getJwtToken, isValidJwtToken } from '@/utils/jwt';
import bodyParser from "body-parser";
import {  getUser, signInByGid, signOutUserByGid, updateUserProfile } from '../dbs/user';



const jsonParser = bodyParser.json();

export async function handler(req: NextApiRequest, res: NextApiResponse, userId? : string, providerAccountId? : string ) {

    if (req.method === 'GET') {
        await handleGet(req, res, userId, providerAccountId);
    }else if (req.method ==='POST'){
        await handlePost(req, res, userId);
    }
}




async function handleGet (req: NextApiRequest,  res: NextApiResponse, userId? : string, providerAccountId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        if ( param1 === 'verify'){
            await handleVerify(req, res );
        } else if (param1 === 'signOutByGid') {
            await handleSignOutByGid(res, userId, providerAccountId);
        } else if ( param1 === 'userProfile'){
            await handleFetchUserProfile(userId ?? "", res);
        }
    }

}


async function handlePost (req: NextApiRequest,  res: NextApiResponse, userId? : string) {
    
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];
        jsonParser(req, res, async () => {
            const { data } = req.body;
            
            if ( data !== undefined) {
                
                if ( param1 === "signInByGid") {
                    await handleSignInByGid(data, res);
                }else if ( param1 === 'updateProfile'){
                    await handleUpdateUserProfile(userId ?? "", data , res);
                }
                
                else {
                    res.status(422).send({error:"Invalid Module", status: -1});
                }
            }
            else {
             
                res.status(400).json({message: "NO proper body data provided!"});
              
            }
        });

    }
    
}




async function handleSignInByGid (data : any,  res: NextApiResponse ){

    try {
      
        
        let ndata = await signInByGid(data.email, data.accountId);
      
        if ( ndata.signedIn ) {

            res.status(200).json({ message: "Successfully Signed In", jwt : getJwtToken({
                id : ndata.eUserId  ?? "",
                accountId : ndata.accountId ?? "",
                authType : AuthType.GOOGLE, 
            }), status : 1});   

        }else {

            res.status(200).json({ message: "Failed To Sign You In", status : -1});   

        }
       
    }
    catch(e: any){
        res.status(422).send({error: e.message, status: -1});
    }
}



async function handleSignOutByGid (res: NextApiResponse, userId? : string, accountId? : string   ){

    try {
      
        let ndata = await signOutUserByGid(userId ?? "", accountId ?? "");
      
        if ( ndata.signedOut ) {

            res.status(200).json({ message: "Successfully Signed Out", status : 1});   

        }else {

            res.status(200).json({ message: "Failed To Sign You Out", status : -1, error : ndata.errorMessage});   
        }
       
    }
    catch(e: any){
        res.status(422).send({error: e.message, status: -1});
    }
}



async function handleVerify(req: NextApiRequest, res : NextApiResponse) {

    const token = req.headers['token'];
    const aTok = Array.isArray(token) ? token[0] : token;

    let valid = await isValidJwtToken(aTok);
    if ( !valid.valid ) {

        res.status(401).json({ error: "Unauthorized!", message: "Verifying User: Unauthroized Access", status:-1, version: process.env.VERSION});
    }else {
   
        res.status(200).json({  message: "Valid User", status:1, version: process.env.VERSION });
   
    }

}




async function handleFetchUserProfile(userId: string, res : NextApiResponse) {

    let user = await getUser(userId, true);

    if ( user ) {
        res.status(200).json({ status:1, data : user});
    }else {
   
        res.status(404).json({  error: "User NOT found", status:-1 });
   
    }

}

async function handleUpdateUserProfile (userId: string, data : any,  res: NextApiResponse ){

    try {
      
        
        let updated = await updateUserProfile(userId, data);
      
        if ( updated ) {
            res.status(200).json({ message: "Successfully Updated", status : 1});   
        }else {
            res.status(200).json({ message: "Failed Updating Profile", status : -1});   
        }
       
    }
    catch(e: any){
        res.status(422).send({error: e.message, status: -1});
    }
}



