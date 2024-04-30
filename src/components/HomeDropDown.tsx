import React from 'react';
import { useThemeContext} from 'pix0-core-ui';
import { CiMenuBurger } from "react-icons/ci";

import { Popup} from 'reactjs-popup';
import Link from 'next/link';
import {ThemeToggle} from 'pix0-core-ui';


const HomeDropDown = () => {

    const {theme} = useThemeContext();
    
    return  <Popup contentStyle={{background: theme.mode === 'dark' ? "#222" : "#eee",minWidth:"240px"}} 
    arrowStyle={{color:theme.mode === 'dark' ? "#222" : "#ddd", border:"1px"}}
    className="bg-gray-900 text-gray-300 w-32 p-10 m-4 lg:hidden block text-center" 
    trigger={<button className="bg-gray-300 hover:bg-gray-400 text-gray-900 dark:bg-gray-700 dark:text-gray-100
    hover:text-blue-200 rounded-full pl-0.5 w-10 h-5 text-center lg:hidden inline-block mt-2.5 ml-10">
    <CiMenuBurger className='w-5 h-4 ml-2'/></button>} position="bottom left">
    <div className='text-left p-2 w-full'><Link href="/jobSeeker" className='w-32 text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Job Seeker</Link></div>
    <div className='text-left p-2 w-full'><Link href="/employer/jobPosts" className='w-32 text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>Post A JOB</Link></div>
    <div className='text-left p-2 w-full'><Link href="/about" className='w-32 text-center bg-stone-900 rounded-full text-gray-100 py-1 px-4 text-sm font-bold m-2 hover:bg-green-900 cursor-pointer'>About Us</Link></div>
    <div className='text-left p-2 w-full'><ThemeToggle iconLightTextColor='#88c'/></div>
    </Popup>;
    
}

export default HomeDropDown;
