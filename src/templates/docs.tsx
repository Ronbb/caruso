import React, { FC } from "react"
import { graphql, PageProps } from "gatsby"
import Layout from "../components/layout"
import DocumentContent from "../components/content"

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

export interface LocalSearchMarkdowns {
  index: any
  store: any
}

interface TemplateData {
  markdownRemark: MarkdownRemarkData
  allMarkdownRemark: AllMarkdownRemarkData
  localSearchMarkdowns: LocalSearchMarkdowns
}

interface TemplateContext {
  slug: string
  type: string
  navigation: PageNavigation
}

export interface MarkdownPath {
  further: Record<string, MarkdownPath>
  slug?: string
}

const Template: FC<PageProps<TemplateData, TemplateContext>> = props => {
  const {
    data: { markdownRemark, allMarkdownRemark, localSearchMarkdowns },
    pageContext: { navigation },
  } = props

  const { frontmatter, fields, html, tableOfContents } = markdownRemark

  const menu = allMarkdownRemark.edges.reduce<MarkdownPath>(
    (result, edge) => {
      const { path: rawPath, slug } = edge.node.fields
      const rawPathArray = rawPath.split("/")
      if (rawPathArray.length === 0) {
        return result
      }
      const lastCursor = rawPathArray.reduce((previous, item) => {
        let current = previous.further[item]
        if (!current) {
          current = { further: {} }
          // eslint-disable-next-line no-param-reassign
          previous.further[item] = current
        }
        return current
      }, result)

      lastCursor.slug = slug
      return result
    },
    { further: {} }
  )

  return (
    <Layout localSearch={localSearchMarkdowns} >
      <DocumentContent
        data={{
          meta: {
            ...frontmatter,
            ...fields,
          },
          navigation,
          toc: tableOfContents,
          content: html,
        }}
        menu={menu}
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
    localSearchMarkdowns {
      index
      store
    }
  }
`
