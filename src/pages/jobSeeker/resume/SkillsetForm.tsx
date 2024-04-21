import { Button, Input, Select } from "pix0-core-ui";
import FieldLabel from "@/components/FieldLabel";
import { ResumeData, SkillSet } from "@/models";
import { useState } from "react";
import { isBlank } from "@/utils";
import { IoIosAddCircleOutline } from "react-icons/io";

export type props = {

    resumeData? : ResumeData,

    setResumeData? : (r: ResumeData)=>void,
}

export default function SkillsetForm({resumeData, setResumeData}: props) {

    const [currSkillsets, setCurrSkillsets] = useState<SkillSet[]>(resumeData?.skillsets ?? [{}]);

    const [currSkillset, setCurrSkillset] = useState<SkillSet>({});

    return <div className="mt-10 text-left">
        <div className="my-2 text-xs">Your Skillsets</div>
        {currSkillsets.map((s,i)=>{

            return <div key={`Sks_${i}`} className="flex text-left p-2 bg-gray-200 mb-4 rounded">
                <FieldLabel title="Skillset" className="mr-2">
                    <Input placeholder="e.g. React, NodeJS, TypeScript" className="w-96" value={s.name}
                    onChange={(e)=>{
                        setCurrSkillset({...currSkillset, name: e.target.value, experience :'1 Year'});
                    }}/>
                </FieldLabel>
                <FieldLabel title="Years Of Experience">
                    <Select className="w-40"
                    onChange={(e)=>{
                        setCurrSkillset({...currSkillset, experience: e.target.value});
                    }}
                        options={Array.from({ length: 11 }, (_, index) => index + 1).map((x) => 
                            { return x > 10 ? { value: `More Than 10 Years` , 
                        label : `More Than 10 Years`} :  { value: `${x} Year${x > 1 ? 's':''}` , label : `${x} Year${x > 1 ? 's':''}`}})}
                    />
                </FieldLabel>

                <Button className="bg-transparent mt-2" title="Add This Skill"
                onClick={(e)=>{
                    e.preventDefault();
                    if ( !isBlank(currSkillset.name) && !isBlank(currSkillset.experience)){
                        let sks = [...currSkillsets];

                        sks[i] = currSkillset;
                        setCurrSkillsets([...sks,{}]);
                    }
                  
                }}><IoIosAddCircleOutline className="w-6 h-6 mt-2"/></Button>
                
            </div>

        })}
    </div>
}