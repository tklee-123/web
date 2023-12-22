const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const middlewareController = {
    // Verify token
    verifyToken: async (req, res, next) => {
        try {
            const token = req.headers.token;

            if (token) {
                const accessToken = token.split(" ")[1];
                const decoded = jwt.verify(accessToken, process.env.JWT_ACCESS_KEY);
                const account = await Account.findById(decoded.id);

                if (!account) {
                    return res.status(403).json("Token is not valid");
                }

                // Check if the user is themselves or an admin
                if (account._id.toString() === req.params.id || account.role === "admin") {
                    req.account = account;
                    next();
                } else {
                    return res.status(403).json("You're not allowed to perform this action");
                }
            } else {
                return res.status(401).json("You're not authenticated");
            }
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    },

    // Verify token and admin role
    verifyTokenAndAdmin: async (req, res, next) => {
        try {
            await middlewareController.verifyToken(req, res, async () => {
                if (req.account.role === "admin") {
                    next();
                } else {
                    return res.status(403).json("You're not allowed to perform this action");
                }
            });
        } catch (err) {
            return res.status(403).json("Token is not valid");
        }
    },
};

module.exports = middlewareController;