import AppLoader from "@/components/AppLoader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { setAppLoading } from "@/redux/reducer/app";
import { setToken, setUser } from "@/redux/reducer/auth";
import { setCartItems } from "@/redux/reducer/cart";
import store from "@/redux/store";
import "@/styles/globals.css";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Provider } from "react-redux";

export default function App({ Component, pageProps }) {
  const { loading } = store.getState().app;
  const router = useRouter();
  const path = router.pathname;
  const isTestPage = path.includes("test");

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
      <AnimatePresence mode="sync">
        <Provider store={store}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
          {!isTestPage && <Footer />}
          {loading && <AppLoader />}
        </Provider>
      </AnimatePresence>
    </>
  );
}
