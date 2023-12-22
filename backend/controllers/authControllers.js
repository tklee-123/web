const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Accounts = require("../models/Account");
const Report = require('../models/WeeklyReport');
const Student = require('../models/Student');
const Business = require('../models/Business')
const News = require('../models/News')
const FinalReport = require('../models/FinalReport');
const Result = require("../models/FinalList");

const authController = {
    registerUser: async (req, res) => {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashed = bcrypt.hashSync(req.body.pass, salt);

            const newUser = new Accounts({
                _id: req.body._id,
                pass: hashed,
                role: req.body.role,
            });

            const user = await newUser.save();

            console.log("User saved to the database:", user);

            res.status(200).json(user);
        } catch (err) {
            console.error("Error during user registration:", err);
            res.status(500).json(err);
        }
    },

    // GENERATE ACCESS TOKEN
    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_ACCESS_KEY,
            { expiresIn: "3600s" }
        );
    },

    // LOGIN USER
    loginUser: async (req, res) => {
        try {
            const user = await Accounts.findOne({ _id: req.body._id });

            if (!user) {
                return res.status(404).json("Wrong username");
            }

            const validPassword = await bcrypt.compare(req.body.pass, user.pass);

            if (!validPassword) {
                return res.status(404).json("Wrong password");
            }

            if (user && validPassword) {
                const accessToken = authController.generateAccessToken(user);

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "strict",
                    maxAge: 30 * 60 * 1000 
                });

                const { pass, ...others } = user._doc;
                return res.status(200).json({ ...others, accessToken });
            }
        } catch (err) {
            console.log(err)
            res.status(500).json(err);
        }
    },

    userLogout: async (req, res) => {
        res.clearCookie("accessToken");
        res.status(200).json("Logged out!");
    },

    //thêm báo cáo hàng tuần cho sinh viên nếu id valid, báo cáo thêm vào sẽ được add thêm vào array báo cáo đã có,
    // ví dụ như id 21002100 trong array reports đang có báo cáo của tuần 1,2,3 thêm 1 báo cáo nữa thì array đó sẽ thành 4 phần tử

    weekly_report: async (req, res) => {
        try {
            const newReport = {
                time: req.body.report.time,
                work: req.body.report.work,
                progress: req.body.report.progress,
            };
    
            const studentId = req.body._id;
    
            // Check if the student with the provided ID exists
            const existingStudent = await Student.findById(studentId);
    
            if (!existingStudent) {
                return res.status(404).json({ error: 'Student not found', success: false });
            }
    
            const report = await Report.findById(studentId);
    
            if (!report) {
                // If the report doesn't exist, create a new one
                const newReportData = {
                    _id: studentId,
                    reports: [newReport],
                };
                await Report.create(newReportData);
            } else {
                // If the report exists, add the new report to the existing reports array
                report.reports.push(newReport);
                await report.save();
            }
    
            res.status(201).json({ message: 'Report added successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },    

    // thêm tin tuyển dụng, id của news sẽ cho tăng dần, ví dụ trong collection đang là id news18 rồi thì tin tiếp theo
    // được thêm vào sẽ có id là news19

    add_news: async (req, res) => {
        try {
            const { businessId, title, startTime, endTime, describe, requirement, profit, address } = req.body;

            const latestNews = await News.findOne({}, {}, { sort: { '_id': -1 } });
            let nextId;
            if (latestNews) {
                const currentIdNumber = parseInt(latestNews._id.replace('news', ''), 10);
                nextId = `news${currentIdNumber + 1}`;
            } else {
                // If no existing news, start from news0
                nextId = 'news0';
            }
    
            const newsData = {
                _id: nextId,
                business: businessId,
                title,
                start_time: startTime,
                end_time: endTime,
                describe,
                require: requirement,
                profit,
                address,
            };
    
            const recruitmentNews = await News.create(newsData);
    
            res.status(201).json({ message: 'Recruitment information saved successfully', recruitmentNews });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message });
        }
    },    


    //thêm report final cho sinh viên nếu id valid
    final_report: async (req, res) => {
        try {
            const studentId = req.body._id;
            const existingStudent = await Student.findById(studentId);
    
            if (!existingStudent) {
                return res.status(404).json({ error: 'Student not found', success: false });
            }
    
            const project = req.body.project;
            const result = req.body.result;
    
            const finalReport = new FinalReport({
                _id: studentId,
                project,
                result
            });
    
            await finalReport.save();
    
            res.status(201).json({ message: 'Final report added successfully', success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message, success: false });
        }
    },

    //add kết quả thực tập cho mấy đứa thực tập ngoài, chỉ cần nhập id, tên vị trí và tên doanh nghiệp
    // mấy thuộc tính khác tự động được thêm nếu id valid
    add_result: async (req, res) => {
        try {
            const studentId = req.body.id;
            const existingStudent = await Student.findById(studentId).select('name birthday sex major -_id');
    
            if (!existingStudent) {
                return res.status(404).json({ error: 'Student not found', success: false });
            }
    
            const position = req.body.position;
            const business = req.body.business;
    
            // Extract selected attributes from the existing student
            const { name, birthday, sex, major } = existingStudent.toObject();
    
            await Result.create({
                _id: studentId,
                name,
                birthday,
                sex,
                major,
                position,
                business
            });
    
            res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error', details: err.message, success: false });
        }
    }
    
};


module.exports = authController;
