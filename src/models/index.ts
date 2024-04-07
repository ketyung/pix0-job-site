
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
