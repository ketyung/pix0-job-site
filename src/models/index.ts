import { getAllEnumValues } from "@/utils";

export interface SearchResult {

    total? : number,

    results: any[],

    page? : number,

    rowsPerPage? : number, 

    totalPages? : number, 
}


export interface SignInData{

    email : string, 

    password? : string,

    accountId? : string, 
}



export enum JobCategory {
   
    Sales = "Sales",

    Admin = "Administration",

    Dev = "Development",

    Consulting = "Consulting",

    Marketing = "Marketing",

    Management = "Management",

    Finance = "Finance",
}


export const JobCategorys = getAllEnumValues(JobCategory);
