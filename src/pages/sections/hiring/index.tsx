import MainIndex  from "..";
import { Button, Drawer } from "pix0-core-ui";
import { FiPlusCircle } from "react-icons/fi";
import { useState } from "react";
import Form from "./form";
import List from "./list";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}

export default function Index( ) {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [reloadCount, setReloadCount] = useState(0);

    const [isEditMode, setIsEditMode] = useState(false);

    const [editRowId, setEditRowId] = useState<string>();

    const [viewType, setViewType] = useState<ViewType>(ViewType.LIST);


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
    
    
    return <MainIndex title="e-Invoicing - Pix0 Application">
        <div className="text-left">
            <h2 className="ml-2 mb-10 font-bold">Invoicing</h2>
            <div className="mb-4 flex">
                <Button className="mx-2 w-48 justify-center flex border pt-1 border-gray-400 rounded p-1"
                onClick={(e)=>{
                    e.preventDefault();
                    setDrawerOpen(true);
                    setIsEditMode(false);
                    setEditRowId(undefined);
                    if ( viewType !== ViewType.LIST)
                        setViewType(ViewType.LIST);

                }}>
                    <FiPlusCircle className="mr-2 w-5 w-5 inline"/>
                    <span className="mt-2 text-xs pt-2">Issue An Invoice</span>
                </Button>
            </div>
            {switchView()}
           
        </div>
        <Drawer withCloseButton open={drawerOpen} width="70%" atRight groupId="d000Inv"
        onClose={()=>{
            setDrawerOpen(false);
        }}>
            <div className='text-center p-2 overflow-y-auto max-h-screen'>
                <Form editRowId={editRowId} refresh={()=>{
                    setReloadCount(reloadCount+1);
                }} isEditMode={isEditMode}/>
            </div>    
        </Drawer>
    </MainIndex>

}
