import FieldLabel from "@/components/FieldLabel"
import { JobPostTypes, JobPostType } from "@/models"
import { Select, Input, TextArea, Button } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState, useEffect } from "react";
import { JobPost } from "@prisma/client";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { createJobPost, updateJobPost, getJobPost , genJobPostDesc} from "@/service";
import { ntb } from "@/utils";
import { BeatLoader } from "react-spinners";
import { BsMarkdown } from "react-icons/bs";
import { CiText } from "react-icons/ci";
import MdEditor from 'react-markdown-editor-lite';
// import style manually
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';


type props = {

   
    title? : string, 

    fromInv? : boolean,

    refresh? : () => void, 

    isEditMode? : boolean,

    editRowId? : string, 
}


export const DEFAULT_JOBPOST : JobPost= {

    code : "",
    title: "",
    description: "",
    
    createdBy: "",
    dateCreated : new Date(),
    dateUpdated : new Date(),
    companyId : "",
    
}

export default function Form({ title, fromInv, isEditMode, refresh, editRowId} :props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [processing, setProcessing] = useState(false);

    const [jobpost, setJobPost] = useState<JobPost>(DEFAULT_JOBPOST);

    const [generating, setGenerating] = useState(false);

    const [viewMarkDown, setViewMarkDown] = useState(false);

    const saveJobPostNow = async () =>{

        if ( jobpost === undefined){
            toast.error(`JobPost is undefined!`);
            return ;
            
        }

        if (isBlank(jobpost?.title) ){
            toast.error(`Job Title Must NOT be blank!`);
            return ;
        }
        
        setProcessing(true);

        let n = isEditMode ? await updateJobPost(jobpost, (e)=>{
            toast.error(e.message);
        }) : await createJobPost(jobpost, (e)=>{
            toast.error(e.message);
        });

        setProcessing(false);
        if ( n ){
            toast.info(isEditMode ? 'Successfully Updated' : 'New job post created successfully!');
            if ( refresh) {
                refresh();
            }
            if ( !isEditMode) setJobPost(DEFAULT_JOBPOST);
            return;
        }
    }
    
    const genJobPostDescNow = async () =>{

        if ( jobpost.title?.trim() === ""){
            toast.error("Please enter the title of the job post first");
            return; 
        }
        setGenerating(true);
        let text = await genJobPostDesc(jobpost.title ?? "My First Product JobPost");
        setJobPost({...jobpost, description : text});
        setGenerating(false);
    }

    useEffect(()=>{

        if (isEditMode && editRowId) {

            getJobPost(editRowId, (e)=>{
                toast.error(e.message);
            } ).then (i=>{
                if ( i ){
                    setJobPost(i);
                }
            });
        }else {
            setJobPost(DEFAULT_JOBPOST);
        }

    },[editRowId,isEditMode]);


    return <div className="mt-2 border border-gray-300 rounded p-2 w-full lg:mb-2 mb-20">
        <div className="mt-2 mb-2 text-left p-1 font-bold">
        {title ?? (isEditMode ? "Edit JobPost" : "Add New JobPost")}        
        </div>
        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="JobPost Code" className="lg:w-1/5 w-full">
                <Input placeholder="Code" onChange={(e)=>{
                    setJobPost({...jobpost, code: e.target.value});
                }} value={ntb(jobpost.code)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
            <FieldLabel title="Name" className="lg:w-2/5 w-full mt-2 lg:mt-0 lg:ml-2">
                <Input placeholder="Name" onChange={(e)=>{
                    setJobPost({...jobpost, name : e.target.value});
                }} value={ntb(jobpost.name)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
                </FieldLabel>
        </div>
        <div className="mt-2 mb-2 text-left">
        <FieldLabel title={<div className="flex"><div className="mt-1">Description</div> 
        <Button className="border border-gray-300 rounded p-1 ml-2 mb-1 w-32" disabled={generating}
        onClick={async (e)=>{
            e.preventDefault();
            await genProdDescNow();
        }}>{generating ? <BeatLoader size={6} color="#888"/> : <>Generate By AI</>}</Button>
        <Button className="ml-4" onClick={(e)=>{
            e.preventDefault();
            setViewMarkDown(!viewMarkDown);  
        }}>{viewMarkDown ? <CiText  title="Change Back To Plain Text Editor" className="w-5 h-5"/> 
        : <BsMarkdown title="Edit In Mark Down Editor" className="w-5 h-5"/>}</Button>
        
        </div>} className="lg:w-4/5 w-full">
            { viewMarkDown ? <MdEditor value={ntb(jobpost.description)} style={{ height: '200px' }} 
            renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                setJobPost({...jobpost, description : e.text});
            }} view={{
                md: true, // Set to true to display Markdown content
                html: false, // Set to true to display rendered HTML content
                menu: true, // Set to true to hide the toolbar by default
            }}/> : <TextArea rows={5} value={ntb(jobpost.description)} 
                placeholder="Add a short description such as provide additional information about this jobpost"
            onChange={(e)=>{
                setJobPost({...jobpost, description : e.target.value});
            }}/>}
        </FieldLabel>
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="JobPost Type" className="lg:w-3/5 w-full">
                <Select value={ntb(jobpost.jobpostType)} options={JobPostTypes.map(i=>{
                    return {value : i, label: i}
                })} onChange={(e)=>{
                    let selType = JobPostTypes.filter(i=>{
                        return i === e.target.value;
                    });

                    if ( setJobPost && selType.length > 0 ) setJobPost({...jobpost, jobpostType:selType[0]});    
                }}/>          
            </FieldLabel>
        </div>

        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="Unit Price" className="lg:w-3/12 w-full">
                <Input placeholder="Unit Price" type="number" onChange={(e)=>{
                      if ( setJobPost) setJobPost({...jobpost, unitPrice :parseFloat(e.target.value)});
                }} value={jobpost?.unitPrice?.toFixed(2)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
            {fromInv &&
            <FieldLabel title="Invoice Qty" className="lg:w-3/12 w-full lg:ml-2">
                <Input placeholder="Inv Qty" type="number" onChange={(e)=>{
                     
                }} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>}
            <FieldLabel title="Qty On Hand" className={`lg:w-3/12 w-full mt-2 lg:mt-0 lg:ml-2`}>
                <Input placeholder="QOH" onChange={(e)=>{
                    setJobPost({...jobpost, qoh :parseInt(e.target.value)});
                }} value={jobpost.qoh !== null ? jobpost.qoh : ""} className="w-full" type="number" icon={<CiCircleInfo className="mb-2"/>}/>
                </FieldLabel>
        </div>

        <div className="mt-2 mb-2 lg:flex">
            <Button disabled={processing} className="border border-gray-300 w-48 flex rounded justify-center bg-gray-300 dark:bg-gray-600 py-1"
            onClick={async (e)=>{
                e.preventDefault();
                await saveJobPostNow();

            }}>
             {processing ? <BeatLoader size={8} color="#ddd"/> :  <>{!isEditMode ? "Create JobPost" : "Update JobPost"}</>}
            </Button>
        </div>
    </div>

    
}