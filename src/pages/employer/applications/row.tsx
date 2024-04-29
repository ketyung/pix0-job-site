import ListActionDropDown from "@/components/ListActionDropDown";
import { deleteJobPost } from "@/service";
import { ntb } from "@/utils";
import { toast } from "react-toastify";
import { Button, Checkbox} from 'pix0-core-ui';
import Link from "next/link";
import { formatRelativeDate } from "@/utils";

type props ={
    row : any, 

    refresh? : () => void, 

    onEdit?: (id? : string) => void, 

    index? : number,

    openSelectedJob? : (id : string) => void,
}

export default function Row({row, refresh, onEdit, index, openSelectedJob} :props) {

    const deleteRow = async () =>{

        if ( window.confirm('Are you sure you wanna remove the selected Job Post?')) {

            let s = await deleteJobPost(row.id, (e)=>{
                toast.error(e.message);
            })

            if (s) {
                if ( refresh) refresh();
            } else {
                toast.error('Failed To Delete Selected Row!');     
            }
        }
    }

    return <tr className="dark:hover:bg-gray-700 hover:bg-gray-100 hover:cursor-pointer hover:shadow-xl">
         <td className="hidden lg:inline-block text-center py-2">{<Checkbox checked={false}
        lightBgColor="#ed8" groupId="invCb">{index && <span className="ml-1">{index}</span>}</Checkbox>}</td>
        <td className="px-1 whitespace-nowrap py-2"><Link title="Click To Preview Job Post" 
        href={`/jobPost/${row?.id}`} target="_blank">{ntb(row?.title)}</Link></td>
        <td className="px-1 py-2">{row?.application?.length}{openSelectedJob && <Button className="ml-2 p-1 rounded border border-gray-400"
        onClick={(e)=>{
            e.preventDefault();
            openSelectedJob(row?.id);  
        }}>
        Analyze By AI</Button>}</td>
        <td className="px-6 py-2" title={new Date(row?.datePub).toLocaleString()}>{formatRelativeDate(new Date(row?.datePub))}</td>
        <td className="px-1 whitespace-nowrap text-center py-2"><ListActionDropDown onDelete={deleteRow}/></td>
    </tr>
    
}