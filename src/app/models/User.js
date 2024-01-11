const mongoose = require('mongoose');
const MongooseDelete = require('mongoose-delete');
const mongoosePaginate = require('mongoose-paginate-v2');
const slug = require('mongoose-slug-generator')
const Schema = mongoose.Schema;
mongoose.plugin(slug)
const followSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const followAddSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});

const User = new Schema({
    username: { type: String, maxLength: 255, unique: true },
    password: { type: String, maxLength: 255 },
    follow: [followSchema],
    followAdd: [followAddSchema],
    phone: { type: String, maxLength: 255 },
    email: { type: String, maxLength: 255 },
    money: { type: Number, default: 0, },
    address: { type: String, maxLength: 255, default: '' },
    name: { type: String, maxLength: 255, default: '' },
    avatar: { type: String, maxLength: 255, default: '' },
    role: { type: String, enum: ['user', 'manager', 'staff', 'admin'], default: 'user' },
    deletedAt: { type: String, maxLength: 255, default: null },
},
    {
        timestamps: true
    }
)

User.plugin(MongooseDelete, { deletedAt: true, overrideMethods: 'all' });
User.plugin(mongoosePaginate);
module.exports = mongoose.model('user', User);

