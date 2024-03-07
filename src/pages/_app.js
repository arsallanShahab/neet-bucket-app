import AppLoader from "@/components/AppLoader";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";
import { setAppLoading } from "@/redux/reducer/app";
import { setToken, setUser } from "@/redux/reducer/auth";
import { setCartItems } from "@/redux/reducer/cart";
import store from "@/redux/store";
import "@/styles/globals.css";
import { NextUIProvider } from "@nextui-org/react";
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
    const cartWeb = localStorage.getItem("cart");
    let cart;
    if (cartWeb && cartWeb !== "undefined" && cartWeb !== "null") {
      cart = JSON.parse(cartWeb);
    }

    const totalQuantityWeb = localStorage.getItem("totalQuantity");
    let totalQuantity;
    if (
      totalQuantityWeb &&
      totalQuantityWeb !== "undefined" &&
      totalQuantityWeb !== "null"
    ) {
      totalQuantity = JSON.parse(totalQuantityWeb);
    }

    const totalPriceWeb = localStorage.getItem("totalPrice");
    let totalPrice;
    if (
      totalPriceWeb &&
      totalPriceWeb !== "undefined" &&
      totalPriceWeb !== "null"
    ) {
      totalPrice = JSON.parse(totalPriceWeb);
    }
    const token = localStorage.getItem("token");
    if (cart?.length) {
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
    <NextUIProvider>
      <AnimatePresence mode="sync">
        <Provider store={store}>
          <Navbar />
          <Component {...pageProps} />
          <Toaster />
          {!isTestPage && <Footer />}
          {loading && <AppLoader />}
        </Provider>
      </AnimatePresence>
    </NextUIProvider>
  );
}
