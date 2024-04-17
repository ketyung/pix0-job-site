import { getUserCompany } from './userCompany';
import prisma from '../db';
import { JobStatus, SearchResult } from '@/models';
import { JobPost } from '@prisma/client';
import { isBlank , padNum} from '@/utils';
import cuid from "cuid";


async function getJobCodePrefix(_companyId? : string) {
    return "J";
}

async function autoGenJobCode (companyId : string) {

    let whereClause: any = {
        where: {
            companyId: companyId
        },
    };

    return `${await getJobCodePrefix(companyId)}${padNum( await getCount(whereClause)+1) }`;
}

export async function createJobPost(userId: string,jobPost : JobPost) {

    if ( isBlank(jobPost.title)) {
        throw new Error("Title of job post must not be blank!");
    }

    try {

        let userCompany =  await getUserCompany(userId);

        let jobCode = isBlank(jobPost.code) ? await autoGenJobCode(userCompany?.id ?? "") : jobPost.code

        let nJobPost : any = {...jobPost, companyId : userCompany?.id, dateCreated : new Date(), id : cuid(), code : jobCode};
  
        let newJobPost = await prisma.jobPost.create({data: nJobPost});
  
        const nJobid = newJobPost.id;
  
        return {cuid : nJobid, status : 1}; 

    }
    catch(e : any){
        throw e ;
    }
   
}


export async function updateJobPost(userId: string,jobPost : JobPost) {


   
    if ( isBlank(jobPost.title)) {
        throw new Error("Title of job post must not be blank!");
    }

    try {

        let userCompany =  await getUserCompany(userId);

       
        let wh =  {
            id: jobPost.id,
            companyId : userCompany?.id
        };
                
        const existingJobPost = await prisma.jobPost.findUnique({
            where: wh 
        });

        if (existingJobPost) {
            const updatedJobPost = await prisma.jobPost.update({
                where: wh,
                data: jobPost
            });

            // 'updatedContact' contains the updated contact record
            return (updatedJobPost.id === jobPost.id && updatedJobPost.companyId === userCompany?.id);
        } else {
  
            throw Error('JobPost NOT found!');
        }
  
  

    }
    catch(e : any){
        throw e ;
    }
   
}


export async function getJobPosts(userId: string, keyword?: string, orderBy? : string, 
    ascOrDesc? : string, offset: number = 0, limit: number = 10) :Promise<SearchResult> {
    
    let userCompany = await getUserCompany(userId);

    if ( userCompany === null) {
        return {results:[], total:0};
    }

    let whereClause: any = {
        where: {
            companyId: userCompany?.id
        },
    };

    if (keyword && keyword.trim()!== '-') {
        whereClause = {
            where: {
                companyId: userCompany?.id,
                OR: [
                    { code: { contains: keyword } },
                    { title: { contains: keyword } },
                ],
            },
        };
    }


    let ordBy : any =  {
        dateCreated : 'desc'
    };

    if ( orderBy ){
        ordBy = {
            [`${orderBy}`]: ascOrDesc ?? 'asc'
        };
    }

    const JobPosts = await prisma.jobPost.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,
    });

   // console.log("orderBy::", ordBy);

    let total = await getCount(whereClause);

    return {results : JobPosts, total};
}


async function getCount(where: any ): Promise<number> {
  
    const count = await prisma.jobPost.count({...where });
    return count;
}



export async function getPubJobPosts(keyword?: string, orderBy? : string, 
    ascOrDesc? : string, offset: number = 0, limit: number = 10) :Promise<SearchResult> {
    
   
    let whereClause: any = {
        where: {
            datePub: {
                lte: new Date()
            },

            jobStatus : JobStatus.Published
        },
    };

    if (keyword && keyword.trim()!== '-') {
        whereClause = {
            where: {
                ...whereClause.where,
                OR: [
                    { code: { contains: keyword } },
                    { title: { contains: keyword } },
                ],
            },
        };
    }

    //console.log("wh.clu::", whereClause);

    let ordBy : any =  {
        datePub : 'desc'
    };

    if ( orderBy ){
        ordBy = {
            [`${orderBy}`]: ascOrDesc ?? 'asc'
        };
    }

    const JobPosts = await prisma.jobPost.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,
        select: {
            company: true,
            title: true,
            datePub: true,
            code: true,
            id: true, 
            location: true,
            workType : true, 
            jobCategory: true, 
            // Exclude the description field
            //description: false
        }
    });

   
    let total = await getCount(whereClause);

    return {results : JobPosts, total};
}

export async function getJobPost(id : string, userId: string) :Promise<JobPost|undefined> {
    
    let userCompany = await getUserCompany(userId);

    if ( userCompany === null) {
        return undefined;
    }

    let whereClause: any = {
        where: {
            companyId: userCompany?.id,
            id : id
        },
    };


    const JobPost = await prisma.jobPost.findUnique({
        ...whereClause
    });

    return JobPost!== null ? JobPost : undefined;
}



export async function getPubJobPost(id : string ) :Promise<JobPost|undefined> {
    
   
    let whereClause: any = {
        where: {
            datePub: {
                lte: new Date()
            },

            jobStatus : JobStatus.Published,

            id 
        },
    };
   
    const JobPost = await prisma.jobPost.findFirst({
        ...whereClause,
        select: {
            company: true,
            title: true,
            datePub: true,
            code: true,
            id: true, 
            location: true,
            workType : true, 
            jobCategory: true,
            description: true,
            jobStatus : true,  
        }
    });

   
    return JobPost!== null ? JobPost : undefined;
}



export async function deleteJobPost(userId: string, id : string ) :Promise<boolean> {

    try {

        let userCompany = await getUserCompany(userId);

        let whereClause: any = {
            where: {
                companyId: userCompany?.id,
                id : id, 
            },
        };

        //console.log("wh.clau::", whereClause);

        const deletedRow = await prisma.jobPost.delete({
            ...whereClause,
        });

        if ( deletedRow === null) return false;
        
        return deletedRow.id === id && deletedRow.companyId === userCompany?.id;

      } 
      catch (error) {
        console.error('Error deleting row:', error);
        return false;   
      }
}
