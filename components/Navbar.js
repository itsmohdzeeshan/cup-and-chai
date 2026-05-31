"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useSession, signOut, useEffect } from "next-auth/react"

const Navbar = () => {
    const { data: session, status, update } = useSession();
    const [showDropdown, setshowDropdown] = useState(false)
    const [showSettingsSubmenu, setShowSettingsSubmenu] = useState(false)



    const closeDropdown = () => {
        setshowDropdown(false)
        setShowSettingsSubmenu(false)
    }

    const hasPassword = session?.user?.hasPassword

    return (
        <nav className='sticky top-0 z-50 backdrop-blur-lg bg-black/40 border-b border-white/10 text-white flex justify-between items-center px-6 h-16'>

            {/* LOGO */}
            <Link href={"/"}>
                <div className='font-extrabold text-lg tracking-wide hover:opacity-80 transition'>
                    CupAndChai ☕
                </div>
            </Link>

            {/* RIGHT SIDE */}
            <div className='relative flex items-center gap-4'>

                {status === 'authenticated' && (
                    <>
                        <div onBlur={(e) => {
                            if (!e.currentTarget.contains(e.relatedTarget)) {
                                closeDropdown()
                            }
                        }
                        }
                        >

                            {/* USER BUTTON */}
                            <button
                                onClick={() => {
                                    setshowDropdown(!showDropdown)
                                    if (showDropdown) {
                                        setShowSettingsSubmenu(false)
                                    }
                                }
                                }
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-all duration-300 text-sm cursor-pointer">

                                <span className="hidden sm:block">
                                    {session.user.email}
                                </span>

                                {/* AVATAR */}
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xs font-bold ">
                                    {session.user.email?.[0]?.toUpperCase()}
                                </div>

                                <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none">
                                    <path stroke="currentColor" strokeWidth="2" d="m19 9-7 7-7-7" />
                                </svg>
                            </button>

                            {/* DROPDOWN */}
                            <div className={`absolute right-0 top-14 md:w-48 rounded-xl backdrop-blur-lg bg-blue-800 border border-white/10 shadow-lg p-2 transition-all duration-300 ${showDropdown ? "opacity-100 visible" : "opacity-0 invisible"}`}>

                                <Link
                                    href={`/${session.user.name}`}
                                    onClick={closeDropdown}
                                    className="block px-3 py-2 rounded-md hover:bg-white/10 transition selection:bg-red-600">
                                    Your Page
                                </Link>

                                <Link href="/dashboard"
                                    onClick={closeDropdown}
                                    className="block px-3 py-2 rounded-md hover:bg-white/10 transition">
                                    Dashboard
                                </Link>

                                <button type="button"
                                    onClick={() => setShowSettingsSubmenu(!showSettingsSubmenu)}
                                    className='w-full text-left px-3 py-2 rounded-md hover:bg-white/10 transition'>
                                    Setting & Privacy
                                </button>

                                <div className={`transition duration-300 ${showSettingsSubmenu ? 'block' : 'hidden'}`}>



                                    {hasPassword ? (
                                        <Link href="/settings-and-privacy/change-password"
                                            onClick={closeDropdown}
                                            className={`border-l text-sm w-full text-left block ml-4 my-1 px-3 py-1 rounded-md hover:bg-white/10 transition `}
                                        >
                                            Change Password
                                        </Link>
                                    ) : (
                                        <Link href="/settings-and-privacy/set-password"
                                            onClick={closeDropdown}
                                            className={`border-l text-sm w-full text-left block ml-4 my-1 px-3 py-1 rounded-md hover:bg-white/10 transition `}
                                        >
                                            Set Password
                                        </Link>
                                    )}


                                    {/* <Link href=""
                                        onClick={closeDropdown}
                                        className={`border-l text-sm w-full text-left block ml-4 my-1 px-3 py-1 rounded-md hover:bg-white/10 transition active:bg-white`}
                                    >
                                        Report user
                                    </Link>

                                    <Link href=""
                                        onClick={closeDropdown}
                                        className={`border-l text-sm w-full text-left block ml-4 my-1 px-3 py-1 rounded-md hover:bg-white/10 transition active:bg-white`}
                                    >
                                        Sign-in options
                                    </Link> */}


                                </div>
                                <hr className="border-white/10 my-1" />


                                <button
                                    onClick={() => signOut({ callbackUrl: "/" })}

                                    className="w-full text-left px-3 py-2 rounded-md hover:bg-red-500/20 text-red-400 transition cursor-pointer"
                                >
                                    Sign out
                                </button>

                            </div>
                        </div>
                    </>
                )}

                {status === 'unauthenticated' && (
                    <Link href={"/login"}>
                        <button className='px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition duration-300 shadow-lg text-sm cursor-pointer'>
                            Login
                        </button>
                    </Link>
                )}

            </div>
        </nav>
    )
}

export default Navbar