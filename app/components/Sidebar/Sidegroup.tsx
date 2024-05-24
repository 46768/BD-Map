"use client"

import React from 'react'

interface SidegroupProp {
    label: string
    children: Readonly<React.ReactNode>
}

const Sidegroup = (props: SidegroupProp) => {
  return (
    <div>
        {props.label}
        <div className="pl-4">
            {props.children}
        </div>
    </div>
  )
}

export default Sidegroup