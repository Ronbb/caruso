import React, { FC } from "react"
import { Row, Col, Menu, Layout } from "antd"
import { useMediaQuery } from "react-responsive"
import { FileTextOutlined, FolderOutlined } from "@ant-design/icons"
import { isEqual, keys } from "lodash"
import { Link } from "gatsby"
import Article from "./article"
import {
  Frontmatter,
  MarkDownFields,
  MarkdownPath,
  PageNavigation,
} from "../../templates/docs"

export type DocumentMenu = MarkdownPath

export type DocumentMeta = Frontmatter & MarkDownFields

export interface DocumentMenuProps {
  title?: React.ReactText
  menu: DocumentMenu
}

export interface DocumentContentProps {
  menu: DocumentMenu
  data: {
    meta: DocumentMeta
    navigation: PageNavigation
    toc: string
    content: string
  }
}

interface InsideCreatorOptions {
  path: string
  title?: string
  further: MarkdownPath
}

const DesktopMenu: FC<DocumentMenuProps> = ({ menu }) => {
  const openKeys: string[] = []
  const insideCreator = ({ path, title, further }: InsideCreatorOptions) => {
    const furtherPath = `${path}/${title}`
    const inside = keys(further.further)
      .map(moreFurtherKey => {
        const moreFurther = further.further[moreFurtherKey]
        return [
          moreFurther.slug && (
            <Menu.Item key={moreFurther.slug} icon={<FileTextOutlined />}>
              <Link to={moreFurther.slug}>{moreFurtherKey}</Link>
            </Menu.Item>
          ),
          isEqual(moreFurther.further, {}) ||
            insideCreator({
              path: furtherPath,
              title: moreFurtherKey,
              further: moreFurther,
            }),
        ]
      })
      .flat()

    openKeys.push(furtherPath)
    return title ? (
      <Menu.SubMenu key={furtherPath} title={title} icon={<FolderOutlined />}>
        {inside}
      </Menu.SubMenu>
    ) : (
      inside
    )
  }

  return (
    <Menu
      mode="inline"
      defaultOpenKeys={openKeys}
      inlineIndent={12}
      expandIcon={<div />}
    >
      {insideCreator({ further: menu, path: "/" })}
    </Menu>
  )
}

const DocumentContent: FC<DocumentContentProps> = props => {
  const { data, menu } = props
  const isMobile = useMediaQuery({ query: "(max-width: 996px)" }) && window

  return (
    <Layout.Content id="content">
      <Row gutter={64}>
        {isMobile ? (
          <div />
        ) : (
          <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24}>
            <DesktopMenu menu={menu} />
          </Col>
        )}
        <Col xxl={20} xl={19} lg={18} md={24} sm={24} xs={24}>
          <div>
            <Article {...props} content={data} />
          </div>
        </Col>
      </Row>
    </Layout.Content>
  )
}

export default DocumentContent
