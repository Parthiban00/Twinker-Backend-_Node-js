const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({



    OrderDetails: {

        type: Object,

    },

    CreatedDate : {
        type: String,

    },
    CreatedTime : {
        type: String,

    },
  
    ActiveYn : {
        type: Boolean,

    },
    DeleteYn : {
        type: Boolean,

    },
  Status:{
      type:String
  },
  BuddyStatus:{
      type:String
  },
  Locality:{
      type:String
  },
  BuddyDetails:{
type:Object
  },
  Type:{
type:String
  },
  UserDetails:{
      type:Object
  }

});

const BuddyOrders = mongoose.model('buddyorders', TaskSchema);

module.exports=BuddyOrders;
