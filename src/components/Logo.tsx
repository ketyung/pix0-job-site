import logo from '../images/pix0Logo.png';
import Image from 'next/image';
import Link from 'next/link';

type props = {

    className? : string ,
}

export default function Logo({className} : props){

    return <Link href="/"><Image src={logo} width={150} height={50} alt="Pix0 Logo" 
    className={ className || 'w-10 mb-3 inline ml-4 mt-1'}/></Link>
}