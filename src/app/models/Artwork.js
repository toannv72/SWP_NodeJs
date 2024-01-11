const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');

const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
const likeSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
});
const reportSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    content: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
});

// const artwork  = new Schema({
//     name: { type: String, required: true },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'user', // Tham chiếu đến schema người dùng
//         required: true,
//     },
//     price: { type: Number, required: true },
//     reducedPrice: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     models: { type: String, default: '' },
//     shape: { type: String, default: '' },
//     material: [{ type: String }],
//     accessory: { type: String, default: '' },
//     sold: { type: Number, default: 0 },
//     image: [{ type: String }],
//     description: { type: String, default: '' },
//     deletedAt: { type: String, maxLength: 255, default: null },
//     likes: [likeSchema],
//     comments: [commentSchema],
//     slug: { type: String, slug: 'name', unique: true },
// }, {
//     timestamps: true
// })

const artwork  = new Schema({
    content:{type: String,},
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Tham chiếu đến schema người dùng
        required: true,
    },
    view: { type: Number, default: 0 },
    image: [{ type: String }],
    genre: [{ type: String }],
    deletedAt: { type: String, maxLength: 255, default: null },
    likes: [likeSchema],
    report: [reportSchema],
    comments: [commentSchema],
}, {
    timestamps: true
})



artwork .plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
artwork .plugin(mongoosePaginate);
module.exports = mongoose.model('artworks', artwork );

