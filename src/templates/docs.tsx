import React, { FC } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Content from "../components/content"

export interface MarkDownFields {
  path: string
  slug: string
  modifiedTime: number
}

export interface Frontmatter {
  title: string
  subtitle: string
  datetime: string
  tags: string[]
}

interface WordCount {
  words: number
}

export interface MarkdownRemarkData {
  html: string
  tableOfContents: string
  frontmatter: Frontmatter
  fields: MarkDownFields
  wordCount: WordCount
}

export interface AllMarkdownRemarkData {
  edges: {
    node: {
      frontmatter: Frontmatter
      fields: MarkDownFields
    }
  }[]
}

export interface PageNavigation {
  previous: MarkDownFields | null
  next: MarkDownFields | null
}

interface TemplateProps {
  data: {
    markdownRemark: MarkdownRemarkData
    allMarkdownRemark: AllMarkdownRemarkData
  }
  pageContext: {
    slug: string
    type: string
    navigation: PageNavigation
  }
}

const Template: FC<TemplateProps> = props => {
  const {
    data: { markdownRemark, allMarkdownRemark },
    pageContext: { navigation }
  } = props
console.log(props, allMarkdownRemark)

  const { frontmatter, fields, html, tableOfContents } = markdownRemark

  return (
    <Layout>
      <Content
        data={{
          meta: {
            ...frontmatter,
            ...fields,
          },
          navigation,
          toc: tableOfContents,
          content: html,
        }}
      />
    </Layout>
  )
}

export default Template

export const pageQuery = graphql`
  query TemplateDocsMarkdown($slug: String!, $type: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      tableOfContents
      frontmatter {
        title
        datetime
        subtitle
        tags
      }
      fields {
        path
        slug
        modifiedTime
      }
      wordCount {
        words
      }
    }
    allMarkdownRemark(
      filter: { fields: { type: { eq: $type } } }
      sort: { fields: [frontmatter___datetime], order: DESC }
    ) {
      edges {
        node {
          frontmatter {
            title
            datetime
            subtitle
            tags
          }
          fields {
            path
            slug
            modifiedTime
          }
        }
      }
    }
  }
`
