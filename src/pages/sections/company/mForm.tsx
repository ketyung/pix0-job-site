import FieldLabel from "@/components/FieldLabel"
import { Industries, Industry, CompanySizes } from "@/models"
import { Select, Input, TextArea, Button, Drawer } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState } from "react";
import { singleUpload } from "@/utils/cloudUpload";
import { UserCompany } from "@prisma/client";
import { blobUrlToBase64, isBlank } from "@/utils";
import { toast } from "react-toastify";
import { ntb } from "@/utils";
import { BeatLoader } from "react-spinners";
import { BsMarkdown } from "react-icons/bs";
import { CiText } from "react-icons/ci";
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { createCompany, genCompanyDesc} from "@/service";
import { GrNext, GrPrevious } from "react-icons/gr";
import ProfileImage from "@/components/ProfileImage";
import DndUploader from "@/components/DndUploader";
import ImageCropper from "@/components/ImageCropper";
import { getSession } from "next-auth/react";
import { sha256 } from "@/utils/enc";

type props = {

   
    title? : string, 

    refresh? : () => void, 

    minWidth? : string, 
}


export const DEFAULT_COMPANY :  UserCompany = {

    id: "", 
    userId : "",
    regNo : "",
    name: "",
    description: "",
    industry : Industry.InformationTechnology,
    size : "1-3",
    logoUrl :null, 
    dateCreated : new Date(),
    dateUpdated : new Date(),

}

