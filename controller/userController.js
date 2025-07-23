const User = require("../models/User")
const bcrypt = require("bcrypt") // maintain hashing for passwords
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

exports.registerUser = async (req, res) => {
    const { username, email, password, confirmPassword } = req.body

    console.log(req.body);

    if (!username || !email || !password || !confirmPassword) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing field"
            }
        )
    }

    try {
        const existingUser = await User.findOne(
            {
                $or:
                    [
                        { username: username },
                        { email: email }
                    ]
            }
        )

        if (existingUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "User exists"
                }
            )
        }

        const hashedPassword = await bcrypt.hash(password, 10) // 10 salt/complexity jaty badayo tety complex hudaii janxa

        const newUser = new User(
            {
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                confirmPassword: hashedPassword,
            }
        )

        // save the user data
        await newUser.save()
        return res.status(201).json(
            {
                "success": true,
                "message": "User registered"
            }
        )

    } catch (e) {
        console.log(e);
        return res.status(500).json(
            {
                "success": false,
                "message": "Server error"
            }
        )
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body
    // validation 
    if (!email || !password) {
        return res.status(400).json(
            {
                "success": false,
                "message": "Missing Field"
            }
        )
    }
    try {
        const getUser = await User.findOne(
            {
                "email": email
            }
        )
        if (!getUser) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "Missing User"
                }
            )
        }
        // check for password
        const passwordCheck = await bcrypt.compare(password, getUser.password)
        if (!passwordCheck) {
            return res.status(400).json(
                {
                    "success": false,
                    "message": "Invalid Credentials"
                }
            )
        }
        // jwt
        const payload = {
            "_id": getUser._id,
            "email": getUser.email,
            "username": getUser.username,
        }
        const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "7d" })
        return res.status(200).json(
            {
                "success": true,
                "message": "Login successful",
                data: {
                    _id: getUser._id,
                    username: getUser.username,
                    email: getUser.email,
                },
                "token": token
            }
        )
    } catch (err) {
        console.log(err);
        return res.status(500).json(
            {
                "success": false,
                "message": "Server Error"
            }
        )
    }
}

// const transporter = nodemailer.createTransport(
//     {
//         service: "gmail",
//         auth: {
//             user: process.env.EMAIL_USER,
//             pass: process.env.EMAIL_PASS
//         }
//     }
// )

// exports.sendResetLink = async (req, res) => {
//     const { email } = req.body
//     try {
//         const user = await User.findOne({ email })
//         if (!user) return res.status(404).json({
//             success: false,
//             message: "User not found"
//         })
//         const token = jwt.sign({ id: user._id }, process.env.SECRET, { expiresIn: "15m" })
//         const resetUrl = process.env.CLIENT_URL + "/reset/password/" + token
//         const mailOptions = {
//             from: `"Budget Hero" <${process.env.EMAIL_USER}>`,
//             to: email,
//             subject: "Reset your password",
//             html: `<p>Reset your password.. ${resetUrl}</p>`
//         }
//         transporter.sendMail(mailOptions, (err, info) => {
//             if (err) {
//                 console.log(err);
//                 return res.status(403).json({
//                     success: false,
//                     message: "Failed"
//                 })
//             }
//             if (info) console.log(info);
//             return res.status(200).json({
//                 success: true,
//                 message: "Success"
//             })
//         })
//     } catch (err) {
//         return res.status(500).json({
//             success: false,
//             message: "Server error"
//         })
//     }
// }

// exports.resetPassword = async (req, res) => {
//     const { token } = req.params
//     const { password } = req.body

//     try {
//         const decoded = jwt.verify(token, process.env.SECRET)
//         const hased = await bcrypt.hash(password, 10)
//         await User.findByIdAndUpdate(decoded.id, { password: hased })
//         return res.status(200).json({
//             success: true,
//             message: "Password updated"
//         })
//     } catch (err) {
//         console.log(err);
//         return res.status(500).json({
//             success: false,
//             message: "Server error / Token invalid"
//         })
//     }
// }