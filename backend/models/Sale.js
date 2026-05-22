const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productTitle: {
      type: String,
      required: true,
    },
    productCategory: {
      type: String,
      default: '',
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    revenue: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Sale', saleSchema);
