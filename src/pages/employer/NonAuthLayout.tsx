import { Modal } from "pix0-core-ui"
import image3 from '../../images/computer-tech.jpg'
import image2 from '../../images/computers.jpg'
import SignInForm from "../common/SignInForm"
import { useState, useEffect } from "react";
import Head from 'next/head';
import Image from "next/image";
import { props } from "./AuthLayout";
import Logo from "@/components/Logo"


export const EMPLOYER_SIGN_IN_CALLBACK_URL ="/employer/jobPosts";

export default function NonAuthLayout({title, description}:props) {

  
    const [isOpen, setIsOpen] = useState(false);

    useEffect(()=>{
        setTimeout(()=>{
            setIsOpen(true);
        },500);
    },[]);
  
    return <><Head><title>{title ?? "Employer's Section For Pix0 Jobs"}</title>
    <meta name="description" content={ description ?? "Employers can easily post jobs here"} />
    </Head>
    <main className="min-h-screen text-gray-800 bg-gray-500 dark:bg-gray-900">
       {isOpen && <Image  alt="Look For Remote Jobs?" src={image3.src} className="w-full h-full" sizes='100vw' width={100} height={100}/>}
       <Modal withoutCloseButton isOpen={isOpen} title={<div className="flex"><Logo className="mr-2 h-6 w-auto mb-1"/>
            <div className="mt-0.5">Sign In</div></div>}>
            <SignInForm callbackUrl={EMPLOYER_SIGN_IN_CALLBACK_URL} fromEmployer/>  
       </Modal>
       {isOpen && <Image alt="The Best Jobs Seeking Website" src={image2.src} className="w-full h-full lg:hidden" sizes='100vw' width={100} height={100}/>}
    </main>
  
    </>

}