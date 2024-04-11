import { UserCompany } from "@prisma/client";
import prisma from '../db';
import { isBlank } from "@/utils";
import { SearchResult } from "@/models";
import cuid from "cuid";

export async function getUserCompany(userId : string, companyId? : string  ) :Promise<UserCompany|null> {
    try {
  

        let wh : any = {
            userId : userId,
        };

        if ( companyId) {
            wh = {...wh, id: companyId};
        }
        const userCompany = await prisma.userCompany.findFirst({
          where: wh,
        });
    
        return userCompany ;
    } 
    catch (error) {
        console.error(error);
        return null;
    }
  }




export async function createCompany(userId: string,company  : UserCompany) {

    if ( isBlank(company.name)) {
        throw new Error("Title of job post must not be blank!");
    }

    try {

        const nid = cuid();

        let nComp : any = {...company, id: nid, userId : userId, dateCreated : new Date()};

        let newCompany = await prisma.userCompany.create({data: nComp});

        const nCid = newCompany.id;

        return {cuid : nCid, status : 1}; 

    }
    catch(e : any){
        throw e ;
    }
 
}


export async function updateCompany(userId: string,userCompany : UserCompany) {


   
  if ( isBlank(userCompany.name )) {
      throw new Error("Name of company must not be blank!");
  }

  try {

    
     
      let wh :any =  {
          userId : userId, 
          companyId : userCompany?.id
      };
              
      const existingUserCompany = await prisma.userCompany.findFirst({
          where: wh 
      });

      if (existingUserCompany) {
          const updatedUserCompany = await prisma.userCompany.update({
              where: wh,
              data: userCompany
          });

          
          return (updatedUserCompany.id === userCompany.id && updatedUserCompany.id === userCompany?.id);
      } else {

          throw Error('UserCompany NOT found!');
      }



  }
  catch(e : any){
      throw e ;
  }
 
}




export async function getCompanies(userId: string, keyword?: string, orderBy? : string, 
  ascOrDesc? : string, offset: number = 0, limit: number = 10) :Promise<SearchResult> {
  
    
    let whereClause: any = {
        where: {
            userId,
        },
    };

    if (keyword && keyword.trim()!== '-') {
        whereClause = {
            where: {
                userId ,
                OR: [
                    { code: { contains: keyword } },
                    { name: { contains: keyword } },
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

    const comps = await prisma.jobPost.findMany({
        ...whereClause,
        skip: offset,
        take: limit,
        orderBy: ordBy,
    });


    let total = await getCount(whereClause);

    return {results : comps, total};
}



async function getCount(where: any ): Promise<number> {
  
    const count = await prisma.userCompany.count({...where });
    return count;
}




export async function deleteCompany(userId: string, id : string ) :Promise<boolean> {

  try {

      let whereClause: any = {
          where: {
              id ,
              userId 
          },
      };

  
      const deletedRow = await prisma.userCompany.delete({
          ...whereClause,
      });

      if ( deletedRow === null) return false;
      
      return deletedRow.id === id && deletedRow.userId === userId;

    } 
    catch (error) {
      console.error('Error deleting row:', error);
      return false;   
    }
}
