import { ReactNode,ReactElement } from 'react';
import { useRouter } from 'next/router';
import './css/Sidebar.css';
import SidebarMenu from './SidebarMenu';

export interface MenuItem {
    
    title: string|ReactElement,

    icon? : ReactNode, 
    
    subMenu?: MenuItem[],

    link? : string, 

    withHoverEffect? : boolean,
}

interface SidebarProps {
    menuItems: MenuItem[],

    isClose? : boolean,
}

const Sidebar = ({ menuItems, isClose } : SidebarProps) => {

  const router = useRouter();


  return (
    <div className={`sidebar${isClose ? '-closed' : ''}`}>
      <ul className={`menu${isClose ? '-closed' : ''}`}>
        {menuItems && menuItems.map((item, index) => {
            //console.log("itm::", item.link , router.pathname);
            return <SidebarMenu key={`sm_${index}`} item={item} isClose={isClose}/>
        })}
      </ul>
    </div>
  );
};

export default Sidebar;