export default function Form({ title, refresh, minWidth} :props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [processing, setProcessing] = useState(false);

    const [company, setCompany] = useState<UserCompany>(DEFAULT_COMPANY);

    const [generating, setGenerating] = useState(false);

    const [viewMarkDown, setViewMarkDown] = useState(false);

    const [stage, setStage] = useState(0);

    const [imageCropOpen, setImageCropOpen] = useState(false);

    const [logoImageChanged, setLogoImageChanged] = useState(false);

   // const [logoDataUrlRaw, setLogoDataUrlRaw] = useState<string>();

    const saveCompanyNow = async () =>{

        if ( company === undefined){
            toast.error(`Company is undefined!`);
            return ;
            
        }

      
        if (isBlank(company?.name) ){
            toast.error(`Company Name Must NOT be blank!`);
            return ;
        }
        
        setProcessing(true);

        let newComp = {...company};

        if ( logoImageChanged && company.logoUrl!== undefined && company.logoUrl !== null) {

            //console.log("logoUrl::", company.logoUrl);
            let sess = await getSession();

            let upe= await singleUpload(company.logoUrl, `${sha256(sess?.user?.name ?? "-test-")}-`, "logos");
            if ( upe instanceof Error){
                let eMesg = `Error uploading logo: ${upe.message}`;
                toast.error(eMesg);
                setProcessing(false);
                return;
            }else {
                //newComp = { ...newComp, logoUrl : upe};
                newComp = { ...newComp, logoUrl : upe.imageUrl, logoUrlPubId: ntb(upe.imagePubId)};
            }
        }

        let n = await createCompany(newComp, (e)=>{
            toast.error(e.message);
        });

        setProcessing(false);
        if ( n ){
            toast.info( 'New company profile created successfully!');
            if ( refresh) {
                refresh();
            }
            return;
        }
    }
    
    const genCompanyDescNow = async () =>{

        if ( company.description?.trim() === ""){
            toast.error("Please enter some descripton first");
            return; 
        }
        setGenerating(true);
        let text = await genCompanyDesc(company.description ?? "");
        setCompany({...company, description : text});
        setGenerating(false);
    }

    const moveStage = async (prev? : boolean) =>{

        if ( prev) {

            if ( stage > 0){
                setStage(stage -1);
            }
        }else {

            if ( stage === 0 ){

                if ( isBlank(company.name)){
                    toast.error('Error! Company Name Must NOT be blank');
                    return;
                }
            }

            if ( stage === 3 ){

                if ( isBlank(company.description)) {
                    toast.error(`Error! Please Provide Some Description Of Your Company!`);
                    return;
                }

                await saveCompanyNow();
                return; 
            }

            if ( stage < 3) {
                setStage(stage + 1);
            }
        }
    }

 

    return <div style={minWidth? {minWidth: minWidth} : undefined} 
    className="mt-2 border border-gray-300 rounded p-2 w-full lg:mb-2 mb-20">
        <div className="mt-2 mb-2 text-left p-1 font-bold">
        {title ??  "Create New Company Profile"}        
        </div>
        {stage=== 0 && <><div className="mt-2 mb-2 text-left">
            <FieldLabel title="Name" className="lg:w-10/12 w-full mt-2">
                <Input placeholder="Company Name" onChange={(e)=>{
                    setCompany({...company, name : e.target.value});
                }} value={ntb(company.name)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
         
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Reg. No" className="lg:w-7/12 w-full lg:mt-2">
                <Input placeholder="Company Registration No (If Any)" onChange={(e)=>{
                    setCompany({...company, regNo: e.target.value});
                }} value={ntb(company.regNo)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
        </div></>}
        {stage=== 1 && 
        <div className="mt-2 mb-2 lg:flex text-left pt-2">
            <FieldLabel title="Company Logo" className="lg:w-7/12 w-full mt-2">
                <DndUploader title="Drag & Drop Profile Image Here" onDrop={(d)=>{

                         //console.log("on.drop::",d );
                         setCompany({...company, logoUrl : d});
                         setLogoImageChanged(true);
                         setImageCropOpen(true);
                    }}>
                    <ProfileImage width="100px" imageUrl={company.logoUrl}  
                    alt={ntb(company.name)} paddingTop="14px" fontSize="54px"/>
                </DndUploader>
        </FieldLabel>
        </div>}
        {stage=== 2 && 
        <><div className="mt-2 mb-2 text-left">
            <FieldLabel title="Company Size">
                <Select className="w-96" defaultValue={company.size ?? ''}
                onChange={(e)=>{
                    setCompany({...company, size: e.target.value});
                }}
                    options={CompanySizes}
                />
            </FieldLabel>   
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Industry" className="lg:w-3/5 w-full">
                <Select value={ntb(company.industry)} options={Industries.map(i=>{
                    return {value : i, label: i}
                })} onChange={(e)=>{
                    let selInd = Industries.filter(i=>{
                        return i === e.target.value;
                    });

                    setCompany({...company, industry:selInd[0]});    
                }}/>          
            </FieldLabel>
        </div></>
        }
        {stage=== 3 && 
        <div className="mt-2 mb-2 text-left">
        <FieldLabel title={<div className="flex"><div className="mt-1">Description</div> 
        <Button className="border border-gray-300 rounded p-1 ml-2 mb-1 w-32" disabled={generating}
        onClick={async (e)=>{
            e.preventDefault();
            await genCompanyDescNow();
        }}>{generating ? <BeatLoader size={6} color="#888"/> : <>Generate By AI</>}</Button>
        <Button className="ml-4" onClick={(e)=>{
            e.preventDefault();
            setViewMarkDown(!viewMarkDown);  
        }}>{viewMarkDown ? <CiText  name="Change Back To Plain Text Editor" className="w-5 h-5"/> 
        : <BsMarkdown name="Edit In Mark Down Editor" className="w-5 h-5"/>}</Button>
        
        </div>} className="lg:w-4/5 w-full">
            { viewMarkDown ? <MdEditor value={ntb(company.description)} style={{ height: '300px',width:"720px" }} 
            renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                setCompany({...company, description : e.text});
            }} view={{
                md: true, // Set to true to display Markdown content
                html: false, // Set to true to display rendered HTML content
                menu: true, // Set to true to hide the toolbar by default
            }}/> : <TextArea rows={10} value={ntb(company.description)} width="720px"
                placeholder="Add a short description such as provide additional information about this company"
            onChange={(e)=>{
                setCompany({...company, description : e.target.value});
            }}/>}
        </FieldLabel>
        </div>}
      

      

        <div className="mt-2 mb-2 lg:flex">

        { stage > 0 && <Button disabled={processing} className="p-1 rounded bg-gray-500 text-gray-100 mr-2 w-64"
                onClick={async (e)=>{
                    e.preventDefault();
                    moveStage(true);
                }}><GrPrevious className="mr-4 inline"/> Prev</Button>}

                <Button disabled={processing} className="p-1 rounded bg-gray-500 text-gray-100 w-64"
                onClick={async (e)=>{
                    e.preventDefault();
                    await moveStage();
                }}>{(stage=== 3 && processing) ? <BeatLoader size={8} color="#eee"/> : <>{stage === 3 ? 'Create Company Profile' : 'Next'} 
                <GrNext className="ml-2 inline"/></>}</Button>
          
        </div>

        <Drawer zIndex={3000} groupId="ModalProfileImageCrop" width="60%" atRight
        open={imageCropOpen} onClose={()=>{
                setImageCropOpen(false);
        }}>
            { imageCropOpen && <ImageCropper 
            imageSrc={company.logoUrl ?? ""} setCroppedImage={async (i)=>{

                let cLogoDataUrl = await blobUrlToBase64(i);
                //console.log("cLogoDataUrl::", cLogoDataUrl);

                setCompany({...company, logoUrl : cLogoDataUrl});
            }} onClose={()=>{
                setImageCropOpen(false);
            }}/>}
        </Drawer>
    </div>

    
}