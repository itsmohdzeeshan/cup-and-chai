"use client"

import React, { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { setPassword as setUserPassword } from "@/actions/useractions"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"

const SetPassword = () => {
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const { data: session, status, update } = useSession()

    const router = useRouter()

    const hasPassword = session?.user?.hasPassword
    const userEmail = session?.user?.email

    if (status === 'loading') {
        return
    }

    if (!session) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex items-center justify-center text-white text-center px-4">
                Unauthorized to access this Endpoint. Kindly Sign-up or login
            </div>
        )
    }

    if (session && hasPassword) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center text-white px-4">
                <p className="mb-4 text-lg font-medium">
                    Your password is already set. If you want to update it, please go to the Change Password page.
                </p>

                <Link
                    href="/settings-and-privacy/change-password"
                    className="rounded-xl bg-white/20 hover:bg-white/30 text-white px-5 py-2 transition border border-white/20"
                >
                    Change Password
                </Link>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!password || !confirmPassword) {
            toast.error("All Fields are required", {
                position: "top-center",
                theme: 'light',
                autoClose: 3000,
                transition: Bounce
            })
            return
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match", {
                position: "top-center",
                theme: 'light',
                autoClose: 3000,
                transition: Bounce
            })
            return
        } else {
            const res = await setUserPassword(userEmail, password)

            if (res?.error) {
                toast.error(res.error, {
                    position: "top-center",
                    theme: 'light',
                    autoClose: 3000,
                    transition: Bounce
                })
                return
            }



            toast("Password set successfully", {
                position: "top-center",
                theme: 'light',
                autoClose: 2000,
                transition: Bounce
            })

            setTimeout(async () => {
                router.push('/dashboard')
                await update({
                    hasPassword: true
                })
            }, 2000)
        }
    }

    return (
        <>
            <ToastContainer />


            <div className="h-full py-6 flex items-center justify-center mx-3.5 px-4">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl"
                >
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Set Password</h1>
                    <p className="text-sm text-white/60 mb-3 md:mb-6">
                        Create a password for your account.
                    </p>

                    <input
                        type="password"
                        placeholder="New password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-2 md:mb-4 px-4 py-2 md:py-3 rounded-lg bg-black/30 border border-white/10 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-2 md:mb-4 px-4 py-2 md:py-3 rounded-lg bg-black/30 border border-white/10 outline-none"
                    />

                    <button className="w-full py-2 md:py-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold hover:cursor-pointer">
                        Set Password
                    </button>
                </form>
            </div>

            <div className="w-[85vw] mx-auto max-w-md mt-6 mb-2 px-4 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/50 flex flex-col gap-2">
                <p className="font-semibold text-white/70 flex items-center gap-1.5">
                    🔒 Strong Password Requirements:
                </p>
                <ul className="space-y-1.5 pl-1">
                    <li className="flex items-center gap-2">
                        <span className="text-green-400/80 text-[10px]">✔</span> Minimum 8 characters long
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-400/80 text-[10px]">✔</span> At least one uppercase letter (A-Z)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-400/80 text-[10px]">✔</span> At least one number (0-9)
                    </li>
                    <li className="flex items-center gap-2">
                        <span className="text-green-400/80 text-[10px]">✔</span> At least one special character (!@#$%)
                    </li>
                </ul>
            </div>
        </>
    )
}

export default SetPassword