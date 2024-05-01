import MainIndex  from "..";
import ResumeView from "./ResumeView";
import YouTubeEmbed from "@/components/YoutubeEmbed";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}


export interface IndexProps {

    openForm? : string, 
}


export default function Index({openForm }:IndexProps ) {

    return <MainIndex title="Job Seeker's Section - Pix0 Application">
        <ResumeView openForm={openForm}/>
        <div className="mt-4 p-2 text-left">
            <h2 className="font-bold">Watch A Tutorial Video Below On How To Create Your Resume With AI</h2>
            <YouTubeEmbed videoId="j8hrqh3vI18" width="640" height="320"/>
        </div>
       </MainIndex>

}
