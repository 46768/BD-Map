import React from 'react'

const NavLabel = ({children} : Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="text-md sm:text-lg md:text-xl lg:text-3xl mr-2 block">{children}</div>
  )
}

export default NavLabel