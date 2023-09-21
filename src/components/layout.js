import * as React from "react"
import { Link } from "gatsby"
import Nav from "./nav"
import capitalize from "../utils/helpers/capitalize"

const Layout = ({ location, title, children, parent }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath

  const header = (
    <div className="header-wrapper">
      <div className="main-heading-wrapper">
        <h1 className="main-heading">
          <Link to="/">{`Elvina Galimova`}</Link>
        </h1>

        <nav className="breadcrumbs">
          {parent ? <a href={parent.link}>{capitalize(parent.title)}</a> : null}
          {title ? <span>{` / ${capitalize(title)}`}</span> : ""}
        </nav>
      </div>

      <Nav />
    </div>
  )

  return (
    <div className="global-wrapper" data-is-root-path={isRootPath}>
      <header className="global-header">{header}</header>
      <main>{children}</main>
      <footer>
        <div className="footer-contacts">
          <a
            className="footer-contacts-icon"
            href="https://instagram.com/orange_idiot"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="ionicon"
              viewBox="0 0 512 512"
            >
              <title>Logo Instagram</title>
              <path
                color="currentColor"
                d="M349.33 69.33a93.62 93.62 0 0193.34 93.34v186.66a93.62 93.62 0 01-93.34 93.34H162.67a93.62 93.62 0 01-93.34-93.34V162.67a93.62 93.62 0 0193.34-93.34h186.66m0-37.33H162.67C90.8 32 32 90.8 32 162.67v186.66C32 421.2 90.8 480 162.67 480h186.66C421.2 480 480 421.2 480 349.33V162.67C480 90.8 421.2 32 349.33 32z"
              />
              <path
                color="currentColor"
                d="M377.33 162.67a28 28 0 1128-28 27.94 27.94 0 01-28 28zM256 181.33A74.67 74.67 0 11181.33 256 74.75 74.75 0 01256 181.33m0-37.33a112 112 0 10112 112 112 112 0 00-112-112z"
              />
            </svg>
          </a>
        </div>
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
