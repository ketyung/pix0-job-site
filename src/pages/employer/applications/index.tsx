import MainIndex  from "..";
import { useState , useEffect, useMemo} from "react";
import List from "./list";

export enum ViewType {

    LIST = 0,

    SETTINGS = 1, 
}


interface IndexProps {

    openForm? : string, 
}


export default function Index({openForm }:IndexProps ) {

    const [drawerOpen, setDrawerOpen] = useState(false);

    const [viewType] = useState<ViewType>(ViewType.LIST);


    const switchView = () =>{

        switch(+viewType) {
            
            default :
                return   <List />
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
    
    return <MainIndex title="Job Applications - Pix0 Application">
        <div className="text-left">
            <h2 className="ml-2 mb-10 font-bold">Job Applications</h2>
            {switchView()}
        </div>
    </MainIndex>

}
