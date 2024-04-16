import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";

export default function Index({
    children, title }: {children: React.ReactNode, title? : string }) {

    return (<ThemeProvider defaultTheme={{mode : "light"}}><Layout title={title}>{children}</Layout></ThemeProvider>)
}