import { TextArea } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { props } from "./SkillsetForm";

export default function AboutForm({resumeData, setResumeData}:props) {

    return <div className="mt-10 text-left">
        <FieldLabel title="Please Provide Some Information About Yourself">
            <TextArea rows={10} width="100%" onChange={(e)=>{
                if ( setResumeData)
                    setResumeData({...resumeData, about : e.target.value});

            }}>{resumeData?.about}</TextArea>
            <div className="mt-2 text-xs">Max 255 characters</div>
        </FieldLabel>
    </div>
}