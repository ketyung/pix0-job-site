import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";
import Link from "next/link";

export default function Custom404() {

    return (<ThemeProvider defaultTheme={{mode : "light"}}><Layout title="Page NOT Found - 404 @ Pix0 Job Site">
        <div className="bg-gray-100 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
                  Page NOT Found
                </h2>
            
            </div>
      </div>
        </div>    
        </Layout></ThemeProvider>)
}

