const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Company = require("../models/Company");

// ===============================
// GENERATE JWT
// ===============================

const generateToken = (user) => {
    return jwt.sign(
        {
            userId: user._id.toString(),
            companyId: user.companyId
                ? user.companyId._id
                    ? user.companyId._id.toString()
                    : user.companyId.toString()
                : null,
            role: user.role
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


// ===============================
// REGISTER
// ===============================

const register = async (req, res) => {
    try {
        const {
            companyName,
            companyEmail,
            companyPhone,
            name,
            email,
            password,
            phone
        } = req.body;

        if (
            !companyName ||
            !companyEmail ||
            !name ||
            !email ||
            !password
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields"
            });
        }

        const existingCompany = await Company.findOne({
            email: companyEmail.toLowerCase()
        });

        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: "Company already exists with this email"
            });
        }

        const existingUser = await User.findOne({
            email: email.toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email"
            });
        }

        // Create company
        const company = await Company.create({
            name: companyName,
            email: companyEmail.toLowerCase(),
            phone: companyPhone
        });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin user
        const user = await User.create({
            companyId: company._id,
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            role: "admin"
        });

        // Generate JWT
        const token = generateToken(user);

        res.status(201).json({
            success: true,
            message: "Company and admin account created successfully",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                companyId: user.companyId
            },

            company: {
                id: company._id,
                name: company.name,
                email: company.email,
                subscriptionPlan: company.subscriptionPlan,
                callingCredits: company.callingCredits
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });
    }
};


// ===============================
// LOGIN
// ===============================

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        }).populate("companyId");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your account is inactive"
            });
        }

        if (!user.companyId || !user.companyId.isActive) {
            return res.status(403).json({
                success: false,
                message: "Your company account is inactive"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate NEW JWT
        const token = generateToken(user);

        res.status(200).json({
            success: true,
            message: "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                companyId: user.companyId._id
            },

            company: {
                id: user.companyId._id,
                name: user.companyId.name,
                email: user.companyId.email,
                subscriptionPlan: user.companyId.subscriptionPlan,
                callingCredits: user.companyId.callingCredits
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message
        });
    }
};


// =========================================================
// GET CURRENT USER=========================================
// =========================================================



const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password")
            .populate("companyId");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,

                companyId: user.companyId
                    ? user.companyId._id
                    : null
            },

            company: user.companyId
                ? {
                    id: user.companyId._id,
                    name: user.companyId.name,
                    email: user.companyId.email,
                    subscriptionPlan:
                        user.companyId.subscriptionPlan,
                    callingCredits:
                        user.companyId.callingCredits
                }
                : null
        });

    } catch (error) {
        console.error("Get Me Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get user information"
        });
    }
};


// ========================
// EXPORT==================
// =========================


module.exports = {
    register,
    login,
    getMe
};