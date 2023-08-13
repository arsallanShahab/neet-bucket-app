import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { setToken, setUser } from "@/redux/reducer/auth";
import { addCartFromLocalStorage } from "@/redux/reducer/cart";
import store from "@/redux/store";
import "@/styles/globals.css";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//i have added worker to public folder and added this line

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const totalQuantity = JSON.parse(localStorage.getItem("totalQuantity"));
    const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    const token = localStorage.getItem("token");
    if (cart) {
      store.dispatch(
        addCartFromLocalStorage({
          cart,
          totalQuantity,
          totalPrice,
        }),
      );
    }
    if (token && token !== "undefined" && token !== "null") {
      store.dispatch(setUser(token));
      store.dispatch(setToken(token));
    }
  }, []);
  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
        <Footer />
      </Provider>
    </>
  );
}
