const mongoose = require('mongoose');
const bcrypt = require("bcrypt")
const Students = require('../models/Student');
const Positions = require('../models/Position');
const Promises = require('../models/Promise');
const Accounts = require('../models/Account');
const Teachers = require('../models/Teacher');
const Business = require('../models/Business');
async function run() {
    // Create students
    const students = [];
    for (let i = 0; i < 80; i++) {
        const student_id = i <= 9 ? `2100210${i}` : `210021${i}`;
        const student = {
            "_id": student_id,
            "name": "ST " + i.toString(),
            "birthday": "2022-01-01", // Replace with the actual birthday format
            "sex": "Male", // Replace with the actual sex
            "field": "Mathematics", // Replace with the actual field
            "major": "Data Science",
            "email": `student${i}@example.com`, // Replace with the actual email
            "phone": `+84${i}`, // Replace with the actual phone number
            "cpa": (Math.random() * (3.8 - 2.3) + 2.3).toFixed(1),
            "cert": Math.floor(Math.random() * 2) // Randomly assign 0 or 1 for cert
        };
        students.push(student);
    }
    await Students.insertMany(students);
    const businesses = [];
    for (let i = 0; i < 10; i++) { // Assuming you want 10 businesses
        const business_id = `B${i}`;
        const business = {
            "_id": business_id,
            "name": `Business${i}`,
            "field": `Field${i}`,
            "address": `address${i}`,
            "website": `http://business${i}.com`,
            "phone_number": `123-456-${i}`
        };
        businesses.push(business);
    }
    await Business.insertMany(businesses);

    // Create positions
    const positions = [];
    for (let i = 0; i < 40; i++) {
        const business_id = `B${Math.floor(i / 4)}`; // Assign a business to every 4 positions
        const position = {
            "_id": `VT${i}`,
            "name": `BA${i}`,
            "business": business_id, // Use the custom _id of the business
            "capacity": Math.floor(Math.random() * (7 - 3 + 1) + 3),
            "require": `require${i}`, // Remove the extra colon here
            "cpa_required": (Math.random() * (3.2 - 2.4) + 2.4).toFixed(1)
        };
        positions.push(position);
    }

    // Insert positions
    await Positions.insertMany(positions);

    // Insert students and positions

    // Use created students and positions to create promises
    for (let i = 0; i < 80; i++) {
        const positionIndices = getRandomElements(40, 3);
        const promise = {
            "_id": students[i]._id, // Use the custom _id
            "promised_positions": [
                {"_id": positions[positionIndices[0]]._id }, // Use the custom _id
                {"_id": positions[positionIndices[1]]._id }, // Use the custom _id
                {"_id": positions[positionIndices[2]]._id },  // Use the custom _id
            ]
        };
        await Promises.create(promise);
    }
    const teachers = [];
    for (let i = 0; i < 20; i++) { // Assuming you want 20 teachers
        const teacher_id = `T${i}`;
        const teacher = {
            "_id": teacher_id,
            "firstname": "Teacher",
            "lastname": i.toString(),
            "address": `TeacherAddress${i}`,
            "position": `Position${i}`
        };
        teachers.push(teacher);
    }

    // Insert teachers
    await Teachers.insertMany(teachers);

    const accounts = [];
    for (let i = 0; i < 80; i++) {
        const student = students[i];
        const hashedPassword = await hashPassword(`password${student._id}`);

        const account = {
            "_id": student._id,
            "pass": hashedPassword,
            "role": 'student'
        };
        accounts.push(account);
    }

    await Accounts.insertMany(accounts);
    mongoose.connection.close();
}
async function hashPassword(password) {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
}
function getRandomElements(max, numElements) {
    if (numElements > max) {
        throw new Error('Number of elements requested is greater than the maximum');
    }

    const indices = Array.from({ length: max }, (_, i) => i);
    const shuffledIndices = indices.sort(() => Math.random() - 0.5);

    return shuffledIndices.slice(0, numElements);
}

run();
