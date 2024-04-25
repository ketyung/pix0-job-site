import FieldLabel from "@/components/FieldLabel"
import { Input, TextArea, Button, Drawer } from "pix0-core-ui"
import { CiCircleInfo } from "react-icons/ci";
import { useState, useEffect, useMemo } from "react";
import { User } from "@prisma/client";
import { isBlank } from "@/utils";
import { toast } from "react-toastify";
import { ntb } from "@/utils";
import { BeatLoader } from "react-spinners";
import 'react-markdown-editor-lite/lib/index.css';
import MarkdownIt from 'markdown-it';
import { updateProfile, getUserProfile } from "@/service";
import ProfileImage from "@/components/ProfileImage";
import DndUploader from "@/components/DndUploader";
import ImageCropper from "@/components/ImageCropper";
import { blobUrlToBase64 } from "@/utils";

type props = {

   
    title? : string, 

    refresh? : () => void, 

    minWidth? : string, 
}

const DEFAULT_USER : User = {id:"", firstName : "", lastName: "", email: "", phoneNumber: "",
    hEmail:"", hPhoneNumber :"",dateCreated: new Date(), dateUpdated: new Date(),
    title :"Mr", googleId : null, userType: null, country: null, about : null, photoUrl: null, 
}


export default function Form({ title, refresh, minWidth} :props) {

    const mdParser = new MarkdownIt(/* Markdown-it options */);
   
    const [processing, setProcessing] = useState(false);

    const [user, setUser] = useState<User>(DEFAULT_USER);

    const [generating, setGenerating] = useState(false);

    const [viewMarkDown, setViewMarkDown] = useState(false);

    const [imageCropOpen, setImageCropOpen] = useState(false);

    const [logoImageChanged, setLogoImageChanged] = useState(false);

    const [loading, setLoading] = useState(false);

    const saveProfile = async () =>{

    

        if (isBlank(user?.firstName) ){
            toast.error(`First Name Must NOT be blank!`);
            return ;
        }
        
        if ( user) {

            setProcessing(true);

     

            let n = await updateProfile(user, (e)=>{
                toast.error(e.message);
            });
    
            setProcessing(false);
            if ( n ){
                toast.info('Successfully Updated');
                if ( refresh) {
                    refresh();
                }
                return;
            }
        }
       
    }
    
 
    const refreshProfile =  useMemo(() => async () => {
        
    
        setLoading(true);
        try {

            let u = await getUserProfile();

            if ( u!== undefined)
                setUser(u);

            setLoading(false);
        }
        catch(e: any){
            toast.error(e.message);
            setLoading(false);
        }  
    }, []);


    useEffect(()=>{
        refreshProfile();
    },[refreshProfile]);


    return <div style={minWidth? {minWidth: minWidth} : undefined} 
    className="mt-2 border border-gray-300 rounded p-2 w-full lg:mb-2 mb-20">
        <div className="mt-2 mb-2 text-left py-1 font-bold flex">
        <span className="mr-2">{title ??  "Edit Profile"}</span>
        {loading && <BeatLoader className="ml-4 inline mt-2" size={8} color="#999"/>}       
        </div>
        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="Company Logo" className="lg:w-7/12 w-full mt-2">
                <DndUploader title="Drag & Drop Profile Image Here" onDrop={(d)=>{
                         //setUser({...user, logoUrl : d});
                         setLogoImageChanged(true);
                         setImageCropOpen(true);
                    }}>
                    <ProfileImage width="90px" imageUrl={user.photoUrl !== null ? user.photoUrl : undefined}  
                    alt={ntb(user?.firstName)} paddingTop="12px" fontSize="34px"/>
                </DndUploader>
            </FieldLabel>
        </div>
        <div className="mt-2 mb-2 lg:flex text-left">
            <FieldLabel title="First Name" className="lg:w-6/12 w-full mt-2">
                <Input placeholder="First Name" onChange={(e)=>{
                    setUser({...user, firstName : e.target.value});
                }} value={ntb(user?.firstName)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
            <FieldLabel title="Last Name" className="lg:w-6/12 w-full lg:mt-2 lg:ml-2">
                <Input placeholder="Last Name" onChange={(e)=>{
                    setUser({...user, lastName: e.target.value});
                }} value={ntb(user.lastName)} className="w-full" icon={<CiCircleInfo className="mb-2"/>}/>
            </FieldLabel>
        </div>
       
        <div className="mt-2 mb-2 text-left">
        <FieldLabel title="About Yourself">
        <TextArea rows={5} value={ntb(user.about)} width="720px"
                placeholder="Add a short description about yourself"
            onChange={(e)=>{
                setUser({...user, about : e.target.value});
            }}/>
        </FieldLabel>
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Email">
                <Input placeholder="email" />
            </FieldLabel>   
        </div>
        <div className="mt-2 mb-2 text-left">
            <FieldLabel title="Phone Number">
                <Input placeholder="Phone Number" />
            </FieldLabel>   
        </div>
       

      

        <div className="mt-2 mb-2 lg:flex">
            <Button disabled={processing} className="border border-gray-300 w-48 flex rounded justify-center bg-gray-300 dark:bg-gray-600 py-1"
            onClick={async (e)=>{
                e.preventDefault();
                await saveProfile();
            }}>
             {processing ? <BeatLoader size={8} color="#999"/> :  <>Update Profile</>}
            </Button>
        </div>

        <Drawer zIndex={3000}  groupId="DrawerOfProfileImageCrop" 
        width="60%" atRight
        open={imageCropOpen} onClose={()=>{
                setImageCropOpen(false);
        }}>
            { imageCropOpen && <ImageCropper 
            imageSrc={user.photoUrl ?? ""} setCroppedImage={async (i)=>{

                let cLogoDataUrl = await blobUrlToBase64(i);
                setUser({...user, photoUrl : cLogoDataUrl});
                
            }} onClose={()=>{
                setImageCropOpen(false);
            }}/>}
        </Drawer>
    </div>

    
}