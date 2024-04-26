import Image from "next/image"

type props = {
    data? : any 

    width? : string, 

    height? : string, 

    fontSize? : string,

    paddingTop? : string, 
}


export default function LogoImage({data, width, height, fontSize, paddingTop } : props) {
   
    return <>
    {data?.imageUrl!== undefined && data?.imageUrl !== null ?
    <Image className={`rounded-full`} src={data?.imageUrl} alt={`${data?.firstName} ${data?.lastName}`}
    style={{width: width ?? '30px', height : height ?? (width ?? "30px")}} width={100} height={100}/>
    : <div 
    style={{width: width ?? '30px', height : height ?? (width ?? "30px"), fontSize : fontSize , paddingTop : paddingTop ?? "4px"}}
    className={`border dark:border-gray-500 border-gray-300 rounded-full text-center dark:bg-gray-600 bg-gray-400 text-gray-100 dark:text-gray-300 font-bold`}>
    {data?.firstName?.substring(0,1).toUpperCase()}{data?.lastName?.substring(0,1).toUpperCase()}
    </div>
    }
    </>
}