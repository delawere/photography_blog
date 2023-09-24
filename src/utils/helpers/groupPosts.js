export default allPosts => {
  const groupedPosts = {}

  allPosts.forEach(post => {
    if (post.frontmatter.parent) {
      groupedPosts[post.frontmatter.parent] = [
        ...(groupedPosts[post.frontmatter.parent] || []),
        post,
      ]
    } else {
      groupedPosts[post.frontmatter.title] = post
    }
  })

  return groupedPosts
}
