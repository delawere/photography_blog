import * as React from "react"
import { Link } from "gatsby"

const navItems = [
  {
    title: "Contacts",
    link: "/contacts",
  },
]

const Nav = () => {
  const path = typeof window !== "undefined" ? window.location.href : ""
  let pathname = ""
  if (path) {
    const url = new URL(path)
    pathname = url.pathname
  }

  return (
    <nav className="header-nav">
      <ul className="header-nav-list">
        {navItems.map(({ title, link }) => (
          <li key={title} className="header-nav-item">
            <Link
              className={`${pathname === link ? "header-link-disabled" : ""}`}
              disabled={pathname === link}
              to={link}
            >
              {title}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default Nav
