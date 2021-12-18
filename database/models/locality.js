const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({

    Locality: {

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
  }





});

const Locality = mongoose.model('localities', TaskSchema);

module.exports=Locality;
