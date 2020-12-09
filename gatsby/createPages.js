const { resolve } = require("path")

module.exports = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  // Used to detect and prevent duplicate redirects

  const docsTemplate = resolve(__dirname, "../src/templates/docs.tsx")
  // Redirect /index.html to root.
  createRedirect({
    fromPath: "/index.html",
    redirectInBrowser: true,
    toPath: "/",
  })

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(limit: 1000) {
          edges {
            node {
              fields {
                slug
                underScoreCasePath
                path
              }
            }
          }
        }
      }
    `
  )

  if (allMarkdown.errors) {
    // eslint-disable-next-line no-console
    console.error(allMarkdown.errors)

    throw Error(allMarkdown.errors)
  }
  const redirects = {}

  const { edges } = allMarkdown.data.allMarkdownRemark
  edges.forEach(edge => {
    const { slug, underScoreCasePath } = edge.node.fields
    if (slug.startsWith("docs-")) {
      const template = docsTemplate
      const createArticlePage = path => {
        if (underScoreCasePath !== path) {
          redirects[underScoreCasePath] = path
        }

        return createPage({
          path,
          component: template,
          context: {
            slug,
            type: "/docs/",
          },
        })
      }

      createArticlePage(slug.replace("/index", ""))
    }
  })

  const indexTemplate = resolve(__dirname, "../src/pages/index.tsx")

  createPage({
    path: "/",
    component: indexTemplate,
  })

  createRedirect({
    fromPath: "/docs/",
    redirectInBrowser: true,
    toPath: "/docs/getting-started",
  })

  Object.keys(redirects).map(path =>
    createRedirect({
      fromPath: path,
      redirectInBrowser: true,
      toPath: redirects[path],
    })
  )
}
