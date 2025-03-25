const mongoose = require('mongoose');

const GroceryListSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{
    name: { type: String, required: true },
    quantity: { type: String },
    checked: { type: Boolean, default: false }  // For marking as bought
  }],
  generatedFromMeals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meal' }]
});

module.exports = mongoose.model('GroceryList', GroceryListSchema);
