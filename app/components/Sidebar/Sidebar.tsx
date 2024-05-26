"use client"

import React, { useState } from 'react'

interface SidebarProps {
  ToggleState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  children: React.ReactNode
}

const Sidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [Toggle, SetToggle] = useState(false)

  return (
    <div className={`bg-gray-700 inline-block ${Toggle ? " w-72 h-80vh sm:w-96" : "w-12 h-12 sm:w-18 sm:h-18"} transition-wh overflow-y-visible overflow-x-hidden rounded-lg`}>
      <div className="w-full h-full p-1 sm:p-3 inline-block">
        <div className={`rounded-md bg-gray-600 w-max ${Toggle ? "pr-2" : ""} inline-flex items-center justify-center`}>
          <button className={`btn min-h-0 min-w-0 m-2 w-6 h-6 pl-0 pr-0 sm:pl-4 sm:pr-4 sm:w-8 sm:h-8`} onClick={() => SetToggle(!Toggle)}> {Toggle ? "X" : "="}</button>
          <p className={`${Toggle ? "inline-block" : "hidden"} text-md sm:text-lg md:text-xl lg:text-3xl`}>Tools</p>
        </div>
        <div className={`${Toggle ? "block" : "hidden"} m-4 pb-16`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar