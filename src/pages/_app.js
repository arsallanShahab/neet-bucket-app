import AppLoader from "@/components/AppLoader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { setAppLoading, setAppSuccess } from "@/redux/reducer/app";
import { setToken, setUser } from "@/redux/reducer/auth";
import { setCartItems } from "@/redux/reducer/cart";
import store from "@/redux/store";
import "@/styles/globals.css";
import { useEffect } from "react";
import { Provider, useDispatch } from "react-redux";

// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

//i have added worker to public folder and added this line

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function App({ Component, pageProps }) {
  const { loading } = store.getState().app;

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart"));
    const totalQuantity = JSON.parse(localStorage.getItem("totalQuantity"));
    const totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    const token = localStorage.getItem("token");
    if (cart) {
      store.dispatch(
        setCartItems({
          cart,
          totalQuantity,
          totalPrice,
        }),
      );
    }
    if (token && token !== "undefined" && token !== "null") {
      store.dispatch(setAppLoading(true));
      store.dispatch(setUser(token));
      store.dispatch(setToken(token));
      store.dispatch(setAppLoading(false));
    }
  }, []);

  return (
    <>
      <Provider store={store}>
        <Navbar />
        <Component {...pageProps} />
        <Toaster />
        <Footer />
        {loading && <AppLoader />}
      </Provider>
    </>
  );
}
