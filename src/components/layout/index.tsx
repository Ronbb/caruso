import React, { FC } from "react"
import { IntlProvider } from "react-intl"
import { ConfigProvider, Layout } from "antd"
import zhCN from "antd/lib/locale-provider/zh_CN"
import cnLocale from "../../static/locale/zh-CN"
import "../../static/style/index.less"
import Header from "./header"
import Footer from "./footer"

const CustomLayout: FC = (props) => {
    const { children } = props
    return (
      <IntlProvider locale={cnLocale.locale} messages={cnLocale.messages}>
        <ConfigProvider locale={zhCN}>
          <Layout>
            <Header />
            {children}
            <Footer />
          </Layout>
        </ConfigProvider>
      </IntlProvider>
    )
  }

export default CustomLayout
