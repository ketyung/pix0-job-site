import AboutForm from "./AboutForm";
import { useState } from "react";
import { Button } from "pix0-core-ui";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { GrNext, GrPrevious } from "react-icons/gr";
import { ResumeData } from "@/models";
import SkillsetForm from "./SkillsetForm";
import WorkExpForm from "./WorkExpForm";
import ResumeForm from "./ResumeForm";


export default function Form (){

    const [stage, setStage] = useState(0);

    const [processing, setProcessing] = useState(false);

    const [resumeData, setResumeData] = useState<ResumeData>();


    const moveStage = async (prev? : boolean) =>{

        if ( prev) {

            if ( stage > 0){
                setStage(stage -1);
            }
        }else {

            if ( stage === 0 ){

                if ( isBlank(resumeData?.about)){
                    toast.error('Error! Please Provide Some Description About YourSelf');
                    return;
                }

                if ( (resumeData?.about?.length ?? 0) > 250) {
                    toast.error('Error! Your Description Has Exceeded 250 Max Characters');
                    return;
                    
                }
            }

            if ( stage === 1 ){

                if ( (resumeData?.skillsets?.length ?? 0)< 3 ){

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
        {stage=== 0 && <AboutForm resumeData={resumeData} setResumeData={setResumeData}/>}

        {stage === 1 && <SkillsetForm resumeData={resumeData} setResumeData={setResumeData}/>}

        {stage === 2 && <WorkExpForm resumeData={resumeData} setResumeData={setResumeData}/>}

        {stage === 3 && <ResumeForm resumeData={resumeData}/>}

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