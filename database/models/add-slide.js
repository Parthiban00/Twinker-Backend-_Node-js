const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({



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
    Locality:{
        type:String
    }






});

const AddSlide = mongoose.model('addslides', TaskSchema);

module.exports=AddSlide;
