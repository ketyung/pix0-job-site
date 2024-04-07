import { ReactElement } from "react"

type props ={

    icon? : ReactElement,

    title : string 
}

export function MenuItemView ({
    icon, title
} : props ) {
    return <div className="flex col">{icon && <div className="mr-1" title={title}>{icon}</div>}
    <div className="menu-text">{title}</div>
    </div>
}