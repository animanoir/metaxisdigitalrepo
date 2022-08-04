const path = require('path')

// create pages dynamically
exports.createPages = async ({
  graphql,
  actions
}) => {
  const {
    createPage
  } = actions
  const result = await graphql(`
    {
      allMdx {
        nodes {
          frontmatter {
            slug
            author
            authorContact
          }
        }
      }
      concepts: allMdx {
        totalCount
        distinct(field: frontmatter___concepts)
      }
    }
  `)

  // Create pages for each post
  result.data.allMdx.nodes.forEach(({
    frontmatter: {
      slug
    }
  }) => {
    createPage({
      path: `/posts/${slug}`,
      component: path.resolve(`src/templates/PostLayout.js`),
      context: {
        slug,
      },
    })
  })

  // Create pages for each author
  result.data.allMdx.nodes.forEach(({
    frontmatter: {
      author,
      authorContact
    }
  }) => {
    createPage({
      path: `/autores/${author}`,
      component: path.resolve(`src/templates/AuthorLayout.js`),
      context: {
        author,
        authorContact
      },
    })
  })

  // Create pages for each concept
  result.data.concepts.distinct.forEach(concept => {
    createPage({
      path: `/concepts/${concept}`,
      component: path.resolve(`src/templates/ConceptLayout.js`),
      context: {
        concept
      }
    })
  })

}