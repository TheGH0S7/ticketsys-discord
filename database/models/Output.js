const mongoose = require('mongoose');

const OutputSchema = new mongoose.Schema({
    vc_id: { type: String, required: true},
    c_id: { type: String, required: true},
    t_id: { type: String, required: true},
    date: { type: Date },
    u_id: { type: String, required: true}
})

const Output = module.exports = new mongoose.model('Output', OutputSchema)