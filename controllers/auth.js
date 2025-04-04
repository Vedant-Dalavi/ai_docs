const User = require("../models/user.model")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config();


exports.signup = async (req, res) => {
    try {
        // Destructure fields from the request body
        const {
            name,
            email,
            password,
        } = req.body;
        // Check if All Details are there or not

        if (
            !name ||
            !email ||
            !password
        ) {
            return res.status(403).send({
                success: false,
                message: "All Fields are required",
            });
        }


        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please sign in to continue.",
            });
        }


        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);


        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        return res.status(200).json({
            success: true,
            user,
            message: "User registered successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "User cannot be registered. Please try again.",
        });
    }
};

// Login controller for authenticating users
exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        // Check if email or password is missing
        if (!email || !password) {
            // Return 400 Bad Request status code with error message
            return res.status(400).json({
                success: false,
                message: `Please Fill up All the Required Fields`,
            });
        }

        // Find user with provided email
        const user = await User.findOne({ email });

        // If user not found with provided email
        if (!user) {
            // Return 401 Unauthorized status code with error message
            return res.status(401).json({
                success: false,
                message: `User is not Registered with Us Please SignUp to Continue`,
            });
        }

        // Generate JWT token and Compare Password
        if (await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { email: user.email, id: user._id },
                process.env.JWT_SECRET,
                {
                    expiresIn: "24h",
                }
            );

            // Save token to user document in database
            user.token = token;
            user.password = undefined;

            // Set cookie for token and return success response
            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true,
            };
            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user,
                message: `User Login Success`,
            });
        } else {
            return res.status(401).json({
                success: false,
                message: `Password is incorrect`,
            });
        }
    } catch (error) {
        console.error(error);
        // Return 500 Internal Server Error status code with error message
        return res.status(500).json({
            success: false,
            message: `Login Failure Please Try Again`,
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {

        const { name, email, _id } = req.body;

        if (!name || !email || !_id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const user = await User.findByIdAndUpdate(_id, { name, email }, { new: true });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            user,
            message: "Profile updated successfully",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });

    }
}