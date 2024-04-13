import FieldLabel from "@/components/FieldLabel"
import { Industries, CompanySizes } from "@/models"
import { Select, Input, TextArea, Button, Drawer } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState, useEffect, useMemo } from "react";
import { UserCompany } from "@prisma/client";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { ntb } from "@/utils";
import { BeatLoader } from "react-spinners";
import { BsMarkdown } from "react-icons/bs";
import { CiText } from "react-icons/ci";
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { createCompany, updateCompany, genCompanyDesc, getCompany, detectImageNudity } from "@/service";
import ProfileImage from "@/components/ProfileImage";
import DndUploader from "@/components/DndUploader";
import ImageCropper from "@/components/ImageCropper";
import { blobUrlToBase64 } from "@/utils";
import { getSession } from "next-auth/react";
import { singleUpload } from "@/utils/cloudUpload";
import { sha256 } from "@/utils/enc";

type props = {

   
    title? : string, 

    refresh? : () => void, 

    isEditMode? : boolean,

    editRowId? : string, 

    minWidth? : string, 
}


export const DEFAULT_COMPANY :  UserCompany = {

    id: "", 
    userId : "",
    regNo : "",
    name: "",
    description: "",
    industry : "",
    size : "",
    logoUrl : "", 
    logoUrlPubId: null, 
    dateCreated : new Date(),
    dateUpdated : new Date(),

}

export default function Form({ title, isEditMode, refresh, editRowId, minWidth} :props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [processing, setProcessing] = useState(false);

    const [company, setCompany] = useState<UserCompany>(DEFAULT_COMPANY);

    const [generating, setGenerating] = useState(false);

    const [viewMarkDown, setViewMarkDown] = useState(false);

    const [imageCropOpen, setImageCropOpen] = useState(false);

    const [logoImageChanged, setLogoImageChanged] = useState(false);

    const [loading, setLoading] = useState(false);

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

            let sess = await getSession();

            try {


                await detectImageNudity(company.logoUrl);
                
                let upe= await singleUpload(company.logoUrl, 
                `${sha256(sess?.user?.name ?? "-test-")}-`, "logos", company.logoUrlPubId, true);

                if ( upe instanceof Error){
                    let eMesg = `Error uploading logo: ${upe.message}`;
                    toast.error(eMesg);
                    setProcessing(false);
                    return;
                }else {
                    newComp = { ...newComp, logoUrl : upe.imageUrl, logoUrlPubId: ntb(upe.imagePubId)};
                    setCompany(newComp);
                }
            }catch(e: any){
                toast.error(`Error uploading image : ${e.message}`);
                console.log(`Error uploading image : ${e.message}`);
                setProcessing(false);
                return;
            }
            
        }

        let n = isEditMode ? await updateCompany(newComp, (e)=>{
            toast.error(e.message);
        }) : await createCompany(newComp, (e)=>{
            toast.error(e.message);
        });

        setProcessing(false);
        if ( n ){
            toast.info(isEditMode ? 'Successfully Updated' : 'New job post created successfully!');
            if ( refresh) {
                refresh();
            }
            if ( !isEditMode) setCompany(DEFAULT_COMPANY);
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

    const refreshProfile =  useMemo(() => async () => {
        
        if ( isEditMode) {

            setLoading(true);
            try {

                let c = await getCompany(editRowId);
    
                if ( c!== undefined)
                    setCompany(c);
   
                setLoading(false);
            }
            catch(e: any){
                toast.error(e.message);
                setLoading(false);
            }
        }else {
            setCompany(DEFAULT_COMPANY);
        }
      
    }, [isEditMode, editRowId]);


    useEffect(()=>{
        refreshProfile();
    },[refreshProfile]);


    return <div style={minWidth? {minWidth: minWidth} : undefined} 
    className="mt-2 border border-gray-300 rounded p-2 w-full lg:mb-2 mb-20">
        <div className="mt-2 mb-2 text-left py-1 font-bold flex">
        <span className="mr-2">{title ?? (isEditMode ? "Edit Company" : "Add New Company")}</span>
        {loading && <BeatLoader className="ml-4 inline mt-2" size={8} color="#999"/>}       
        </div>
        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="Company Logo" className="lg:w-7/12 w-full mt-2">
                <DndUploader title="Drag & Drop Profile Image Here" onDrop={(d)=>{
                         setCompany({...company, logoUrl : d});
                         setLogoImageChanged(true);
                         setImageCropOpen(true);
                    }}>
                    <ProfileImage width="90px" imageUrl={company.logoUrl !== null ? company.logoUrl : undefined}  
                    alt={ntb(company.name)} paddingTop="12px" fontSize="34px"/>
                </DndUploader>
            </FieldLabel>
        </div>
        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="Name" className="lg:w-7/12 w-full mt-2">
                <Input placeholder="Company Name" onChange={(e)=>{
                    setCompany({...company, name : e.target.value});
                }} value={ntb(company.name)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
            <FieldLabel title="Reg. No" className="lg:w-4/12 w-full lg:mt-2 lg:ml-2">
                <Input placeholder="Company Reg No If Any" onChange={(e)=>{
                    setCompany({...company, regNo: e.target.value});
                }} value={ntb(company.regNo)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
        </div>
       
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
            { viewMarkDown ? <MdEditor value={ntb(company.description)} style={{ height: '200px', width:"720px" }} 
            renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                setCompany({...company, description : e.text});
            }} view={{
                md: true, // Set to true to display Markdown content
                html: false, // Set to true to display rendered HTML content
                menu: true, // Set to true to hide the toolbar by default
            }}/> : <TextArea rows={5} value={ntb(company.description)} width="720px"
                placeholder="Add a short description such as provide additional information about this company"
            onChange={(e)=>{
                setCompany({...company, description : e.target.value});
            }}/>}
        </FieldLabel>
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Company Size">
                <Select className="w-96" value={company.size ?? ''}
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
        </div>

      

        <div className="mt-2 mb-2 lg:flex">
            <Button disabled={processing} className="border border-gray-300 w-48 flex rounded justify-center bg-gray-300 dark:bg-gray-600 py-1"
            onClick={async (e)=>{
                e.preventDefault();
                await saveCompanyNow();

            }}>
             {processing ? <BeatLoader size={8} color="#999"/> :  <>{!isEditMode ? "Create Company" : "Update Company"}</>}
            </Button>
        </div>

        <Drawer zIndex={3000}  groupId="DrawerOfProfileImageCrop" 
        width="60%" atRight
        open={imageCropOpen} onClose={()=>{
                setImageCropOpen(false);
        }}>
            { imageCropOpen && <ImageCropper 
            imageSrc={company.logoUrl ?? ""} setCroppedImage={async (i)=>{

                let cLogoDataUrl = await blobUrlToBase64(i);
                setCompany({...company, logoUrl : cLogoDataUrl});
                
            }} onClose={()=>{
                setImageCropOpen(false);
            }}/>}
        </Drawer>
    </div>

    
}