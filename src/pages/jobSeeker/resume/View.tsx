import MarkdownRenderer from "@/components/MarkdownRenderer";
import { BsFiletypePdf } from "react-icons/bs";
import { Button } from "pix0-core-ui";

type props = {
    resumeText? : string, 
}

export default function View({ resumeText } :props) {
   
    return <div className="mt-2 border border-gray-300 rounded p-2 w-11/12 mx-auto lg:mb-2 mb-20 shadow-xl">
        <div className="mt-2 mb-2 text-left p-1 font-bold">
            <h1 className="text-xl dark:bg-gray-700 dark:text-gray-200 bg-gray-300 p-2 rounded flex">
            Preview Of Your Resume  <Button className="ml-20 w-48 justify-center pb-1 flex border border-gray-400 rounded "
                    onClick={async (e)=>{
                        e.preventDefault();
                    }}>
                        <BsFiletypePdf className="mr-2 w-5 w-5 inline"/>
                        <span className="mt-2.5 text-xs pt-2">View As PDF</span>
                    </Button>
                        
            </h1>
            {resumeText && <MarkdownRenderer markdownContent={resumeText}/>}
        </div>
    </div>

}