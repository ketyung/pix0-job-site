import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/utils/cropImg';
import { Button, Slider } from 'pix0-core-ui';
import FieldLabel from './FieldLabel';
import { CiCircleCheck} from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { GrPowerReset } from "react-icons/gr";
import './css/ImageCropper.css';

interface ImageCropperProps {
      
      imageSrc: string,
      
      aspectRatio?: number,

      setCroppedImage? : (newImg : string) => void,

      onClose? : () => void, 

      cropShape? : string, 
  }
  

const ImageCropper = ({ imageSrc, aspectRatio = 1 / 1, setCroppedImage,onClose, cropShape = 'round' } : ImageCropperProps) => {
  
  const [image] = useState(imageSrc); // The image source

  const [crop, setCrop] = useState({ x: 0, y: 0 }); // Initial crop position
  
  const [zoom, setZoom] = useState(1); // Initial zoom level

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>();

  const onCropChange = (crop : any)  => {
        setCrop(crop);
  };

  const onZoomChange = (zoom : any) => {
        setZoom(zoom);
  };

  const onCropComplete = (_croppedArea : any, _croppedAreaPixels : any) => {

       setCroppedAreaPixels( _croppedAreaPixels);
       //console.log("onCropComplete:::", croppedArea, _croppedAreaPixels);
  };

  const resetAll = () =>{
      setCrop( {x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(undefined);
      if ( setCroppedImage) setCroppedImage(image);
  }

  const applyCroppedImage = async () => {
      try {
            const croppedImage = await getCroppedImg(image,croppedAreaPixels);

            if ( setCroppedImage && croppedImage!== null ) setCroppedImage(croppedImage);
            
      } 
      catch (e) {
            console.error(e)
      }
  }
  

  return (
        <div className='p-4 overflow-y-auto mb-20'>
         
            <div className="crop-container">
            <div className='crop-title'>
            Crop The Image
            </div>
            <Cropper cropSize={{width:320, height:320}}
                  image={image}
                  crop={crop}
                  zoom={zoom}
                  aspect={aspectRatio} // Aspect ratio (optional)
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  cropShape={cropShape ==='round' ? 'round' : 'rect'}
            />
            </div>
            <div className="controls flex-col p-2 mb-2">
                  <FieldLabel title='Zoom' className='lg:w-3/5 w-4/5 mx-auto'>
                        <Slider initialValue={zoom} onChange={(z)=>{
                              if ( z>=1) setZoom(z);
                        }} step={0.1} max={10} min={1}/>
                  </FieldLabel>
                  <div className='flex mt-2 mb-2'>
                        <Button className='ml-4 lg:w-28 w-20 rounded-full border border-gray-500 p-1'
                        onClick={async (e)=>{
                              e.preventDefault();
                              await applyCroppedImage();
                        }}>
                        <span className='lg:inline-block hidden mr-1'>Apply</span><CiCircleCheck className='inline w-5 h-5 ml-1'/>
                        </Button>

                        <Button className='ml-2 lg:w-28 w-20 rounded-full border border-gray-500 p-1'
                        onClick={async (e)=>{
                              e.preventDefault();
                              resetAll();
                        }}>
                        <span className='lg:inline-block hidden mr-1'>Reset</span><GrPowerReset className='inline w-5 h-5 ml-1'/>
                        </Button>
                        { onClose && 
                        <Button className='ml-2 lg:w-28 w-20 rounded-full border border-gray-500 p-1'
                        onClick={async (e)=>{
                              e.preventDefault();
                              onClose();
                        }}>
                        <span className='lg:inline-block hidden mr-1'>Close</span><IoMdClose className='inline w-5 h-5 ml-1'/>
                        </Button>}
                  </div>
            </div>
        </div>
  );
};

export default ImageCropper;
