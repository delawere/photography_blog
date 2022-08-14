import * as React from "react"
import { Link } from "gatsby"
import Nav from "./nav"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const header = (
    <div className="header-wrapper">
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
      </h1>
      <Nav />
    </div>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        © {new Date().getFullYear()}, {`Built by `}
        <a href="https://github.com/delawere" rel="noreferrer" target="_blank">
          Dmitriy Zhiganov
        </a>
        {` with `}
        {` `}
        <a href="https://www.gatsbyjs.com">Gatsby</a>
      </footer>
    </div>
  )
}

export default Layout
