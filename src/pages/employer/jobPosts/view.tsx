import { getJobPost } from "@/service";
import { JobPost } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { BeatLoader } from "react-spinners";


type props = {
    jobId: any, 
}

export default function View({ jobId} :props) {


    const [ jobPost, setJobPost] = useState<JobPost>();

    const [ loading, setLoading] = useState(false);

    const fetchJobPost =   useMemo(() => async () => {
        setLoading(true);
        let jp = await getJobPost(jobId);
        setJobPost(jp);
        setLoading(false);
    },[jobId]);

    useEffect(()=>{
        fetchJobPost();
    },[fetchJobPost])

    return <div className="mt-2 border border-gray-300 rounded p-2 lg:w-4/5 w-full mx-auto lg:mb-2 mb-20">

        {loading ? <BeatLoader size={10} color="#999" className="my-10 mx-auto"/>
        :
        (jobPost ? <>
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl">{jobPost?.title}</h1>
        </div>
        </> : 
        <div className="my-10 w-3/5 text-center p-2 bg-gray-300 dark:bg-gray-400 dark:text-gray-100 
        rounded mx-auto">JOB {jobId} NOT found!!!</div> )
        
        }

    </div>

}