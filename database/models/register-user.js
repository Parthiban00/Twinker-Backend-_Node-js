const mongoose = require('mongoose');
const TaskSchema = new mongoose.Schema({

    FirstName: {

        type: String,

    },

    LastName : {
        type: String,

    },
    Address : {
        type: String,

    },
    MobileNo : {
        type: String,

    },
    Password : {
        type: String,

    },
    Email : {
        type: String,

    },
    Address1 : {
        type: String,

    },
    Address2 : {
        type: String,

    },
    Address3 : {
        type: String,

    },
    UserType : {
        type: String,

    },
    ActiveYn : {
        type: Boolean,

    },
    DeleteYn : {
        type: Boolean,

    },
    WelcomeOffer:{
      type:Boolean
    },
    Offer:{
      type:Number
    },
    CreatedDate:{
      type:String
    },
    CreatedTime:{
      type:String
    },
    Locality:{
        type:String
    }
    

});

const Register = mongoose.model('Register', TaskSchema);

module.exports=Register;
