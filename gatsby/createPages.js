const { resolve } = require("path")

module.exports = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions
  const docsTemplate = resolve(__dirname, "../src/templates/docs.tsx")
  createRedirect({
    fromPath: "/index.html",
    redirectInBrowser: true,
    toPath: "/",
  })

  const allMarkdown = await graphql(
    `
      {
        allMarkdownRemark(sort: { fields: [frontmatter___datetime], order: DESC }) {
          edges {
            node {
              frontmatter {
                title
                tags
                datetime
              }
              fields {
                slug
                path
                modifiedTime
                type
              }
            }
            next {
              fields {
                path
                slug
              }
              frontmatter {
                tags
                datetime
                title
              }
            }
            previous {
              fields {
                slug
                path
                modifiedTime
              }
              frontmatter {
                tags
                datetime
                title
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
  edges.forEach(({ node, previous, next }) => {
    const { slug, type } = node.fields
    if (type === "/docs") {
      const createArticlePage = path => {
        return createPage({
          path,
          component: docsTemplate,
          context: {
            slug,
            type,
            navigation: { previous, next },
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
    toPath: "/",
  })

  Object.keys(redirects).map(path =>
    createRedirect({
      fromPath: path,
      redirectInBrowser: true,
      toPath: redirects[path],
    })
  )
}
