import { ReactNode} from 'react';
import './globals.css'
import './fonts.css';


type props = {

    title ? : string,
  
    description ? : string, 
  
    children : ReactNode,
}


const DefaultMain = () =>{


    return <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 h-full pt-4 pb-4">
    <section id="home">
        <div className="container dark:bg-gray-800 lg:flex flex-col lg:flex-row">
            <div className='text-left min-w-32'>
            <h1 className='header-text'>Welcome to Pix0 Inc.</h1>
            <p className='norm-text'>Your partner in creating innovative web and AI solutions.</p>
            </div>
        </div>
    </section>

    </div>;

}

export default function Layout({ title, description, children} : props) {



    return <><header className='dark:bg-gray-800 bg-top-bar-orange dark:text-gray-100 text-gray-800 shadow-xl 
        border-width:1px dark:border-0 border border-gray-300 dark:border-gray-800'>
        </header>
        { children ? <div className="dark:bg-gray-900 bg-gray-100 dark:text-gray-100 text-gray-900 min-h-screen h-full pt-4 pb-4">
            {children}</div> : DefaultMain()}
       </>

}

