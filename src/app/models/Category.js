const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const mongooseDelete = require('mongoose-delete');
const category = new mongoose.Schema({
    label: {
        type: String, maxLength: 255, default: ""
    },
    value: {
        type: String, maxLength: 255, default: ""
    },
}, {
    timestamps: true
});
category.plugin(mongooseDelete, { deletedAt: true, overrideMethods: 'all' });
category.plugin(mongoosePaginate);
const Category = mongoose.model('category', category);

module.exports = Category;
