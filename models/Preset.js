const mongoose = require('mongoose');
const {Schema} = mongoose;
const presetSchema = new Schema({
name: {type: String, required:true},
user: { type: 'ObjectId', ref: 'User', requiered: true},
amp: { type: 'ObjectId', ref: 'Amplifier', required: true},
musicId: String,
musicTitle: String,
settings: {
    masterVolume: {type: Number,min: 0,max: 10},
    bass: {type: Number, min: 0,max: 10},
    gain: {type: Number, min: 0,max: 10},
    presence: {type: Number, min: 0,max: 10},
    treble: {type: Number, min: 0,max: 10},
    middle: {type: Number, min: 0,max: 10}
},
},{timestamps: true});
const Preset = mongoose.model('Preset', presetSchema);
module.exports = Preset;