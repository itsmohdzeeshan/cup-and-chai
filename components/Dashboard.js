"use client"
import React, { useEffect, useState } from 'react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { updateProfile, fetchUser } from '@/actions/useractions'
import { ToastContainer, toast, Bounce } from 'react-toastify'
import { motion } from 'framer-motion'

const Dashboard = () => {

    const [form, setform] = useState({})
    const [originalForm, setOriginalForm] = useState({})
    const [isLoading, setIsLoading] = useState(true)
    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const { data: session, status, update } = useSession()
    const router = useRouter()

    const getData = async () => {
        setIsLoading(true)
        let user = await fetchUser(session.user.name)
        setform(user || {})
        setOriginalForm(user || {})
        setIsLoading(false)
        setIsFirstLoad(false)
    }

    useEffect(() => {
    }, [form]); // This array ensures the log runs every time 'form' changes

    // useEffect(() => {
    //     if (!session) {
    //         router.push('/login')
    //     } else {
    //         setTimeout(() => {
    //             getData()
    //         })
    //     }
    // }, [router, session])

    // Above useEffect is not optimized so we change that from the below one 
    useEffect(() => {
        if (status === 'loading') {
            return
        }

        if (status === 'unauthenticated') {
            router.push('/login')
        }

        if (status === 'authenticated') {
            getData()
        }

    }, [status])

    const handleSubmit = async () => {

        if (JSON.stringify(originalForm) === JSON.stringify(form)) {
            toast.info("No changes detected", {
                position: 'top-center',
                autoClose: false,
                theme: "dark",
                transition: Bounce
            })
            return
        }

        await updateProfile(form, session.user.name)


        toast('Profile has been updated!', {
            position: "top-center",
            autoClose: 3000,
            theme: "dark",
            transition: Bounce,
        });

        await update()
    }


    const handleImageUpload = async (e, key) => {
        const file = e.target.files[0]
        if (!file) return

        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "profile_uploads")

        const res = await fetch("https://api.cloudinary.com/v1_1/dgnk4ms7k/image/upload", {
            method: "POST",
            body: data
        })

        const uploadedImage = await res.json()

        setform({
            ...form,
            [key]: uploadedImage.secure_url,
            [`${key}_name`]: file.name
        })
    }

    // if (status === "loading" || isLoading) {
    //     return <div className="text-white">Loading...</div>
    // }

    return (
        <>
            <ToastContainer />

            {/* PAGE ANIMATION */}
            <motion.div
                initial={isFirstLoad ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-white px-4 py-10"
            >

                {/* TITLE */}
                <motion.h3
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className='font-bold text-2xl sm:text-3xl text-center mb-10'
                >
                    Welcome to your Dashboard 🚀
                </motion.h3>

                {/* 
                {isLoading && (
                    <div className="max-w-2xl mx-auto mb-6 p-4 rounded-xl border border-white/10 bg-white/5 animate-pulse">
                        Loading dashboard data...
                    </div>
                )} */}

                {/* FORM CARD */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-2xl mx-auto backdrop-blur-lg bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg"
                >



                    <form action={handleSubmit} className="flex flex-col gap-5" style={{ opacity: isLoading ? 0.6 : 1 }}>

                        {[
                            { label: "Name", key: "name" },
                            { label: "Username", key: "username" },
                            { label: "Profile Picture", key: "profilepic", type: "file" },
                            { label: "Cover Picture", key: "coverpic", type: "file" },
                            { label: "Razorpay Id", key: "razorpayid" },
                            { label: "Razorpay Secret", key: "razorpaysecret" }
                        ].map((field, i) => (
                            <motion.div
                                key={field.key}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * i }}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <label className="text-sm text-gray-300">{field.label}</label>

                                    {form?.[field.key] && field.key !== "password" && (
                                        <span className="text-xs text-purple-400">Uploaded</span>
                                    )}
                                </div>

                                {field.type === "file" ? (
                                    <>

                                        <input
                                            name={field.key}
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                handleImageUpload(e, field.key)
                                            }
                                            }
                                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg"
                                        />
                                        {form?.[field.key] && (

                                            <>
                                                <img
                                                    src={form[field.key]}
                                                    alt={field.label}
                                                    className="mt-3 h-24 w-24 object-cover rounded-lg border border-white/10"
                                                />
                                                <p>{form?.[`${field.key}_name`]}</p>
                                            </>
                                        )}
                                    </>
                                ) : (
                                    <input
                                        value={form?.[field.key] || ""}
                                        onChange={(e) => {
                                            setform({ ...form, [field.key]: field.key === "username" ? e.target.value.toLowerCase() : e.target.value })
                                        }}
                                        className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg outline-none focus:ring-2 focus:ring-purple-500 transition"
                                        placeholder={field.placeholder || field.label}
                                    />
                                )}

                            </motion.div>
                        ))}

                        {/* EMAIL (READONLY) */}
                        <div>
                            <label className="block mb-1 text-sm text-gray-300">Email</label>
                            <input
                                readOnly
                                value={form.email || ""}
                                className="w-full px-4 py-2 bg-gray-700/40 border border-white/10 rounded-lg"
                            />
                            <p className="text-xs text-yellow-400 mt-1">
                                ⚠️ Email cannot be changed
                            </p>
                        </div>

                        {/* BUTTON */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            className="mt-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 shadow-lg"
                        >
                            Save Changes
                        </motion.button>

                    </form>


                </motion.div>

            </motion.div>
        </>
    )
}

export default Dashboard