import AboutForm from "./AboutForm";
import { useState } from "react";
import { Button } from "pix0-core-ui";
import { BeatLoader } from "react-spinners";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { GrNext, GrPrevious } from "react-icons/gr";
import { ResumeData } from "@/models";
import SkillsetForm from "./SkillsetForm";


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
            }

            if ( stage === 1 ){

                if ( (resumeData?.skillsets?.length ?? 0)< 3 ){

                    toast.error('Please enter at least 3 skillsets');
                }
                return; 
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

    </div>
}