import ProfileImage from "@/components/ProfileImage"
import { Button } from "pix0-core-ui"
import { ntb } from "@/utils";
import ResumeView from "../resume/ResumeView";
import { FaArrowDown } from "react-icons/fa";

type props = {
    jobPost?: any, 
}

export default function View({ jobPost } :props) {


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
            <ResumeView title={<div className="flex bg-gray-300 dark:bg-gray-700 dark:text-gray-100 rounded p-1 pl-2">Apply With Your CV/Resume Below:
            <FaArrowDown className="ml-2 w-5 h-5 mt-0.5"/></div>}/>
            <Button className="bg-cyan-800 text-gray-100 rounded p-1 w-48 mt-4 ml-4">Proceed To Apply</Button>
        </div>
        </> }

    </div>

}