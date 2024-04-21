import MainIndex  from "..";
import { Button, Drawer, Modal } from "pix0-core-ui";
import { FiPlusCircle } from "react-icons/fi";
import { useState , useEffect, useMemo} from "react";
import Form from "./Form";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}


interface IndexProps {

    openForm? : string, 
}


export default function Index({openForm }:IndexProps ) {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [viewType, setViewType] = useState<ViewType>(ViewType.LIST);


  
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
                <Button className="mx-2 w-64 justify-center flex border pt-1 border-gray-400 rounded p-1"
                onClick={async (e)=>{
                    e.preventDefault();
                    setDrawerOpen(true);
                }}>
                    <FiPlusCircle className="mr-2 w-5 w-5 inline"/>
                    <span className="mt-2 text-xs pt-2">Generate A Resume With AI</span>
                </Button>
            </div>
           
        </div>
        <Drawer withCloseButton open={drawerOpen} width="75%" atRight groupId="d000Inv"
        onClose={()=>{
            setDrawerOpen(false);
        }}>
            <div className='text-center p-2 overflow-y-auto max-h-screen'>
              <Form/>
            </div>    
        </Drawer>

       
    </MainIndex>

}
