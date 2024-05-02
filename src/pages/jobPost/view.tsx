import MarkdownRenderer from "@/components/MarkdownRenderer";
import { JobStatus } from "@/models";
import Link from "next/link";
import { BsLightningCharge } from "react-icons/bs";
import { GoLinkExternal } from "react-icons/go";
import { useMemo, useEffect, useState } from "react";
import { hasJobApplication} from "@/service";
import { FaCheck } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

type props = {
    jobPost?: any, 
}

export default function View({ jobPost } :props) {

    const [hasApplied, setHasApplied] = useState(false);

    const [loading, setLoading] = useState(false);

    const fetchHasApplied =  useMemo(() => async () => {
        setLoading(true);
        let hasAppl = await hasJobApplication(jobPost?.id);
        setHasApplied(hasAppl);
        setLoading(false);
    }, [jobPost?.id]);

    useEffect(()=>{
        fetchHasApplied()
    },[fetchHasApplied]);


    const applyView = () =>{

        return (jobPost?.jobStatus === JobStatus.Published ?
        <Link href={jobPost?.applyAtExt === 'Y' ? (jobPost?.applyAtUrl ?? "/") : `/jobSeeker/apply/${jobPost?.id}` } 
        target={jobPost?.applyAtExt === 'Y' ? '_blank' : undefined}>
        <div className={`flex rounded-2xl px-4 text-gray-100 ${jobPost?.applyAtExt === 'Y' ? 'bg-green-700' : 'bg-blue-500'} 
        w-${jobPost?.applyAtExt === 'Y' ? '96' :'48'} text-center py-1 lg:my-0 my-2`}>
        {jobPost?.applyAtExt==='Y' ? <><GoLinkExternal className="ml-14 w-5 h-5 mr-1 mt-1"/>Apply At External Site</> : 
        <><BsLightningCharge className="ml-2 w-5 h-5 mr-1 mt-1"/>Easy Apply</>}</div></Link> : <></>);
    }

    return <div className="mt-2 border border-gray-300 rounded p-2 lg:w-3/5 w-11/12 mx-auto lg:mb-2 mb-20 shadow-xl">
      
        {jobPost && <>
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl dark:bg-gray-700 dark:text-gray-200 bg-gray-300 p-2 rounded lg:flex">
                <div className="w-10/12">{jobPost?.title}</div>
                {loading ? <BeatLoader size={6} color="#bbb"/> :
                (hasApplied ? <div className="bg-green-700 rounded w-32 p-1 text-gray-100 text-center">
                <FaCheck className="w-5 h-5 mr-2 inline"/>Applied</div> : applyView())}
            </h1>
            {jobPost?.description && <MarkdownRenderer markdownContent={jobPost?.description}/>}
        </div>
        </> }

    </div>

}