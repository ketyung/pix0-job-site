import { TextArea } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";

export default function AboutForm() {

    return <div className="mt-10 text-left">
        <FieldLabel title="Please Provide Some Information About Yourself">
            <TextArea rows={10} width="100%"></TextArea>
            <div className="mt-2 text-xs">Max 255 characters</div>
        </FieldLabel>
    </div>
}