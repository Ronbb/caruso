import React, { FC } from "react"
import { Row, Col, Menu, Layout } from "antd"
import { useMediaQuery } from "react-responsive"
import Article from "./article"
import { Frontmatter, MarkDownFields, PageNavigation } from "../../templates/docs"

export interface MainContentProps {
  data: {
    meta: Frontmatter & MarkDownFields
    navigation: PageNavigation
    toc: string | false
    content: string
  }
}

const Content: FC<MainContentProps> = props => {
  const { data } = props
  const isMobile = useMediaQuery({ query: "(max-width: 996px)" }) && window
  
  return (
    <Layout.Content id="content">
      <Row>
        {isMobile ? (
          <div />
        ) : (
          <Col xxl={4} xl={5} lg={6} md={24} sm={24} xs={24}>
            <Menu />
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

export default Content
