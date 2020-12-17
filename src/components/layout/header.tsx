import React, { FC, useEffect, useState } from "react"
import { FormattedMessage } from "react-intl"
import { Link } from "gatsby"
import { EyeOutlined } from "@ant-design/icons"
import { Row, Col, Select, Button, Layout, Space, Menu } from "antd"
import { useFlexSearch } from "react-use-flexsearch"
import FlexSearch from "flexsearch"
import { lowerCase, words } from "lodash"

export interface HeaderProps {
  localSearch: {
    index: string
    store: any
  }
}

const createIndex = exported => {
  const index = FlexSearch.create({
    encode: false,
    tokenize: (item: string) => words(item).map(lowerCase),
  })
  index.import(exported)
  return index
}

const Header: FC<HeaderProps> = ({ localSearch }) => {
  const [index, setIndex] = useState<FlexSearch>(createIndex(localSearch.index))

  useEffect(() => {
    setIndex(createIndex(localSearch.index))
  }, [localSearch.index])

  const results = useFlexSearch(
    { query: "ant 构建", suggest: true },
    index,
    localSearch.store
  )
  console.log(results)

  return (
    <div>
      <Layout.Header id="header">
        <Row>
          <Col xxl={4} xl={5} lg={8} md={8} sm={24} xs={24}>
            <Link id="logo" to="/">
              <span>this is a logo</span>
            </Link>
          </Col>
          <Col xxl={20} xl={19} lg={16} md={16} sm={0} xs={0}>
            <Menu
              id="header-menu"
              theme="light"
              mode="horizontal"
            >
              <Menu.Item key="1">nav 1</Menu.Item>
              <Menu.Item key="2">nav 2</Menu.Item>
              <Menu.Item key="3">nav 3</Menu.Item>
            </Menu>
            <div id="header-right">
              <Space size="middle">
                <Button size="small">
                  <FormattedMessage id="app.header.lang" />
                </Button>
                <a
                  id="preview-button"
                  target="_blank"
                  href="http://ronbb.fun/"
                  rel="noopener noreferrer"
                >
                  <Button icon={<EyeOutlined />} size="small">
                    <FormattedMessage
                      tagName="span"
                      id="app.header.menu.more"
                    />
                  </Button>
                </a>
                <Select size="small" value="stable">
                  <Select.Option value="v1">v1</Select.Option>
                  <Select.Option value="v2">v2</Select.Option>
                  <Select.Option value="stable">v4</Select.Option>
                </Select>
              </Space>
            </div>
          </Col>
        </Row>
      </Layout.Header>
    </div>
  )
}

export default Header
