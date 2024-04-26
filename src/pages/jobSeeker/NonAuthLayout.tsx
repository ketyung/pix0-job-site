import { Modal } from "pix0-core-ui"
import image3 from '../../images/job-seeker.jpg'
import SignInForm from "../common/SignInForm"
import { useState, useEffect } from "react";
import Head from 'next/head';
import Image from "next/image";
import { props } from "./AuthLayout";
import Logo from "@/components/Logo";
import { useRouter } from 'next/router';

export const JOBSEEKER_SIGN_IN_CALLBACK_URL ="/jobSeeker/resume";

export default function NonAuthLayout({title, description}:props) {

  
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter();

    // Get the current URL
    const currentUrl = router.asPath;
  
    useEffect(()=>{
        setTimeout(()=>{
            setIsOpen(true);
        },500);
    },[]);
  
    return <><Head><title>{title ?? "Job Seeker's Section For Pix0 Jobs"}</title>
    <meta name="description" content={ description ?? "You can apply for your ideal jobs here"} />
    </Head>
    <main className="flex flex-row min-h-screen text-gray-800 bg-gray-200 dark:bg-gray-700">
       {isOpen && <Image alt="Look For Remote Jobs?" src={image3.src} className="w-full h-full" sizes='100vw' width={100} height={100}/>}
       <Modal withoutCloseButton isOpen={isOpen} title={<div className="flex"><Logo className="mr-2 h-6 w-auto mb-1"/>
            <div className="mt-0.5">Sign In</div></div>}>
            <SignInForm callbackUrl={currentUrl !== JOBSEEKER_SIGN_IN_CALLBACK_URL ? currentUrl : JOBSEEKER_SIGN_IN_CALLBACK_URL}/>   
       </Modal>
    </main>
  
    </>

}