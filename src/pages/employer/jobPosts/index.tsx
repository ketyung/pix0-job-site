import MainIndex  from "..";
import { Button, Drawer, Modal } from "pix0-core-ui";
import { FiPlusCircle } from "react-icons/fi";
import { useState , useEffect, useMemo} from "react";
import Form from "./form";
import List from "./list";
import { hasCompany } from '@/service';
import CompanyForm from "../company/mForm";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}


interface IndexProps {

    openForm? : string, 
}


export default function Index({openForm }:IndexProps ) {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [reloadCount, setReloadCount] = useState(0);

    const [isEditMode, setIsEditMode] = useState(false);

    const [editRowId, setEditRowId] = useState<string>();

    const [viewType, setViewType] = useState<ViewType>(ViewType.LIST);


    const [hasCreatedCompany, setHasCreatedCompany] = useState(true);


    const verifyingHasCompany = useMemo(() => async () =>{
        let hasC = await hasCompany();
        setHasCreatedCompany(hasC);
        return hasC;
    },[setHasCreatedCompany]); 

    const switchView = () =>{

        switch(+viewType) {

            
            default :
                return   <List reloadCount={reloadCount} onEdit={(id)=>{
                    setEditRowId(id);
                    setIsEditMode(true);
                    setDrawerOpen(true);
                }} />
        }
    }

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
            <h2 className="ml-2 mb-10 font-bold">Job Posts</h2>
            <div className="mb-4 flex">
                <Button className="mx-2 w-48 justify-center flex border pt-1 border-gray-400 rounded p-1"
                onClick={async (e)=>{
                    e.preventDefault();

                    if (await verifyingHasCompany() ){

                        setDrawerOpen(true);
                        setIsEditMode(false);
                        setEditRowId(undefined);
                        if ( viewType !== ViewType.LIST)
                            setViewType(ViewType.LIST);
    
                    }
              
                }}>
                    <FiPlusCircle className="mr-2 w-5 w-5 inline"/>
                    <span className="mt-2 text-xs pt-2">Post A Job</span>
                </Button>
            </div>
            {switchView()}
           
        </div>
        <Drawer withCloseButton open={drawerOpen} width="75%" atRight groupId="d000Inv"
        onClose={()=>{
            setDrawerOpen(false);
        }}>
            <div className='text-center p-2 overflow-y-auto max-h-screen'>
                <Form editRowId={editRowId} refresh={()=>{
                    setReloadCount(reloadCount+1);
                }} isEditMode={isEditMode}/>
            </div>    
        </Drawer>

        <Modal maxHeight="600px" maxWidth="800px" isOpen={!hasCreatedCompany} onClose={()=>{
            setHasCreatedCompany(true);
        }}><CompanyForm title="Please Create A Company Profile First" minWidth="720px"/></Modal>
       
    </MainIndex>

}
