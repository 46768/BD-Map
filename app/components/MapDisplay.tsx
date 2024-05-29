"use client"

import React, { useEffect, useRef, useState } from 'react'

interface MapLocaData {
  X: number
  Y: number
  Zoom: number
  Rot: number
}

const MapDisplay = () => {
  //TypeChecking
  function IsTouchEvent(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>): Evt is React.TouchEvent<HTMLCanvasElement> {
    return 'touches' in Evt
  }

  const CanvasRef = useRef<HTMLCanvasElement>(null)

  const [ViewportW, SetViewportW] = useState<number>(0)
  const [ViewportH, SetViewportH] = useState<number>(0)

  const [X, SetX] = useState<number>(Math.floor(ViewportW/2))
  const [Y, SetY] = useState<number>(Math.floor(ViewportH/2))
  const [Zoom, SetZoom] = useState<number>(0)
  const [Rot, SetRot] = useState<number>(0)

  const [IsMouseDown, SetMouseDown] = useState<boolean>(false)
  const [XOffset, SetXOffset] = useState<number>(0)
  const [YOffset, SetYOffset] = useState<number>(0)
  const [TouchX, UpdateTouchX] = useState(0)
  const [TouchY, UpdateTouchY] = useState(0)

  function UpdateMap(CanvasContext: CanvasRenderingContext2D, XPos: number, YPos: number, MX: number, MY: number, ZoomAmount: number, Rotation: number, VH: number, VW: number) {
    //Constants
    const ScaleFactor: number = 10 ** Zoom
    const LineGap: number = 32 * ScaleFactor
    const UX: number = (XPos * ScaleFactor) + MX
    const UY: number = (YPos * ScaleFactor) + MY

    //Clear Canvas
    CanvasContext.clearRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Base
    CanvasContext.fillStyle = "green"
    CanvasContext.fillRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Scale Lines
    for (let XLine = 0; XLine < VW + LineGap; XLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(XLine + ((UX) % LineGap), 0)
      CanvasContext.lineTo(XLine + ((UX) % LineGap), VH)
      CanvasContext.stroke()
    }

    for (let YLine = 0; YLine < VH + LineGap; YLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(0, YLine + ((UY) % LineGap))
      CanvasContext.lineTo(VW, YLine + ((UY) % LineGap))
      CanvasContext.stroke()
    }

    //Test School
    const SchoolX: number = 96 * ScaleFactor
    const SchoolY: number = 96 * ScaleFactor

    CanvasContext.fillStyle = "blue"
    CanvasContext.fillRect(UX, UY, SchoolX, SchoolY)

    //Test Building
    const BuildingX: number = 96 * ScaleFactor
    const BuildingY: number = 96 * ScaleFactor

    CanvasContext.fillStyle = "red"
    CanvasContext.fillRect(UX + 160 * ScaleFactor, UY + 160 * ScaleFactor, BuildingX, BuildingY)

    //Debug Center Point
    CanvasContext.fillStyle = "red"
    CanvasContext.fillRect(MX-10, MY-10, 20, 20)
  }

  function HandleUserEvtDown(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) {
    if (IsTouchEvent(Evt)) {
      if (Evt.touches.length >= 2) return
      const Touch = Evt.touches[0]
      SetXOffset(Touch.clientX)
      SetYOffset(Touch.clientY)
    } else {
      SetXOffset(Evt.clientX)
      SetYOffset(Evt.clientY)
    }
    SetMouseDown(true)
  }

  function HandleUserEvtUp() {
    SetMouseDown(false)
    SetX(X + (TouchX - XOffset))
    SetY(Y + (TouchY - YOffset))
    UpdateTouchX(0)
    UpdateTouchY(0)
    SetXOffset(0)
    SetYOffset(0)
  }

  function HandleUserEvtMove(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | React.TouchEvent<HTMLCanvasElement>) {
    if (IsMouseDown) {
      if (IsTouchEvent(Evt)) {
        if (Evt.touches.length >= 2) return
        const ChangedTouch = Evt.changedTouches[0]
        UpdateTouchX(ChangedTouch.clientX)
        UpdateTouchY(ChangedTouch.clientY)
      } else {
        UpdateTouchX(Evt.clientX)
        UpdateTouchY(Evt.clientY)
      }
    }
  }

  function HandleUserMouseScroll(WheelEvt: React.WheelEvent<HTMLCanvasElement>) {
    SetZoom(Math.max(Math.min(Zoom - (WheelEvt.deltaY / 1000), 0.75), -0.75))
    console.log(Zoom)
  }

  useEffect(() => {
    function UpdateViewportSize() {
      SetViewportW(window.innerWidth)
      SetViewportH(window.innerHeight)
    }

    UpdateViewportSize()

    const Ctx = CanvasRef.current
    const CanvasContext = Ctx?.getContext("2d")

    if (Ctx && CanvasContext) {
      Ctx.width = ViewportW
      Ctx.height = ViewportH
      UpdateMap(CanvasContext, X + (TouchX - XOffset), Y + (TouchY - YOffset), Math.floor(ViewportW/2), Math.floor(ViewportH/2), Zoom, Rot, ViewportH, ViewportW)
    }

    //console.log(ViewportH)
    //console.log(ViewportW)
    if (Ctx) {
      window.addEventListener('resize', UpdateViewportSize)
    }

    return () => {
      if (Ctx) {
        window.removeEventListener('resize', UpdateViewportSize)
      }
    }
  }, [X, Y, Zoom, Rot, ViewportH, ViewportW, TouchX, TouchY])

  return (
    <div className="fixed top-24 left-0 w-full h-full -z-50">
      <canvas ref={CanvasRef} 
        onMouseDown={HandleUserEvtDown} onMouseUp={HandleUserEvtUp} onMouseMove={HandleUserEvtMove}
        onTouchStart={HandleUserEvtDown} onTouchEnd={HandleUserEvtUp} onTouchMove={HandleUserEvtMove}
        onWheel={HandleUserMouseScroll}/>
    </div>
  )
}

export default MapDisplay