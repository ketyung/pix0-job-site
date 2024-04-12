import { CloudParam } from "@/models";
import { randomInt, shortenStringTo } from "../";
import { getCloudParams } from "@/service";
const CryptoJS = require('crypto-js');

export const singleUpload = async ( data_url : string,
    creator : string, subFolder? : string ): Promise<string|Error> =>{

    let prms =  await getCloudParamsFss(); //getAllCloudParams();
    //console.log("prms::", prms);
    if ( prms ){

        let prm = prms[ randomInt(0, prms.length -1)];
      
        return await singleUploadNow({data_url : data_url, cloudName : prm.name, api: prm.api_key,creator: creator,
        upload_folder : `${prm.upload_folder}${subFolder ? `/${subFolder}` : ''}`, secret_key : prm.secret});
    }
    else {

        return new Error("Undefined cloud params!");
    }
}



const singleUploadNow = async (param : {data_url : string, cloudName? : string, api? :string,
    creator? : string,  upload_folder? : string, secret_key? : string }) : Promise<string|Error>=>{

    try {

        const signData = shaSignature( param.api ?? "",
        param.upload_folder ?? "",    
        `${shortenStringTo(param.creator ?? "", 16, "")}`, 
        param.creator ?? "", 
        param.secret_key ?? "");
    

        var url = process.env.NEXT_PUBLIC_CLOUD_UPLOAD_URL;

        if ( url === undefined ){
            return new Error('Undefined cloud upload URL!!');
        }

        url = url.replace(":cloud_name",param.cloudName ?? "");

        //console.log("url::", url);

        var fd = new FormData();
        fd.append("api_key", signData.api_key );
        fd.append("folder", signData.folder);
        fd.append('public_id', signData.public_id);
        fd.append('tags', signData.tags ); // Optional - add tag for image admin in Cloudinary
        fd.append("timestamp", signData.timestamp);
       
        fd.append("signature", signData.signature);
        fd.append('file', param.data_url);
       
       
        let response = await fetch(url, {
            method: "POST",
            body: fd
        });

        if (response.status === 200 ){

            let txt = await response.json();
          
            return txt.secure_url;
        }
        else {

            let err = new Error(`Error ${response.status} : ${(await response.text())}`);
            return err;
        }
    }
    catch(e : any ) {

        let err = new Error(`Error : ${e.message}`);
           
        return err; 
    }
}


// refer here 
const shaSignature = ( api_key : string, folder : string ,pub_id : string, tags: string, secret_key : string ) =>{

    let tt = Date.now();
    let timestamp = Math.floor( tt / 1000);

    let pubid = `${pub_id}${tt}`;

    let s = `folder=${folder}&public_id=${pubid}&tags=${tags}&timestamp=${timestamp}${secret_key}`;

    let ss = CryptoJS.SHA1(s).toString();

    let rt = {timestamp : `${timestamp}`, signature : ss, public_id : pubid, tags : tags,
    folder : folder , api_key : api_key};
    
    return rt; 
}



const getCloudParamsFss = async () : Promise<CloudParam[]|undefined> =>{

    try {
        return await getCloudParams();
    }catch(e :any){

        return undefined;
    }
}

// refer here https://github.com/ketyung/pix0
/*
const getAllCloudParams = () : CloudParam[]|undefined =>{

    let params = process.env.NEXT_PUBLIC_CLOUDINARY_PARAMS;
    if ( params ){

        let prms = JSON.parse(params) as CloudParam[];
        return prms;
    }
}*/