"use client"

import React, { useState } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { changePassword } from "@/actions/useractions"
import { Bounce, toast, ToastContainer } from "react-toastify"
import { useRouter } from "next/navigation"

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    const { data: session, status } = useSession()
    const hasPassword = session?.user?.hasPassword
    const userEmail = session?.user?.email
    const router = useRouter()


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

    if (session && !hasPassword) {
        return (
            <div className="min-h-[calc(100vh-150px)] flex flex-col items-center justify-center text-center text-white px-4">
                <p className="mb-4 text-lg font-medium">
                    Your password is not set yet. Kindly go to the Set Password page.
                </p>

                <Link
                    href="/settings-and-privacy/set-password"
                    className="rounded-xl bg-white/20 hover:bg-white/30 text-white px-5 py-2 transition border border-white/20 hover:cursor-pointer"
                >
                    Set Password
                </Link>
            </div>
        )
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error("All password fields are required", {
                position: "top-center",
                theme: 'light',
                autoClose: 3000,
                transition: Bounce
            })
            return
        }

        if (oldPassword === newPassword) {
            toast.error("Old password and new password cannot be same", {
                position: "top-center",
                theme: 'light',
                autoClose: 3000,
                transition: Bounce
            })
            return
        }


        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match", {
                position: "top-center",
                theme: 'light',
                autoClose: 3000,
                transition: Bounce
            })
            return
        } else {
            const res = await changePassword(userEmail, oldPassword, newPassword)

            if (res?.error) {
                toast.error(res.error, {
                    position: "top-center",
                    theme: 'light',
                    autoClose: 3000,
                    transition: Bounce
                })
                return
            }

            toast("Password Changed successfully", {
                position: 'top-center',
                autoClose: 3000,
                theme: 'dark',
                transition: Bounce
            })
        }

        setTimeout(() => {
            router.push('/dashboard')
        }, 3000)
    }

    return (
        <>

            <ToastContainer />
            < div className="h-full flex items-center justify-center px-4 mx-3.5 mt-4" >
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white/10 border border-white/10 backdrop-blur-lg rounded-2xl p-6 text-white shadow-xl"
                >
                    <h1 className="text-xl md:text-2xl font-bold mb-2">Change Password</h1>
                    <p className="text-sm text-white/60 mb-6">
                        Update your current password.
                    </p>

                    <input
                        type="password"
                        placeholder="Old password"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        className="w-full mb-2 md:mb-4 px-4 py-3 rounded-lg bg-black/30 border border-white/10 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="New password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full mb-2 md:mb-4 px-4 py-3 rounded-lg bg-black/30 border border-white/10 outline-none"
                    />

                    <input
                        type="password"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-3 md:mb-5 px-4 py-3 rounded-lg bg-black/30 border border-white/10 outline-none"
                    />

                    <button className="w-full p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition font-semibold hover:cursor-pointer">
                        Change Password
                    </button>
                </form>
            </div >

            <div className="w-[85vw] max-w-md justify-center mt-6 mb-2 px-6 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs text-white/50 flex flex-col gap-2 mx-auto">
                <p className="font-semibold text-white/70">💡 Security Quick Tips:</p>
                <ul className="list-disc pl-4 space-y-1">
                    <li>Don't reuse passwords from other websites.</li>
                    <li>Include a mix of letters, numbers, and symbols ($@%!).</li>
                    <li>We recommend changing your password every 6 months.</li>
                </ul>
            </div>

        </>
    )
}

export default ChangePassword