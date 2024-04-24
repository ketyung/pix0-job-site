import MainIndex  from "..";
import { Button, Drawer} from "pix0-core-ui";
import { FiPlusCircle, FiEdit } from "react-icons/fi";
import { useState , useEffect, useMemo} from "react";
import Form from "./Form";
import { getOwnResume } from "@/service";
import { Resume } from "@/models";
import { BeatLoader } from "react-spinners";
import { IoDocumentTextOutline } from "react-icons/io5";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}


interface IndexProps {

    openForm? : string, 
}


export default function Index({openForm }:IndexProps ) {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [loading, setLoading] = useState(false);

    const [resumeInfo, setResumeInfo] = useState<Resume>();


    const fetchResume =  useMemo(() => async () => {
        setLoading(true);
        let r = await getOwnResume();
        setResumeInfo(r);
    //    console.log("r::",r );
        setLoading(false);
    }, []);


    useEffect(()=>{
        fetchResume()
    },[fetchResume]);


  
    const setOpenFormIfNeeded =  useMemo(() => () => {
       
        if (openForm && openForm==='1') {
            setDrawerOpen(true);
        }else {
            setDrawerOpen(false);
        }
    }, [openForm,setDrawerOpen]);
    

    useEffect(()=>{
        setOpenFormIfNeeded();
    },[setOpenFormIfNeeded]);
    
    return <MainIndex title="Job Posts - Pix0 Application">
        <div className="text-left">
            <h2 className="ml-2 mb-10 font-bold">Your CV/Resume</h2>
            <div className="mb-4 flex">

                {loading ? <BeatLoader size={8} color="#999"/> : 
                (resumeInfo ? 
                <div className="p-2 text-center">
                    <IoDocumentTextOutline className="w-48 h-48 mt-2 text-gray-300"/>
                    <Button className="mx-2 w-64 justify-center flex border pt-1 border-gray-400 rounded p-1"
                    onClick={async (e)=>{
                        e.preventDefault();
                        setDrawerOpen(true);
                    }}>
                        <FiEdit className="mr-2 w-5 w-5 inline"/>
                        <span className="mt-2.5 text-xs pt-2">Edit Resume With AI</span>
                    </Button>
                        
                </div> :
                    <Button className="mx-2 w-64 justify-center flex border pt-1 border-gray-400 rounded p-1"
                    onClick={async (e)=>{
                        e.preventDefault();
                        setDrawerOpen(true);
                    }}>
                        <FiPlusCircle className="mr-2 w-5 w-5 inline"/>
                        <span className="mt-2 text-xs pt-2">Create Resume With AI</span>
                    </Button>
                )}
            </div>
           
        </div>
        <Drawer withCloseButton open={drawerOpen} width="75%" atRight groupId="d000Inv"
        onClose={()=>{
            setDrawerOpen(false);
        }}>
            <div className='text-center p-2 overflow-y-auto max-h-screen'>
              <Form resume={resumeInfo}/>
            </div>    
        </Drawer>

       
    </MainIndex>

}
