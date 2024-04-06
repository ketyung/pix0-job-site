import { ReactNode } from "react";

type props ={
    children : string|ReactNode, 

    className? : string, 

    title? : string|ReactNode,

    sideTrigger? : ReactNode,
}

export default function FieldLabel ({children, title, className, sideTrigger } : props) {

    return <div className={className}>
            <div className={`text-xs dark:text-gray-400 text-gray-500${sideTrigger ? " flex" : ""}`}>
            {title}{sideTrigger}</div>
            {children}
    </div>
}