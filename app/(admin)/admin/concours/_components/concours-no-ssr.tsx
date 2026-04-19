"use client"
import dynamic from "next/dynamic"
export default dynamic(() => import("./concours-client"), { ssr: false })
