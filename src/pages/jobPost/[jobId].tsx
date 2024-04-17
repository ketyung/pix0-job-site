import View from "./view";
import MainIndex from "../index";
import { GetServerSidePropsContext } from 'next';
import { getPubJobPost } from "@/service";


export default function JobPost({job}: PageProps) {

    return <MainIndex title={`${job?.title ?? 'Job Post'} - Pix0 Job Site`}>
        <View jobPost={job}/>
    </MainIndex>
}


interface PageProps {
    job?: any,
 
    title? : string 
}


export async function getServerSideProps(context : GetServerSidePropsContext) {
    
    const { params } = context;
    const jobId = params?.jobId as string;

    const data : any = await getPubJobPost(jobId);

  
    return {
        props: {
            job: data ,
        },
    };
}