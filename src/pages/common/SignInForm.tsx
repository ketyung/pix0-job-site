import { Button } from "pix0-core-ui";
import { signIn } from 'next-auth/react';
import { FaGoogle, FaLinkedin } from "react-icons/fa";
import { toast } from "react-toastify";

type props = {

    callbackUrl? : string,

    fromEmployer? : boolean,

}

export default function SignInForm({callbackUrl, fromEmployer} : props) {


     return <div className="mx-auto p-2 min-w-80">
     

        <div className="mt-10 mb-6">
        <Button className="p-1 rounded-3xl text-sm bg-red-500 text-gray-100 w-full mx-auto"
                onClick={async (e)=>{
                    e.preventDefault();
                    await signIn('google', { callbackUrl: callbackUrl });
                }}>{<div className="flex p-1"><FaGoogle className="mr-2 w-5 h-5"/>
                Sign In With Google</div>}</Button>
        </div>


        <div className="mt-10 mb-6">
        <Button className="p-1 rounded-3xl text-sm bg-blue-500 text-gray-100 w-full mx-auto"
                onClick={async (e)=>{
                    e.preventDefault();
                    //await signIn('linkedin');
                    toast.error('Not Available Yet! Coming soon....');
                }}>{<div className="flex p-1"><FaLinkedin className="mr-2 w-5 h-5"/>
                Sign In With LinkedIn</div>}</Button>
        </div>
    </div>

}