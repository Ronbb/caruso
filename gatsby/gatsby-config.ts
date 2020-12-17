/* eslint-disable no-useless-escape */
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

import { flattenDeep, lowerCase, round, words } from "lodash"
import { GatsbyConfig } from "gatsby"
import { resolveRoot, chinesePunctuation } from "./utils"

const config: GatsbyConfig = {
  siteMetadata: {
    title: "CARUSO",
    description: "caruso",
    author: "ronbb",
    siteUrl: "https://ronbb.fun",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-typescript",
      options: {
        isTSX: true,
        jsxPragma: "jsx",
        allExtensions: true,
      },
    },
    {
      resolve: "gatsby-plugin-less",
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
    {
      resolve: "gatsby-plugin-antd",
      options: {
        style: true,
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "/docs",
        path: resolveRoot("docs/"),
        ignore: ["**/.*"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "/assets",
        path: resolveRoot("assets/"),
        ignore: ["**/.*"],
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          "gatsby-remark-autolink-headers",
          "gatsby-remark-copy-linked-files",
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              noInlineHighlight: true,
            },
          },
          {
            resolve: `gatsby-remark-images`,
            options: {
              maxWidth: 960,
              quality: 90,
              showCaptions: true,
              wrapperStyle: fluidResult =>
                `flex:${round(fluidResult.aspectRatio, 2)};`,
            },
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-local-search",
      options: {
        name: "markdowns",
        engine: "flexsearch",
        engineOptions: {
          encode: false,
          tokenize(item: string) {
            const object = JSON.parse(item.replace(chinesePunctuation, " "))
            const { path, tags, title, subtitle, body } = object
            const tokens: string[] = []
            tokens.push(
              ...flattenDeep([path, ...tags, title, subtitle, body].map(words))
            )
            return tokens.map(lowerCase)
          },
        },
        query: `
          {
            allMarkdownRemark {
              nodes {
                id
                frontmatter {
                  title
                  subtitle
                  tags
                }
                fields {
                  path
                }
                excerpt
              }
            }
          }
        `,
        ref: "id",
        normalizer: ({ data }) =>
          data.allMarkdownRemark.nodes.map(node => ({
            id: node.id,
            path: node.fields.path,
            tags: node.frontmatter.tags,
            title: node.frontmatter.title,
            subtitle: node.frontmatter.subtitle,
            body: node.excerpt,
          })),
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-plugin-lodash",
    "gatsby-plugin-sitemap",
  ],
}

export default config
