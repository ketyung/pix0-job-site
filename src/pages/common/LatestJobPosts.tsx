import ProfileImage from "@/components/ProfileImage";
import { ntb } from "@/utils";

type props ={
    jobPosts:any , 
}

export default function LatestJobPosts ({jobPosts }: props){

    return <div className="mt-10 lg:w-3/5 w-4/5 mx-auto">
        {jobPosts.results.map((j:any)=>{

            return <div className="mb-4 border-b border-gray-300 dark:border-gray-600 py-2 hover:bg-yellow-100 hover:dark:bg-gray-700 p-2">
                <div className="flex">
                    <div className="w-9/12 text-2xl">{j.title}</div>
                    <div className="lg:w-32 w-24 text-center lg:text-base text-xs ml-2 lg:h-8 h-6 bg-gray-500 text-gray-100 p-1 rounded">{j.jobCategory}</div>
                </div>
                <div className="mt-2 flex">
                    <ProfileImage width="30px" imageUrl={j.company.logoUrl !== null ? j.company.logoUrl : undefined}  
                    alt={ntb(j.company.name)} paddingTop="4px" fontSize="12px"/>
                    <div className="w-10/12 text-left ml-2 mt-1">{j.company.name}</div>
                </div>
            </div>

        })}

    </div>
}