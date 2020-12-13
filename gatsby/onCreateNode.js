const { join } = require("path")
const { kebabCase } = require("lodash")
const slash = require("slash2")

const handleMarkdownRemark = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  const {
    relativeDirectory,
    name,
    relativePath,
    sourceInstanceName,
    modifiedTime,
  } = getNode(node.parent)
  const markdownFilePath = join(sourceInstanceName, relativePath)
  createNodeField({
    node,
    name: "modifiedTime",
    value: modifiedTime,
  })

  const slug = join(sourceInstanceName, relativeDirectory, kebabCase(name))
  
  createNodeField({
    node,
    name: "type",
    value: slash(sourceInstanceName),
  })

  createNodeField({
    node,
    name: "slug",
    value: slash(slug.replace("/index", "")),
  })

  createNodeField({
    node,
    name: "path",
    value: slash(markdownFilePath),
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
