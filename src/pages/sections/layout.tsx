import AuthLayout from "./AuthLayout";
import NonAuthLayout from "./NonAuthLayout";
import { props } from "./AuthLayout";
import {ToastContainer} from 'react-toastify';
import { useThemeContext } from "pix0-core-ui";
import { useEffect, useState, useMemo } from "react";
import { getSession } from "next-auth/react";
import { userSignInByGid, verifyLogin } from "@/service";
import { JWTStorage } from "@/utils/local-storage";

export default function Layout({children, title, description, menuItems}: props) {
        
    const {theme} = useThemeContext();

    //const { data: session, status } = useSession();

    const [isLoggedIn, setIsLoggedIn] = useState(true);

 
    const verifySess = useMemo(() => async () =>{

        const session = await getSession();

        const hasSignedIn = () =>{

            //return (session !== undefined && session?.user !== undefined && status === 'authenticated');
            return (session !== undefined && session?.user !== undefined);
        }
 

        const checkIsSignedIn = async () =>{
            let s = hasSignedIn();
            
            if (s) {
    
                let newSess : any = session;
    
                let signedIn = await userSignInByGid({email : newSess?.user?.email, accountId : newSess.accountId})
                return signedIn;
            }
            
            return false;
        }

        let signedIn = JWTStorage.get() !== null;
        setIsLoggedIn(signedIn);
          
        if ( signedIn) {

            setIsLoggedIn( await verifyLogin() );

        }else {

             if ( hasSignedIn()) {
            
                let s = await checkIsSignedIn();
                    
                if (s){
                    setIsLoggedIn( await verifyLogin() );
                }
                

            }else {

                setIsLoggedIn(false);
            }
            
        }
    },[setIsLoggedIn]);

    useEffect(()=>{
       
        //setTimeout(()=>{
        verifySess();
        //}, 2000);
                
    },[verifySess]);

    return <>{ isLoggedIn ?  
        <AuthLayout title={title} description={description} menuItems={menuItems}>{children}</AuthLayout>
        : <NonAuthLayout title={title} description={description}/>}
    <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme.mode}/>
    </> ;
};
