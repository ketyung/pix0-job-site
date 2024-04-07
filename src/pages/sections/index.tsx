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
            title :<MenuItemView title="CRM" />, 
            icon : <MdPeopleAlt className="ml-0.5 w-4 h-4 mt-0.5"/>,
            link : "/apps/crm",
            withHoverEffect : true, 
        }, {
            title :<MenuItemView title="Invoicing" />,
            icon : <RiBillLine className="ml-0.5 w-4 h-4 mt-0.5"/>,
            link : "/apps/inv",
                    withHoverEffect : true, 
            }, {
                title :<MenuItemView title="Item Inventory" />,
                icon : <MdOutlineInventory2 className="ml-0.5 w-4 h-4 mt-0.5"/>,
                link : "/apps/item",
                withHoverEffect : true, 
        }]

    //console.log("process.env.GOOGLE_CLIENT_ID::", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

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


