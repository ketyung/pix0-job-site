import { getJobPostWithAppls } from "@/service"
import { useMemo, useEffect, useState } from "react"
import { formatRelativeDate } from "@/utils";
import { Button } from "pix0-core-ui";
import { analyzeAppls } from "@/service";
import { BeatLoader } from "react-spinners";

type props ={
    jobId : string, 
}

export default function JobPostApplsView({jobId}: props) {

    const [jobPost, setJobPost] = useState<any>();

    const [loading, setLoading] = useState(false);

    const [processing , setProcessing] = useState(false);

    const fetchJob = useMemo(() => async () => {

        setLoading(true);
        let j = await getJobPostWithAppls(jobId);
        setJobPost(j);
        setLoading(false);

    },[jobId]);

    useEffect(()=>{
        fetchJob();
    },[fetchJob])


    const analyzeApplicants = async () =>{

        setProcessing(true);
        await analyzeAppls(jobId);
        await fetchJob();
        setProcessing(false);
    }

    return (loading ? <BeatLoader size={8} color="#aaa" className="mx-auto my-10"/> : <table className="table-auto w-11/12 mx-auto divide-y divide-gray-200 mt-4">
    <thead> 
      <tr className="bg-gray-300 p-1 dark:bg-gray-900 p-2">
        <td vAlign="top"colSpan={3} className="text-left font-bold p-1">
        {jobPost?.title}
        </td>
        <td vAlign="top"colSpan={2} className="p-1">
          <Button disabled={processing} onClick={async (e)=>{
              e.preventDefault();
              await analyzeApplicants();
          }}
          className="rounded bg-cyan-600 text-gray-100 text-sm font-bold border border-gray-400 w-64">
            {processing ? <BeatLoader size={6} color="#aaa"/> : <>Analyze All Applicants By AI</>}
          </Button>
        </td>
      </tr>
      <tr className="dark:bg-gray-800 bg-gray-100 border-b border-gray-300 text-xs font-bold dark:text-gray-100 text-gray-500 uppercase">
        <th className="hidden lg:inline-block text-center py-2 px-2">No.</th>
        <th className="px-1 text-left py-2">Applicant</th>
        <th className="px-1 py-2">Date Applied</th>
        <th className="px-1 text-left py-2">Score</th>
        <th className="px-1 text-left py-2">Reason</th>
      </tr>
      {
            jobPost?.application?.map((a: any, i : number )=>{

                return    <tr id={`JobApplicant_${i}`} className="hover:bg-gray-300 dark:hover:bg-gray-700 dark:bg-gray-800 bg-gray-100 border-b border-gray-300 text-xs dark:text-gray-100 text-gray-500 uppercase">
                <td valign="top"className="hidden lg:inline-block text-center py-2 px-2">{(i+1)}.</td>
                <td valign="top"className="px-1 text-left py-2">{`${a.user?.firstName} ${a.user?.lastName}`}</td>
                <td valign="top"className="px-6 py-2" title={new Date(a.dateCreated).toLocaleString()}>{formatRelativeDate(new Date(a.dateCreated))}</td>
                <td valign="top"className="px-1 text-left py-2">{a.score?.toFixed(2)}</td>
                <td valign="top"className="px-1 text-left py-2" style={{width:"30%"}}>{a.scoreReason}</td>
              </tr>
            })
      }
    </thead>
    </table>)
}