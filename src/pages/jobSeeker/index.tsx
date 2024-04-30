import Layout  from "./layout";
import { ThemeProvider} from "pix0-core-ui";
import { MenuItemView } from '@/components/MenuItemView';
import { MenuItem } from "@/components/Sidebar";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { LuFiles } from "react-icons/lu";
import { CiPen } from "react-icons/ci";

export default function Index({
    children, title, isLoggedIn }: PageProps) {

    const menuItems : MenuItem[] = [{
        title :<MenuItemView title="Job Applications" />, 
        icon : <LuFiles className="ml-0.5 w-4 h-4 mt-0.5"/>,
        link : "/jobSeeker/applications",
        withHoverEffect : true, 
    }, {
        title :<MenuItemView title="Your CV/Resume" />, 
        icon : <CiPen className="ml-0.5 w-4 h-4 mt-0.5"/>,
        link : "/jobSeeker/resume",
        withHoverEffect : true, 
    }]

   
    return <SessionProvider>
            <React.StrictMode>
                <ThemeProvider defaultTheme={{mode : "light"}}><Layout title={title}
                menuItems={menuItems} isSignedIn={isLoggedIn}>{children}</Layout></ThemeProvider>
            </React.StrictMode>
    </SessionProvider>
}



interface PageProps {

    children?: React.ReactNode, 
    
    title? : string,

    isLoggedIn? : boolean,
}

