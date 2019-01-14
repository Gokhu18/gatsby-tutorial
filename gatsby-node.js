const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)

// To implement a Gatsby API, you export a function with the name of the API
exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions
  if (node.internal.type === `MarkdownRemark`) {
    // GOAL: Use each markdown file name to create the page slug

    // Add your new slugs directly onto the MarkdownRemark nodes.
    //  Any data you add to nodes is available to query later with GraphQL.
    const slug = createFilePath({ node, getNode, basePath: `pages` })
    createNodeField({
      node,
      name: `slug`,
      value: slug,
    })
  }
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions
  // **Note:** The graphql function call returns a Promise
  // see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise for more info
  return graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `
).then(result => {  // GraphQL query data has been received
    // console.log(JSON.stringify(result, null, 4))
    // You need one additional thing beyond a slug to create pages: a page template component.
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      createPage({
        path: node.fields.slug,
        component: path.resolve(`./src/templates/blog-post.js`),
        context: {
          // Data passed to context is available
          // in page queries as GraphQL variables.
          slug: node.fields.slug,
        },
      })
    })
  })
}