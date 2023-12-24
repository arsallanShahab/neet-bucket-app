import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <link rel="manifest" href="/manifest.json" /> */}
        {/* <link rel="stylesheet" href="https://rsms.me/inter/inter.css" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="NeetBucket is a platform where you can buy study material like notes, pdfs, etc. for students preparing NEET exams"
        />
        <meta
          name="keyword"
          content="neetbucket, neet bucket, neetbucket.in, neetbucket.com, neetbucket notes, neetbucket pdf, neetbucket notes pdf, neetbucket notes download, neetbucket pdf download, neetbucket notes free download, neetbucket pdf free download, neetb ucket pdf download free, neetbucket pdf download free, neetbucket notes,NEET,NTA,national eligibility cum entrance test,neet 2021,neet 2022,neet 2023,buy neet notes,prepare neet at home,neet preparation,neet preparation app,neet preparation books,neet preparation books pdf,neet preparation books free download,neet preparation books pdf free download,neet preparation books free download pdf in hindi,neet preparation books free download pdf in english,neet preparation books free download pdf in hindi medium,neet preparation books free download pdf in english medium,neet preparation books free download pdf in hindi medium,neet preparation books free download pdf in english medium"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.neetbucket.com/" />
        <meta property="og:title" content="NeetBucket" />
        <meta
          property="og:description"
          content="NeetBucket is a platform where you can buy study material like notes, pdfs, etc. for students preparing NEET exams"
        />
        <link rel="canonical" href="https://www.neetbucket.com/" />
        {/* <meta name="robots" content="index, follow" />
          <meta name="googlebot" content="index, follow" />
          <meta name="google" content="notranslate" />
          <meta name="google" content="nositelinkssearchbox" />
          <meta name="google" content="nositelinkssearchbox" />

          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://www.pdfnotes.co/" />
          <meta property="og:title" content="PDF Notes" />
          <meta property="og:description" content="PDF Notes is a platform where you can download free study material like notes, pdfs, ebooks, etc. for school, college, and university students." />
          <meta property="og:image" content="https://www.pdfnotes.co/og-image.png" /> */}
      </Head>
      <body>
        <Main />
        <NextScript></NextScript>
        <script
          async
          src="https://checkout.razorpay.com/v1/checkout.js"
        ></script>
      </body>
    </Html>
  );
}
