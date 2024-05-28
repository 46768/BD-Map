"use client"

import React, { useEffect, useRef, useState } from 'react'

const MapDisplay = () => {
  //TypeChecking
  function IsTouchEvent(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | TouchEvent): Evt is TouchEvent {
    return 'touches' in Evt
  }

  const CanvasRef = useRef<HTMLCanvasElement>(null)

  const [X, SetX] = useState<number>(0)
  const [Y, SetY] = useState<number>(0)
  const [XOffset, SetXOffset] = useState<number>(0)
  const [YOffset, SetYOffset] = useState<number>(0)
  const [Zoom, SetZoom] = useState<number>(0)
  const [Rot, SetRot] = useState<number>(0)

  const [IsMouseDown, SetMouseDown] = useState<boolean>(false)
  const [EventListenerAdded, SetEvtListenerState] = useState<boolean>(false)
  const [TouchX, UpdateTouchX] = useState(0)
  const [TouchY, UpdateTouchY] = useState(0)

  const [ViewportW, SetViewportW] = useState<number>(0)
  const [ViewportH, SetViewportH] = useState<number>(0)

  const UpdateMap = (CanvasContext: CanvasRenderingContext2D, XPos: number, YPos: number, ZoomAmount: number, Rotation: number, VH: number, VW: number) => {
    //Constants
    const ScaleFactor: number = 10 ** ZoomAmount
    const LineGap: number = 32 * ScaleFactor

    //Clear Canvas
    CanvasContext.clearRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Base
    CanvasContext.fillStyle = "green"
    CanvasContext.fillRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Scale Lines
    for (let XLine = 0; XLine < VW + LineGap; XLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(XLine + ((XPos) % LineGap), 0)
      CanvasContext.lineTo(XLine + ((XPos) % LineGap), VH)
      CanvasContext.stroke()
    }

    for (let YLine = 0; YLine < VH + LineGap; YLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(0, YLine + ((YPos) % LineGap))
      CanvasContext.lineTo(VW, YLine + ((YPos) % LineGap))
      CanvasContext.stroke()
    }

    //Test School
    const SchoolX: number = 96 * ScaleFactor
    const SchoolY: number = 96 * ScaleFactor

    CanvasContext.fillStyle = "blue"
    CanvasContext.fillRect(XPos, YPos, SchoolX, SchoolY)

    //Test Building
    const BuildingX: number = 96 * ScaleFactor
    const BuildingY: number = 96 * ScaleFactor

    CanvasContext.fillStyle = "red"
    CanvasContext.fillRect(XPos + 160 * ScaleFactor, YPos + 160 * ScaleFactor, BuildingX, BuildingY)
  }

  function HandleUserMouseDown() {
    SetMouseDown(true)
  }

  function HandleUserMouseUp() {
    SetMouseDown(false)
  }

  function HandleUserMouseMove(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent>) {
    if (IsMouseDown) {
        SetX(X + Evt.movementX)
        SetY(Y + Evt.movementY)
    }
  }

  function HandleUserMouseScroll(WheelEvt: React.WheelEvent<HTMLCanvasElement>) {
    SetZoom(Zoom + (WheelEvt.deltaY / 1000))
    console.log(Zoom)
  }

  function HandleUserTouchDown(TouchEvt: React.TouchEvent<HTMLCanvasElement>) {
    SetMouseDown(true)
    const Touch = TouchEvt.touches[0]
    SetXOffset(Touch.clientX)
    SetYOffset(Touch.clientY)
    UpdateTouchX(TouchX)
    UpdateTouchY(TouchY)
  }

  function HandleUserTouchUp() {
    SetMouseDown(false)
    SetX(X + (TouchX - XOffset))
    SetY(Y + (TouchY - YOffset))
    UpdateTouchX(0)
    UpdateTouchY(0)
    SetXOffset(0)
    SetYOffset(0)
  }

  function HandleUserTouchMove(TouchEvt: React.TouchEvent<HTMLCanvasElement>) {
    if (true) {
        const ChangedTouch = TouchEvt.changedTouches[0]
        UpdateTouchX(ChangedTouch.clientX)
        UpdateTouchY(ChangedTouch.clientY)
    }
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
      UpdateMap(CanvasContext, X + (TouchX - XOffset), Y + (TouchY - YOffset), Zoom, Rot, ViewportH, ViewportW)
    }

    //console.log(ViewportH)
    //console.log(ViewportW)
    if (!EventListenerAdded && Ctx) {
      window.addEventListener('resize', UpdateViewportSize)

      SetEvtListenerState(true)
    }

    return () => {
      if (EventListenerAdded && Ctx) {
        window.removeEventListener('resize', UpdateViewportSize)
        SetEvtListenerState(false)
      }
    }
  }, [X, Y, Zoom, Rot, ViewportH, ViewportW, TouchX, TouchY])

  return (
    <div className="fixed top-24 left-0 w-full h-full -z-50">
      <canvas ref={CanvasRef} 
        onMouseDown={HandleUserMouseDown} onMouseUp={HandleUserMouseUp} onMouseMove={HandleUserMouseMove}
        onTouchStart={HandleUserTouchDown} onTouchEnd={HandleUserTouchUp} onTouchMove={HandleUserTouchMove}
        onWheel={HandleUserMouseScroll}/>
    </div>
  )
}

export default MapDisplay