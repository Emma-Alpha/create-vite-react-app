import { Spin } from "antd";
import { t } from "i18next";
import { Outlet} from "react-router-dom";


export const MainContentLayout = () => {

  const loadingTip =  t("toast.loading")

  return (
    <Spin
      className="!max-h-none"
      spinning={false}
      tip={loadingTip}
    >
      <Outlet />
    </Spin>
  );
};
