// controllers/userController.js
const Profile = require('../models/Student');
const Accounts = require('../models/Account');
const FinalReports = require('../models/FinalReport');
const InternshipResult = require('../models/InternshipResult');
const RegularReport = require('../models/WeeklyReport');
const { exec } = require('child_process');
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
            const accounts = await Accounts.find({ role: 'student' }).populate('_id');
    
            const profiles = accounts.map(account => ({
                    _id: account._id._id,
                    name: account._id.name,
                    major: account._id.major,
                
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

            const user = await Accounts.findById(userId).populate('profile');
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
    getRegularReport : async (req, res) => {
        try {
            const regularReports = await FinalReports.find({}).populate({
                path: '_id',
                model: 'Internship_Result'
            });
    
            const profiles = regularReports.map(report => ({
                _id: report._id._id,
                name: report._id.name,
                phone: report._id.phone,
                major: report._id.major,
                position: report._id.position,
                business: report._id.business,
                project: report.project
            }));
    
            return res.status(200).json(profiles);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },    
    getRegularReport_details: async (req, res) => {
        try {
            const regularReports = await RegularReport.find({});
            const results = [];
    
            regularReports.forEach(regularReport => {
                regularReport.reports.forEach(report => {
                    results.push({
                        time: report.time,
                        work: report.work,
                        progress: report.progress,
                    });
                });
            });
    
            return res.status(200).json(results);
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    },   

    runcode: async (req, res) => {
        exec('python D:\\web\\backend\\algorithms\\demo.py', (error, stdout, stderr) => {
          if (error) {
            console.error(`Error executing the Python script: ${error}`);
            return res.status(500).send('Internal Server Error');
          }
      
          try {
            const jsonData = JSON.parse(stdout);
            res.json(jsonData);
          } catch (parseError) {
            console.error(`Error parsing JSON: ${parseError}`);
            res.send(stdout.replace(/\n/g, '<br>'));
          }
        });
    }
};

module.exports = userController;
