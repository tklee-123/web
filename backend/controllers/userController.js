// controllers/userController.js
const Profile = require('../models/Student');
const Accounts = require('../models/Account');
const User = require('../models/Account');
const userController = {
    getProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;
            const requestingUserRole = req.user.role;
            if (requestingUserRole === 'admin' || userId === requestingUserId) {
                const user = await Accounts.findById(userId).populate('_id');
                if (!user) {
                    return res.status(404).json('User not found');
                }

                const responseProfile =
                    requestingUserRole === 'student' && userId !== requestingUserId
                        ? user.profile.getPublicProfile()
                        : user.profile;

                res.status(200).json(responseProfile);
            } else {
                return res.status(403).json("You're not allowed to view this profile");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    },

    updateProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await Accounts.findById(userId).populate('_id');
            if (!user) {
                return res.status(404).json('User not found');
            }

            if (req.body.firstname) user.firstname = req.body.firstname;
            if (req.body.lastname) user.lastname = req.body.lastname;
            if (req.body.address) user.address = req.body.address;
            if (req.body.major) user.major = req.body.major;
            if (req.body.gpa) user.gpa = req.body.gpa;

            await user.save(); // Save the profile separately
            res.status(200).json('Profile updated successfully');
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', chiTiet: err.message });
        }
    },

    deleteProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId).populate('profile');

            if (!user) {
                return res.status(404).json('User not found');
            }

            if (user.profile) {
                await Profile.findByIdAndDelete(user.profile._id); // Delete the profile separately
                user.profile = null;
            }

            await user.save();
            res.status(200).json('Profile deleted successfully');
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', chiTiet: err.message });
        }
    },

    getAllProfiles: async (req, res) => {
        try {
            const users = await User.find({ role: 'student' }).populate('profile');
            const profiles = users.map((user) => ({
                userId: user._id,
                username: user.username,
                profile: user.profile ? user.profile : {},
            }));

            return res.status(200).json(profiles);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    createProfile: async (req, res) => {
        try {
            const userId = req.params.id;
            const requestingUserId = req.user.id;

            const user = await User.findById(userId).populate('profile');
            if (!user) {
                return res.status(404).json('User not found');
            }

            if (user.profile) {
                return res.status(400).json('User already has a profile');
            }

            const newProfile = {
                fullName: req.body.fullName,
                studentId: req.body.studentId,
                dateOfBirth: req.body.dateOfBirth,
                gender: req.body.gender,
                faculty: req.body.faculty,
                major: req.body.major,
                gpa: req.body.gpa,
                advisor: req.body.advisor,
            };

            const createdProfile = await Profile.create(newProfile);
            user.profile = createdProfile._id;
            await user.save();

            res.status(201).json('Profile created successfully');
        } catch (err) {
            res.status(500).json({ error: 'Internal Server Error', chiTiet: err.message });
        }
    },
};

module.exports = userController;
