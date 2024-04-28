// pages/api/[...path].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { AuthType, isAllowedUser } from '@/utils/jwt';
import { getToken } from "next-auth/jwt";
import getConfig from 'next/config';


function checkAllowed  (req: NextApiRequest) {

    const clientHost = req.headers.host;
    const serverHost = process.env.SERVER_HOST || req.headers.host;

    return (clientHost === serverHost || clientHost?.startsWith("localhost"))

}


const isPathToSkipCheckAuth = (req: NextApiRequest) =>{

    const { path } = req.query;

    let aPath = (path && path.length > 1) ? `${path[0]}/${path[1]}` : '';

    let skipPaths = ['user/verify', 'user/signup', 'user/signInByEmail','user/signInByGid', 'verify/email', 'auth/error', 'auth/google',
        'jobPost/pubJobPosts','jobPost/pubJobPost'
    ];

    let passCheck= skipPaths.includes(aPath);

    //console.log("aPath::", aPath, passCheck);
    return passCheck;
}




const isApiKeyValid = async (req : NextApiRequest, res: NextApiResponse) : Promise<boolean>=>{


    if (req.headers) {
        
        
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ message: 'Unauthorized', reason: "Invalid API KEY"});
            return false; 
        }

        const token = authHeader.split(' ')[1];

        const {  publicRuntimeConfig } = getConfig();
        
        if ( token !== publicRuntimeConfig.RestApiKey){
            res.status(401).json({ message: 'Unauthorized' , reason: "Invalid API KEY"});
            return false; 
        }

        return true;

    }else {
        
        res.status(422).json(
        process.env.NODE_ENV === "production"
            ? { status: "unauthorized" }
            : { error: "Undefined cookies!", status: "unauthorized" }
        );
        
        return false; 
    }
}

const verifyToken2 = async (req : NextApiRequest, res: NextApiResponse, _next: (userId? : string , providerAccountId? : string) => void) =>{


        const _token : any = await getToken({ req });

        if ( _token !== null) {

            const v = await isAllowedUser({id : _token.userId, authType: AuthType.GOOGLE, accountId : _token.accountId });
          
            if (v.valid) {
                _next(v.userId, v.providerAccountId);
                return true;
            } else {
                res.status(401).json({ error: "Unauthorized!", message: "Unauthroized Access", version: process.env.VERSION });
                return false; 
            }
        }else {
        
            res.status(422).json(
            process.env.NODE_ENV === "production"
                ? { status: "unauthorized" }
                : { error: "Undefined cookies!", status: "unauthorized" }
            );
            
            return false; 
        }
}

const checkAccess = async (req: NextApiRequest, res: NextApiResponse, _next: (userId? : string , providerAccountId? : string) => void, byPassCheck? : boolean) => {
    
 
    if ( byPassCheck){
        _next(); return; 
    }
       
    if ( !checkAllowed(req)){
        res.status(401).json({ message : "Unathorized!" });
        return;
    }

    if ( !isApiKeyValid(req, res)){
        return;
    }
   
    if ( isPathToSkipCheckAuth(req)){
        _next(); return; 
    }

    if ( !verifyToken2(req, res, _next)){
        return; 
    }

};


export const config = {
    api: {
      externalResolver: true,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    
    checkAccess(req, res, (uid, pAid)=>{
    
        processNext(req,res, uid, pAid );
    });  
}



async function processNext ( req : NextApiRequest, res : NextApiResponse, userId? : string, providerAccountId? : string  ) {

    const { path } = req.query;

    if ( path ) {
        const moduleName = path?.length > 0 ? path[0] : "";
       
        //console.log("::providerAccountId", providerAccountId);
        try 
        {
            const myMod = require(`./modules/${moduleName}`);
            await myMod.handler(req, res, userId,providerAccountId);
        } 
        catch (error : any) {
            //console.error(error);
            res.status(500).json({ error: `Internal server error : ${error.message}` });
        }
    }
    else {
        res.status(404).json({ error: 'Undefined path!' });   
    }
  
}



/*
function getPageNumAndSize (path : any) : {pageNum : number, pageSize: number} {

    let pageSize = path[2] !== undefined ? parseInt(path[2]) : 10;
    let pageNum = path[1] !== undefined ? (parseInt(path[1]) - 1) * (pageSize ?? 10) : 1;
  
    return { pageNum: pageNum < 0 ? 0 : pageNum, pageSize :pageSize}
}*/