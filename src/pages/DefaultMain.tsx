import FieldLabel from "@/components/FieldLabel";
import { Input } from "pix0-core-ui";
import LatestJobPosts from "./common/LatestJobPosts";
import { getPubJobPosts } from "@/service";
import { useState, useMemo, useEffect } from "react";
import { SearchResult } from "@/models";

const DefaultMain = (data?: any ) =>{


    const [jobPosts, setJobPosts] = useState<SearchResult>(data);

    const [searchStr, setSearchStr] = useState("");

    const [pageNum, setPageNum] = useState(1);

    const fetchJobPosts = async () =>{
        let res = await getPubJobPosts(searchStr,"-","-",pageNum);

        if (pageNum === 1){
            setJobPosts(res);
        }else {
            setJobPosts({...jobPosts, page: res.page, results : [...jobPosts.results, ...res.results]});
        }
    }

    const searchJobPosts =  useMemo(() => async () => {
        await fetchJobPosts();
    }, [searchStr, pageNum]);

    useEffect(()=>{
        searchJobPosts();
    },[searchJobPosts])

    return <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 h-full pt-4 pb-4">
        <section id="home">
            <div className="rounded bg-gray-300 mx-auto lg:w-3/5 w-11/12 dark:bg-gray-800 lg:flex flex-col lg:flex-row my-4 p-2">
                <div className='text-left min-w-32'>
                <h1 className='header-text'>Welcome to Pix0 Job Site.</h1>
                <p className='norm-text'>Here you can find great jobs, whether you intend to work remotely or in-office or hybrid.</p>
                </div>
            </div>
            <div className='rounded bg-gray-300 mx-auto lg:w-3/5 w-11/12 dark:bg-gray-800 my-4 p-2'>
                <FieldLabel title="Job Search">
                    <Input className='lg:w-3/5 w-full' value={searchStr} onChange={async (e)=>{
                        setSearchStr(e.target.value);
                        setPageNum(1);
                    }} placeholder="Search By Job Title or Job Code"/>
                </FieldLabel>
            </div>
            {data && <LatestJobPosts jobPosts={jobPosts} setNextPage={setPageNum}/>}
        </section>

    </div>;

}

export default DefaultMain;