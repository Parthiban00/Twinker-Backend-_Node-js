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
    Description:{
      type:String
    },
    AvailableStatus:{
      type:Boolean
    },
    Locality:{
        type:String
    }






});

const MainCategory = mongoose.model('maincategories', TaskSchema);

module.exports=MainCategory;
