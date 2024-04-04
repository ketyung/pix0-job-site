import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";

export default function Index({
    children}: {children: React.ReactNode}) {

    return (<ThemeProvider defaultTheme={{mode : "dark"}}><Layout>{children}</Layout></ThemeProvider>)
}