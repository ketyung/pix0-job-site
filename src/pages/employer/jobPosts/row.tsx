import ListActionDropDown from "@/components/ListActionDropDown";
import { deleteJobPost } from "@/service";
import { ntb } from "@/utils";
import { toast } from "react-toastify";
import { Checkbox} from 'pix0-core-ui';
import Link from "next/link";

type props ={
    row : any, 

    refresh? : () => void, 

    onEdit?: (id? : string) => void, 

    index? : number,
}

export default function Row({row, refresh, onEdit, index} :props) {

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
        <td className="hidden lg:inline-block px-1 whitespace-nowrap py-2">{ntb(row?.code)}</td>
        <td className="px-1 whitespace-nowrap py-2"><Link title="Click To Preview Job Post" 
        href={`/employer/jobPosts/${row?.id}`} target="_blank">{ntb(row?.title)}</Link></td>
        <td className="hidden lg:inline-block py-2">{ntb(row?.jobCategory)}</td>
        <td className="inline-block pl-10 py-2 text-left">{ntb(row?.jobStatus)}</td>
        <td className="px-1 whitespace-nowrap text-center py-2"><ListActionDropDown onDelete={deleteRow}
        onEdit={()=>{
            if ( onEdit ){
                onEdit(row?.id);
            }
        }}/></td>
    </tr>
    
}