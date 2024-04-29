import ProfileImage from "@/components/ProfileImage"
import { Button } from "pix0-core-ui"
import { ntb } from "@/utils";
import ResumeView from "../resume/ResumeView";
import { FaArrowDown } from "react-icons/fa";
import { useState } from "react";
import { hasJobApplication, createJobApplication} from "@/service";
import { useMemo, useEffect } from "react";
import { BeatLoader } from "react-spinners";
import { FaCheck } from "react-icons/fa";

type props = {
    jobPost?: any, 
}

export default function View({ jobPost } :props) {

    const [hasValidResume, setHasValidResume] = useState(false);

    const [selectedResumeId, setSelectedResumeId] = useState<string>("");

    const [loading, setLoading] = useState(false);

    const [processing, setProcessing] = useState(false);

    const [hasApplied, setHasApplied] = useState(false);

    const fetchHasApplied =  useMemo(() => async () => {
        setLoading(true);
        let hasAppl = await hasJobApplication(jobPost.id);
        setHasApplied(hasAppl);
        setLoading(false);
    }, [jobPost.id]);

    useEffect(()=>{
        fetchHasApplied()
    },[fetchHasApplied]);

    const createJobAppl = async () =>{

        setProcessing(true);
        let jobApp : any = {
            jobId : jobPost.id,
            resumeId : selectedResumeId,
        };
        await createJobApplication(jobApp);
        setProcessing(false);

        await fetchHasApplied();
    }


    return <div className="mt-2 border border-gray-300 rounded p-2 lg:w-4/5 w-11/12 mx-auto lg:mb-2 mb-20 shadow-xl">
      
        {jobPost && <>
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl dark:bg-gray-700 dark:text-gray-200 bg-gray-300 p-2 rounded flex">
                <div className="w-10/12">{jobPost?.title}</div>
            </h1>
            <h2 className="text-sm flex my-2">
            <ProfileImage width="24px" imageUrl={jobPost?.company?.logoUrl !== null ? jobPost?.company?.logoUrl : undefined}  
                alt={ntb(jobPost?.company?.name)} paddingTop="2px" fontSize="12px"/>
                <div className="w-10/12 text-left ml-2 mt-0.5 text-sm">{jobPost?.company?.name}</div>
            </h2>

            {loading ? <BeatLoader size={8} color="#888"/> :
            (hasApplied ? <div className="bg-green-700 rounded w-32 p-1 text-gray-100 text-center">
            <FaCheck className="w-5 h-5 mr-2 inline"/>Applied</div> :
            <><ResumeView setHasValidResume={setHasValidResume} setSelectedResume={setSelectedResumeId}
            title={<div className="flex bg-gray-300 dark:bg-gray-700 dark:text-gray-100 rounded p-1 pl-2">Apply With Your CV/Resume Below:
            <FaArrowDown className="ml-2 w-5 h-5 mt-0.5"/></div>}/>
            <Button disabled={!hasValidResume || processing} onClick={async (e)=>{
                e.preventDefault();
                await createJobAppl();
            }} 
            className="bg-cyan-800 disabled:bg-gray-300 text-gray-100 rounded p-1 w-48 mt-4 ml-4">
            {processing ? <BeatLoader size={6} color="#999"/> : <>Proceed To Apply</>}</Button></>
            )}
        </div>
        </> }

    </div>

}