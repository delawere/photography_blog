import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"
import { Slide } from "react-slideshow-image"
import "react-slideshow-image/dist/styles.css"
import { createPortal } from "react-dom"

const Slider = ({ initialIndex = 0, images, onClose }) => {
  return createPortal(
    <div className="slider-wrapper">
      <button className="close-button" onClick={onClose}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M23 20.168l-8.185-8.187 8.185-8.174-2.832-2.807-8.182 8.179-8.176-8.179-2.81 2.81 8.186 8.196-8.186 8.184 2.81 2.81 8.203-8.192 8.18 8.192z" />
        </svg>
      </button>
      <Slide
        autoplay={false}
        transitionDuration={300}
        defaultIndex={initialIndex}
        easing={"ease"}
        indicators={index => {
          return (
            <div className="indicator">
              <img src={images[index]} alt={`open ${index}`} />
            </div>
          )
        }}
      >
        {images.map(t => (
          <div className="each-slide-effect">
            <img src={t} alt="" />
          </div>
        ))}
      </Slide>
    </div>,
    document.querySelector("body")
  )
}

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const articleRef = React.useRef(null)
  const [showCarousel, setShowCarousel] = React.useState(false)
  const [initialIndex, setInitialIndex] = React.useState(0)

  const images = (post.frontmatter.content || "").split(",").filter(t => !!t)

  React.useEffect(() => {
    if (images.length > 0) {
      document
        .querySelector(".blog-post")
        .querySelectorAll("img")
        .forEach((img, index) => {
          img.addEventListener("click", () => {
            setInitialIndex(index)
            setShowCarousel(true)
            document.body.classList.add("overlay")
          })
        })
    }
  }, [images.length])

  const handleKeyDown = React.useCallback(e => {
    if (e.key === "Escape") {
      document.body.classList.remove("overlay")
      setShowCarousel(false)
    }
  }, [])

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleKeyDown])

  return (
    <Layout
      location={location}
      title={post.frontmatter.title}
      parent={
        post.frontmatter.parent
          ? {
              title: post.frontmatter.parent,
              link: "/" + post.frontmatter.parent,
            }
          : null
      }
    >
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      {showCarousel ? (
        <Slider
          images={images}
          initialIndex={initialIndex}
          onClose={() => setShowCarousel(false)}
        />
      ) : null}
      <article
        ref={articleRef}
        className="blog-post"
        itemScope
        itemType="http://schema.org/Article"
      >
        <section
          dangerouslySetInnerHTML={{ __html: post.html }}
          itemProp="articleBody"
        />
        <hr />
      </article>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        image
        parent
        content
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
