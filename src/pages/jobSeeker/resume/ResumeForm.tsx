import FieldLabel from "@/components/FieldLabel";
import { props } from "./SkillsetForm";
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import { useState } from "react";
import { IoDocumentTextOutline } from "react-icons/io5";
import { Button } from "pix0-core-ui";
import { BeatLoader } from "react-spinners";
import { genResume } from "@/service";

export default function ResumeForm({resumeData}:props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [genResumeText ,setGenResumeText] = useState<string>();

    const [processing, setProcessing] = useState(false);

    const generateResume = async () =>{

        if ( resumeData ){
            setProcessing(true);
    
            let txt = await genResume(resumeData);
    
            setGenResumeText(txt);

            setProcessing(false);
        }
      
    }
   
    return <div className="mt-10 text-left">
        {genResumeText !== undefined ?

        <FieldLabel title={<div className="flex"><div className="mt-5">Your Resume</div>
        <Button className="ml-2 font-bold bg-cyan-600 rounded text-gray-100 mt-4 p-1 w-20 text-center inline mb-2" 
        onClick={async (e)=>{
            e.preventDefault();
            await generateResume();
        }}
        disabled={processing}>{processing ? <BeatLoader size={10} color="#aaa"/> : <>Regenerate</>}</Button> </div>}>
        <MdEditor value={genResumeText} style={{ height: '400px' }} 
                renderHTML={text => mdParser.render(text)} onChange={(e)=>{
               
                }} view={{
                    md: true, // Set to true to display Markdown content
                    html: false, // Set to true to display rendered HTML content
                    menu: true, // Set to true to hide the toolbar by default
                }}/> 
        </FieldLabel> : 
        
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