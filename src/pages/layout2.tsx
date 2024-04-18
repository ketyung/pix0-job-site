'use client';
import { ReactNode} from 'react';
import './globals.css'
import './fonts.css';
import { ThemeToggle } from 'pix0-core-ui';
import Link from 'next/link';
import Head from 'next/head';
import DefaultMain from './DefaultMain';
import { IoHomeOutline } from "react-icons/io5";

type props = {

    title ? : string,
  
    description ? : string, 
  
    children : ReactNode,

    data? : any, 
}



export default function Layout({ title, description, children, data} : props) {



    return <>
        <Head><title>{title ?? "Pix0 Jobs Site"}</title>
            <meta name="description" content={ description ?? "You can find various jobs in various industry here including remote, in-office, hybrid etc"} />
        </Head>
        <header className='dark:bg-gray-800 bg-top-bar-blue dark:text-gray-100 text-gray-800 shadow-xl 
        border-width:1px dark:border-0 border border-gray-300 dark:border-gray-800 flex'>   
            <Link href="/" className='ml-4 mr-2 mt-2.5' title="Back To Home"><IoHomeOutline className='w-5 h-5 dark:text-gray-300 text-gray-200'/></Link>
            <Link href="/employer/jobPosts" className='text-center bg-gray-700 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Post A JOB</Link>
            <div className='w-1/12 mt-3 text-right'><ThemeToggle iconLightTextColor='#ffa'/></div>
        </header>
        { children ? <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 min-h-screen h-full pt-4 pb-4">
            {children}</div> : DefaultMain(data )}
       </>

}

