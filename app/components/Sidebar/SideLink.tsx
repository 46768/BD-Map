import Link from 'next/link'
import React from 'react'

interface SideLinkProp {
    href: string
    children: React.ReactNode
}

const SideLink = (props: SideLinkProp) => {
  return (
    <div><Link href={props.href} className="text-xl text-blue-500">{props.children}</Link></div>
  )
}

export default SideLink