import Link from "next/link";
import { MenuItem } from "./Sidebar";
import { useRouter } from 'next/router';
import { Button, ChevronDown } from "pix0-core-ui";
import { useState } from "react";


type props = {

    item : MenuItem, 

    isClose? : boolean,
}

export default function SidebarMenu ({item, isClose} : props) {

    const router = useRouter();

    const [submenuClosed, setSubmenuClosed] = useState(false);


    return <li className={`${item.withHoverEffect && 'hover:bg-gray-300 hover:dark:bg-gray-800 '}${item.link === router.pathname ? 'bg-gray-100 dark:bg-gray-800 ' : ''} w-48`}>
        <div className="flex my-2 p-1">{item.link ? <Link href={item.link} className="flex">
            {item.icon && <span className="mr-2">{item.icon}</span>}{item.title}</Link>
            : item.title}{ item.subMenu && <Button className={"ml-2"} onClick={(e)=>{
                e.preventDefault();setSubmenuClosed(!submenuClosed);
            }}><ChevronDown className={`w-4 h-4 mt-0.5 icon rotate${!submenuClosed ? ' down' : ''}${isClose ? ' hidden' : ''}`}/>
            </Button>}
        </div>
        {(item.subMenu && !submenuClosed) && (
        <ul className={`sub-menu${isClose ? '-closed' : ''}`}>
            {item.subMenu.map((subItem, subIndex) => {

                return <li key={subIndex} className={`${subItem.link === router.pathname ? 'bg-gray-100 dark:bg-gray-800 ' : ''} hover:bg-gray-600 hover:dark:bg-cyan-800`}>
                {subItem.link ? <Link href={subItem.link} className="flex">
                    {subItem.icon && <span className="mr-2">{subItem.icon}</span>}
                    {subItem.title}</Link>
                : subItem.title}</li>
                })
            }
        </ul>
        )}
    </li>
}