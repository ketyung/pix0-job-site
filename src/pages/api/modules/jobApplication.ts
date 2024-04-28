import { NextApiRequest, NextApiResponse } from 'next';
import bodyParser from "body-parser";
import { getPageOffsetAndLimit, toTotalPages } from '@/utils';
import { hasJobApplication, createJobApplication, getJobApplication, getJobApplications, getJobAppsOfCompany } from '../dbs/jobApplication';
import { updateJobApplication, deleteJobApplication } from '../dbs/jobApplication';

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
        const param2 = path[2];
        if (param1!== undefined && param1 !== null ){
        
            if ( param1 === 'search'){
                let keyword = path[2];
                let orderBy = path[3];
                let ascOrDesc = path[4];
                let pageNum = parseInt(path[5]);
                let rowsPerPage = parseInt(path[6]);
                
                await handleGetJobApplications(res, userId, keyword, 
                    orderBy !== '-' ? orderBy : undefined , 
                    ascOrDesc !== '-' ? ascOrDesc : undefined, 
                    isNaN(pageNum) ? 1 : pageNum, isNaN(rowsPerPage) ? 10 : rowsPerPage);

            } 
            else
            if ( param1 === 'company' && param2 === 'search'){

                let keyword = path[3];
                let orderBy = path[4];
                let ascOrDesc = path[5];
                let pageNum = parseInt(path[6]);
                let rowsPerPage = parseInt(path[7]);
                
                await handleGetCompanyJobApps(res, userId, keyword, 
                    orderBy !== '-' ? orderBy : undefined , 
                    ascOrDesc !== '-' ? ascOrDesc : undefined, 
                    isNaN(pageNum) ? 1 : pageNum, isNaN(rowsPerPage) ? 10 : rowsPerPage);

            } 
            else if(param1 === 'hasApplication') {
                await handleHasJobApplication(res,  param2, userId);
            }
            else {
                await handleGetJobApplication(res,  param1, userId);
            }
     
        }
        else {
            res.status(400).json({message: "Invalid action!"});
        }

    }

}



async function handleGetJobApplications ( 
    res: NextApiResponse, 
    userId? : string,  
    keyword? : string, 
    orderBy? : string, 
    ascOrDesc? : string, 
    page? : number, 
    rowsPerPage? : number  ){

    try {

        let p = getPageOffsetAndLimit(page ?? 1, rowsPerPage ?? 10);

        let ndata = await getJobApplications(userId ?? "", keyword, orderBy, ascOrDesc, p.offset, p.limit);

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


async function handleGetCompanyJobApps ( 
    res: NextApiResponse, 
    userId? : string,  
    keyword? : string, 
    orderBy? : string, 
    ascOrDesc? : string, 
    page? : number, 
    rowsPerPage? : number  ){

    try {

        let p = getPageOffsetAndLimit(page ?? 1, rowsPerPage ?? 10);

        let ndata = await getJobAppsOfCompany(userId ?? "", keyword, orderBy, ascOrDesc, p.offset, p.limit);

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



async function handleGetJobApplication ( res: NextApiResponse, id : string,  userId? : string  ){

    try {

        let ndata = await getJobApplication(id, userId ?? "");

        if ( ndata !== undefined){
            res.status(200).json({  data : ndata, status : 1});   
        }else {
            res.status(404).json({  message : "Job Application NOT found", status : -1});      
        }
    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}




async function handleHasJobApplication ( res: NextApiResponse, jobId : string,  userId? : string  ){

    try {

        let ndata = await hasJobApplication(jobId, userId ?? "");

        if ( ndata !== undefined){
            res.status(200).json({  hasJobApplication : true, status : 1});   
        }else {
            res.status(200).json({  hasJobApplication : false , status : 1});   
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

        let ndata = await createJobApplication(userId, data );

        res.status(200).json({ message: "Created", data : ndata, status : 1});   

    }
    catch(e: any){
        res.status(422).send({error: e.message, status: -1});
    }
}




async function handleUpdate ( res: NextApiResponse, userId : string, jobapplication : any  ){

    try {

        let updated = await updateJobApplication(userId, jobapplication );

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
            await handleDeleteJobApplication(res, userId, param1);
        }else {
            res.status(400).json({message: "Invalid action!"});
        }

    }

}


async function handleDeleteJobApplication ( res: NextApiResponse, userId? : string,  id? : string  ){

    try {

        let d = await deleteJobApplication(userId ?? "", id ?? "");
        
        res.status(200).json({  deleted : d, status : 1});   

    }
    catch(e: any){
        console.log("e::",e);
        res.status(422).send({error: e.message, status: -1});
    }
}
