import FieldLabel from "@/components/FieldLabel";
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Button } from "pix0-core-ui";
import { BeatLoader } from "react-spinners";
import { genResume, saveResume } from "@/service";
import { Resume } from "@/models";
import { toast } from "react-toastify";
import { useEffect } from "react";

type props = {

    resume? : Resume,

    reload?: () =>void, 
}

export default function ResumeForm({resume, reload}:props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [genResumeText ,setGenResumeText] = useState<string>();

    const [processing, setProcessing] = useState(false);

    const [resumeInfo, setResumeInfo] = useState<Resume>();

    const generateResume = async () =>{

        if ( resumeInfo?.data ){
            setProcessing(true);
    
            let txt = await genResume(resumeInfo?.data);
    
            setGenResumeText(txt);

            setResumeInfo({...resumeInfo, text : txt});

            setProcessing(false);
        }
      
    }


    const saveResumeNow = async () =>{

        if ( resumeInfo) {

            setProcessing(true);

            let rt = await saveResume(resumeInfo);
            setResumeInfo(rt);
        
            if(rt!== undefined){
                toast.info("Resume Saved Successfully!");
            }else {
                toast.error("Some error saving resume!");
            }
    
            setProcessing(false);

            if (reload) reload();
    
        }
       
    }

    useEffect(()=>{

        setResumeInfo(resume);
    },[resume]);
   
    return <div className="mt-10 text-left">
        {(genResumeText || resume?.text) ?

        <div><FieldLabel title={<div className="flex"><div className="mt-5">Your Resume</div>
        <Button className="ml-20 font-bold rounded border border-gray-300 mt-4 p-1 w-40 text-center inline mb-2" 
        onClick={async (e)=>{
            e.preventDefault();
            await generateResume();
        }}
        disabled={processing}>{processing ? <BeatLoader size={6} color="#aaa"/> : <>Re-generate With AI</>}</Button> </div>}>
        <MdEditor value={genResumeText ?? resume?.text} style={{ height: '400px' }} 
                renderHTML={text => mdParser.render(text)} onChange={(e)=>{
                    setResumeInfo({...resumeInfo, text: e.text});
                }} view={{
                    md: true, // Set to true to display Markdown content
                    html: false, // Set to true to display rendered HTML content
                    menu: true, // Set to true to hide the toolbar by default
                }}/> 
        </FieldLabel> 
        <Button className="font-bold bg-cyan-600 rounded text-gray-100 mt-4 p-1 w-64" onClick={async (e)=>{
                e.preventDefault();
                await saveResumeNow();
            }}
            disabled={processing}>{processing ? <BeatLoader size={10} color="#aaa"/> : <>Save Resume</>}</Button>
        </div>
        : 
        
        <div className="mt-4 text-center">
            <IoDocumentTextOutline className="my-4 w-40 h-40 mx-auto"/>
            <Button className="font-bold bg-cyan-600 rounded text-gray-100 mt-4 p-2 w-64" onClick={async (e)=>{
                e.preventDefault();
                await generateResume();
            }}
            disabled={processing}>{processing ? <BeatLoader size={10} color="#aaa"/> : <>Generate Your Resume By AI</>}</Button>
        </div>
        }
    </div>
}