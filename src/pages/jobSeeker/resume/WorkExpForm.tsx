import { Input, TextArea, Button } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { props } from "./SkillsetForm";
import YrSel from "@/components/YrSel";
import { useState } from "react";
import { WorkExp } from "@/models";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";

export default function WorkExpForm({resumeData, setResumeData}:props) {

    const [workExps, setWorkExps] = useState<WorkExp[]>(resumeData?.workExperiences ? resumeData.workExperiences : 
        [{}]);

    return <div className="mb-2">
        <div className="font-bolder text-left">Work Experiences</div>
        {workExps.map((w,i)=>{
    
            return <div className="mt-2 text-left border-b border-gray-300 mb-2 p-2" key={`wExp_${i}`}>
            <div className="lg:flex">
                <FieldLabel title={<div>{`${i+1}. Company Name`}{i > 0 &&<IoIosRemoveCircleOutline 
                className="inline ml-2 w-4 h-4 cursor-pointer" title="Remove"
                onClick={(e)=>{
                    e.preventDefault();
                    let wps= [...workExps];
                    wps.splice(i, 1);
                    setWorkExps(wps);
                   
                    if ( setResumeData) {
                        setResumeData({...resumeData, workExperiences : wps});
                    }
                }}
                />}</div>} className="mr-2 lg:w-2/5 w-4/5">
                    <Input placeholder="Company Name" value={workExps[i].companyName} onChange={(e)=>{
                        let wps= [...workExps];
                        wps[i].companyName = e.target.value ;
                        setWorkExps(wps);
                        if ( setResumeData) {
                            setResumeData({...resumeData, workExperiences : wps});
                        }
                    }}/>
                </FieldLabel>
                <FieldLabel title="From Year" className="lg:ml-2 lg:mt-0 mt-2">
                    <YrSel value={workExps[i].fromYear} onChange={(e)=>{
                        let wps= [...workExps];
                        wps[i].fromYear = e.toString();
                        setWorkExps(wps);
                        if ( setResumeData) {
                            setResumeData({...resumeData, workExperiences : wps});
                        }
                    }}/>
                </FieldLabel>
                <FieldLabel title="To Year" className="lg:ml-2 lg:mt-0 mt-2">
                    <YrSel value={workExps[i].toYear} onChange={(e)=>{
                        let wps= [...workExps];
                        wps[i].toYear = e.toString();
                        setWorkExps(wps);
                        if ( setResumeData) {
                            setResumeData({...resumeData, workExperiences : wps});
                        }
                    }}/>
                </FieldLabel>
            </div>
            <div className="mt-2">
                <FieldLabel title="Description Of Your Role" className="mr-2">
                    <TextArea placeholder="Please Provide Some Simple Description About Your Role At This Company" width="90%" rows={5} onChange={(e)=>{
                        let wps= [...workExps];
                        wps[i].role = e.target.value;
                        setWorkExps(wps);
                        if ( setResumeData) {
                            setResumeData({...resumeData, workExperiences : wps});
                        }
                    }}>{workExps[i].role}</TextArea>
                </FieldLabel>
            </div>
        </div>})}
        <div className="my-2 py-2 text-left">
            <Button className="bg-cyan-500 rounded text-gray-100 w-48 text-center px-2 py-1" onClick={(e)=>{
                e.preventDefault();
                let wps = [...workExps, {}];
                setWorkExps(wps);
            }}>
            Add More<IoIosAddCircleOutline className="ml-2 inline"/></Button>
        </div>
    </div>
}