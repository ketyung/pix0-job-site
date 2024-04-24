import { sha256, encrypt, decrypt } from '@/utils/enc';
import prisma from '../db';
import { User, UserType } from "@prisma/client";
import cuid from "cuid";

export const DEFAULT_ENC_KEY = "zGx63636xx38xsHkad";



export async function signInByGid(email : string, accId : string   ) :
Promise<{authToken? : string, signedIn: boolean, eUserId? : string, accountId? : string  }> {
    try {
        const user = await prisma.user.findUnique({
          where: {
            hEmail : sha256(email),
          },
        });
    
       // console.log("sign.in::", email, accId);
        if ( user !== undefined) {

            let wClau : any = {
                userId : user?.id, 
                accountId : accId, 
            };

            const gCred = await prisma.googleCredential.findFirst({
                where: wClau,
            });

            //console.log("gCred::[]", wClau);
           
            if (gCred!== null && gCred.userId === user?.id  && gCred.accountId === accId){

                let eUserId = encrypt(user?.id ?? "", process.env.UID_ENCRYPT_KEY ?? DEFAULT_ENC_KEY);
                let rt= {signedIn : true, accountId : gCred.accountId, eUserId : eUserId };

                //console.log("rt::",rt);
                return rt; 
            } else {

                return {signedIn : false};
            }
        }

        return {signedIn : false};
    } 
    catch (error) {
        console.error(error);
        return {signedIn : false};
    }
}



export async function signOutUserByGid(uid  : string , accountId : string, toDecryptUid?: boolean  ) :
Promise<{ signedOut : boolean, errorMessage? : string  }> {
    try {

        let dUserId = toDecryptUid? decrypt(uid, process.env.UID_ENCRYPT_KEY ?? DEFAULT_ENC_KEY) : uid;


        const user = await prisma.user.findUnique({
          where: {
            id: dUserId,
          },
        });
    
        if ( user !== undefined) {


            let whClau : any = {
              userId : user?.id, 
              accountId : accountId 
            };

            const gCred = await prisma.googleCredential.findFirst({
                where: whClau,
            });

            if ( gCred === undefined || gCred === null) return {signedOut : false};

            //console.log("signOutGid.whClau::", whClau);
            
            const updData : any = {
                accountId :"-",
                tokenId : "-" ,
            };
    
            let upd = await prisma.googleCredential.update({
                where: {...whClau, id : gCred.id}, 
                data: updData,
            });

            return { signedOut : upd.userId === dUserId };

        }

        return {signedOut : false};
    } 
    catch (error : any ) {
        console.error(error);
        return {signedOut : false, errorMessage : error.message };
    }
}

export const userExistsByEmail = async (email: string): Promise<boolean> => {
  // Find a user with the given email or phoneNumber
  const user = await prisma.user.findFirst({
    where: {
      hEmail : sha256(email) 
    },
  });

  // If a user is found, return true, otherwise return false
  return !!user;
};


export const userExistsByPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
    // Find a user with the given email or phoneNumber
    const user = await prisma.user.findFirst({
      where: {
        hPhoneNumber : sha256(phoneNumber) 
      },
    });
  
    // If a user is found, return true, otherwise return false
    return !!user;
};



export async function allowedUserByGid(userId : string, accountId : string  ) :Promise<{ valid: boolean, userId? : string}> {
    try {

        let realUserId = decrypt(userId, process.env.UID_ENCRYPT_KEY ?? DEFAULT_ENC_KEY);
        let whClu =  {
            userId : realUserId,
            accountId : accountId, 
        };

       // console.log("ver.by.gid::", whClu);

        const gCred = await prisma.googleCredential.findFirst({
          where:whClu,
        });
    
        return { valid :gCred?.userId === realUserId, userId : gCred?.userId};
    } 
    catch (error) {
        console.error(error);
        return {valid :false} ; 
    }
}


