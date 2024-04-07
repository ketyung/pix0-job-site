const jwt = require('jsonwebtoken');
import { allowedUserByGid } from "@/pages/api/dbs/user";

export enum AuthType {

    EMAIL = 1, 

    GOOGLE = 2,
    
    FB = 3, 
}

export interface UserAuth {

    id: string, 

    authToken? : string, 

    authType : AuthType, 

    accountId? : string, 
}


export async function isAllowedUser ( user : UserAuth) : Promise<{ valid: boolean, userId? : string, providerAccountId? : string}> {

    if (user.authType === AuthType.GOOGLE) {

        let _AllowedUser : any =  await allowedUserByGid(user.id, user.accountId ?? "");
        _AllowedUser = {..._AllowedUser, providerAccountId : user.accountId}
       
        return _AllowedUser;
    } else {

        return  { valid: false};    
    }
    
}



export function getJwtToken(user : UserAuth ) {

    let tokenKey = process.env.JWT_TOKEN_KEY;
    
    const token = jwt.sign(
        {user : user}, 
        tokenKey,
        {
            expiresIn: "4h",
        }
    );
 
    return token;
}

export function decodeJwtToken(token? : string) : {user?: UserAuth,
    error? : string } | undefined{
   
       try {
   
           if ( token ) {
               const decodedToken = jwt.verify(token,process.env.JWT_TOKEN_KEY );
               return decodedToken === undefined ? undefined : {user : decodedToken.user };
           }
       
       }
       catch (e : any) {
   
           return { error : e.message};
       }    
       return undefined; 
   
}
   
   
   
export async function isValidJwtToken(token? : string) : Promise<{ valid: boolean, userId? : string, providerAccountId? : string }>{

    try {

        let j = decodeJwtToken(token);

        if (j !== undefined && j.user !== undefined){

            let v= await isAllowedUser(j.user);
            //console.log("j::", j, v);
            return v; 
        }
        else {

            return {valid : false }; 
        }
    
    }
    catch (e : any) {
        return {valid : false };
    }    
    

}