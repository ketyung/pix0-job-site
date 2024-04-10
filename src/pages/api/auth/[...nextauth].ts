import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { createGoogleCredential } from "../dbs/user";
import { sha256 } from "@/utils/enc";

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

    callbacks: {
        
        async signIn({ account, profile }) {
          if (account !== null && account.provider === "google") {
             //console.log("profile.is:::", profile);
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
            //console.log("user:::", user, token, session);
            let sAccId= sha256(token.sub);
            //console.log("sAcc.id::", sAccId);
            let newSession : any = {...session, accountId : sAccId };

            //console.log("n.sess:", newSession);
            return newSession
        },
    },
    
    pages: {
        signIn: '/api/auth/google', // Redirect to Google sign-in
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