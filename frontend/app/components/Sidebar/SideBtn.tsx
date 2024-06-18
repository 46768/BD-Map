
import React from 'react'

interface SideBtnProp {
    hidden?: boolean
    //onClickEvt: React.MouseEventHandler<HTMLButtonElement>
    extraCss?: string
    children: React.ReactNode
}

const SideBtn = (props: SideBtnProp) => {
  return (
    <div><button className={`btn min-h-min w-max h-max p-2 mb-2 block ${props.extraCss}`}>{props.children}</button></div>
  )
}

export default SideBtn