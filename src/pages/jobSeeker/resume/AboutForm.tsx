import { TextArea } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { props } from "./SkillsetForm";

export default function AboutForm({resumeData, setResumeData}:props) {

    return <div className="mt-10 text-left">
        <FieldLabel title="Please Provide Some Information About Yourself">
            <TextArea rows={6} width="100%" onChange={(e)=>{
                if ( setResumeData && e.target.value.length <= 250)
                    setResumeData({...resumeData, about : e.target.value});

            }} value={resumeData?.about}>{resumeData?.about}</TextArea>
            <div className="mt-2 text-xs">Max 250 chars{(resumeData?.about?.length ??0) > 0 && ` ,Current:${resumeData?.about?.length}`}</div>
        </FieldLabel>
    </div>
}