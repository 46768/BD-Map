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
  const [Zoom, SetZoom] = useState<number>(0)
  const [Rot, SetRot] = useState<number>(0)

  const [IsMouseDown, SetMouseDown] = useState<boolean>(false)
  const [EventListenerAdded, SetEvtListenerState] = useState<boolean>(false)
  const [PrevTouchX, UpdatePrevTouchX] = useState(0)
  const [PrevTouchY, UpdatePrevTouchY] = useState(0)

  const [ViewportW, SetViewportW] = useState<number>(0)
  const [ViewportH, SetViewportH] = useState<number>(0)

  const UpdateMap = (CanvasContext: CanvasRenderingContext2D, XPos: number, YPos: number, ZoomAmount: number, Rotation: number, VH: number, VW: number) => {
    //Constants
    const LineGap = 32

    //Clear Canvas
    CanvasContext.clearRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Base
    CanvasContext.fillStyle = "green"
    CanvasContext.fillRect(0, 0, CanvasContext.canvas.width, CanvasContext.canvas.height)

    //Draw Scale Lines
    for (let XLine = 0; XLine < VW; XLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(XLine + ((XPos) % LineGap), 0)
      CanvasContext.lineTo(XLine + ((XPos) % LineGap), VH)
      CanvasContext.stroke()
    }

    for (let YLine = 0; YLine < VH; YLine += LineGap) {
      CanvasContext.beginPath()
      CanvasContext.moveTo(0, YLine + ((YPos) % LineGap))
      CanvasContext.lineTo(VW, YLine + ((YPos) % LineGap))
      CanvasContext.stroke()
    }

    //Test School
    const SchoolX = 100
    const SchoolY = 100

    CanvasContext.fillStyle = "blue"
    CanvasContext.fillRect(XPos, YPos, SchoolX, SchoolY)
  }

  function HandleUserEventDown(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | TouchEvent) {
    if (IsTouchEvent(Evt) && !IsMouseDown) {
      console.log("Tooched-------------------------------------------------")
      const TouchEvt = Evt.touches[0]
      console.log("SetX: ", (TouchEvt.clientX))
      console.log("SetY: ", (TouchEvt.clientY))
      UpdatePrevTouchX(TouchEvt.clientX)
      UpdatePrevTouchY(TouchEvt.clientY)
    }
    SetMouseDown(true)
  }

  function HandleUserEventUp() {
    SetMouseDown(false)
  }

  function HandleUserEventMove(Evt: React.MouseEvent<HTMLCanvasElement, MouseEvent> | TouchEvent) {
    if (IsMouseDown) {
      if (IsTouchEvent(Evt)) {
        const TouchEvt = Evt.touches[0]
        console.log("DeltaX: ", (TouchEvt.clientX - PrevTouchX))
        console.log("DeltaY: ", (TouchEvt.clientY - PrevTouchY))
        SetX(X + (TouchEvt.clientX - PrevTouchX))
        SetY(Y + (TouchEvt.clientY - PrevTouchY))
        UpdatePrevTouchX(TouchEvt.clientX)
        UpdatePrevTouchY(TouchEvt.clientY)
      } else {
        SetX(X + Evt.movementX)
        SetY(Y + Evt.movementY)
        console.log("test")
      }

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
      UpdateMap(CanvasContext, X, Y, Zoom, Rot, ViewportH, ViewportW)
    }

    //console.log(ViewportH)
    //console.log(ViewportW)
    if (!EventListenerAdded && Ctx) {
      window.addEventListener('resize', UpdateViewportSize)
      Ctx.addEventListener('touchstart', HandleUserEventDown)
      Ctx.addEventListener('touchmove', HandleUserEventMove)
      Ctx.addEventListener('touchend', HandleUserEventUp)

      SetEvtListenerState(true)
    }

    return () => {
      if (EventListenerAdded && Ctx) {
        window.removeEventListener('resize', UpdateViewportSize)
        Ctx.removeEventListener('touchstart', HandleUserEventDown)
        Ctx.removeEventListener('touchmove', HandleUserEventMove)
        Ctx.removeEventListener('touchend', HandleUserEventUp)
        SetEvtListenerState(false)
      }
    }
  }, [X, Y, Zoom, Rot, ViewportH, ViewportW])

  return (
    <div className="fixed top-24 left-0 w-full h-full -z-50">
      <canvas ref={CanvasRef} onMouseDown={HandleUserEventDown} onMouseUp={HandleUserEventUp} onMouseMove={HandleUserEventMove}
        onTouchStart={(evt) => { evt }} />
    </div>
  )
}

export default MapDisplay