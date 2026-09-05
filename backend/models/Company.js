const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        industry: {
            type: String,
            default: "Recruitment"
        },

        subscriptionPlan: {
            type: String,
            enum: ["free", "starter", "professional", "enterprise"],
            default: "free"
        },

        callingCredits: {
            type: Number,
            default: 100
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Company", companySchema);