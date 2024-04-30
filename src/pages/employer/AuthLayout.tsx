import Sidebar, { MenuItem } from '@/components/Sidebar';
import '../globals.css'
import '../fonts.css';
import Head from 'next/head';
import { ReactNode, useState, useEffect, useMemo } from "react";
import {AiOutlineMenu} from 'react-icons/ai';
import { ThemeProvider, ThemeToggle} from 'pix0-core-ui';
import Logo from '@/components/Logo';
import {Button, Drawer, Modal} from 'pix0-core-ui';
import ProfileDropdownMenu from '@/components/ProfileDropDownMenu';
import CompanyForm from "./company/mForm";
import { hasCompany } from '@/service';

export type props = {

  title ? : string,

  description ? : string, 

  children? : ReactNode,

  menuItems? : MenuItem[],

  isSignedIn? : boolean, 

}


const DefaultMain = () =>{

   
    return <div className="mt-10 text-lg lg:w-3/5 w-4/5 mx-auto text-left border border-gray-300 rounded p-2">
        <h2 className='m-2 font-bold'>Welcome Back</h2>
        <h3 className='m-2'>Click the left menu to start with</h3>
    </div>;
;

}

export default function AuthLayout({children, title, description, menuItems}: props) {

   
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
   
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [ verifyingCompany, setVerifyingCompany] = useState(false);

    const [hasCreatedCompany, setHasCreatedCompany] = useState(true);


    const verifyingHasCompany = useMemo(() => async () =>{
        setVerifyingCompany(true);
        let hasC = await hasCompany();
        setHasCreatedCompany(hasC);
        setVerifyingCompany(false);
    },[setVerifyingCompany]); 

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };


    useEffect(() => {

        setTimeout(()=>{
            verifyingHasCompany();
        },300);

        const handleResize = () => {
          setIsSidebarOpen(window.innerWidth >= 1024);
        };
    
        // Initial check on component mount
        handleResize();
    
        // Attach resize event listener
        window.addEventListener('resize', handleResize);
    
        // Clean up the event listener when the component unmounts
        return () => {
            window.removeEventListener('resize', handleResize);
        };

     
    }, [verifyingHasCompany]);


    return (<><Head><title>{title ?? "Pix0 Application Suite"}</title>
      <meta name="description" content={ description ?? "An easy to use applications by Pix0 Inc"} />
      </Head>
      <ThemeProvider>
      <main className="flex flex-row min-h-screen text-gray-800 bg-gray-200 dark:bg-gray-700">
        <div className={`lg:${isSidebarOpen ? 'w-48' : 'w-0'} h-full overflow-y-auto overflow-x-hidden text-left`}>
            <Button onClick={toggleSidebar} className={`hidden lg:inline 
            rounded bg-gray-100 dark:bg-gray-800 
            text-gray-800 dark:text-gray-100
            z-30 w-5 h-5 mt-2 ml-1.5 pr-2`}>
                <AiOutlineMenu className="w-2.5 h-3"/>
            </Button>  
            <Logo className={isSidebarOpen ? undefined :'hidden'}/>
            <Sidebar menuItems={menuItems ?? []} isClose={!isSidebarOpen}/>
        </div>
        <div className="grow ml-0 h-screen mx-auto dark:bg-gray-800 bg-gray-100 
        text-center overflow-y-auto overflow-x-hidden dark:text-gray-100 text-gray-900">
            <div className='p-1 dark:bg-gray-700 bg-gray-200 mb-2 pr-2 h-10'>
            <Button className="inline lg:hidden float-left" onClick={(e)=>{
                e.preventDefault();
                setDrawerOpen(!drawerOpen);
            }}>
                <AiOutlineMenu className="w-4 h-4"/>
            </Button>  
            <div className='float-right flex'>
                <ProfileDropdownMenu className='mt-1' signOutCallbackUrl='/employer'/>
                <ThemeToggle/>
            </div>
        </div>
            {children ? children : DefaultMain()}
        </div> 
        <Drawer zIndex={3000} width='160px' groupId="SidemenuDrawer01" 
        darkBgColor='#245' lightBgColor='#dde'
        atRight open={drawerOpen}>
            { drawerOpen && <>
                <div className='flex'>
                    <Logo/>
                    <Button className="ml-16" onClick={(e)=>{
                        e.preventDefault();
                        setDrawerOpen(!drawerOpen);
                    }}>
                        <AiOutlineMenu className="w-4 h-4 dark:text-gray-100 text-gray-800"/>
                    </Button>  
                </div>
                <Sidebar menuItems={menuItems ?? []} isClose={!drawerOpen}/>
            </>}
        </Drawer>
        <Modal maxHeight="600px" maxWidth="800px" isOpen={!hasCreatedCompany} onClose={()=>{
            setHasCreatedCompany(true);
        }}><CompanyForm title="Please Create A Company Profile First" minWidth="720px"/></Modal>
       
    </main>
    </ThemeProvider>
    </>
    )
}