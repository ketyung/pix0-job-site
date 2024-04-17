// pages/api/[...path].ts
import { NextApiRequest, NextApiResponse } from 'next';
import { isValidJwtToken } from '@/utils/jwt';

function checkAllowed  (req: NextApiRequest) {

    const clientHost = req.headers.host;
    const serverHost = process.env.SERVER_HOST || req.headers.host;

    return (clientHost === serverHost || clientHost?.startsWith("localhost"))

}


const isPathToSkipCheckAuth = (req: NextApiRequest) =>{

    const { path } = req.query;

    let aPath = (path && path.length > 1) ? `${path[0]}/${path[1]}` : '';

    let skipPaths = ['user/verify', 'user/signup', 'user/signInByEmail','user/signInByGid', 'verify/email', 'auth/error', 'auth/google',
        'jobPost/pubJobPosts'
    ];

    let passCheck= skipPaths.includes(aPath);

    //console.log("aPath::", aPath, passCheck);
    return passCheck;
}


const checkAccess = async (req: NextApiRequest, res: NextApiResponse, _next: (userId? : string , providerAccountId? : string) => void, byPassCheck? : boolean) => {
    if ( byPassCheck){
        _next(); return; 
    }

       
    if ( !checkAllowed(req)){
        res.status(401).json({ message : "Unathorized!" });
        return;
    }

    if ( isPathToSkipCheckAuth(req)){
        _next(); return; 
    }

    if (req.headers) {
        const token = req.headers['token'];
        const aTok = Array.isArray(token) ? token[0] : token;

        const v = await isValidJwtToken(aTok);

        if (v.valid) {
            _next(v.userId, v.providerAccountId);
        } else {
            res.status(401).json({ error: "Unauthorized!", message: "Unauthroized Access", version: process.env.VERSION });
        }

    }else {
        
            res.status(422).json(
            process.env.NODE_ENV === "production"
                ? { status: "unauthorized" }
                : { error: "Undefined cookies!", status: "unauthorized" }
            );
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