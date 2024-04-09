import { UserCompany } from "@prisma/client";
import prisma from '../db';


export async function getUserCompany(userId : string ) :Promise<UserCompany|null> {
    try {
  
        
  
        const userCompany = await prisma.userCompany.findFirst({
          where: {
            userId : userId,
          },
        });
    
        
        return userCompany ;
    } 
    catch (error) {
        console.error(error);
        return null;
    }
  }