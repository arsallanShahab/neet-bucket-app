import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import store from "@/redux/store";
import "@/styles/globals.css";
import { Provider } from "react-redux";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//i have added worker to public folder and added this line

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function App({ Component, pageProps }) {
  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
      </Provider>
    </>
  );
}
