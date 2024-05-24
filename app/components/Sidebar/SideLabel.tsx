import React from 'react'

const SideLabel = ({children} : Readonly<{children: React.ReactNode}>) => {
  return (
    <div className="text-xl">{children}</div>
  )
}

export default SideLabel