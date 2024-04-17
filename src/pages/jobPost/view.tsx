import MarkdownRenderer from "@/components/MarkdownRenderer";
import { JobStatus } from "@/models";
import Link from "next/link";
import { BsLightningCharge } from "react-icons/bs";
import { GoLinkExternal } from "react-icons/go";

type props = {
    jobPost?: any, 
}

export default function View({ jobPost } :props) {



    const applyView = () =>{

        return (jobPost?.jobStatus === JobStatus.Published ?
        <Link href={jobPost.applyAtExt === 'Y' ? (jobPost.applyAtUrl ?? "/") : "/" } 
        target="_blank"><div className={`flex rounded-2xl px-4 text-gray-100 bg-${jobPost.applyAtExt === 'Y' ? 'orange' : 'blue'}-500 
        w-${jobPost.applyAtExt === 'Y' ? '96' :'48'} text-center py-1`}>
        {jobPost.applyAtExt==='Y' ? <><GoLinkExternal className="ml-14 w-5 h-5 mr-1 mt-1"/>Apply At External Site</> : <><BsLightningCharge className="ml-2 w-5 h-5 mr-1 mt-1"/>Easy Apply</>}</div></Link> : <></>);
    }

    return <div className="mt-2 border border-gray-300 rounded p-2 lg:w-3/5 w-11/12 mx-auto lg:mb-2 mb-20 shadow-xl">
      
        {jobPost && <>
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl dark:bg-gray-700 dark:text-gray-200 bg-gray-300 p-2 rounded flex">
                <div className="w-10/12">{jobPost?.title}</div>
                {applyView()}
            </h1>
            {jobPost.description && <MarkdownRenderer markdownContent={jobPost.description}/>}
        </div>
        </> }

    </div>

}