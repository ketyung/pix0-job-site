import Head from "next/head";

const Custom404 =() =>{

    return <><Head><title>Page NOT found!</title>
        <meta name="description" content="Something is missing!" />
        </Head>
        <div className="rounded border border-gray-400 w-3/5"><h1 className="text-2xl mt-10 text-gray-900">It&apos;s 404</h1></div>
    </>
         
}

export default Custom404;