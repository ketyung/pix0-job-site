import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";
import Link from "next/link";

export default function About() {

    return (<ThemeProvider><Layout title="About Us - Pix0 Job Site">
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
            
        <div className="mt-2 p-2 lg:w-8/12 w-11/12 mx-auto">
                <h1 className="font-bold mb-2 text-2xl">Privacy Policy</h1>
                
                <h2 className="mt-4 font-bold text-xl">Information Collection and Use</h2>
                <p>We collect personal information for various purposes, including but not limited to:</p>
                <ul>
                    <li>Providing and improving the Pix0 AI Job Site</li>
                    <li>Customizing and personalizing user experience</li>
                    <li>Analyzing usage and performance data</li>
                </ul>
                
                <h2 className="mt-4 font-bold text-xl">Log Data</h2>
                <p>Like many websites, we collect information that your browser sends whenever you visit our site (&quot;Log Data&quot;). This Log Data may include information such as your computer&apos;s Internet Protocol (&quot;IP&quot;) address, browser type, browser version, the pages of our site that you visit, the time and date of your visit, the time spent on those pages, and other statistics.</p>
                
                <h2 className="mt-4 font-bold text-xl">Cookies</h2>
                <p>Our website may use &quot;cookies&quot; to enhance the user experience. Cookies are small text files that are stored on your computer or mobile device by your web browser. They are used to remember user preferences, store information for things like shopping carts, and provide anonymized tracking data to third-party applications like Google Analytics. You have the option to disable cookies in your browser settings, but this may affect the functionality of the website.</p>
                
                <h2 className="mt-4 font-bold text-xl">Service Providers</h2>
                <p>We may employ third-party companies and individuals to facilitate our service (&quot;Service Providers&quot;), provide the service on our behalf, perform service-related services, or assist us in analyzing how our service is used.</p>
                <p>These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>
                
                <h2 className="mt-4 font-bold text-xl">Security</h2>
                <p>We value your trust in providing us with your personal information, thus we are striving to use commercially acceptable means of protecting it. However, please be aware that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.</p>
                <h2 className="mt-4 font-bold text-xl">Contact Us</h2>
                <p>If you have any questions about our Privacy Policy, please contact us at pix0.labs.23@gmail.com</p>
            </div>

        </div>
        </Layout></ThemeProvider>)
}

