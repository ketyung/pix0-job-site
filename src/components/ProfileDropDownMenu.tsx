import React, { useState } from 'react';
import { useThemeContext } from 'pix0-core-ui';
import { PiSignOut } from "react-icons/pi";
import { CgProfile } from "react-icons/cg";
import { toast } from 'react-toastify';
import { useSession, signOut } from 'next-auth/react';
import {  userSignOutByGid } from '@/service';

type props = {

    className ? : string, 
}

const ProfileDropdownMenu = ({className} :props) => {

    const { data: session, status } = useSession();

    const {theme} = useThemeContext();

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const dropdownStyles : any = {
        position: 'relative',
        //display: 'inline-block',
    };

    const buttonStyles : any = {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        color: 'blue',
        padding: '0',
    };

    const menuStyles : any = {
        display: isDropdownOpen ? 'block' : 'none',
        position: 'absolute',
        top: '100%',
        right: '10px',
        background: theme.mode === 'dark' ? '#223' : '#eee',
        color: theme.mode === 'dark' ? '#eee' : '#222',
        border: '1px solid #ccc',
        borderRadius: '4px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        zIndex: 100,
        minWidth:'200px', 
    };

    const listItemStyles : any = {
        listStyle: 'none',
        padding: '8px',
    };

  
    const logOut = async (onError?:(e : Error)=> void) =>{

        if (session!== null && session !== undefined && status === 'authenticated') {
            signOut();
            let s = await userSignOutByGid(onError);
            
            document.location.reload();
            return s; 
        }
    }
    const signOutNow = async () =>{

        if ( window.confirm('Are you sure you wanna sign out now?')){
            logOut((e)=>{
                toast.error(e.message);
                return;
            })
            toast.info('Successfully Signed You Out');
        }
   
    }

    return (
        <div className={className} style={dropdownStyles}>
        <button style={buttonStyles} onClick={toggleDropdown}>
            <CgProfile className={`w-5 h-5 mt-1 ${theme.mode === 'dark' ? 'text-gray-100' : 'text-gray-600'}`}/>
        </button>
        <ul style={menuStyles}>
            <li style={listItemStyles} className='cursor-pointer flex w-full text-sm hover:bg-gray-300 dark:hover:bg-gray-500'><CgProfile className='inline w-4 h-4 mr-2 mt-1'/>Profile</li>
            <li style={listItemStyles} className='cursor-pointer flex w-full text-sm hover:bg-gray-300 dark:hover:bg-gray-500'
            onClick={async ()=>{
                await signOutNow();
            }}><PiSignOut className='inline w-4 h-4 mr-2 mt-1'/>Sign Out</li>
        </ul>
       
        </div>
    );
};

export default ProfileDropdownMenu;
