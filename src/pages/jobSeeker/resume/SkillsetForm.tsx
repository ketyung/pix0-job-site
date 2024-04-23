import { Button, Input, Select } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { ResumeData, SkillSet } from "@/models";
import { useState } from "react";
import { isBlank } from "@/utils";
import { IoIosAddCircleOutline, IoIosRemoveCircleOutline } from "react-icons/io";

export type props = {

    resumeData? : ResumeData,

    setResumeData? : (r: ResumeData)=>void,
}

export default function SkillsetForm({resumeData, setResumeData}: props) {

    const [currSkillsets, setCurrSkillsets] = useState<SkillSet[]>(resumeData?.skillsets ? [...resumeData.skillsets ,{}] : [{}]);

    return <div className="mt-10 text-left">
        <div className="my-2 text-xs">Your Skillsets</div>
        {currSkillsets.map((s,i)=>{

            return <div key={`Sks_${i}`} className="flex text-left p-2 bg-gray-200 dark:bg-gray-700 mb-4 rounded">
                <FieldLabel title="Skillset" className="mr-2">
                    <Input placeholder="e.g. React, NodeJS, TypeScript" className="w-96" value={s.name}
                    onChange={(e)=>{
                        let sks= [...currSkillsets];
                        sks[i].name = e.target.value ;
                        sks[i].experience = '1 Year';
                        setCurrSkillsets(sks);
                        if ( setResumeData) {
                            setResumeData({...resumeData, skillsets : sks});
                        }

                    }}/>
                </FieldLabel>
                <FieldLabel title="Years Of Experience">
                    <Select className="w-40" value={s.experience}
                    onChange={(e)=>{
                        let sks= [...currSkillsets];
                        sks[i].experience = e.target.value;
                        setCurrSkillsets(sks);
                        if ( setResumeData) {
                            setResumeData({...resumeData, skillsets : sks});
                        }
                    }}
                        options={Array.from({ length: 11 }, (_, index) => index + 1).map((x) => 
                            { return x > 10 ? { value: `More Than 10 Years` , 
                        label : `More Than 10 Years`} :  { value: `${x} Year${x > 1 ? 's':''}` , label : `${x} Year${x > 1 ? 's':''}`}})}
                    />
                </FieldLabel>


                {(currSkillsets[i].name && currSkillsets[i].experience) &&
               
                    <Button className="bg-transparent mt-2" title="Remove This Skill"
                    onClick={(e)=>{
                        e.preventDefault();
                        let sks = [...currSkillsets];
                        sks.splice(i, 1);
                        setCurrSkillsets(sks);
                    
                        if ( setResumeData)
                            setResumeData({...resumeData, skillsets : sks});
                    }}><IoIosRemoveCircleOutline className="w-6 h-6 mt-2"/></Button>
                }
            </div>

        })}

        <div className="my-2 py-2 text-left">
            <Button className="bg-cyan-500 rounded text-gray-100 w-48 text-center px-2 py-1" onClick={(e)=>{
                e.preventDefault();
                let sks = [...currSkillsets, {}];
                setCurrSkillsets(sks);
            }}>
            Add More<IoIosAddCircleOutline className="ml-2 inline"/></Button>
        </div>
    </div>
}