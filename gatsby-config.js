/* eslint-disable no-useless-escape */
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.com/docs/gatsby-config/
 */

const { round } = require("lodash")

module.exports = {
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
        path: `${__dirname}/docs/`,
        ignore: ["**/.*"],
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "/assets",
        path: `${__dirname}/assets/`,
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
    "gatsby-plugin-sharp",
    "gatsby-plugin-lodash",
    "gatsby-plugin-sitemap",
  ],
}
