"use client"

import React, { useState } from 'react'

const Sidebar = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  const [Toggle, SetToggle] = useState(false)

  return (
    <div className={`h-screen inline-block ${Toggle ? "w-64" : "w-24"} transition-width`}>
      <div className="bg-gray-700 w-full h-full p-3 inline-block">
        <div className={`rounded-md bg-gray-600 w-max relative ${Toggle ? "pr-2" : "left-1"}`}>
          <button className="btn inline-block m-2 w-12 h-12" onClick={() => SetToggle(!Toggle)}> {Toggle ? "X" : "="}</button>
          <p className={`${Toggle ? "inline-block" : "hidden"} text-3xl relative top-1`}>Tools</p>
        </div>
        <div className={`${Toggle ? "block" : "hidden"} m-4`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar