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

// Update email
exports.updateEmail = async (req, res) => {
    const userId = req.user._id;
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email required" });
    }

    try {
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        await User.findByIdAndUpdate(userId, { email: email.toLowerCase() });
        return res.status(200).json({ success: true, message: "Email updated" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update username
exports.updateUsername = async (req, res) => {
    const userId = req.user._id;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ success: false, message: "Username required" });
    }

    try {
        const existing = await User.findOne({ username });
        if (existing) {
            return res.status(400).json({ success: false, message: "Username already in use" });
        }

        await User.findByIdAndUpdate(userId, { username: username.toLowerCase() });
        return res.status(200).json({ success: true, message: "Username updated" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// Update password
exports.updatePassword = async (req, res) => {
    const userId = req.user._id;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields required" });
    }

    try {
        const user = await User.findById(userId);
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Old password incorrect" });
        }

        const hashed = await bcrypt.hash(newPassword, 10);
        user.password = hashed;
        await user.save();

        return res.status(200).json({ success: true, message: "Password updated" });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};