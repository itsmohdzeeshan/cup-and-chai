"use client"

import React from 'react'
import { fetchPayments, fetchUser, initiate } from '@/actions/useractions'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

import { ToastContainer, toast } from 'react-toastify'
import { Bounce } from 'react-toastify'

import { useRouter } from 'next/navigation'



const PaymentPage = ({ username }) => {

    const searchParams = useSearchParams()
    const router = useRouter()

    const [paymentForm, setPaymentForm] = useState({
        amount: "",
        name: "",
        message: ""
    })
    const [currentUser, setCurrentUser] = useState({})
    const [payments, setpayments] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchdata()
    }, [])

    useEffect(() => {
        if (searchParams.get("paymentdone") == "true") {
            toast('Thanks for your donation!', {
                position: "top-center",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: false,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Bounce,
            });
            router.push(`/${username}`)
        }
    }, [])


    const fetchdata = async () => {
        try {
            setIsLoading(true)
            let u = await fetchUser(username)
            setCurrentUser(u || {})
            let dbPayment = await fetchPayments(username)
            setpayments(dbPayment || [])
        } catch (error) {
            console.log(error)
        }
        finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e) => {
        setPaymentForm({ ...paymentForm, [e.target.name]: e.target.value })
    }

    // we have to load razorpay to avoid race call
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true)
                return
            }

            const script = document.createElement("script")
            script.src = "https://checkout.razorpay.com/v1/checkout.js"
            script.onload = () => resolve(true)
            script.onerror = () => resolve(false)

            document.body.appendChild(script)
        })
    }

    const pay = async (amount) => {

        try {

            let finalAmount = Number(amount)
            if (finalAmount < 1 || finalAmount > 500000) {
                toast.error("Amount should be between ₹1 and ₹5,00,000")
                return
            }

            //client side validation
            if (!paymentForm.name.trim()) {
                toast.error("Name field is required to initiate payment")
                return
            }

            const isLoaded = await loadRazorpay()
            if (!isLoaded || !window.Razorpay) {
                toast.error("Unable to reach Razorpay servers. Please check your internet connection or disable ad-blockers.")
            }

            // Validate that the creator actually has a RazorpayID confiured
            if (!currentUser.razorpayid) {
                toast.error("This user hasn't configured their Razorpay account details yet")
                return
            }

            let order;
            try {
                order = await initiate(amount, username, paymentForm)
                if (!order || !order.id) {
                    throw new Error("Failed to generate the order ID from backend server.")
                }
            } catch (serverError) {
                toast.error("Could not initiate transaction. Server is temporarily busy")
                return
            }

            var orderID = order.id

            var options = {
                "key": currentUser.razorpayid, // Enter the Key ID generated from the Dashboard
                "amount": amount * 100, // Amount is in currency subunits.
                "currency": "INR",
                "name": "Get me a chai", //your business name
                "description": "Test Transaction",
                "image": "https://example.com/your_logo",
                "order_id": orderID, // This is a sample Order ID. Pass the id obtained in the response of Step 1
                "callback_url": `${process.env.NEXT_PUBLIC_URL}/api/razorpay`,
                "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information especially their phone number
                    "name": "Gaurav Kumar", //your customer's name
                    "email": "gaurav.kumar@example.com",
                    "contact": "+919876543210" //Provide the customer's phone number for better conversion rates 
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                },
            }

            var rzp1 = new Razorpay(options);
            rzp1.open();
        } catch (error) {
            toast.error("Something went wrong processing your transaction. Please try again.")
        }
    }

    return (
        <>

            <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                transition={Bounce}
            />

            {/* <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy='beforeInteractive'> */}
            {/* </Script> */}

            {isLoading ? (
                <div className="w-[90%] md:w-[80%] mx-auto mt-10 p-8 rounded-xl border border-white/10 bg-white/5 animate-pulse text-center">
                    Loading page data...
                </div>
            ) : (
                <>
                    {isLoading ? (
                        <div className="w-[90%] md:w-[80%] mx-auto mt-10 p-8 rounded-xl border border-white/10 bg-white/5 animate-pulse text-center">
                            Loading page data...
                        </div>
                    ) : (
                        < div className="cover relative border border-white">
                            <img className='object-cover w-full h-[350px]'
                                src={currentUser.coverpic}
                                alt="cover"
                            />

                            <div className='w-[150px] h-[150px] absolute left-1/2 -translate-x-1/2 -bottom-20 border border-white border-4 rounded-full'>
                                <img className='object-cover rounded-full w-full h-full' src={currentUser.profilepic} alt={`${currentUser.name}`} />
                            </div>
                        </div>)}

                    <div className='info my-23 flex flex-col justify-center items-center gap-1'>

                        <h3 className='font-bold text-lg mt-3'>@{username}</h3>
                        <p className='text-slate-400 text-center px-4'>Let help <span className='font-bold text-white'> {currentUser.name} </span> get a chai!</p>
                        <p className='text-slate-400 text-center px-4'>{payments.length} Payments. {currentUser.name} has raised ₹{
                            payments.reduce((a, b) => a + b.amount, 0)}
                        </p>

                        <div className='payment flex w-[90%] md:w-[80%] gap-6 md:gap-2 m-auto mt-4 flex-col md:flex-row'>

                            <div className="supporters flex-1 rounded-lg p-5 md:p-10 backdrop-blur-2xl bg-white/5 border border-white/10">
                                <h2 className='text-lg font-bold'>Top 10 Supporters</h2>
                                <ul className='md:mx-4 flex flex-col gap-5 mt-4 overflow-y-auto max-h-[400px]'>

                                    {payments.length === 0 && <span>No payments yet</span>}

                                    {payments.map((e) => {

                                        return <li key={e._id} className='flex gap-1 items-start text-sm md:text-base'>
                                            <img className='items-start shrink-0 bg-white/20 p-0.5 rounded-full backdrop-blur-sm' width={25} src="avatar.gif" alt="" />
                                            <span>{e.name} donated <span className='font-bold'>₹{e.amount}</span> with a <span className='font-bold'>message</span> &quot;{e.message}&quot;</span>
                                        </li>
                                    })}

                                </ul>
                            </div>

                            <div className="makePayments flex-1 rounded-lg p-5 md:p-10 backdrop-blur-lg bg-white/5 border border-white/10">

                                <h2 className='font-bold text-lg my-3'>Make a Payment</h2>

                                <div className='flex flex-col gap-3'>

                                    <input onChange={handleChange} value={paymentForm.name} name="name" className='w-full bg-slate-800 rounded-lg p-2' type="text" placeholder='Enter name' />
                                    <input onChange={handleChange} value={paymentForm.message} name="message" className='w-full bg-slate-800 rounded-lg p-2' type="text" placeholder='Enter message' />
                                    <input onChange={handleChange} value={paymentForm.amount} name="amount" className='w-full bg-slate-800 rounded-lg p-2' type="text" placeholder='Enter amount' />

                                    <button onClick={() => pay(paymentForm.amount)} type='button' className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover: cursor-pointer bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-6 py-2 text-center leading-5 rounded-md'>
                                        Pay
                                    </button>
                                </div>

                                {/* other payments option */}
                                <div className='flex gap-2 md:gap-4 mt-5'>

                                    <button onClick={() => pay(20)} type='button' className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover: cursor-pointer bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-2 md:px-6 py-2 text-center leading-5 rounded-md whitespace-nowrap'>
                                        Pay ₹20
                                    </button>
                                    <button onClick={() => pay(40)} type='button' className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover: cursor-pointer bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-2 md:px-6 py-2 text-center leading-5 rounded-md whitespace-nowrap'>
                                        Pay ₹40
                                    </button>
                                    <button onClick={() => pay(100)} type='button' className='text-white bg-gradient-to-br from-purple-600 to-blue-500 hover: cursor-pointer bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-2 md:px-6 py-2 text-center leading-5 rounded-md whitespace-nowrap'>
                                        Pay ₹100
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>
                </>
            )
            }



        </>
    )
}

export default PaymentPage
