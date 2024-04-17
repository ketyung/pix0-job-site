import MarkdownRenderer from "@/components/MarkdownRenderer";
import { JobStatus } from "@/models";

type props = {
    jobPost?: any, 
}

export default function View({ jobPost } :props) {



    const jobStatusView = () =>{

        return <div className={`ml-4 rounded-full px-4 text-gray-100${jobPost?.jobStatus === JobStatus.Published ? ' bg-green-900' : ' bg-red-900'}`}>
            {jobPost?.jobStatus}
        </div>
    }

    return <div className="mt-2 border border-gray-300 rounded p-2 lg:w-3/5 w-11/12 mx-auto lg:mb-2 mb-20 shadow-xl">
      
        {jobPost && <>
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl dark:bg-gray-700 dark:text-gray-200 bg-gray-300 p-2 rounded flex">
                {jobPost?.title}
                {jobStatusView()}
            </h1>
            {jobPost.description && <MarkdownRenderer markdownContent={jobPost.description}/>}
        </div>
        </> }

    </div>

}