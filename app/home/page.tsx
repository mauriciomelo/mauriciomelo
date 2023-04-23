"use client";
import Head from "next/head";

export default function Home() {
  return (
    <div className="flex h-screen w-full flex-col bg-black pt-[200px] text-center text-white ">
      <Head>
        <title>Mauricio Melo</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="mb-4 text-5xl font-bold md:text-8xl">Mauricio Melo</h1>

      <a className="text-fuchsia-500" href="https://github.com/mauriciomelo">
        github.com/mauriciomelo
      </a>
    </div>
  );
}
