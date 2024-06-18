import Link from 'next/link'
import React from 'react'

interface SideLinkProp {
    hidden: boolean
    extraCss?: string
    href: string
    children: React.ReactNode
}

const SideLink = (props: SideLinkProp) => {
  return (
    <div><Link href={props.href} className={`text-xl text-blue-500 ${props.extraCss}`}>{props.children}</Link></div>
  )
}

export default SideLink