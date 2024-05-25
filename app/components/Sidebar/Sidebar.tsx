"use client"

import React, { useState } from 'react'

interface SidebarProps {
  ToggleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  children: React.ReactNode
}

const Sidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [Toggle, SetToggle] = useState(false)

  return (
    <div className={`bg-gray-700 inline-block ${Toggle ? " w-96 min-h-screen" : "w-20 h-20"} transition-width overflow-y-auto rounded-lg`}>
      <div className="w-full h-full p-3 inline-block">
        <div className={`rounded-md bg-gray-600 w-max relative ${Toggle ? "pr-2" : "left-1"} inline-flex items-center justify-center`}>
          <button className={`btn min-h-min inline-flex m-2 w-8 h-8`} onClick={() => SetToggle(!Toggle)}> {Toggle ? "X" : "="}</button>
          <p className={`${Toggle ? "inline-block" : "hidden"} text-3xl relative top-1`}>Tools</p>
        </div>
        <div className={`${Toggle ? "block" : "hidden"} m-4 pb-16`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar