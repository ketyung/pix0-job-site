import prisma from '../db';
import { SearchResult } from '@/models';
import { JobApplication } from '@prisma/client';
import { isBlank} from '@/utils';
import { getUserCompany } from './userCompany';


export async function createJobApplication(userId: string,jobApplication : JobApplication) {

    if ( isBlank(jobApplication.jobId)) {
        throw new Error("The application must be linked to a job!");
    }

    try {

        let nJobApplication : any = {...jobApplication, userId : userId, dateCreated : new Date()};
  
        let newJobApplication = await prisma.jobApplication.create({data: nJobApplication});
  
        const nJobid = newJobApplication.id;
  
        return {cuid : nJobid, status : 1}; 

    }
    catch(e : any){
        throw e ;
    }
   
}


export async function updateJobApplication(userId: string,jobApplication : JobApplication) {


   
    if ( isBlank(jobApplication.jobId)) {
        throw new Error("The application must be linked to a job!");
    }
    try {

       
        let wh =  {
            id: jobApplication.id,
            userId 
        };
                
        const existingJobApplication = await prisma.jobApplication.findUnique({
            where: wh 
        });

        if (existingJobApplication) {
            const updatedJobApplication = await prisma.jobApplication.update({
                where: wh,
                data: jobApplication
            });

            // 'updatedContact' contains the updated contact record
            return (updatedJobApplication.id === jobApplication.id && updatedJobApplication.userId === userId);
        } else {
  
            throw Error('JobApplication NOT found!');
        }
  
  

    }
    catch(e : any){
        throw e ;
    }
   
}




export async function updateJobApplForScore(userId: string,id : string, score : number, reason : string ) {


    try {

       
        let wh =  {
            id: id,
            userId 
        };
                
        const existingJobApplication = await prisma.jobApplication.findUnique({
            where: wh 
        });

        if (existingJobApplication) {
            const updatedJobApplication = await prisma.jobApplication.update({
                where: wh,
                data: {...existingJobApplication, score: score, scoreReason :reason}
            });

            // 'updatedContact' contains the updated contact record
            return (updatedJobApplication.id === id && updatedJobApplication.userId === userId);
        } else {
  
            throw Error('JobApplication NOT found!');
        }
  
  

    }
    catch(e : any){
        throw e ;
    }
   
}




export async function getJobAppsOfCompany(userId: string, keyword?: string, orderBy? : string, 
    ascOrDesc? : string, offset: number = 0, limit: number = 10) :Promise<SearchResult> {
    
    let userCompany = await getUserCompany(userId);

    if ( userCompany === null) {
        return {results:[], total:0};
    }

    let whereClause: any = {
        where: {
            job: { companyId: userCompany.id } 
        },
    };

    if (keyword && keyword.trim()!== '-') {
        whereClause = {
            where: {
                    job: { companyId: userCompany.id },
                OR: [
                    { job: { code: { contains: keyword } } }, // Nested query for job's code
                    { job: { title: { contains: keyword } } },
                ],
            },
        };
    }

    //console.log("w.cl::", whereClause);

    let ordBy : any =  {
        dateCreated : 'desc'
    };

    if ( orderBy ){
        ordBy = {
            [`${orderBy}`]: ascOrDesc ?? 'asc'
        };
    }

    const JobApps = await prisma.jobApplication.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,

        select: {
            job: {
                select: {
                    id: true,
                    code: true,
                    title: true,
                    companyId: true, 
                }
            },
            dateCreated: true,
            resumeId: true,
            id: true,
            status: true,  
            user: {
                select :{
                    firstName: true,
                    lastName : true,
                }
            }
        }
    });

   
    let total = await getCount(whereClause);

    return {results : JobApps, total};
}



export async function getJobApplications(userId: string, keyword?: string, orderBy? : string, 
    ascOrDesc? : string, offset: number = 0, limit: number = 10) :Promise<SearchResult> {
    
  
    let whereClause: any = {
        where: {
            userId 
        },
    };

    if (keyword && keyword.trim()!== '-') {
        whereClause = {
            where: {
                userId,
                OR: [
                    { job: { code: { contains: keyword } } }, // Nested query for job's code
                    { job: { title: { contains: keyword } } },
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

    const JobApps = await prisma.jobApplication.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,

        select: {
            job: {
                select: {
                    // Specify the fields of the job relation you want to include
                    id: true,
                    code: true,
                    title: true,
                    // Add company and specify its fields
                    company: {
                        select: {
                            // Specify the fields of the company relation you want to include
                            id: true,
                            name: true, 
                            logoUrl: true, 
                        }
                    }
                }
            },
            dateCreated: true,
            resumeId: true,
            id: true,
            status: true,  
        }
    });

   
    let total = await getCount(whereClause);

    return {results : JobApps, total};
}


async function getCount(where: any ): Promise<number> {
  
    const count = await prisma.jobApplication.count({...where });
    return count;
}




export async function getJobApplication(id : string, userId: string) :Promise<JobApplication|undefined> {
    
    let whereClause: any = {
        where: {
            id,
            userId
        },
    };


    const JobApplication = await prisma.jobApplication.findUnique({
        ...whereClause
    });

    return JobApplication!== null ? JobApplication : undefined;
}




export async function hasJobApplication(jobId : string, userId: string) :Promise<JobApplication|undefined> {
    
    let whereClause: any = {
        where: {
            jobId,
            userId
        },
    };


    const JobApplication = await prisma.jobApplication.findFirst({
        ...whereClause
    });

    return JobApplication!== null ? JobApplication : undefined;
}




export async function deleteJobApplication(userId: string, id : string ) :Promise<boolean> {

    try {

        let whereClause: any = {
            where: {
                id,
                userId
            },
        };

        //console.log("wh.clau::", whereClause);

        const deletedRow = await prisma.jobApplication.delete({
            ...whereClause,
        });

        if ( deletedRow === null) return false;
        
        return deletedRow.id === id && deletedRow.userId === userId ;

      } 
      catch (error) {
        console.error('Error deleting row:', error);
        return false;   
      }
}
