import Layout  from "./layout2";
import { ThemeProvider } from "pix0-core-ui";
import Link from "next/link";

export default function About() {

    return (<ThemeProvider defaultTheme={{mode : "light"}}><Layout title="About Us - Pix0 Job Site">
    <div className="bg-gray-100 dark:bg-gray-800 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 sm:text-4xl">
                Welcome to Pix0 Job Site!
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 text-left">
                At Pix0 Job Site, we believe in revolutionizing the way people connect with employment opportunities. 
                Our platform is not just another job board; it's a dynamic ecosystem powered by cutting-edge AI technology.
            </p>
        </div>
        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-12">
            <div className="rounded-xl border border-gray-300 p-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">For Employers</h3>
                <p className="text-lg dark:text-gray-300 text-gray-600 mb-4">Pix0 Job Site offers intuitive tools to create compelling job descriptions in seconds. 
                Simply provide a job title, and our AI will generate a comprehensive description tailored to your needs.</p>
                <p className="text-lg dark:text-gray-300 text-gray-600 mb-4">Our <Link href="/employer/applications">AI scoring system</Link> analyzes job applications and resumes, providing insightful 
                recommendations to identify the best-fit candidates quickly.</p>
            </div>
            <div className="rounded-xl border border-gray-300 p-2">
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">For Job Seekers</h3>
                <p className="text-lg dark:text-gray-300 text-gray-600 mb-4">Crafting a standout resume is no longer a daunting task. With our <Link href="/jobSeeker/resume">AI-powered resume builder</Link>, 
                users can input their skills, experiences, and personal information to create professional resumes in no time.</p>
                <p className="text-lg dark:text-gray-300 text-gray-600 mb-4">Furthermore, our platform ensures that resumes are free from unsuitable content, 
                providing a secure and professional environment for all users.</p>
            </div>
        </div>
        <div className="mt-20 text-left">
            <p className="text-lg dark:text-gray-300 text-gray-600">
                At Pix0 Job Site, we prioritize user experience and safety. Our AI algorithms constantly monitor job posts, resumes, 
                and user-generated content to filter out inappropriate or harmful material.
            </p>
            <p className="text-lg dark:text-gray-300 text-gray-600 mt-10">
                As we continue to evolve, Pix0 Job Site is committed to introducing innovative features such as personalized job matching 
                based on individual preferences. Join us on our journey to revolutionize the future of hiring with AI innovation.
            </p>
                </div>
            </div>
        </div>

        
        </Layout></ThemeProvider>)
}

