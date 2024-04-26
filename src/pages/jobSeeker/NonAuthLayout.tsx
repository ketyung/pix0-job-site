import { Modal } from "pix0-core-ui"
import image3 from '../../images/job-seeker.jpg'
import image2 from '../../images/computers.jpg'
import image1 from '../../images/colleagues.jpg';
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
    <main className="min-h-screen text-gray-800 bg-gray-500 dark:bg-gray-900">
       {isOpen && <Image alt="Look For Remote Jobs?" src={image3.src} className="w-full h-full" sizes='100vw' width={100} height={100}/>}
       <Modal withoutCloseButton isOpen={isOpen} title={<div className="flex"><Logo className="mr-2 h-6 w-auto mb-1"/>
            <div className="mt-0.5">{currentUrl.indexOf("/apply/") !== -1 ? <div className="text-sm">Please Sign In Before 
            Applying For This Job</div> : 'Sign In'}</div></div>}>
            <SignInForm callbackUrl={currentUrl !== JOBSEEKER_SIGN_IN_CALLBACK_URL ? currentUrl : JOBSEEKER_SIGN_IN_CALLBACK_URL}/>   
       </Modal>
       {isOpen && <Image alt="The Best Jobs Seeking Website" src={image2.src} className="w-full h-full lg:hidden" sizes='100vw' width={100} height={100}/>}
       {isOpen && <Image alt="Seek for the best job" src={image1.src} className="w-full h-full lg:hidden" sizes='100vw' width={100} height={100}/>}
    </main>
  
    </>

}