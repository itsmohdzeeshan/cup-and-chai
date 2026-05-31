import mongoose from 'mongoose'
import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

// imports regarding databases
import User from '@/models/User'
import Payment from '@/models/Payment'
import connectDB from '@/db/connectDB'

export const authoptions = NextAuth({

    providers: [
        GitHubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    // prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),

        CredentialsProvider({
            name: "credentials",

            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials) {

                await connectDB()

                const user = await User.findOne({
                    email: credentials.email
                })

                if (!user) {
                    throw new Error("User not found. Sign up")
                }

                // const isMatch = await bcrypt.compare(credentials.password, user.password)
                // if (!isMatch) {
                //     throw new Error("Password is Incorrect")
                // }


                if (!user.password) {
                    throw new Error("Use Google/Github login")
                }

                if (credentials.password !== user.password) {
                    throw new Error("Password is Incorrect")
                }


                return {
                    email: user.email,
                    name: user.username
                }
            }
        })

    ],

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account.provider == "github") {
                await connectDB()
                // Check if the user already exists in the database
                const currentUser = await User.findOne({ email: user.email })

                if (!currentUser) {
                    // create a new user
                    const newUser = await new User({
                        email: user.email,
                        username: user.email.split("@")[0],
                        provider: "github"
                    })

                    await newUser.save()
                }
                return true
            }


            else if (account.provider == "google") {

                await connectDB()

                let currentUser = await User.findOne({ email: user.email })
                if (!currentUser) {
                    //create a new user
                    currentUser = await new User({
                        email: user.email,
                        username: user.email.split("@")[0],
                        profilepic: user.image,
                        provider: "google",
                        googleId: account.providerAccountId
                    });
                }


                if (account.refresh_token) {
                    currentUser.googleRefreshToken = account.refresh_token
                    await currentUser.save() // save only if token is updated
                }

                return true;
            } else if (account.provider === "credentials") {
                // They passed the password check in authorize(), so allow them through!
                
                return true;
            }
            return false;
        },

        async session({ session, user, token }) {
            // while querring to the database we have to use await
            await connectDB()
            const dbUser = await User.findOne({ email: session.user.email })
            session.user.name = dbUser.username
            session.user.hasPassword = !!dbUser.password
            return session
        },
    }
})


export { authoptions as GET, authoptions as POST }
