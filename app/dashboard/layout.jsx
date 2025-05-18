"use client"
import React from 'react'
import Head from 'next/head'
function DashboardLayout({ children }) {
  return (
    <>
      <Head>
        <title>I-Hire Dashboard</title>
        <meta name="description" content="AI-powered interview platform" />
      </Head>
            
      <div>
        {children}
      </div>

    </>
  )
}

export default DashboardLayout