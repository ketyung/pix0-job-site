import { NextApiRequest, NextApiResponse } from 'next';
import bodyParser from "body-parser";
import { saveResume } from '../dbs/userResume';

const jsonParser = bodyParser.json();

export async function handler(req: NextApiRequest, res: NextApiResponse, userId? : string ) {

    if (req.method === 'GET') {
        await handleGet(req, res, userId);
    }else if (req.method ==='POST'){
        await handlePost(req, res, userId);
    }
}




async function handleGet (req: NextApiRequest,  res: NextApiResponse, userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        if (param1!== undefined && param1 !== null ){
        
          
     
        }
        else {
            res.status(400).json({message: "Invalid action!"});
        }

    }

}


async function handlePost (req: NextApiRequest,  res: NextApiResponse, userId? : string) {
    
    const { path } = req.query;

    if ( !userId) {
        res.status(400).json({message: "Invalid user id!"});
        return; 
    }

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];
        jsonParser(req, res, async () => {
            const { data } = req.body;
            if ( data !== undefined) {
                
                if ( param1 === 'save'){
                    await handleSave(res, userId ,  data);
                } else {
                    res.status(400).json({message: "Invalid action!"});
                }
            }
            else {
             
                res.status(400).json({message: "NO proper body data provided!"});
              
            }
        });

    }
    
}




async function handleSave ( res: NextApiResponse,  userId: string, data : any  ){

    try {

        let ndata = await saveResume(userId, data );
        console.log("n.data::", ndata, data);

        res.status(200).json({ message: "Saved", data : ndata, status : 1});   

    }
    catch(e: any){

        console.log("e::", e);
        res.status(422).send({error: e.message, status: -1});
    }
}
