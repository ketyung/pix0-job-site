import AuthLayout from "./AuthLayout";
import NonAuthLayout from "./NonAuthLayout";
import { props } from "./AuthLayout";
import { useEffect, useState, useMemo } from "react";
import { getSession } from "next-auth/react";
import { userSignInByGid, verifyLogin } from "@/service";
import { JWTStorage } from "@/utils/local-storage";
import CommonToastContainer  from "./common/CommonToastContainer";
import Cover from "@/components/Cover";

export default function Layout({children, title, description, menuItems}: props) {
        
    //const { data: session, status } = useSession();

    const [isLoggedIn, setIsLoggedIn] = useState(true);

    const [verifying, setVerifying] = useState(false);


    const verifySess = useMemo(() => async () =>{

        setVerifying(true);
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

        setVerifying(false);
    },[setIsLoggedIn, setVerifying]);

    useEffect(()=>{
       
        //setTimeout(()=>{
        verifySess();
        //}, 2000);
    
    },[verifySess]);

    return <>{ isLoggedIn ?  
        <AuthLayout title={title} description={description} menuItems={menuItems}>{children}</AuthLayout>
        : <NonAuthLayout title={title} description={description}/>}
        <Cover visible={verifying}/>
     
    <CommonToastContainer/>
    </> ;
};