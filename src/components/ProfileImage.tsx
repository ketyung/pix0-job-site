import Image from "next/image"

type props = {

    alt? : string, 

    imageUrl? : string|null,  

    width? : string, 

    height? : string, 

    fontSize? : string,

    paddingTop? : string, 
}


export default function ProfileImage({imageUrl, width, height, fontSize, paddingTop, alt } : props) {
   
    return <>
    {imageUrl!== undefined && imageUrl !== null ?
    <Image className={`rounded-full`} src={imageUrl} alt={alt ?? ""}
    style={{width: width ?? '30px', height : height ?? (width ?? "30px")}} width={100} height={100}/>
    : <div 
    style={{width: width ?? '30px', height : height ?? (width ?? "30px"), fontSize : fontSize , paddingTop : paddingTop ?? "4px"}}
    className={`border dark:border-gray-500 border-gray-700 rounded-full text-center dark:bg-gray-600 bg-gray-400 text-gray-100 dark:text-gray-300 font-bold`}>
    {alt?.substring(0,1).toUpperCase()}
    </div>
    }
    </>
}