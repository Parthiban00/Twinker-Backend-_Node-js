const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({

    Category: {

        type: String,

    },

    ImageUrl : {
        type: String,

    },
    Type : {
      type: String,

  },


    ActiveYn : {
        type: Boolean,

    },

    DeleteYn : {
        type: Boolean,

    },
    RestaurantId:{
      type:String
    },
    RestaurantName:{
      type:String
    },
    AvailableStatus:{
      type:Boolean
    },
    Locality:{
        type:String
    }






});

const SpecialOffers = mongoose.model('specialoffers', TaskSchema);

module.exports=SpecialOffers;
