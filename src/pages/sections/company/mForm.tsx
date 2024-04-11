import FieldLabel from "@/components/FieldLabel"
import { Industries } from "@/models"
import { Select, Input, TextArea, Button } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState, useEffect } from "react";
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
    industry : "",
    size : "",
    logoUrl : "", 
    dateCreated : new Date(),
    dateUpdated : new Date(),

}

export default function Form({ title, refresh, minWidth} :props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [processing, setProcessing] = useState(false);

    const [company, setCompany] = useState<UserCompany>(DEFAULT_COMPANY);

    const [generating, setGenerating] = useState(false);

    const [viewMarkDown, setViewMarkDown] = useState(false);

    const [step, setStep] = useState(1);

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

        let n = await createCompany(company, (e)=>{
            toast.error(e.message);
        });

        setProcessing(false);
        if ( n ){
            toast.info( 'New compnay profile created successfully!');
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

 

    return <div style={minWidth? {minWidth: minWidth} : undefined} 
    className="mt-2 border border-gray-300 rounded p-2 w-full lg:mb-2 mb-20">
        <div className="mt-2 mb-2 text-left p-1 font-bold">
        {title ??  "Create New Company Profile"}        
        </div>
        {step=== 1 && <><div className="mt-2 mb-2 text-left">
            <FieldLabel title="Name" className="lg:w-7/12 w-full mt-2">
                <Input placeholder="Company Name" onChange={(e)=>{
                    setCompany({...company, name : e.target.value});
                }} value={ntb(company.name)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
         
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Reg. No" className="lg:w-4/12 w-full lg:mt-2 lg:ml-2">
                <Input placeholder="Company Reg No If Any" onChange={(e)=>{
                    setCompany({...company, regNo: e.target.value});
                }} value={ntb(company.regNo)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
        </div></>}
        {step=== 1 && 
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
        </div>}
        {step=== 2 && 
        <><div className="mt-2 mb-2 text-left">
            <FieldLabel title="Industry" className="lg:w-3/5 w-full">
            <FieldLabel title="Company Size">
                <Select className="w-96" defaultValue={company.size ?? ''}
                onChange={(e)=>{
                    setCompany({...company, size: e.target.value});
                }}
                    options={[{value:"1-3",
                        label : "1-3 Employees"},
                        {value:"4-10",
                        label : "4-10 Employees"},
                        {value:"11-15",
                        label : "11-50 Employees"},
                        {value:"51-100",
                        label : "51-100 Employees"},
                        {value:"101-500",
                        label : "101-500 Employees"},
                        {value:"501-1000",
                        label : "501-1000 Employees"},
                        {value:"> 1000",
                        label : "More Than 1000 Employees"},
                    ]}
                />
            </FieldLabel>   
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

      

        <div className="mt-2 mb-2 lg:flex">
            
            <Button disabled={processing} className="border border-gray-300 w-48 flex rounded justify-center bg-gray-300 dark:bg-gray-600 py-1"
            onClick={async (e)=>{
                e.preventDefault();
                await saveCompanyNow();
            }}>
             {processing ? <BeatLoader size={8} color="#ddd"/> :  <>Create Company</>}
            </Button>
        </div>
    </div>

    
}