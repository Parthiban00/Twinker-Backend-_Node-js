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

    AvailableStatus:{
      type:Boolean
    },
    BannerImage:{
        type:String
    }





});

const SpecificCategory = mongoose.model('specificcategories', TaskSchema);

module.exports=SpecificCategory;
