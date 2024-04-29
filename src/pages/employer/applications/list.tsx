import { SearchResult } from "@/models"
import { useEffect, useState, useCallback, useMemo} from "react"
import { getJobPostsWithAppls} from "@/service";
import { Pagination, Input, Drawer } from "pix0-core-ui";
import { STANDARD_RES_ROWS_PER_PAGE } from "@/models";
import { CiSearch } from "react-icons/ci";
import Row from "./row";
import BeatLoader from "react-spinners/BeatLoader";
import { handleUnauthorizedError } from "@/pages/employer/jobPosts/list";
import JobPostApplsView from "./JobPostApplsView";


type props = {
    reloadCount? : number,

    onEdit?: (id? : string) => void, 
}

export default function List({reloadCount, onEdit} :props) {

    const [searchResult, setSearchResult] = useState<SearchResult>({results:[]});

    const [page, setPage] = useState(1);

    const [searchStr, setSearchStr] = useState("");

    const [loading, setLoading] = useState(false);

    const rowsPerPage = STANDARD_RES_ROWS_PER_PAGE;

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [selectedJobId, setSelectedJobId] = useState<string>();


    const openSelectedJob = (jobId: string)=> {

        setSelectedJobId(jobId);
        setDrawerOpen(true);
    }

    const refreshResult =  useMemo(() => async (searchString? : string, pageNum? : number ) => {
        setLoading(true);
        let s = await getJobPostsWithAppls(searchString ?? searchStr, '-', '-', pageNum ?? page , rowsPerPage, (e)=>{
            handleUnauthorizedError(e);
        });
        setSearchResult(s);
        setLoading(false);
    }, [searchStr, page, rowsPerPage]);

    const fetchData = useCallback(async () => {
       await refreshResult();
    }, [ refreshResult]);
    

    useEffect(()=>{
      fetchData();
    },[fetchData,reloadCount]);

    return <div className="overflow-x-auto mx-2 mb-20 text-sm">
    <div>
    <Input className="lg:w-3/5 w-full mb-2" placeholder="Enter job title or job code to search" 
      rightIcon={
        loading ? <BeatLoader className="lg:ml-4 w-10 h-4" color="#aaa" size={8}/> :
      <CiSearch className="w-5 h-5 mb-1 cursor-pointer" onClick={async ()=>{
          await refreshResult();
      }}/>}
      onChange={async (e)=>{
          setSearchStr(e.target.value);
          setPage(1);
          await refreshResult(e.target.value,1);
      }}/>
    </div>
    <table className="table-auto min-w-full divide-y divide-gray-200">
      <thead>
       
        <tr className="dark:bg-gray-800 bg-gray-100 border-b border-gray-300 text-xs font-bold dark:text-gray-100 text-gray-500 uppercase">
          <th className="hidden lg:inline-block text-center py-2 px-2">No.</th>
          <th className="px-1 text-left py-2">Job</th>
          <th className="px-1 text-left py-2">No Of Applicants</th>
          <th className="px-4 py-2">Date Published</th>
          <th className="px-1 text-left py-2 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="dark:bg-gray-800 bg-white divide-y dark:divide-gray-600 divide-gray-200">
      {
            searchResult.results?.map((r,i)=>{
                    return <Row row={r} key={`ItemRow_${i}`} index={(i+1) + ((page -1) * rowsPerPage) } refresh={refreshResult} onEdit={onEdit}
                    openSelectedJob={openSelectedJob}/>
            })
      }
      { (searchResult.results.length ?? 0) === 0 &&
      <tr>
        <td colSpan={5} className="text-center">
          <div className="mt-2 text-gray-400 p-2">NO Job Applications For The Jobs You've Posted</div>
        </td>
      </tr>
      }
      { (searchResult.results.length ?? 0) > 0 &&
      <tr>
          <td colSpan={5}>
            <Pagination currentPage={page} totalPages={searchResult.totalPages ?? 0}
            onPageChange={async (p)=>{
                setPage(p);
                await refreshResult(searchStr, p);
            }} total={searchResult.total}/>
          </td>
      </tr>}
      </tbody>
    </table>
    <Drawer zIndex={3000} width='80%' groupId="AnalyizeAiDrawer01" 
        darkBgColor='#245' lightBgColor='#eee' withCloseButton onClose={()=>{
            setDrawerOpen(false);
        }}
        atRight open={drawerOpen}>
            { (drawerOpen && selectedJobId) && <>
             <JobPostApplsView jobId={selectedJobId}/>   
            </>}
    </Drawer>
    </div>
}