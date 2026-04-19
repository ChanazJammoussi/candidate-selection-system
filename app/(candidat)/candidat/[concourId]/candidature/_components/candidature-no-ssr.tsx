"use client"
import dynamic from "next/dynamic"
export default dynamic(() => import("./candidature-client"), { ssr: false })
