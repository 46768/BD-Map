import React from 'react'

const Navbar = ({children} : Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="absolute top-0 right-0 bg-gray-700 h-24 w-full -z-10 pl-28 p-4 flex items-center">
        {children}
    </div>
  )
}

export default Navbar