"use client"

import React, { MouseEventHandler } from 'react'

interface SideBtnProp {
    children: React.ReactNode
}

const SideBtn = (props: SideBtnProp) => {
  return (
    <div><button className="btn min-h-min w-max h-max p-2 mb-2 block">{props.children}</button></div>
  )
}

export default SideBtn