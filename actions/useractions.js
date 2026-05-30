"use server"

import Razorpay from 'razorpay'
import User from '@/models/User'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'
import bcrypt from "bcrypt"

export const initiate = async (amount, to_username, paymentForm) => {

    await connectDB()

    const user = await User.findOne({ username: to_username })
    const secret = user.razorpaysecret
    const id = user.razorpayid

    var instance = new Razorpay(
        {
            key_id: id,
            key_secret: secret
        }
    )

    var options = {
        amount: Number.parseInt(amount) * 100,
        currency: "INR"
    }

    const order = await instance.orders.create(options)

    await Payment.create({ oid: order.id, amount: amount, to_user: to_username, name: paymentForm.name, message: paymentForm.message })

    return order
}

// export const fetchUser = async (username) => {
//     await connectDB()
//     let u = await User.findOne({username}).lean()
//     // let user = u.toObject({ flattenObjectIds: true })
//     return user
// }

// export const fetchPayments = async (username) => {
//     await connectDB()
//     let p = await Payment.find({to_user: username, done: true}).sort({amount: -1}).limit(10).lean()
//     return p
// }

export const fetchUser = async (username) => {
    await connectDB()

    // You should add .select("-password") is order to exclude the password field from the query
    let user = await User.findOne({ username }).select("-password").lean()

    if (!user) return null

    return {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt?.toISOString(),
        updatedAt: user.updatedAt?.toISOString(),
    }
}

export const fetchPayments = async (username) => {
    await connectDB()

    let payments = await Payment.find({ to_user: username, done: true })
        .sort({ amount: -1 })
        .limit(10)
        .lean()


    // 🔥 Convert to pure JSON-safe object
    let p2 = payments.map(p => ({ ...p, _id: p._id.toString(), createdAt: p.createdAt?.toISOString(), updatedAt: p.updatedAt?.toISOString(), }))

    return p2
}

export const updateProfile = async (formData, oldUsername) => {
    await connectDB()

    const { email, ...rest } = formData

    // Now we hashed the user password
    if (rest.password) {
        rest.password = await bcrypt.hash(rest.password, 10)
    }

    // below check is used to determine if user changed his username or not 
    if (formData.username !== oldUsername) { // it means user changed his username
        // now we update 
        // first check if username is not already been taken by anyone
        const u = await User.findOne({ username: formData.username })
        // if user is already existed in our database
        if (u) {
            return { error: "Username is already been taken" }
        }

        await User.updateOne({ email: email }, { $set: rest })
        await Payment.updateMany({ to_user: oldUsername }, { to_user: formData.username })

    }
    else {

        await User.updateOne({ email: email }, { $set: rest })

    }

}

export const registerUser = async (formdata) => {
    await connectDB()
    const { email, password } = formdata;

    try {

        // check for already exixting email in database 
        const user = await User.findOne({ email: email })
        if (user) {
            return { error: "An account with this email already exists. Kindly continue login" }
        }

        // const hashedPassword = await bcrypt.hash(password, 10)

        const generatedUsername = email.split("@")[0]

        await User.create({
            email: email,
            password: password,
            username: generatedUsername,
        })

        return { success: true }

    } catch (err) {
        return { error: "Internal Server error. Please try again", err }
    }
}

export const setPassword = async (email, password) => {
    await connectDB()

    const user = await User.findOne({ email: email })

    if (!user) {
        return { error: "User not found" }
    }

    if (user.password) {
        return { error: "Password is already set" }
    }

    user.password = password
    await user.save()

    return { success: true }
}

export const changePassword = async (email, oldPassword, newPassword) => {
    await connectDB()

    const user = await User.findOne({ email })

    if (!user) {
        return { error: "User not found" }
    }

    if (!oldPassword || !newPassword) {
        return { error: "All password fields are required" }
    }

    if(oldPassword === newPassword){
        return {error: "Old password and new password cannot be same"}
    }

    if (!user.password) {
        return { error: "User password is not set. First set the password before changing it" }
    }

    if (user.password !== oldPassword) {
        return { error: "Old password is incorrect" }
    }

    user.password = newPassword
    await user.save()

    return { success: true }
}