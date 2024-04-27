import prisma from '../db';
import { SearchResult } from '@/models';
import { JobApplication } from '@prisma/client';
import { isBlank} from '@/utils';


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

    const JobApplications = await prisma.jobApplication.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,

        select: {
            job: true,
            dateCreated: true,
            resumeId: true,
            id: true,
            status: true,  
        }
    });

   
    let total = await getCount(whereClause);

    return {results : JobApplications, total};
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
