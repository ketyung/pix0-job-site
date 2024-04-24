import { JWTStorage } from "@/utils/local-storage";
import { SignInData, SearchResult, CloudParam, Resume , ResumeData} from "@/models";
import { JobPost, UserCompany, UserResume } from "@prisma/client";
import getConfig from 'next/config';

const axios = require('axios');

const UNAUTHORIZED_MESSAGE = "Unauthorized!";


export const isErrorUnathorized = (data : any) : boolean =>{

    if ( data instanceof Error){
        return data.message.startsWith(UNAUTHORIZED_MESSAGE);
    }

    return false; 
}



const obtainHeaderWithJWT = async  () =>{

      try {
  
          let jwt = JWTStorage.get();

          let hdrs = ( jwt !== null ) ? {           
              'Content-Type': 'application/json',
              'token': jwt, 
          } : undefined;
  
          return hdrs;
      }
      catch (e : any) {
  
          return undefined;
  
      }
  
  }

export async function fetchRemote(module : string, param1? : string, param2? : string, param3? : string , param4? : string,
      param5? : string , param6? : string, param7? : string ) {
  try {
    
      const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

        //console.log("print.for.testing.RestApiKey:", publicRuntimeConfig.restApiKey);

        let uri = `${process.env.NEXT_PUBLIC_API_URL}/${module}${param1 ? 
            `/${encodeURIComponent(param1)}` : ""}${param2 
            ? `/${encodeURIComponent(param2)}` : ""}${param3 
            ? `/${encodeURIComponent(param3)}` : ""}${param4 
            ? `/${encodeURIComponent(param4)}` : ""}${param5 
            ? `/${encodeURIComponent(param5)}` : ""}${param6 
            ? `/${encodeURIComponent(param6)}` : ""}${param7 
            ? `/${encodeURIComponent(param7)}` : ""}`; 
        
        let getHdr =  {
            headers : await obtainHeaderWithJWT(),
        };

      
        let response = await axios.get(uri,getHdr);
       
        const data = response.data;
        return data; 
  } 
  catch (error) {
        console.error('Error fetching API:', error);
        throw error; 
  }
}


export async function postToRemote (data : any,module : string,
param1? : string, param2? : string, param3? : string , param4? : string  ) {
      try {

            
            let uri = `${process.env.NEXT_PUBLIC_API_URL}/${module}${param1 ? 
            `/${encodeURIComponent(param1)}` : ""}${param2 
            ? `/${encodeURIComponent(param2)}` : ""}${param3 
            ? `/${encodeURIComponent(param3)}` : ""}${param4 
            ? `/${encodeURIComponent(param4)}` : ""}`; 
        
            let headers =  await obtainHeaderWithJWT();

            const response = await axios.post(uri,{data},{headers});
            
          
            if ( response.status === 200){

                  return response.data;
            }
            else {
                  throw new Error(`Error :${response.status}`);
            }

            
      } 
      catch (error) {
            throw error;
      }
}



export async function verifyLogin(onError? : (e : Error)=>void ) {

      try {

            let data = await fetchRemote("user","verify");

            return ( data.status === 1);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return false; 

      }

}





export async function userSignInByGid (signInData : SignInData, 
      onError? : (e : Error)=>void, onMessage? : (message : string) => void  ){

      try {
           
            let data = await postToRemote(signInData, "user", "signInByGid");

            //console.log("jwt.data::", data);
            JWTStorage.set(data.jwt);

            if ( onMessage )
                  onMessage(data.message);

            return ( data.status === 1);

      }catch(err : any) {

           // console.log("errorOnSignedInGid::", err, signInData);

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}



export async function deleteRemote(module: string, param1?: string, param2?: string, param3?: string, param4?: string) {
      try {
          let uri = `${process.env.NEXT_PUBLIC_API_URL}/${module}${param1 ? 
              `/${encodeURIComponent(param1)}` : ""}${param2 
              ? `/${encodeURIComponent(param2)}` : ""}${param3 
              ? `/${encodeURIComponent(param3)}` : ""}${param4 
              ? `/${encodeURIComponent(param4)}` : ""}`;
  
          let headers = await obtainHeaderWithJWT();
  
          let response = await axios.delete(uri, { headers });
          const data = response.data;
          return data;
      } catch (error) {
          console.error('Error fetching API@onDelete:', error);
          throw error;
      }
}




export async function deleteContact(id: string, onError? : (e : Error)=>void ) {

      try {

            let data = await deleteRemote("contact",id);

            return ( data.status === 1 && data.deleted);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return false; 

      }

}


export async function uploadBase64File(base64Data : string ) {
      try {
            const response = await axios.post('/api/upload/handler', { base64Data });
            console.log('File uploaded successfully:', response.data.filename);
            return response.data.filename; // Return the filename if needed
      } 
      catch (error : any ) {
            console.error('Error uploading file:', error.response.data.error);
            throw new Error('Error uploading file');
      }
}
    



export async function createJobPost (jobpost : JobPost, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(jobpost, "jobPost", "create");

            return ( data.status === 1);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}


export async function updateJobPost (jobpost : JobPost, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(jobpost, "jobPost", "update");

            return ( data.status === 1);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}


export async function checkIfJobPostInfoProper (jobpost : JobPost, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(jobpost, "gai", "checkJobPostInfo");

            //console.log("data:::", data);

            return ( data.status === 1 && data.text.trim() === "yes");

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }else {

                        throw err;
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            } else {
                  throw err;
            }
            return false; 

      }
}


