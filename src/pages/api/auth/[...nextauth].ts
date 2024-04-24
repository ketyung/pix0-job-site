import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { createGoogleCredential, getUserByHEmail, signInByGid, signOutUserByGid } from "../dbs/user";
import { sha256 } from "@/utils/enc";
import { encrypt } from "@/utils/enc";
//const jwt = require('jsonwebtoken');
// refer here for Google Sign In
// https://next-auth.js.org/providers/google
// https://github.com/nextauthjs/next-auth/tree/v4/packages/next-auth
// https://www.telerik.com/blogs/how-to-implement-google-authentication-nextjs-app-using-nextauth

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        })
    ],

    session: { strategy: "jwt" }, 

    callbacks: {
        
        async signIn({ account, profile}) {
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

        async session({ session, user, token }) {
            
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

        async jwt({ token, user, account, profile }) {
            
            let u = await getUserByHEmail(sha256(user?.email ?? ""));

            const newToken = u?.id!== undefined ? {...token,  
                userId: encrypt(u.id , process.env.UID_ENCRYPT_KEY ?? "xxxx"),
                userType : u?.userType, accountId: sha256(token.sub),  
            } : token;//
            
            //console.log("n.Token::", newToken);
            return newToken;
        }
    },
    
    pages: {
        signIn: '/api/auth/google', // Redirect to Google sign-in
    },
   
    events: {
        async signOut(message) {  

            let nToken : any = message.token;
            await signOutUserByGid( nToken.userId, nToken.accountId, true);
            
        },
        /*
        async signIn(message) {
            console.log("after.signeIn::", message);
        }*/
    },
});


async function createGC(profile : any , account : any) : Promise<{ status:boolean, encAccountId? : string}>{

    try {
        return await createGoogleCredential(profile, account);

    }
    catch(e: any){
        console.log("error.credting.gc::",e );
        return {status : false }; 
    }
    
}