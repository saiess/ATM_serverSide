const mongoose = require('mongoose');

const Client = mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  bin: { type: String, required: [true, 'Bin is required'] },
  password: { type: String, required: [true, 'Password is required'] },
  phone: { type: String, required: [true, 'Phone is required'] },
  email: { type: String, required: [true, 'Email is required'] },
  contractCode: { type: String, required: [true, 'This code is required'] },
  vehicleNumber: { type: String, required: [true, 'required'] },
  sold: { type: Number },
});
module.exports = mongoose.model('Client', Client);
