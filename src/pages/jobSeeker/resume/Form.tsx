import AboutForm from "./AboutForm";
import { useState, useEffect } from "react";
import { Button } from "pix0-core-ui";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { GrNext, GrPrevious } from "react-icons/gr";
import { Resume } from "@/models";
import SkillsetForm from "./SkillsetForm";
import WorkExpForm from "./WorkExpForm";
import ResumeForm from "./ResumeForm";

type props ={

    resume?: Resume,

    reload?: () =>void, 
}

export default function Form ({resume, reload} : props){

    const [stage, setStage] = useState(0);

    const [processing, setProcessing] = useState(false);

    const [resumeInfo, setResumeInfo] = useState<Resume>();

    useEffect(()=>{
        setResumeInfo(resume);
    },[resume])


    const moveStage = async (prev? : boolean) =>{

        if ( prev) {

            if ( stage > 0){
                setStage(stage -1);
            }
        }else {

            if ( stage === 0 ){

                if ( isBlank(resumeInfo?.data?.about)){
                    toast.error('Error! Please Provide Some Description About YourSelf');
                    return;
                }

                if ( (resumeInfo?.data?.about?.length ?? 0) > 250) {
                    toast.error('Error! Your Description Has Exceeded 250 Max Characters');
                    return;
                    
                }
            }

            if ( stage === 1 ){

                if ( (resumeInfo?.data?.skillsets?.length ?? 0)< 3 ){

                    toast.error('Please enter at least 3 skillsets');
                    return; 
                }
               
            }

         
            if ( stage < 3) {
                setStage(stage + 1);
            }
        }
    }


    return <div className="border border-gray-300 rounded p-2">
        <div className="my-2 font-bold dark:bg-gray-700 bg-gray-300 p-1 text-left">Generate CV/Resume With AI</div>
        {stage=== 0 && <AboutForm resumeData={resumeInfo?.data} setResumeData={(d)=>{

            setResumeInfo({...resumeInfo, data :d });

        }}/>}

        {stage === 1 && <SkillsetForm resumeData={resumeInfo?.data} setResumeData={(d)=>{

            setResumeInfo({...resumeInfo, data :d });
            
        }}/>}

        {stage === 2 && <WorkExpForm resumeData={resumeInfo?.data} setResumeData={(d)=>{

            setResumeInfo({...resumeInfo, data :d });

        }}/>}

        {stage === 3 && <ResumeForm resume={resumeInfo} reload={reload}/>}

        <div className="mt-8 mb-2 lg:flex text-left">

                { stage > 0 && <Button disabled={processing} className="p-1 rounded-full bg-gray-500 text-gray-100 mr-2 w-24 lg:mt-0 mt-2"
                onClick={async (e)=>{
                    e.preventDefault();
                    moveStage(true);
                }}><GrPrevious className="mr-4 inline"/> Prev</Button>}

                {stage <3  &&
                <Button disabled={processing} className="p-1 rounded-full bg-gray-500 text-gray-100 lg:ml-2 w-24 lg:mt-0 mt-2"
                onClick={async (e)=>{
                    e.preventDefault();
                    await moveStage();
                }}><>Next <GrNext className="ml-2 inline"/></></Button>}
        
        </div>

    </div>
}