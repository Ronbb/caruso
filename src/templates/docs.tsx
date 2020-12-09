import React, { FC } from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"
import Content from "../components/content"

interface MarkDownFields {
  path: string
  slug: string
  modifiedTime: number
}

export interface FrontmatterData extends MarkDownFields {
  title: string
  time: string
  toc: string
  order: number
  type: string
  filename: string
  subtitle: string
  path: string
  disabled: boolean
  important: boolean
  next: {
    frontmatter: GraphqlFrontmatterData
    fields: MarkDownFields
  }
  previous: { frontmatter: GraphqlFrontmatterData; fields: MarkDownFields }
}

export interface GraphqlFrontmatterData extends FrontmatterData {}

export interface MarkdownRemarkData {
  html: string
  tableOfContents: string
  frontmatter: GraphqlFrontmatterData
  fields: MarkDownFields
}

export interface AllMarkdownRemarkData {
  edges: {
    node: {
      frontmatter: GraphqlFrontmatterData
      fields: MarkDownFields
    }
    next: {
      frontmatter: GraphqlFrontmatterData
      fields: MarkDownFields
    }
    previous: { frontmatter: GraphqlFrontmatterData; fields: MarkDownFields }
  }[]
}

interface TemplateProps {
  data: {
    markdownRemark: MarkdownRemarkData
    allMarkdownRemark: AllMarkdownRemarkData
  }
}

const Template: FC<TemplateProps> = ({ data: { markdownRemark } }) => {
  const { frontmatter, fields, html, tableOfContents } = markdownRemark

  return (
    <Layout>
      <Content
        data={{
          meta: {
            ...frontmatter,
            ...fields,
            filename: fields.slug,
            path: fields.path,
          },
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
        order
        type
      }
      fields {
        path
        slug
        modifiedTime
      }
    }
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: $type } }
      sort: {
        fields: [frontmatter___order, frontmatter___type, frontmatter___time]
        order: DESC
      }
    ) {
      edges {
        node {
          frontmatter {
            title
            order
            type
            time
          }
          fields {
            slug
            path
          }
        }
      }
    }
  }
`
