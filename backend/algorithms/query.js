const PromiseModel = require("../models/Promise");

PromiseModel.findOne({ _id: '21002157' }) // Use the string value directly
  .populate('_id') // Populate the student field
  .populate({
    path: 'promised_positions._id', // Populate the position field in promised_positions array
    populate: {
      path: 'business', // Populate the business field in the Position model
      model: 'Business', // Specify the model to use
    }
  })
  .then(promise => {
    // Access information from Student, Position, and Business through the populated fields
    console.log('Thông tin về sinh viên:', promise._id);
    console.log('Danh sách vị trí đã đăng kí:');
    promise.promised_positions.forEach(position => {
      console.log('  - Vị trí:', position._id.name);
      console.log('    Doanh nghiệp:', position._id.business);
    });
  })
  .catch(err => {
    // Handle errors if needed
    console.error(err);
  });
