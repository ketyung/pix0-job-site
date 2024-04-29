import { getJobPostWithAppls } from "@/service"
import { useMemo, useEffect, useState } from "react"
import { formatRelativeDate } from "@/utils";

type props ={
    jobId : string, 
}

export default function JobPostApplsView({jobId}: props) {

    const [jobPost, setJobPost] = useState<any>();

    const [loading, setLoading] = useState(false);

    const fetchJob = useMemo(() => async () => {

        setLoading(true);
        let j = await getJobPostWithAppls(jobId);
        setJobPost(j);
        setLoading(false);

    },[jobId]);

    useEffect(()=>{
        fetchJob();
    },[fetchJob])

    return   <table className="table-auto w-11/12 mx-auto divide-y divide-gray-200 mt-4">
    <thead> 
      <tr>
        <td colSpan={5} className="text-left font-bold bg-gray-300 p-1 dark:bg-gray-900">
        {jobPost?.title}
        </td>
      </tr>
      <tr className="dark:bg-gray-800 bg-gray-100 border-b border-gray-300 text-xs font-bold dark:text-gray-100 text-gray-500 uppercase">
        <th className="hidden lg:inline-block text-center py-2 px-2">No.</th>
        <th className="px-1 text-left py-2">Applicant</th>
        <th className="px-1 text-left py-2">Score</th>
        <th className="px-1 text-left py-2">Reason</th>
        <th className="px-1 py-2">Date Applied</th>
      </tr>
      {
            jobPost?.application?.map((a: any, i : number )=>{

                return    <tr id={`JobApplicant_${i}`} className="hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-800 bg-gray-100 border-b border-gray-300 text-xs dark:text-gray-100 text-gray-500 uppercase">
                <td className="hidden lg:inline-block text-center py-2 px-2">{(i+1)}.</td>
                <td className="px-1 text-left py-2">{`${a.user?.firstName} ${a.user?.lastName}`}</td>
                <td className="px-1 text-left py-2">{a.score?.toFixed(2)}</td>
                <td className="px-1 text-left py-2">{a.reason}</td>
                <td className="px-6 py-2" title={new Date(a.dateCreated).toLocaleString()}>{formatRelativeDate(new Date(a.dateCreated))}</td>
              </tr>
            })
      }
    </thead>

    </table>
}