import { Input, TextArea } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { props } from "./SkillsetForm";
import YrSel from "@/components/YrSel";

export default function WorkExpForm({resumeData, setResumeData}:props) {

    return <div className="mt-10 text-left">
        <div className="lg:flex">
            <FieldLabel title="Company Name" className="mr-2 lg:w-2/5 w-4/5">
                <Input placeholder="Company Name"/>
            </FieldLabel>
            <FieldLabel title="From Year" className="lg:ml-2 lg:mt-0 mt-2">
                <YrSel/>
            </FieldLabel>
            <FieldLabel title="To Year" className="lg:ml-2 lg:mt-0 mt-2">
                <YrSel/>
            </FieldLabel>
        </div>
        <div className="mt-2">
            <FieldLabel title="Description Of Your Role" className="mr-2">
                <TextArea width="90%" rows={5}></TextArea>
            </FieldLabel>
        </div>
    </div>
}