import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import groupPosts from "../utils/helpers/groupPosts"

const Portraits = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes
  const { portraits = [] } = groupPosts(posts)

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="Portraits" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={"portraits"}>
      <Seo title="All posts" />
      <ol className="sub-post-list" style={{ listStyle: `none` }}>
        {portraits.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug} className="sub-post-item">
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2 className="post-title">
                    <Link to={`/portraits${post.fields.slug}`} itemProp="url">
                      <div className="post-title-mask" />
                      <img
                        alt={post.frontmatter.image}
                        className="post-image"
                        src={`../images/${post.frontmatter.image}`}
                      />
                      <span className="post-title-text" itemProp="headline">
                        {title}
                      </span>
                    </Link>
                  </h2>
                </header>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default Portraits

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
          image
          parent
        }
      }
    }
  }
`
