import { SearchResult } from "@/models"
import { Button } from "pix0-core-ui"

type props ={

    result : SearchResult,

    setNextPage? : (nextPage: number)=>void, 
}


function hasMorePages(result: SearchResult): boolean {
    if (!result.total || !result.rowsPerPage || !result.page) {
        return false; // If any required property is missing, return false
    }
    const totalPages = Math.ceil(result.total / result.rowsPerPage);
    return result.page < totalPages;
}

export default function LoadMore ({result, setNextPage}:props){

    return hasMorePages(result) && <Button className="rounded bg-orange-600 text-gray-200 p-1 w-48"
    onClick={(e)=>{
        e.preventDefault();
        if ( setNextPage) setNextPage((result.page ?? 0) + 1);
    }}>Load More</Button>
}