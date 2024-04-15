import { ReactNode, useState, useEffect } from "react";
import {BiPhone} from 'react-icons/bi';
import { Button, Input, Modal } from "pix0-core-ui";
import { CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { CountryCode } from "@/models";


type props = {
    countryCodes?: any[], 

    defaultValue? : string, 

    id? : string, 

    left? : boolean,

    icon? : ReactNode,

    lgWidth? : string, 

    setSelectedValue? :(countryCode : CountryCode) => void,  

    useModal? : boolean, 

    withCloseButton? : boolean,

    searchAutoFocus? : boolean,

    hideDialCode? : boolean, 
}

export function CountryCodesSel ({countryCodes, defaultValue, id, left , icon, lgWidth, setSelectedValue, useModal, withCloseButton, searchAutoFocus, 
    hideDialCode} :props) {

    const [selValue, setSelValue] = useState(defaultValue ?? "");

    const [open, setOpen] = useState(false);


    const [cCodes, setCCodes] = useState<any[]|undefined>(countryCodes);


    useEffect(()=>{
        if ( defaultValue){
            setSelValue(defaultValue);
            //console.log("d.value::", defaultValue);    
        }

    },[defaultValue]);

    const searchField =   <Input className="ml-4 w-4/5 mb-2 h-4" id="ccSearchField" placeholder="Search" 
    autoFocus={searchAutoFocus}
    icon={<CiSearch className="mb-2"/>}
    onChange={(e)=>{

        let fCodes = countryCodes?.filter((c)=>{
            return c.name.toLowerCase().indexOf(e.target.value.toLowerCase()) !== -1 ;
        });
        if((fCodes?.length ?? 0) > 0) {
            setCCodes(fCodes);
        }
    }}/>;

    const phoneList = <div style={useModal ? {minWidth:"460px"} : {}}
        className={`${!useModal 
        ? `p-2 origin-top-left absolute ${left ? 'left' : 'right'}-0 mt-2` : ''}  
        bg-transparent w-full lg:${ lgWidth ?? ( useModal ? 'w-full' : 'w-3/5') }`}>
            <div className="absolute top-0 left-10 w-0 h-0 border-4 border-solid border-gray-100 dark:border-gray-800 
            border-t-transparent border-r-transparent"></div>
            <div className="bg-gray-100 dark:bg-gray-800 p-2 shadow-xl rounded-md">
            { withCloseButton ? <div className="flex">
            {searchField}
            <Button className="ml-8 mt-1 cursor-pointer" onClick={()=>{
                setOpen(false);
            }}><IoMdClose className="w-5 h-5 dark:text-gray-300"/></Button>
            </div>  : searchField}
             <div className={`py-1 ${useModal ? 'h-40' : 'h-64'} dark:bg-gray-800 bg-gray-100 overflow-y-scroll scrollbar dark:scrollbar-thumb-gray-300 dark:scrollbar-track-gray-800
             scrollbar-thumb-gray-500 scrollbar-track-gray-200`} role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
              
                {cCodes?.map((c,i) => (
                    <div title={c.code}
                    key={`_${id}_Cc_${i}`}
                    className="block px-4 py-2 text-xs text-gray-700 dark:hover:bg-gray-700 hover:bg-blue-100 
                    border-b border-gray-300 dark:border-gray-700 dark:text-gray-100 cursor-pointer text-left flex"
                    
                    onClick={() => {
                        if ( hideDialCode)
                         setSelValue(c.name)
                        else
                            setSelValue(c.dial_code)
                        if ( setSelectedValue)
                            setSelectedValue({ dialCode :c.dial_code, code : c.code, name : c.name } );
                        setTimeout(()=>{
                            setOpen(false);
                            setCCodes(countryCodes);
                        },300);
                    }}
                    >
                    {!hideDialCode && <div className="w-1/12">{c.dial_code}</div>}
                    <div className="w-1/12 ml-1">{c.flag}</div> 
                    <div className="w-10/12 ml-1 text-left">{c.name}</div>
                    </div>
                ))}
            </div>
        </div></div>;

    const handler =  <button onClick={() =>{ setOpen(o => !o); 
        setCCodes(countryCodes);
       }} className="flex px-1 bg-gray-300 dark:bg-cyan-900 rounded mb-1">
       { icon ?? <><BiPhone className="mt-0.5 dark:text-gray-200 text-gray-900"/>
       <span className="ml-1 text-sm cursor-pointer dark:text-gray-100 text-gray-900" 
       >{selValue}</span></>}
       </button>;

    return useModal ? 
        <>
        {handler}
        <Modal groupId="signUpPhoneNum" zIndex={1200} isOpen={open} withOutHeader padding="0px" 
        withoutCloseButton 
        onClose={()=>{
            setOpen(false);
        }}>
            {phoneList}
        </Modal>
        </>
        :
        <div>
        {handler}
        {open && phoneList}
        </div>
}