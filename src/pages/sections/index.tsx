import Layout  from "./layout";
import { ThemeProvider} from "pix0-core-ui";
import { MenuItemView } from '@/components/MenuItemView';
import { MenuItem } from "@/components/Sidebar";
import { MdPeopleAlt } from "react-icons/md";
import { RiBillLine } from "react-icons/ri";
import { MdOutlineInventory2 } from "react-icons/md";
import React from "react";
import { SessionProvider } from "next-auth/react";


export default function Index({
    children, title, isLoggedIn }: PageProps) {

    const menuItems : MenuItem[] = [{
        title :<MenuItemView title="Job Posts" />, 
        icon : <MdPeopleAlt className="ml-0.5 w-4 h-4 mt-0.5"/>,
        link : "/sestions/hiring",
        withHoverEffect : true, 
    }]

   
    return <SessionProvider>
            <React.StrictMode>
                <ThemeProvider defaultTheme={{mode : "dark"}}><Layout title={title}
                menuItems={menuItems} isSignedIn={isLoggedIn}>{children}</Layout></ThemeProvider>
            </React.StrictMode>
    </SessionProvider>
}



interface PageProps {

    children?: React.ReactNode, 
    
    title? : string,

    isLoggedIn? : boolean,
}


