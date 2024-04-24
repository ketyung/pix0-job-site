import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { createGoogleCredential, getUserByHEmail, signInByGid, signOutUserByGid } from "../dbs/user";
import { sha256 } from "@/utils/enc";
import { encrypt } from "@/utils/enc";
import { NextApiRequest, NextApiResponse } from 'next';

//const jwt = require('jsonwebtoken');
// refer here for Google Sign In
// https://next-auth.js.org/providers/google
// https://github.com/nextauthjs/next-auth/tree/v4/packages/next-auth
// https://www.telerik.com/blogs/how-to-implement-google-authentication-nextjs-app-using-nextauth
// https://next-auth.js.org/getting-started/client#additional-parameters
// https://github.com/nextauthjs/next-auth/issues/45
// https://github.com/nextauthjs/next-auth/discussions/469

const Options : any = (req? : NextApiRequest) => (

    {
        providers: [
            GoogleProvider({
                clientId: process.env.GOOGLE_CLIENT_ID ?? "",
                clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            })
        ],
    
        session: { strategy: "jwt" }, 
    
        callbacks: {
            
            async signIn({ account, profile, email } : any ) {
    
            //console.log("req::",request);
    
              if (account !== null && account.provider === "google") {
                
                let stat = await createGC(profile, account);
                 return stat.status;
              }
    
              if (account !== null && account.provider === "linkedin") {
                console.log("profile.is:::", profile, "account.is::",account);
                
    
                return false;
             }
              return false; // Do different verification for other providers that don't have `email_verified`
            },
    
            async session({ session, user, token } : any) {
                
                let sAccId= sha256(token.sub);
                let signedIn = await signInByGid(session.user?.email ?? "", sAccId);
                //console.log("signedIn::", signedIn);
                if ( signedIn.signedIn) {
                    let u = await getUserByHEmail(sha256(session.user?.email ?? ""));
                    let newSession : any = {...session, accountId : sAccId, user: {...session.user, userType : u?.userType} };  
                    return newSession
                }else {
                    return null;
                }
    
               
            },
    
            async jwt({ token, user, account, profile } : any) {
                
                let u = await getUserByHEmail(sha256(user?.email ?? ""));
    
                //console.log("tok::",token);
    
                const newToken = u?.id!== undefined ? {...token,  
                    userId: encrypt(u.id , process.env.UID_ENCRYPT_KEY ?? "xxxx"),
                    userType : u?.userType, accountId: sha256(token.sub),  
                } : token;//
                
                //console.log("n.Token::", newToken);
                return newToken;
            },
    
        },
        
        pages: {
            signIn: '/api/auth/google', // Redirect to Google sign-in
        },
       
        events: {
            async signOut(message : any) {  
    
                let nToken : any = message.token;
                await signOutUserByGid( nToken.userId, nToken.accountId, true);
                
            },
            /*
            async signIn(message) {
                console.log("after.signeIn::", message);
            }*/
        },
    }

)

export default NextAuth(Options());
//export default (req : NextApiRequest, _res : NextApiResponse) => NextAuth(Options(req));

async function createGC(profile : any , account : any) : Promise<{ status:boolean, encAccountId? : string}>{

    try {
        return await createGoogleCredential(profile, account);

    }
    catch(e: any){
        console.log("error.credting.gc::",e );
        return {status : false }; 
    }
    
}