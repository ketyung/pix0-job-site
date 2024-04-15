import FieldLabel from "@/components/FieldLabel"
import { JobCategorys, JobStatus, JobStatuses, WorkType, WorkTypes } from "@/models"
import { Select, Input, TextArea, Button, Checkbox } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState, useEffect } from "react";
import { JobPost, YesNo } from "@prisma/client";
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
import { CountryCodesSel } from "@/components/CountryCodesSel";
import countryCodesFromJson from '@/models/country_dial_info.json';


type props = {

   
    title? : string, 

    refresh? : () => void, 

    isEditMode? : boolean,

    editRowId? : string, 
}


export const DEFAULT_JOBPOST : JobPost= {

    id: "", 
    code : "",
    title: "",
    description: "",
    workType : WorkType.Remote,
    jobCategory :"",
    location:"",
    createdBy: "",
    salaryFrom : null,
    salaryTo : null,
    jobStatus: JobStatus.Draft, 
    datePub : null,
    applyAtExt : YesNo.N,
    applyAtUrl : null, 
    dateCreated : new Date(),
    dateUpdated : new Date(),
    companyId : "",
    
}

export default function Form({ title, isEditMode, refresh, editRowId} :props) {

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
    
    const genJobDescNow = async () =>{

        if ( jobpost.title?.trim() === ""){
            toast.error("Please enter the title of the job post first");
            return; 
        }
        setGenerating(true);
        let text = await genJobPostDesc(jobpost.title ?? "My First Job Post Description");
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

        <div className="lg:flex">
        <div className="lg:w-9/12 lg:border-r lg:border-gray-300 lg:dark:border-gray-700 pr-2">
            <div className="mt-2 mb-2 lg:flex text-left">
                <FieldLabel title="Title" className="lg:w-9/12 w-full mt-2">
                    <Input placeholder="Job Title" onChange={(e)=>{
                        setJobPost({...jobpost, title : e.target.value});
                    }} value={ntb(jobpost.title)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
                </FieldLabel>
                <FieldLabel title="Job Code" className="lg:w-3/12 w-full mt-2 lg:ml-2">
                    <Input placeholder="If Any" onChange={(e)=>{
                        setJobPost({...jobpost, code: e.target.value});
                    }} value={ntb(jobpost.code)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
                </FieldLabel>
            </div>
            <div className="mt-2 mb-2 text-left">
            <FieldLabel title={<div className="flex"><div className="mt-1">Description</div> 
            <Button className="border border-gray-300 rounded p-1 ml-2 mb-1 w-32" disabled={generating}
            onClick={async (e)=>{
                e.preventDefault();
                await genJobDescNow();
            }}>{generating ? <BeatLoader size={6} color="#888"/> : <>Generate By AI</>}</Button>
            <Button className="ml-4" onClick={(e)=>{
                e.preventDefault();
                setViewMarkDown(!viewMarkDown);  
            }}>{viewMarkDown ? <CiText  title="Change Back To Plain Text Editor" className="w-5 h-5"/> 
            : <BsMarkdown title="Edit In Mark Down Editor" className="w-5 h-5"/>}</Button>
            
            </div>} className="w-full">
                { viewMarkDown ? <MdEditor value={ntb(jobpost.description)} style={{ height: '300px' }} 
                renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                    setJobPost({...jobpost, description : e.text});
                }} view={{
                    md: true, // Set to true to display Markdown content
                    html: false, // Set to true to display rendered HTML content
                    menu: true, // Set to true to hide the toolbar by default
                }}/> : <TextArea rows={10} value={ntb(jobpost.description)} width="100%"
                    placeholder="Add a short description such as provide additional information about this jobpost"
                onChange={(e)=>{
                    setJobPost({...jobpost, description : e.target.value});
                }}/>}
            </FieldLabel>
            </div>
        </div>
        <div  className="lg:w-3/12 lg:mt-0 mt-2 lg:pl-4">
            <div className="mt-2 mb-2 text-left">
                <FieldLabel title="Status">
                    <Select value={ntb(jobpost.jobStatus)} options={[{value:"", label:"-"}, 
                    ...JobStatuses.map(i=>{
                        return {value : i, label: i}
                    })]} onChange={(e)=>{
                        let selStat = JobStatuses.filter(i=>{
                            return i === e.target.value;
                        });

                        setJobPost({...jobpost, jobStatus:selStat[0]});    
                    }}/>          
                </FieldLabel>
            </div>

            <div className="mt-2 mb-2 text-left">
                <FieldLabel title="Job Category">
                    <Select value={ntb(jobpost.jobCategory)} options={[{value:"", label:"Please Select"}, 
                    ...JobCategorys.map(i=>{
                        return {value : i, label: i}
                    })]} onChange={(e)=>{
                        let selCat = JobCategorys.filter(i=>{
                            return i === e.target.value;
                        });

                        setJobPost({...jobpost, jobCategory:selCat[0]});    
                    }}/>          
                </FieldLabel>
            </div>

            <div className="mt-2 mb-2 text-left">
                <FieldLabel title="Work Type">
                    <Select value={ntb(jobpost.workType)} options={[{value:"", label:"Please Select"}, 
                    ...WorkTypes.map(i=>{
                        return {value : i, label: i}
                    })]} onChange={(e)=>{
                        let selWt = WorkTypes.filter(i=>{
                            return i === e.target.value;
                        });
                        setJobPost({...jobpost, workType : selWt[0]});    
                    }}/>          
                </FieldLabel>
            </div> 
            <div className="mt-2 mb-2 text-left">
                <FieldLabel title="Limited To Selected Country Only">
                    <div className="flex mt-1">
                        <CountryCodesSel hideDialCode left={true} countryCodes={countryCodesFromJson}
                        icon={<div className="px-1" title="Choose A Country">...</div>}
                        setSelectedValue={(c)=>{
                            setJobPost({...jobpost, location : c.name ?? ""});
                        }}/>
                        {jobpost.location && <div className="ml-2">{jobpost.location}</div>}
                    </div>
                </FieldLabel>
            </div>


            <div className="mt-2 mb-2 text-left lg:flex">
                <FieldLabel title="Apply At External Site?">
                    <Checkbox setChecked={(e)=>{
                        
                        setJobPost({...jobpost, applyAtExt :e? 'Y' : 'N'});
                        
                    }} checked={jobpost.applyAtExt === 'Y'}/>
                </FieldLabel>  

            
            </div>
            {jobpost.applyAtExt === 'Y' && 
            <div className="mt-2 mb-2 text-left">
                <FieldLabel title="External Site URL">
                    <Input onChange={(e)=>{
                        setJobPost({...jobpost, applyAtUrl: e.target.value});
                    }} value={ntb(jobpost.applyAtUrl)} placeholder="e.g. https://linkedin.com/...."/>
                </FieldLabel> 
            </div>    
            }     
        </div>
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