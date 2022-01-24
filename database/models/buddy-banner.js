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

const BuddyBanner = mongoose.model('buddybanners', TaskSchema);

module.exports=BuddyBanner;
