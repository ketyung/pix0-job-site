import React, { useState } from 'react';
import { useThemeContext} from 'pix0-core-ui';
import { CiTrash } from "react-icons/ci";
import { CiCircleMore } from "react-icons/ci";
import { CiEdit } from "react-icons/ci";
import { Popup} from 'reactjs-popup';

type props = {

    className ? : string, 

    onDelete?: () => void, 

    onEdit? : () => void, 
}

const ListActionDropDown = ({ onDelete, onEdit} :props) => {

   
    const {theme} = useThemeContext();
    
    return  <Popup contentStyle={{background: theme.mode === 'dark' ? "#222" : "#ddd",minWidth:"240px"}} 
    arrowStyle={{color:theme.mode === 'dark' ? "#222" : "#ddd", border:"1px"}}
    className="bg-gray-900 text-gray-300 w-64 p-4 m-4"
    trigger={<button className="bg-gray-100 hover:bg-blue-800 text-gray-900 
    hover:text-blue-200 rounded-2xl">
    <CiCircleMore className='w-5 h-5'/></button>} position="left center">
        
        {onEdit && <div className="rounded hover:bg-gray-500 dark:hover:bg-gray-700 hover:cursor-pointer hover:text-gray-100
         dark:bg-gray-800 bg-gray-300 text-gray-900 dark:text-gray-200 p-2 text-sm"
        onClick={(e)=>{
            e.preventDefault();
            onEdit();
        }}>
        <CiEdit className="mr-2 inline mb-1"/> Edit
        </div>}
        
        {onDelete && <div className="rounded hover:bg-gray-500 dark:hover:bg-gray-700 hover:cursor-pointer hover:text-gray-100
        dark:bg-gray-800 bg-gray-300 text-gray-900 dark:text-gray-200 p-2 text-sm" onClick={async (e)=>{
            e.preventDefault();
           
        }}>
        <CiTrash className="mr-2 inline mb-1"/> Delete 
        </div>}
    </Popup>;
    
}

export default ListActionDropDown;
