import FieldLabel from "@/components/FieldLabel"
import { Industries } from "@/models"
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
import { createCompany, updateCompany, genCompanyDesc, getCompany } from "@/service";
import ProfileImage from "@/components/ProfileImage";
import DndUploader from "@/components/DndUploader";
import ImageCropper from "@/components/ImageCropper";

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

        let n = isEditMode ? await updateCompany(company, (e)=>{
            toast.error(e.message);
        }) : await createCompany(company, (e)=>{
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

            console.log("c::isEdm::", isEditMode);
            try {

                let c = await getCompany(editRowId);
                console.log("c::",c, isEditMode);
    
                if ( c!== undefined)
                    setCompany(c);
        
            }
            catch(e: any){
                toast.error(e.message);
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
        <div className="mt-2 mb-2 text-left p-1 font-bold">
        {title ?? (isEditMode ? "Edit Company" : "Add New Company")}        
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
            { viewMarkDown ? <MdEditor value={ntb(company.description)} style={{ height: '300px' }} 
            renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                setCompany({...company, description : e.text});
            }} view={{
                md: true, // Set to true to display Markdown content
                html: false, // Set to true to display rendered HTML content
                menu: true, // Set to true to hide the toolbar by default
            }}/> : <TextArea rows={5} value={ntb(company.description)} 
                placeholder="Add a short description such as provide additional information about this company"
            onChange={(e)=>{
                setCompany({...company, description : e.target.value});
            }}/>}
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
             {processing ? <BeatLoader size={8} color="#ddd"/> :  <>{!isEditMode ? "Create Company" : "Update Company"}</>}
            </Button>
        </div>

        <Drawer zIndex={3000}  groupId="DrawerOfProfileImageCrop" 
        width="60%" atRight
        open={imageCropOpen} onClose={()=>{
                setImageCropOpen(false);
        }}>
            { imageCropOpen && <ImageCropper 
            imageSrc={company.logoUrl ?? ""} setCroppedImage={(i)=>{
                setCompany({...company, logoUrl : i});
            }} onClose={()=>{
                setImageCropOpen(false);
            }}/>}
        </Drawer>
    </div>

    
}