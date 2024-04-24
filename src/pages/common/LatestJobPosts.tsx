import ProfileImage from "@/components/ProfileImage";
import { JobCategorys, SearchResult, WorkType } from "@/models";
import { ntb } from "@/utils";
import { CiGlobe } from "react-icons/ci";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { TbSeeding } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import Link from "next/link";

type props ={
    jobPosts?: SearchResult , 
}

export default function LatestJobPosts ({jobPosts }: props){


    const jobCatBgColor = (jCat : any ) =>{

        let colors = ["#800", "#070", "#f70", "#a0a", "#026","#0a9", "#967"];

        let idx = JobCategorys.indexOf(jCat);

        if ( idx >=0 && idx < colors.length){

            let rtColor= colors[idx];
          
            return rtColor;
        }
        return 'black';
    }


    const workTypeIcon = (wt : any) =>{

        if ( wt === WorkType.Flexible){
            return <TbSeeding className="w-4 h-4 mr-1"/>
        }
        else if (wt === WorkType.Remote){
            return <CiGlobe className="w-4 h-4 mr-1"/>
        }else if ( wt === WorkType.InOffice){
            return <HiOutlineBuildingOffice2 className="w-4 h-4 mr-1"/>
        }

    }

    return <div className="mt-10 lg:w-3/5 w-4/5 mx-auto bg-gray-200 rounded dark:bg-gray-800">
        <div className="text-2xl my-2 ml-2">Latest Job Posts</div>      
        {jobPosts?.results?.map((j:any)=>{

            //console.log("catClas::",catCls);

            return <div key={`Job_${j.id}`} 
            className="mb-4 border-b border-gray-300 dark:border-gray-600 py-2 hover:bg-gray-300 hover:dark:bg-gray-700 p-2 rounded">
                <Link href={`/jobPost/${j.id}`} target="_blank">
                    <div className="flex">
                        <div className="w-9/12 text-xl">{j.title}</div>
                        <div className='lg:w-32 w-24 text-center lg:text-base text-xs ml-2 lg:h-8 h-6 text-gray-100 p-1 rounded'
                        style={{backgroundColor:jobCatBgColor(j.jobCategory)}}>{j.jobCategory}</div>
                    </div>
                    <div className="mt-2 flex">
                        <ProfileImage width="30px" imageUrl={j.company.logoUrl !== null ? j.company.logoUrl : undefined}  
                        alt={ntb(j.company.name)} paddingTop="4px" fontSize="12px"/>
                        <div className="w-10/12 text-left ml-2 mt-1 text-sm">{j.company.name}</div>
                    </div>
                </Link>

                {(j.workType || j.location) && 
                  <div className="mt-2 flex">
                    {j.workType && <div className="flex">{workTypeIcon(j.workType)}
                    <span className="text-xs mb-1">{j.workType}</span></div>}

                    {j.location && <div className={j.workType ? `ml-2 flex` : 'flex'}>
                        <CiLocationOn className="w-4 h-4 mr-1"/>
                        <span className="text-xs mb-1">{j.location}</span>
                    </div>}
                  </div>}
            </div>

        })}

    </div>
}