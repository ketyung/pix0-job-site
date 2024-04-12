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


export enum Industry {
    InformationTechnology = "Information Technology (IT)",
    Healthcare = "Healthcare",
    FinanceAndBanking = "Finance and Banking",
    Manufacturing = "Manufacturing",
    Retail = "Retail",
    Automotive = "Automotive",
    Telecommunications = "Telecommunications",
    Education = "Education",
    HospitalityAndTourism = "Hospitality and Tourism",
    RealEstate = "Real Estate",
    TransportationAndLogistics = "Transportation and Logistics",
    Entertainment = "Entertainment",
    EnergyAndUtilities = "Energy and Utilities",
    Agriculture = "Agriculture",
    Construction = "Construction",
    Aerospace = "Aerospace",
    Biotechnology = "Biotechnology",
    FoodAndBeverage = "Food and Beverage",
    MediaAndCommunications = "Media and Communications",
    Pharmaceutical = "Pharmaceutical",
}

export const Industries = getAllEnumValues(Industry);

export const JobCategorys = getAllEnumValues(JobCategory);


export const STANDARD_RES_ROWS_PER_PAGE  = 10;



export interface CloudParam {

    name?: string,

    api_key?: string,

    secret?: string, 

    upload_folder?: string, 

    pubId? : string, 
}



export interface CompanySize {

    value : string,

    label : string,
}


export const CompanySizes : CompanySize []  =[
    {value:"1-3",
    label : "1-3 Employees"},
    {value:"4-10",
    label : "4-10 Employees"},
    {value:"11-15",
    label : "11-50 Employees"},
    {value:"51-100",
    label : "51-100 Employees"},
    {value:"101-500",
    label : "101-500 Employees"},
    {value:"501-1000",
    label : "501-1000 Employees"},
    {value:"> 1000",
    label : "More Than 1000 Employees"},

]
