'use client';
import { ReactNode} from 'react';
import './globals.css'
import './fonts.css';
import { ThemeToggle } from 'pix0-core-ui';
import Link from 'next/link';
import Head from 'next/head';
import DefaultMain from './DefaultMain';
import { IoHomeOutline } from "react-icons/io5";
import HomeDropDown from '@/components/HomeDropDown';

type props = {

    title ? : string,
  
    description ? : string, 
  
    children : ReactNode,

    data? : any, 
}



export default function Layout({ title, description, children, data} : props) {


    const links =  <><div className='lg:w-3/12 w-full lg:inline-block hidden text-right pt-2'><Link href="/jobSeeker" className='text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Job Seeker</Link></div>
    <div className='lg:w-3/12 w-full lg:inline-block hidden text-left pt-2'><Link href="/employer/jobPosts" className='text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Post A JOB</Link></div>
    <div className='lg:w-3/12 w-full lg:inline-block hidden text-left pt-2'><Link href="/about" className='text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>About Us</Link></div>
    <div className='lg:w-1/12 w-full lg:inline-block hidden mt-3 text-right'><ThemeToggle iconLightTextColor='#ffa'/></div></>
   

    return <>
        <Head><title>{title ?? "Pix0 Jobs Site"}</title>
            <meta name="description" content={ description ?? "You can find various jobs in various industry here including remote, in-office, hybrid etc"} />
        </Head>
        <header className='dark:bg-gray-800 bg-top-bar-blue dark:text-gray-100 text-gray-800 shadow-xl 
        border-width:1px dark:border-0 border border-gray-300 dark:border-gray-800 flex h-16'>   
            <Link href="/" className='ml-4 mr-2 mt-2.5' title="Back To Home"><IoHomeOutline className='w-5 h-5 dark:text-gray-300 text-gray-200'/></Link>
            {links}
            <HomeDropDown/>        
        </header>
        { children ? <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 h-full pt-4 pb-4">
            {children}</div> : DefaultMain(data )}
       </>

}

