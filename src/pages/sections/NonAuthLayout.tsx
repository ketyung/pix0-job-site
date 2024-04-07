import { Button, Modal } from "pix0-core-ui"
import image1 from '../../images/work-software-technology.jpg'
import image2 from '../../images/software-technology.jpg'
import image3 from '../../images/computer-software-technology.jpg'
import SignInForm from "./common/SignInForm"
import { useState, useEffect } from "react";
import Head from 'next/head';
import Image from "next/image";
import ASignUpForm from "./common/ASignUpForm";
import { props } from "./AuthLayout";
import Logo from "@/components/Logo"



export default function NonAuthLayout({title, description}:props) {

    const [isSignUp, setIsSignUp] = useState(false);

    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            setIsOpen(true);
        },500);
    },[]);
  
    return <><Head><title>{title ?? "Pix0 UI lib components for React"}</title>
    <meta name="description" content={ description ?? "An easy to use UI components for React by Pix0 Inc"} />
    </Head>
    <main className="flex flex-row min-h-screen text-gray-800 bg-gray-200 dark:bg-gray-700">
       {isOpen && <Image  alt="CRM, e-Invoicing" src={image1.src} className="w-full h-full" width={100} height={100}  layout="responsive"/>}
       <Modal withoutCloseButton isOpen={isOpen} title={<div className="flex"><Logo className="mr-2 h-6 w-auto mb-1"/>
            <div className="mt-0.5">{isSignUp ? 'Sign Up' : 'Sign In'}</div></div>}>
                { isSignUp ? <ASignUpForm/> : <SignInForm/>}
                <div className="mt-2">
                <Button className="text-blue-500 text-xs ml-1 mt-10"
                onClick={(e)=>{
                    e.preventDefault();
                    setIsSignUp(!isSignUp);
                }}>{isSignUp ? 'Sign In' : 'Sign Up'}</Button>
            </div>
       </Modal>
       {isOpen && <Image alt="CRM, e-Invoicing" src={image2.src} className="w-full h-full xl:hidden" width={100} height={100}  layout="responsive"/>}
       {isOpen && <Image alt="CRM, e-Invoicing" src={image3.src} className="w-full h-full xl:hidden"  width={100} height={100}  layout="responsive"/>}
    </main>
  
    </>

}