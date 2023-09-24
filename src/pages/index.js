import * as React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"
import Seo from "../components/seo"
import groupPosts from "../utils/helpers/groupPosts"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="All posts" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  const { series, portraits, ...rest } = groupPosts(posts)

  return (
    <Layout location={location} title={""}>
      <Seo title="All posts" />
      <ul className="post-list" style={{ listStyle: `none` }}>
        <li className="post-list-item">
          <div className="post-title">
            <Link to={"/portraits"} itemProp="url" className="post-link">
              <div className="post-title-mask" />
              <img
                alt="portraits"
                className="post-image"
                src={`../images/portraits.jpg`}
              />
              <span className="post-title-text" itemProp="headline">
                Portraits
              </span>
            </Link>
          </div>
        </li>
        <li className="post-title">
          <Link to={"/series"} itemProp="url">
            <div className="post-title-mask" />
            <img
              alt="series"
              className="post-image"
              src={`../images/series.jpg`}
            />
            <span className="post-title-text" itemProp="headline">
              Series
            </span>
          </Link>
        </li>

        {Object.values(rest).map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug} className="post-list-item">
              <article
                className="post-list-item"
                itemScope
                itemType="http://schema.org/Article"
              >
                <header>
                  <h2 className="post-title">
                    <Link to={post.fields.slug} itemProp="url">
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
      </ul>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        id
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
