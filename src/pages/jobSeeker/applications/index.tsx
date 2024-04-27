import MainIndex  from "..";
import { Button, Drawer, Modal } from "pix0-core-ui";
import { FiPlusCircle } from "react-icons/fi";
import { useState , useEffect, useMemo} from "react";
import List from "./list";
import { hasCompany } from '@/service';

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
 
    const [viewType, setViewType] = useState<ViewType>(ViewType.LIST);


    const switchView = () =>{

        switch(+viewType) {
            
            default :
                return   <List reloadCount={reloadCount} onEdit={(id)=>{
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
            <h2 className="ml-2 mb-10 font-bold">Job Applications</h2>
            {switchView()}
        </div>
    </MainIndex>

}
