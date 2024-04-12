import { NextApiRequest, NextApiResponse } from 'next';
import { CloudParam } from "@/models";

export async function handler(req: NextApiRequest, res: NextApiResponse, userId? : string ) {

    if (req.method === 'GET') {
        await handleGet(req, res, userId);
    }
}


async function handleGet (req: NextApiRequest,  res: NextApiResponse, _userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        if ( param1 === 'getCloudParams') {
            let prms = getCloudParams();
            if ( prms !== undefined){
                res.status(200).json({data: prms, status:1});
            }else {
                res.status(404).json({error: "Not Found", status:-1});
            }
        }else {
            res.status(400).json({text: "Invalid action!", status:-1});
        }
    }
}



function getCloudParams() : CloudParam[]|undefined {

    let params = process.env.CLOUDINARY_PARAMS;
    if ( params ){

        let prms = JSON.parse(params) as CloudParam[];
        return prms;
    }

    return undefined;
}