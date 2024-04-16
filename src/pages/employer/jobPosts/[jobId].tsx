import { useRouter } from "next/router";
import View from "./view";
import MainIndex from "../../index";

export default function JobPostPreview() {

    const router = useRouter();
    const { jobId } = router.query;

    return <MainIndex title={`Job Post Preview : ${jobId}`}>
        <View jobId={jobId}/>
    </MainIndex>
}