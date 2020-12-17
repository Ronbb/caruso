import { join } from "path"
import { kebabCase } from "lodash"
import slash from "slash2"
import { GatsbyNode } from "gatsby"

type OnCreateNode = GatsbyNode["onCreateNode"]

const handleMarkdownRemark: OnCreateNode = ({ node, actions, getNode }) => {
  if (!node.parent) {
    return
  }

  const { createNodeField } = actions
  const { relativeDirectory, name, sourceInstanceName, modifiedTime } = getNode(
    node.parent
  )

  const slug = join(
    sourceInstanceName as string,
    relativeDirectory as string,
    kebabCase(name as string)
  )
  const path = join(relativeDirectory as string, name as string)

  createNodeField({
    node,
    name: "modifiedTime",
    value: modifiedTime,
  })

  createNodeField({
    node,
    name: "type",
    value: slash(sourceInstanceName),
  })

  createNodeField({
    node,
    name: "slug",
    value: slash(slug),
  })

  createNodeField({
    node,
    name: "path",
    value: slash(path),
  })
}

const onCreateNode: OnCreateNode = options => {
  switch (options.node.internal.type) {
    case "MarkdownRemark":
      handleMarkdownRemark(options)
      break
    default:
      break
  }
}

export default onCreateNode
