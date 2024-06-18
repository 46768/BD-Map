"use client"

import React from 'react'

interface SidegroupProp {
    label: string
    children: React.ReactNode
}

const Sidegroup = (props: SidegroupProp) => {
  return (
    <div className="text-xl">
        {props.label}
        <div className="pl-4">
            {props.children}
        </div>
    </div>
  )
}

export default Sidegroup