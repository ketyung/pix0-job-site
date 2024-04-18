import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";

const Custom404 =() =>{

    return (<ThemeProvider defaultTheme={{mode : "light"}}><Layout title="404, Page NOT found" >
         <div className="rounded border border-gray-400 w-3/5"><h1 className="text-2xl mt-10 text-gray-900">It&apos;s 404</h1></div>
         </Layout></ThemeProvider>)
}

export default Custom404;