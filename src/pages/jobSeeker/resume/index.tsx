import MainIndex  from "..";
import { useState , useEffect, useMemo} from "react";
import { getOwnResume } from "@/service";
import { Resume } from "@/models";
import ResumeView from "./ResumeView";

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
    </MainIndex>

}
