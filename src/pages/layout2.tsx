import { ReactNode} from 'react';
import './globals.css'
import './fonts.css';
import { Input, ThemeToggle } from 'pix0-core-ui';
import FieldLabel from '@/components/FieldLabel';
import Link from 'next/link';
import Head from 'next/head';

type props = {

    title ? : string,
  
    description ? : string, 
  
    children : ReactNode,
}


const DefaultMain = () =>{


    return <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 h-screen pt-4 pb-4">
        <section id="home">
            <div className="rounded bg-gray-200 mx-auto lg:w-3/5 w-4/5 dark:bg-gray-800 lg:flex flex-col lg:flex-row my-4 p-2">
                <div className='text-left min-w-32'>
                <h1 className='header-text'>Welcome to Pix0 Inc.</h1>
                <p className='norm-text'>Your partner in creating innovative web and AI solutions.</p>
                </div>
            </div>
            <div className='rounded bg-gray-200 mx-auto lg:w-3/5 w-4/5 dark:bg-gray-800 my-4 p-2'>
                <FieldLabel title="Job Search">
                    <Input className='lg:w-3/5 w-full'/>
                </FieldLabel>
            </div>
        </section>

    </div>;

}

export default function Layout({ title, description, children} : props) {



    return <>
        <Head><title>{title ?? "Pix0 Jobs Site"}</title>
            <meta name="description" content={ description ?? "You can find various jobs in various industry here including remote, in-office, hybrid etc"} />
        </Head>
        <header className='dark:bg-gray-800 bg-top-bar-blue dark:text-gray-100 text-gray-800 shadow-xl 
        border-width:1px dark:border-0 border border-gray-300 dark:border-gray-800 flex'>   
            <Link href="/employer/jobPosts" className='bg-gray-700 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Post A JOB</Link>
            <ThemeToggle iconLightTextColor='#ffa'/>
        </header>
        { children ? <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 min-h-screen h-full pt-4 pb-4">
            {children}</div> : DefaultMain()}
       </>

}