export async function updateUser (user : User) {
    try {

        let wh =  {
            id: user.id 
        };
                
        const existingUser = await prisma.user.findUnique({
            where: wh 
        });

        if (existingUser ) {
            const updatedUser = await prisma.user.update({
                where: wh,
                data: user 
            });

            // 'updatedContact' contains the updated contact record
            return (updatedUser.id === user.id );
        } 
        else {
            throw Error('User NOT found!');
        }
  }
  catch(e : any){
      throw e ;
  }
}


export async function getUser(userId : string, toDecryptInfo?: boolean ) :Promise<User|null> {
  try {

    
      let user = await prisma.user.findUnique({
        where: {
          id : userId,
        },
      });

      if (user!== null && toDecryptInfo) {

          let email = decrypt( user.email, process.env.EM_ENCRYPT_KEY ?? DEFAULT_ENC_KEY);
          let phone = decrypt( user.phoneNumber, process.env.TEL_ENCRYPT_KEY ?? DEFAULT_ENC_KEY);
          user = {...user, email: email, phoneNumber : phone};

      }
  
      return user ;
  } 
  catch (error) {
      console.error(error);
      return null;
  }
}





export async function getUserByHEmail(hEmail : string ) :Promise<User|null> {
  try {

    
      const user = await prisma.user.findUnique({
        where: {
          hEmail ,
        },
      });
  
      return user ;
  } 
  catch (error) {
      console.error(error);
      return null;
  }
}




export async function hasLinkedGoogleCredential(userEmail : string ) :Promise<User|null> {
  try {

    
      const user = await prisma.user.findUnique({
        where: {
          hEmail : sha256(userEmail),
        },

        include: {
            GoogleCredential: true
        },
      });
  
      return user ;
  } 
  catch (error) {
      console.error(error);
      return null;
  }
}



async function createUserFromGoogleProfile(data : any,userType? : UserType) {

    let user : any = { email : data.email ? encrypt( data.email, process.env.EM_ENCRYPT_KEY ?? DEFAULT_ENC_KEY) : null , 
    phoneNumber : `Phone-${cuid()}`,title : data.title ?? "Mr", firstName : data.given_name ?? "", lastName : data.family_name ?? "" , 
    hEmail :  data.email ? sha256(data.email) : null, hPhoneNumber : `hPhone-${cuid()}`, userType : userType ?? UserType.HiringManager};

    const newUser = await prisma.user.create({ data : user});

    return newUser;
}

export async function createGoogleCredential(profile : any, account : any ,userType? : UserType ) :Promise<{ status:boolean, encAccountId? : string}>  {

    let user : any = await prisma.user.findUnique({
        where: {
          hEmail : sha256(profile.email),
        },

        include: {
            GoogleCredential: true
        },
    });

    if ( user === null) {
        user = await createUserFromGoogleProfile(profile, userType);
    } else {

        if ( user.userType !== userType && user.userType !== UserType.Both) {
              await updateUser({...user, userType : UserType.Both, GoogleCredential : undefined});
        }
    }

    //console.log("acc.expiresAt::", account.expires_at);
    let ecTokenId = encrypt(account.access_token, process.env.GC_ENCRYPT_KEY ?? "xxxxxx90x");
    let ecAccId = sha256(account.providerAccountId); //encrypt( account.providerAccountId, process.env.GID_ENCRYPT_KEY ?? "xxxxxx90x");
  
    if (user?.GoogleCredential === null || (user?.GoogleCredential?.length ?? 0) === 0) {

       const cg : any = {
            userId : user?.id,
            tokenId: ecTokenId,
            accountId : ecAccId,
            expiresAt: new Date(account.expires_at * 1000),
        };

     
        //console.log("ecTokenId::", ecTokenId,"len::", ecTokenId.length, account.access_token.length, "cg:::", cg);
     
        await prisma.googleCredential.create({
            data: cg,
        });

    }else {

        let whClau : any = {
          userId : user?.id, 
          id : user?.GoogleCredential[0].id 
        };
        
        const updData : any = {
            tokenId: ecTokenId,
            accountId : ecAccId,
            expiresAt: new Date(account.expires_at * 1000),
        };

        await prisma.googleCredential.update({
            where: whClau, 
            data: updData,
        });
    }

    return {status : true, encAccountId : ecAccId}; 
}