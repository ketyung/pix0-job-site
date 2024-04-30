import Layout  from "./layout";
import { ThemeProvider} from "pix0-core-ui";
import { MenuItemView } from '@/components/MenuItemView';
import { MenuItem } from "@/components/Sidebar";
import { MdPeopleAlt } from "react-icons/md";
import { IoDocumentsOutline } from "react-icons/io5";
import React from "react";
import { SessionProvider } from "next-auth/react";


export default function Index({
    children, title, isLoggedIn }: PageProps) {

    const menuItems : MenuItem[] = [{
        title :<MenuItemView title="Job Posts" />, 
        icon : <MdPeopleAlt className="ml-0.5 w-4 h-4 mt-0.5"/>,
        link : "/employer/jobPosts",
        withHoverEffect : true, 
    },
    {
        title :<MenuItemView title="Job Applications" />, 
        icon : <IoDocumentsOutline className="ml-0.5 w-4 h-4 mt-0.5"/>,
        link : "/employer/applications",
        withHoverEffect : true, 
    }]

   
    return <SessionProvider>
            <React.StrictMode>
                <ThemeProvider><Layout title={title}
                menuItems={menuItems} isSignedIn={isLoggedIn}>{children}</Layout></ThemeProvider>
            </React.StrictMode>
    </SessionProvider>
}



interface PageProps {

    children?: React.ReactNode, 
    
    title? : string,

    isLoggedIn? : boolean,
}

