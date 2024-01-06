const mongoose = require('mongoose');
const {Schema} = mongoose;


const amplifierSchema = new Schema({
name: {type: String, required:true},
image: String,
brand: { type: 'ObjectId', ref: 'Brand' },
power: {type: Number, enum: [140, 230]},
features: {
masterVolume: Boolean,
bass: Boolean,
gain: Boolean,
presence: Boolean,
treble: Boolean,
middle: Boolean,
},
presets: [{ type: 'ObjectId', ref: 'Preset' }]
},{timestamps: true});
const Amplifier = mongoose.model('Amplifier', amplifierSchema);
module.exports = Amplifier;