import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";
import { GetServerSidePropsContext } from 'next';
import { getPubJobPosts } from "@/service";

export default function Index({
    children, title, data }: PageProps) {

    return (<ThemeProvider defaultTheme={{mode : "light"}}><Layout title={title} data={data}>{children}</Layout></ThemeProvider>)
}



interface PageProps {
    data: any,

    children?: React.ReactNode, 
    
    title? : string 
}

export async function getServerSideProps(context : GetServerSidePropsContext) {
    
    const { query } = context;

    //const pageNum = typeof query.pageNum === 'string' ? parseInt(query.pageNum, 10) : 1;

    const searchText = typeof query.searchText === 'string' ? query.searchText : "";

    
    const orderBys = typeof query.orderBy === 'string' ? query.orderBy : undefined;

    
    const data : any = await getPubJobPosts(searchText, orderBys);
  
    return {
        props: {
            data,
        },
    };
}