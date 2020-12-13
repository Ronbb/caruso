import React, { FC, useRef } from "react"
import { FormattedMessage } from "react-intl"
import { Helmet } from "react-helmet"
import { Affix, Button, Tooltip } from "antd"
import dayjs from "dayjs"
import { EditOutlined } from "@ant-design/icons"
import { Frontmatter, MarkDownFields } from "../../templates/docs"

interface ArticleProps {
  content: {
    meta: Frontmatter & MarkDownFields
    toc: string | false
    content: string
  }
}

const Article: FC<ArticleProps> = props => {
  const node = useRef<HTMLElement>(null)

  const { content } = props
  const { meta } = content
  const { title, subtitle, modifiedTime } = meta
  const hideToc = !content.toc || content.toc.length <= 1

  return (
    <>
      <Helmet>
        <title>{`${title} - ronbb`}</title>
        <meta name="description" content={title} />
      </Helmet>
      <article className="markdown" id="article" ref={node}>
        <h1>
          {title}
          <span className="subtitle">{subtitle}</span>
          <Tooltip title={<FormattedMessage id="app.content.edit-page" />}>
            <Button type="text" shape="circle" icon={<EditOutlined />} />
          </Tooltip>
        </h1>
        <div id="modified-time">
          <FormattedMessage id="app.content.modifiedTime" />
          {"  "}
          {dayjs(modifiedTime).format("YYYY-MM-DD HH:mm:ss")}
        </div>
        {hideToc ? null : (
          <Affix className="toc-affix" offsetTop={16}>
            <div
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: (content.toc as string)
                  .replace(/<ul>/g, '<ul class="toc">')
                  .replace(/\/#/g, "#"),
              }}
            />
          </Affix>
        )}
        <section
          className="markdown api-container"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: content.content }}
        />
      </article>
    </>
  )
}

export default Article
