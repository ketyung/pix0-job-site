import { Resume } from "@/models";
import prisma from '../db';
import cuid from "cuid";


export async function saveResume(userId: string,resume : Resume) :Promise<Resume> {


    try {

        const existingRecord = await prisma.userResume.findFirst({
            where: {
              id: resume.id,
              userId 
            }
          });
        
        if (existingRecord) {
                // Update the existing record
                await prisma.userResume.update({
                    where: {
                        id: existingRecord.id,
                        userId 
                    },
                    data: {id:existingRecord.id, userId: userId, resumeData : resume.data ? JSON.stringify(resume.data) : "", resumeText : resume.text}
                });

                return {...resume, id: existingRecord.id, userId: userId};
          } 
          else {
                // Create a new record
                let nid = cuid();
                await prisma.userResume.create({
                    data: {
                        id: nid,
                        userId,
                        resumeData : resume.data ? JSON.stringify(resume.data) : "", 
                        resumeText : resume.text ?? ""
                    }
                });

                return {...resume, id: nid, userId: userId};
          }

    }
    catch(e : any){
        throw e ;
    }
 
}


export async function getUserResume(userId : string) :Promise<Resume|null> {
    try {
  
        const resume = await prisma.userResume.findFirst({
            where: {
                userId 
            }
        });
    
        return {id: resume?.id, data: JSON.parse(resume?.resumeData ?? ""), text: resume?.resumeText };
    } 
    catch (error) {
        console.error(error);
        return null;
    }
}
  
  
  