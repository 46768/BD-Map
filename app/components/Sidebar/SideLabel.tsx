import React from 'react'

interface SideLabelProp {
  hidden?: boolean
  extraCss?: string
  children: React.ReactNode
}

const SideLabel = (props : Readonly<SideLabelProp>) => {
  return (
    <div className={`text-xl ${props.hidden ? "hidden" : "block"} ${props.extraCss}`}>{props.children}</div>
  )
}

export default SideLabel