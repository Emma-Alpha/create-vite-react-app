import { LocaleString } from "@/store/type";
import localForage from "localforage";

localForage.config({
  name: "Vite-Config",
});

export const getLocale = (): LocaleString =>
  (localStorage.getItem("IM_LOCALE") as LocaleString) || "zh-CN";
