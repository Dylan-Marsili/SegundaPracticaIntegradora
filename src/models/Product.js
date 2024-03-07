import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thumbnail' }],
});

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;
