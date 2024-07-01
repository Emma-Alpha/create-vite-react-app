import { App as AntdApp, ConfigProvider } from "antd";
import enUS from "antd/locale/en_US";
import zhCN from "antd/locale/zh_CN";
import { Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { RouterProvider } from "react-router-dom";

import AntdGlobalComp from "./AntdGlobalComp";
import router from "./routes";
import { getLocale } from "@/utils/storage.ts";

function App() {
  const basename = (window as any).__MICRO_APP_BASE_ROUTE__ ?? "/";

  const locale = getLocale();
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        cacheTime: 0,
      },
    },
  });

  return (
    <ConfigProvider
      button={{ autoInsertSpace: false }}
      locale={locale === "zh-CN" ? zhCN : enUS}
      theme={{
        token: { colorPrimary: "#0089FF" },
      }}
    >
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<div>loading...</div>}>
          <AntdApp>
            <AntdGlobalComp />
            <RouterProvider router={router(basename)} />
          </AntdApp>
        </Suspense>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ConfigProvider>
  );
}

export default App;
