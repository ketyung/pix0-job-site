
type props ={
    jobPosts:any [], 
}

export default function LatestJobPosts ({jobPosts }: props){

    return <div className="mt-10 lg:w-3/5">
        {jobPosts.map((j)=>{

            return <div className="mb-4">
                <div className="flex text-xl">
                    <div className="w-9/12">{j.title}</div>
                    <div className="w-2/12 text-base ml-2 bg-gray-500 text-gray-100 p-1 rounded">{j.jobCategory}</div>
                </div>
                <div className="mt-2">
                    {j.company.name}
                </div>
            </div>

        })}

    </div>
}