export async function getJobPosts(
      searchStr? : string,
      orderBy? : string,
      ascOrDesc? : string, 
      page? : number, 
      rowsPerPage? : number,
      onError? : (e : Error)=>void ) : Promise<SearchResult> {

      try {

            let searchString = searchStr === '' ? '-' : searchStr;
            let data = await fetchRemote("jobPost","search", searchString,
            orderBy, ascOrDesc, 
            page ? `${page}` : undefined, 
            rowsPerPage ? `${rowsPerPage}` : undefined);

            return data.data;

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return {results:[]}; 

      }

}



export async function getJobPost(id : string, onError? : (e : Error)=>void ) : Promise<JobPost|undefined>{

      try {

            let res = await fetchRemote("jobPost",id);

            if( res.status === 1){
                  return res.data;
            }else {
                  if ( onError) {
                        onError(new Error('Contact NOT found!'));
                  }
                  return undefined;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return undefined; 

      }

}




export async function getPubJobPost(id : string, onError? : (e : Error)=>void ) : Promise<JobPost|undefined>{

      try {

            let res = await fetchRemote("jobPost","pubJobPost",id);

            if( res.status === 1){
                  return res.data;
            }else {
                  if ( onError) {
                        onError(new Error('Contact NOT found!'));
                  }
                  return undefined;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return undefined; 

      }
}

export async function deleteJobPost(id: string, onError? : (e : Error)=>void ) {

      try {

            let data = await deleteRemote("jobPost",id);

            return ( data.status === 1 && data.deleted);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return false; 

      }

}


export async function getPubJobPosts(
      searchStr? : string,
      orderBy? : string,
      ascOrDesc? : string, 
      page? : number, 
      rowsPerPage? : number,
      onError? : (e : Error)=>void ) : Promise<SearchResult> {

      try {

            let searchString = searchStr === '' ? '-' : searchStr;
            let data = await fetchRemote("jobPost","pubJobPosts", searchString,
            orderBy, ascOrDesc, 
            page ? `${page}` : undefined, 
            rowsPerPage ? `${rowsPerPage}` : undefined);

            return data.data;

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return {results:[]}; 

      }

}

export async function genJobPostDesc (jobpostTitle : string ){

      try {

            let data = await fetchRemote ("gai", "genJobDesc", jobpostTitle);

            return ( data.text );

      }catch(err : any) {
            return undefined; 

      }
}


export async function genResume (resumeData: ResumeData){

      try {

            let data = await postToRemote(resumeData, "gai", "generateResume");

            return ( data.status === 1 ) ? data.text : undefined;


      }catch(err : any) {
            return undefined; 

      }
}



export async function createCompany (company : UserCompany, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(company, "company", "create");

            return ( data.status === 1);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}


export async function updateCompany (company : UserCompany, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(company, "company", "update");

            return ( data.status === 1);

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}



export async function getCompany(id? : string, onError? : (e : Error)=>void ) : Promise<UserCompany|undefined>{

      try {
            
            let res = await fetchRemote("company", "companyProfile", id);

             if( res.status === 1){
                  return res.data;
            }else {
                  if ( onError) {
                        onError(new Error('Contact NOT found!'));
                  }
                  return undefined;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            console.log("getC.err:",err);

            return undefined; 

      }

}



export async function hasCompany(onError? : (e : Error)=>void ) : Promise<boolean>{

      try {

            let res = await fetchRemote("company","hasCompany");

            if( res.status === 1){
                  return res.hasCompany ;
            }else {
                  if ( onError) {
                        onError(new Error('Company NOT found!'));
                  }
                  return false;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            //console.log("err::", err.response.data);
            return false; 

      }

}
export async function genCompanyDesc (description : string ){

      try {

            let data = await fetchRemote ("gai", "genCompDesc", description);

            return ( data.text );

      }catch(err : any) {
            return undefined; 

      }
}



export async function getCloudParams( onError? : (e : Error)=>void ) : Promise<CloudParam[]|undefined>{

      try {

            let res = await fetchRemote("cprm","getCloudParams");

            if( res.status === 1){
                  return res.data;
            }else {
                  if ( onError) {
                        onError(new Error('Params NOT found!'));
                  }
                  return undefined;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            return undefined; 

      }

}

export async function checkIfImageIsSFW (imageData : any ) {

      try {

            let data = await postToRemote(imageData, "gai", "checkIfImageIsSFW");
            
            const b= ( data.status === 1 && (data.text.trim().toUpperCase() === "NO" || data.text.trim().toUpperCase().startsWith("NO")));

            //console.log("checkImg::", data, b);
            return b; 

      }
      catch(e: any){

            return false; 
      }
}




export async function saveResume (resume : Resume, onError? : (e : Error)=>void ){

      try {

            let data = await postToRemote(resume, "userResume", "save");

            if ( data.status === 1)
                  return data.data;
            else 
                  return undefined;

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.response.data.error}`));
                  }
            }

            if ( onError) {
                  onError(new Error(`${err.response.data.error}`));
            }
            return false; 

      }
}




export async function getOwnResume(onError? : (e : Error)=>void ) : Promise<UserResume|undefined>{

      try {
            
            let res = await fetchRemote("userResume", "resume");

             if( res.status === 1){
                  return res.data;
            }else {
                  if ( onError) {
                        onError(new Error('Contact NOT found!'));
                  }
                  return undefined;
            }

      }catch(err : any) {

            if(err.response && err.response.status === 401){

                  if ( onError) {
                        onError(new Error(`${UNAUTHORIZED_MESSAGE} ${err.message}`));
                  }
            }

            console.log("getC.err:",err);

            return undefined; 

      }

}