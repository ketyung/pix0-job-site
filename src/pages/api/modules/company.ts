import { NextApiRequest, NextApiResponse } from 'next';
import bodyParser from "body-parser";
import { getPageOffsetAndLimit, toTotalPages } from '@/utils';
import { createCompany, getUserCompany, updateCompany, getCompanies, deleteCompany} from '../dbs/userCompany';

const jsonParser = bodyParser.json();

export async function handler(req: NextApiRequest, res: NextApiResponse, userId? : string ) {

    if (req.method === 'GET') {
        await handleGet(req, res, userId);
    }else if (req.method ==='POST'){
        await handlePost(req, res, userId);
    }else if (req.method ==='DELETE'){
        await handleDelete(req, res, userId);
    }
}




async function handleGet (req: NextApiRequest,  res: NextApiResponse, userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

     
        if (param1!== undefined && param1 !== null ){
        
            if ( param1 === 'search'){
                let keyword = path[2];
                let orderBy = path[3];
                let ascOrDesc = path[4];
                let pageNum = parseInt(path[5]);
                let rowsPerPage = parseInt(path[6]);
                
                await handleGetUserCompanies(res, userId, keyword, 
                    orderBy !== '-' ? orderBy : undefined , 
                    ascOrDesc !== '-' ? ascOrDesc : undefined, 
                    isNaN(pageNum) ? 1 : pageNum, isNaN(rowsPerPage) ? 10 : rowsPerPage);

            }
            else if ( param1 === 'hasCompany'){

                await handleUserHasCompany(res, userId);
            }
            else {
                await handleGetUserCompany(res,  param1, userId);
            }
     
        }
        else {
            res.status(400).json({message: "Invalid action!"});
        }

    }

}



async function handleGetUserCompanies ( 
    res: NextApiResponse, 
    userId? : string,  
    keyword? : string, 
    orderBy? : string, 
    ascOrDesc? : string, 
    page? : number, 
    rowsPerPage? : number  ){

    try {

        let p = getPageOffsetAndLimit(page ?? 1, rowsPerPage ?? 10);

        let ndata = await getCompanies(userId ?? "", keyword, orderBy, ascOrDesc, p.offset, p.limit);

        let data = {...ndata, page, rowsPerPage};
        data = { ...data , totalPages : toTotalPages(data)  };
        //console.log("data:::",data);
        res.status(200).json({  data : data, status : 1});   

    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}


async function handleGetUserCompany ( res: NextApiResponse, id : string,  userId? : string  ){

    try {

        let ndata = await getUserCompany(userId ?? "", id );

        if ( ndata !== undefined && ndata !== null ){
            res.status(200).json({  data : ndata, status : 1});   
        }else {
            res.status(404).json({  message : "Company NOT found", status : -1});      
        }
    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}




async function handleUserHasCompany ( res: NextApiResponse, userId? : string  ){

    try {

        let ndata = await getUserCompany(userId ?? "" );

        if ( ndata !== undefined && ndata !== null ){
            res.status(200).json({  hasCompany : true , status : 1});   
        }else {
            res.status(404).json({  message : "Company NOT found", status : -1});      
        }
    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
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
                
                if ( param1 === 'create'){
                    await handleCreate(res, userId ,  data);
                } else if ( param1 === 'update'){
                    await handleUpdate(res, userId ,  data);
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




async function handleCreate ( res: NextApiResponse,  userId: string, data : any  ){

    try {

        let ndata = await createCompany(userId, data );

        res.status(200).json({ message: "Created", data : ndata, status : 1});   

    }
    catch(e: any){
        res.status(422).send({error: e.message, status: -1});
    }
}




async function handleUpdate ( res: NextApiResponse, userId : string, usercompany : any  ){

    try {

        let updated = await updateCompany(userId, usercompany );

        res.status (200).send({status: updated ? 1 : -1, message : updated ? 'Record successfully updated' : 'Failed to update record'});

    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}


async function handleDelete (req: NextApiRequest,  res: NextApiResponse, userId? : string ) {
    const { path } = req.query;

    if (Array.isArray(path) && path.length > 1) {   

        const param1 = path[1];

        if ( param1 !== undefined && param1 !== null ){
            await handleDeleteUserCompany(res, userId, param1);
        }else {
            res.status(400).json({message: "Invalid action!"});
        }

    }

}


async function handleDeleteUserCompany ( res: NextApiResponse, userId? : string,  id? : string  ){

    try {

        let d = await deleteCompany(userId ?? "", id ?? "");
        
        res.status(200).json({  deleted : d, status : 1});   

    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}
