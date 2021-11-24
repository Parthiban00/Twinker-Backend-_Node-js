const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({

    Category: {

        type: String,

    },





    ActiveYn : {
        type: Boolean,

    },

    DeleteYn : {
        type: Boolean,

    },
    MinimumDeliveryCharge:{
      type:Number
    },
    PerKm:{
      type:Number
    },
    CategoryId:{
      type:String
    }








});

const DeliveryCharge = mongoose.model('deliverycharges', TaskSchema);

module.exports=DeliveryCharge;
