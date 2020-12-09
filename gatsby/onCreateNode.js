const { join } = require("path")
const { statSync } = require("fs")
const { kebabCase } = require("lodash")
const slash = require("slash2")

const handleMarkdownRemark = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  const { permalink } = node.frontmatter
  const { relativePath, sourceInstanceName } = getNode(node.parent)
  let slug = permalink
  const filePath = join(__dirname, "../", sourceInstanceName, relativePath)
  const stats = statSync(filePath)
  const modifiedTime = new Date(stats.mtime).getTime()
  const mdFilePath = join(sourceInstanceName, relativePath)
  createNodeField({
    node,
    name: "modifiedTime",
    value: modifiedTime,
  })

  if (!slug) {
    slug = `${sourceInstanceName}/${relativePath
      .replace(".md", "")}`
  }

  createNodeField({
    node,
    name: "slug",
    value: slash(kebabCase(slug.replace("/index", ""))),
  })
  createNodeField({
    node,
    name: "underScoreCasePath",
    value: slash(slug.replace("/index", "")),
  })

  createNodeField({
    node,
    name: "path",
    value: slash(mdFilePath),
  })
}

module.exports = async ({ node, actions, getNode }) => {
  switch (node.internal.type) {
    case "MarkdownRemark":
      handleMarkdownRemark({ node, actions, getNode })
      break
    default:
      break
  }
}
