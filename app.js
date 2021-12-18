const express = require('express');
const app = express();
const cors=require('cors');
const mongoose = require('./database/mongoose');
const fast2sms = require('fast-two-sms')
const List= require ('./database/models/list');
const Task= require ('./database/models/task');
const Tokens=require('./database/models/tokens');
const Register= require ('./database/models/register-user');
const Restaurant = require('./database/models/restaurant');
const MainMenu = require('./database/models/main-menu');
const Products = require('./database/models/products');
const Cart = require('./database/models/Cart');
const DeliveryLocation = require('./database/models/delivery-location');
const OrderDetails = require('./database/models/order-details');
const Category = require('./database/models/category');
const Coupons = require('./database/models/coupons');
const { isValidObjectId } = require('mongoose');
let Razorpay = require('razorpay');
const socket = require('socket.io');
const ShopCategory=require('./database/models/shop-category');
const Offers = require('./database/models/offers');
const MainCategory=require('./database/models/main-category');
const AddSlide = require('./database/models/add-slide.js');
const BuddySlide = require('./database/models/buddy-slide.js');
const SpecialOffers = require('./database/models/special-offers.js');
const BookingSlide = require('./database/models/bokking-slide.js');
const DeliveryCharge = require('./database/models/delivery-charges');
const SpecificCategory = require('./database/models/specific-category');
const Locality = require('./database/models/locality');
 //var server=require('http').createServer(app);
 var MongoClient = require('mongodb').MongoClient;
 var url = "mongodb://localhost:27017/";
app.use(express.json());
// ---------------------------------new--------------
const port = process.env.PORT || 5000;





app.use(cors());
app.use(express.urlencoded({extended:false}))




  server=app.listen(port,()=>{
    console.log("server is runnging "+port);
   });


//const io=socket(server);


   const io=require("socket.io")(server,{cors:{origin:"*"}});
   io.on('connection',(socket)=>{
     console.log(`new connection id: ${socket.id}`);
    
 socket.on('JoinRoom',function(data){
console.log(data.room+' '+data.user);


 socket.join(data.room);

//  MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("twinkertest");
//   dbo.collection("orderdetails").find({"Status":"Placed","ActiveYn":true}).toArray(function(err, result) {
//     if (err) throw err;
  
//     socket.broadcast.to(data.room).emit('NewOrderPlaced',{data:result});
//     db.close();
//   });
// }); 






socket.on('OrderPlaced',function(data){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("twinkertest");
    dbo.collection("orderdetails").find({"Status":"Placed","ActiveYn":true}).toArray(function(err, result) {
      if (err) throw err;
    
      socket.broadcast.to(data.room).emit('NewOrderPlaced',{data:result});
      db.close();
    });
  }); 
})
 })

 
});



function GetPlacedOrders(){
var placedOrder;
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("twinkertest");
    dbo.collection("orderdetails").find({}).toArray(function(err, result) {
      if (err) throw err;
    //  console.log(result);
      placedOrder=result;
      db.close();
    });
  }); 
 return placedOrder;
  
}


  function SocketCheck(){
    console.log("connect check function");
  }

const RazorpayConfig={
  key_id:'rzp_live_BNBLXyHk09HIQZ',
  key_secret:'GfucUQNVT6s5EIWiTL0z9ow9'
}




app.use((req,res,next)=> {

    res.header("Access-Control-Allow-Orgin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


var instance = new Razorpay({ key_id: 'rzp_live_Lr7mSG4IeRtTrk', key_secret: 'XVMQGkUnw8Yqcp1VG9OrXTOK' })
var orderPlacedUserId;
var cartRemovedUserId;

app.post('/razorpay/:amount',(req,res)=>{
  var options = {
    amount:req.params.amount ,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function(err, order) {
    console.log(order);
    res.send(order)

  });
})

app.get('/lists',(req,res)=>{

    List.find({})
    .then(lists=>res.send(lists))
    .catch((error)=>console.log(error));
});

app.post('/lists',(req,res)=>{

    (new List ({'title': req.body.title}))
    .save()
    .then((list)=> res.send(list))
    .catch((error)=>console.log(error));

})

app.get('/lists/:listId',(req,res)=>{
    List.find({_id:req.params.listId})
    .then((list)=> res.send(list))
    .catch((error)=>console.log(error));
});

app.patch('/lists/:listId', (req,res)=>{
List.findOneAndUpdate({'_id': req.params.listId}, {$set: req.body})
.then((list)=> res.send(list))
.catch((error)=>console.log(error));

}),

app.delete('/lists/:listId', (req,res)=>{
    const deleteTasks=(list)=>{
        Task.deleteMany({_listId:list.id})
        .then(()=>list)
        .catch((error)=> cosole.log(error));
    };
    const list=List.findByIdAndDelete(req.params.listId)
    .then((list)=> deleteTasks(list))
    .catch((error)=>console.log(error))
    res.send(list);
});


/* http://localhost:3000/lists/:listId/tasks/:taskId */

app.post('/lists/:listId/tasks', (req,res)=>{

    (new Task({'_listId': req.params.listId, 'title': req.body.title}))
    .save()
    .then((task)=>res.send(task))
    .catch((error)=>console.log(error));
});

app.get('/lists/:listId/tasks',(req,res)=>{
    Task.find({_listId: req.params.listId})
    .then((tasks)=>res.send(tasks))
    .catch((error)=>console.log(error));
});

app.get('/lists/:listId/tasks/:taskId',(req,res)=>{
    Task.find({_listId: req.params.listId, _id:req.params.taskId})
    .then((tasks)=>res.send(tasks))
    .catch((error)=>console.log(error));
});

app.patch('/lists/:listId/tasks/:taskId', (req,res)=>{
    Task.findOneAndUpdate({_id: req.params.taskId, _listId:req.params.listId}, {$set: req.body})
    .then((tasks)=> res.send(tasks))
    .catch((error)=>console.log(error));

    }),

app.delete('/lists/:listId/tasks/:taskId', (req,res)=>{
        Task.findOneAndDelete({_id: req.params.taskId, _listId:req.params.listId})
        .then((tasks)=> res.send(tasks))
        .catch((error)=>console.log(error));

        }),

        //-------------------------------------------------------------------login----------------------------------------------------






        app.post('/userregisters',(req,res)=>{
          let date_ob = new Date();
          let hours = date_ob.getHours();


let minutes = date_ob.getMinutes();

var time=hours+":"+minutes;
//console.log(hours + ":" + minutes);

var dd = String(date_ob.getDate()).padStart(2, '0');
var mm = String(date_ob.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = date_ob.getFullYear();

var today1 = yyyy + '-' + mm + '-' + dd;
//console.log(today1);
         //   console.log("enters backend");
if(req.body.UserType=='D'){

}
else{


            (new Register ({'FirstName': req.body.FirstName,'LastName':req.body.LastName,'Address':req.body.Address,'MobileNo':req.body.MobileNo,'Password':req.body.Password,'Email':req.body.Email,'Address1':req.body.Address1,'Address2':req.body.Address2,'Address3':req.body.Address3,'UserType':req.body.UserType,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'WelcomeOffer':true,'CreatedDate':today1,'CreatedTime':time}))
            .save()
            .then((userregisters)=> res.send(userregisters))
            .catch((error)=>console.log(error));
          }
        })


        app.get('/userregisters',(req,res)=>{

            Register.find({})
            .then(userregisters=>res.send(userregisters))
            .catch((error)=>console.log(error));
        });

        app.get('/userregisters/:MobileNo/:Password/:ActiveYn',(req,res)=>{
            console.log("user login get ");
            Register.find({MobileNo:req.params.MobileNo,Password:req.params.Password,ActiveYn:true})
            .then((userregisters)=> res.send(userregisters))
            .catch((error)=>console.log(error));
        });
        app.get('/userregisters/:MobileNo/:ActiveYn',(req,res)=>{
          console.log("user login get ");
          Register.find({MobileNo:req.params.MobileNo,ActiveYn:true})
          .then((userregisters)=> res.send(userregisters))
          .catch((error)=>console.log(error));
      });

      app.get('/userregisters/:id',(req,res)=>{
        console.log("user login get by id ");
        Register.find({_id:req.params.id,ActiveYn:true,WelcomeOffer:true})
        .then((userregisters)=> res.send(userregisters))
        .catch((error)=>console.log(error));
    });
    app.patch('/userregisters/:id', (req,res)=>{
      console.log('welcome offer false update');
      Products.findOneAndUpdate({_id: req.params.id}, {$set:{WelcomeOffer:false}})
      .then((products)=> res.send(products))
      .catch((error)=>console.log(error));

      }),


        app.post('/restaurants',(req,res)=>{

console.log("save restaurant");
            (new Restaurant ({'RestaurantName': req.body.RestaurantName,'RestaurantNickName':req.body.RestaurantNickName,'Address':req.body.Address,'MobileNo':req.body.MobileNo,'Password':req.body.Password,'Email':req.body.Email,'RestaurantType':req.body.RestaurantType,'RestaurantStatus':req.body.RestaurantStatus,'OrderStatus':req.body.OrderStatus,'DineinStatus':req.body.DineinStatus,'AvailableDays':req.body.AvailableDays,'OpenTime':req.body.OpenHr,'CloseTime':req.body.CloseHr,'UserType':req.body.UserType,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Latitude':req.body.Latitude,'Longitude':req.body.Longitude,'Distance':req.body.Distance,'Offer':req.body.Offer,'AvailableStatus':req.body.AvailableStatus,'OfferDescription':req.body.OfferDescription,'UserId':req.body.UserId,'Sort':req.body.Sort,'Type':req.body.Type}))
            .save()
            .then((restaurants)=> res.send(restaurants))
            .catch((error)=>console.log(error));

        });

        app.post('/tokens',(req,res)=>{

          console.log("save tokens");
                      (new Tokens ({'Token': req.body.Token}))
                      .save()
                      .then((tokens)=> res.send(tokens))
                      .catch((error)=>console.log(error));

                  });

                  app.get('/tokens/:Token',(req,res)=>{

                    console.log('get tokens');

                      Tokens.find({'Token':req.params.Token})
                      .then(tokens=>res.send(tokens))
                      .catch((error)=>console.log(error));
                  });


        app.get('/restaurants',(req,res)=>{

          console.log('get restaurants entered');

           var datetime = new Date();
           console.log(datetime);

            Restaurant.find({'ActiveYn':true,'DeleteYn':false})
            .then(restaurants=>res.send(restaurants))
            .catch((error)=>console.log(error));
        });


        app.get('/restaurants/:ActiveYn/:Type',(req,res)=>{
          let date_ob = new Date();
          let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();
console.log(hours + ":" + minutes);

var dd = String(date_ob.getDate()).padStart(2, '0');
var mm = String(date_ob.getMonth() + 1).padStart(2, '0'); //January is 0!
var yyyy = date_ob.getFullYear();

var today1 = yyyy + '-' + mm + '-' + dd;
console.log(today1);

          console.log('get restaurants entered');

          if(req.params.ActiveYn=="true" || req.params.ActiveYn=="false" ){
            Restaurant.find({'ActiveYn':true,'DeleteYn':false,'ActiveYn':req.params.ActiveYn,'Type':req.params.Type}).sort({"AvailableStatus":-1})
            .then(restaurants=>res.send(restaurants))
            .catch((error)=>console.log(error));
            // socket.emit('data1',res);
          }
          else{
            console.log('hi '+req.params.ActiveYn);

            Restaurant.find({UserId:req.params.ActiveYn})
            .then(restaurants=>res.send(restaurants))
            .catch((error)=>console.log(error));
          }


        });

        app.get('/restaurants/:restId',(req,res)=>{
            console.log('get rest');

            Restaurant.find({_id:req.params.restId,ActiveYn:true,DeleteYn:false})
            .then(restaurants=>res.send(restaurants))
            .catch((error)=>console.log(error));
        });


        app.post('/restaurants/:restId/mainmenus',(req,res)=>{


            (new MainMenu ({'RestaurantId': req.params.restId,'MenuName':req.body.MenuName,'AvailableTime':req.body.AvailableTime,'AvailableStatus':req.body.AvailableStatus,'AvailableDays':req.body.AvailableDays,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'ViewType':req.body.ViewType}))
            .save()
            .then((mainmenus)=> res.send(mainmenus))
            .catch((error)=>console.log(error));

        });

        app.get('/restaurants/:restId/:activeYn/mainmenus',(req,res)=>{
          console.log("main menu entered");

            MainMenu.find({RestaurantId: req.params.restId,ActiveYn:req.params.activeYn}).sort({"AvailableStatus":-1})
            .then(mainmenus=>res.send(mainmenus))
            .catch((error)=>console.log(error));
        });

        app.post('/restaurants/:restId/mainmenus/:menuId/products',(req,res)=>{


            (new Products ({'RestaurantId': req.params.restId,'MenuId':req.params.menuId,'ProductName':req.body.ProductName,'Price':req.body.Price,'Size':req.body.Size,'Description':req.body.Description,'AvailableTime':req.body.AvailableTime,'AvailableStatus':req.body.AvailableStatus,'AvailableDays':req.body.AvailableDays,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Offer':req.body.Offer,'OfferPrice':req.body.OfferPrice,'OfferDescription':req.body.OfferDescription,'Commission':req.body.Commission,'Suggestion':req.body.Suggestion,'Sort':req.body.Sort,'ItemCount':req.body.ItemCount,'ImageUrl':req.body.ImageUrl,'Amount':req.body.Amount,'ActualAmount':req.body.ActualAmount,'RestaurantName':req.body.RestaurantName}))
            .save()
            .then((Products)=> res.send(Products))
            .catch((error)=>console.log(error));

        });

        app.get('/restaurants/:restId/mainmenus/products',(req,res)=>{

            Products.find({RestaurantId: req.params.restId}).sort({"AvailableStatus":-1})
            .then(Products=>res.send(Products))
            .catch((error)=>console.log(error));
        });


        app.patch('/products/:productId', (req,res)=>{
            Products.findOneAndUpdate({_id: req.params.productId}, {$set: req.body})
            .then((products)=> res.send(products))
            .catch((error)=>console.log(error));

            }),

            app.get('/carts/:UserId/:MenuId/:ProductId/:Status/:ActiveYn',(req,res)=>{

              cartRemovedUserId=req.params.UserId;
                Cart.find({UserId:req.params.UserId,MenuId:req.params.MenuId,ProductId:req.params.ProductId,Status:req.params.Status,ActiveYn:req.params.ActiveYn})
                .then(carts=>res.send(carts))
                .catch((error)=>console.log(error));
            });


            app.get('/carts/:UserId/:Status/:ActiveYn',(req,res)=>{

                  Cart.find({UserId:req.params.UserId,Status:req.params.Status,ActiveYn:req.params.ActiveYn})
                  .then(carts=>res.send(carts))
                  .catch((error)=>console.log(error));

            });

            app.post('/carts',(req,res)=>{


                (new Cart ({'RestaurantId': req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'MenuId':req.body.MenuId,'MenuName':req.body.MenuName,'ProductId':req.body.ProductId,'ProductName':req.body.ProductName,'Price':req.body.Price,'ItemCount':req.body.ItemCount,'Amount':req.body.Amount,'UserId':req.body.UserId,'UserName':req.body.UserName,'MobileNo':req.body.MobileNo,'Address':req.body.Address,'CreatedDate':req.body.CreatedDate,'CreatedBy':req.body.CreatedBy,'Status':req.body.Status,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'ActualPrice':req.body.ActualPrice,'Offer':req.body.Offer,'OfferDescription':req.body.OfferDescription,'Commission':req.body.Commission,'ActualAmount':req.body.ActualAmount,'Description':req.body.Description,'Type':req.body.Type}))
                .save()
                .then((carts)=> res.send(carts))
                .catch((error)=>console.log(error));

            });

            app.patch('/carts/:RestaurantId/:MenuId/:ProductId/:Status/:ActiveYn/:UserId', (req,res)=>{
                Cart.findOneAndUpdate({RestaurantId: req.params.RestaurantId,MenuId:req.params.MenuId,ProductId:req.params.ProductId,Status:req.params.Status,ActiveYn:req.params.ActiveYn,UserId:req.params.UserId}, {$set: req.body})
                .then((carts)=> res.send(carts))
                .catch((error)=>console.log(error));

                }),

                app.patch('/carts/:RestaurantId/:MenuId/:ProductId/:CartItemId/:Status/:ActiveYn/:UserId', (req,res)=>{

                    Cart.findOneAndUpdate({RestaurantId: req.params.RestaurantId,MenuId:req.params.MenuId,ProductId:req.params.ProductId,_id:req.params.CartItemId,Status:req.params.Status,ActiveYn:req.params.ActiveYn,UserId:req.params.UserId}, {$set: {ItemCount:req.body.ItemCount,Amount:req.body.Amount,ActualAmount:req.body.ActualAmount}})
                    .then((carts)=> res.send(carts))
                    .catch((error)=>console.log(error));

                    }),





                app.patch('/carts', (req,res)=>{
                  if(req.body.Status=="Placed"){
                     Cart.updateMany({Status: 'Cart',ActiveYn:true,DeleteYn:false,UserId:orderPlacedUserId}, {$set: {Status:req.body.Status,ActiveYn:req.body.ActiveYn,DeleteYn:req.body.DeleteYn}})
                     .then((carts)=> res.send(carts))
                     .catch((error)=>console.log(error));
                  }
                  else if(req.body.Status=="Removed"){
                    Cart.updateMany({Status: 'Cart',ActiveYn:true,DeleteYn:false,UserId:cartRemovedUserId}, {$set: {Status:req.body.Status,ActiveYn:req.body.ActiveYn,DeleteYn:req.body.DeleteYn}})
                    .then((carts)=> res.send(carts))
                    .catch((error)=>console.log(error));
                  }



                    }),

                    app.patch('/removecarts', (req,res)=>{

                      Cart.updateMany({Status: 'Cart',ActiveYn:true,DeleteYn:false,UserId:req.body.UserId}, {$set: {Status:req.body.Status,ActiveYn:req.body.ActiveYn,DeleteYn:req.body.DeleteYn}})
                      .then((carts)=> res.send(carts))
                      .catch((error)=>console.log(error));

                      }),

                    app.get('/carts',(req,res)=>{


                        Cart.find({Status:'Cart'})
                        .then(carts=>res.send(carts))
                        .catch((error)=>console.log(error));
                    });


                    app.patch('/carts/:RestaurantId/:MenuId/:ProductId/:UserId/:Status', (req,res)=>{
                        console.log('hic art dfasfas');
                        Cart.findOneAndUpdate({RestaurantId: req.params.RestaurantId,MenuId:req.params.MenuId,ProductId:req.params.ProductId,UserId:req.params.UserId,Status:req.params.Status}, {$set: {Status:'Removed',ItemCount:0,ActiveYn:false,DeleteYn:true}})
                        .then((carts)=> res.send(carts))
                        .catch((error)=>console.log(error));

                        }),


                        app.patch('/carts/:RestaurantId/:MenuId/:ProductId/:CartItemId/:UserId/:ActiveYn/:DeleteYn/:Status', (req,res)=>{
                            console.log('hic art dfasfas1111111111');
                            Cart.findOneAndUpdate({RestaurantId: req.params.RestaurantId,MenuId:req.params.MenuId,ProductId:req.params.ProductId,_id:req.params.CartItemId,UserId:req.params.UserId,ActiveYn:req.params.ActiveYn,Status:req.params.Status}, {$set: {Status:'Removed',ItemCount:0,ActiveYn:false,DeleteYn:true}})
                            .then((carts)=> res.send(carts))
                            .catch((error)=>console.log(error));

                            }),

                        app.post('/deliverylocations',(req,res)=>{


                            (new DeliveryLocation ({'UserId': req.body.UserId,'UserName':req.body.UserName,'MobileNo':req.body.MobileNo,'Address':req.body.Address,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Recent':req.body.Recent,'UserType':req.body.UserType}))
                            .save()
                            .then((deliverylocations)=> res.send(deliverylocations))
                            .catch((error)=>console.log(error));

                        });


                        app.get('/deliverylocations/:UserId/:ActiveYn',(req,res)=>{


                            DeliveryLocation.find({UserId:req.params.UserId,ActiveYn:req.params.ActiveYn})
                            .then(deliverylocations=>res.send(deliverylocations))
                            .catch((error)=>console.log(error));
                        });


                        app.patch('/deliverylocations/:UserId/:id/:ActiveYn', (req,res)=>{
                            DeliveryLocation.findOneAndUpdate({UserId:req.params.UserId,_id:req.params.id,ActiveYn:req.params.ActiveYn}, {$set: {Recent:'No',ActiveYn:false,DeleteYn:true}})
                            .then((deliverylocations)=> res.send(deliverylocations))
                            .catch((error)=>console.log(error));

                            }),

                            app.post('/orderdetails',(req,res)=>{

                              orderPlacedUserId=req.body.UserId;
                              console.log(req.body.Locality);
console.log(req.body.DeliveryPartnerDetails);
                              if(req.body.DeliveryPartnerDetails==undefined || req.body.DeliveryPartnerDetails==null || req.body.DeliveryPartnerDetails==""){
                                (new OrderDetails ({'OrderId': req.body.OrderId,'UserId':req.body.UserId,'UserName':req.body.UserName,'RestaurantId':req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'ItemTotal':req.body.ItemTotal,'DeliveryPartnerFee':req.body.DeliveryPartnerFee,'TaxesAndCharges':req.body.TaxesAndCharges,'TotalAmount':req.body.TotalAmount,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Status':req.body.Status,'CreatedDate':req.body.CreatedDate,'CreatedBy':req.body.CreatedBy,'ItemCount':req.body.ItemCount,'MobileNo':req.body.MobileNo,'Address':req.body.Address,'ItemDetails':req.body.ItemDetails,'DeliveryPartnerStatus':req.body.DeliveryPartnerStatus,'ActualAmount':req.body.ActualAmount,'CreatedTime':req.body.CreatedTime,'Discount':req.body.Discount,'DiscountDescritpion':req.body.DiscountDescritpion,'DiscountCode':req.body.DiscountCode,'Latitude':req.body.Latitude,'Longitude':req.body.Longitude,'DeliveryTime':req.body.DeliveryTime,'Locality':req.body.Locality,DeliveryPartnerDetails:{'UserId':""}}))
                                .save()
                                .then((orderdetails)=> res.send(orderdetails))
                                .catch((error)=>console.log(error));
                                updateUserWelcomeOffer(req.body.UserId);
                              }
                              else{
                                (new OrderDetails ({'OrderId': req.body.OrderId,'UserId':req.body.UserId,'UserName':req.body.UserName,'RestaurantId':req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'ItemTotal':req.body.ItemTotal,'DeliveryPartnerFee':req.body.DeliveryPartnerFee,'TaxesAndCharges':req.body.TaxesAndCharges,'TotalAmount':req.body.TotalAmount,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Status':req.body.Status,'CreatedDate':req.body.CreatedDate,'CreatedBy':req.body.CreatedBy,'ItemCount':req.body.ItemCount,'MobileNo':req.body.MobileNo,'Address':req.body.Address,'ItemDetails':req.body.ItemDetails,'DeliveryPartnerStatus':req.body.DeliveryPartnerStatus,'ActualAmount':req.body.ActualAmount,'CreatedTime':req.body.CreatedTime,'Discount':req.body.Discount,'DiscountDescritpion':req.body.DiscountDescritpion,'DiscountCode':req.body.DiscountCode,'Latitude':req.body.Latitude,'Longitude':req.body.Longitude,'DeliveryTime':req.body.DeliveryTime,'Locality':req.body.Locality,DeliveryPartnerDetails:req.body.DeliveryPartnerDetails}))
                                .save()
                                .then((orderdetails)=> res.send(orderdetails))
                                .catch((error)=>console.log(error));
                                updateUserWelcomeOffer(req.body.UserId);
                              }
                            });

                            app.get('/orderdetails/:UserId/:Status/:ActiveYn',(req,res)=>{


                                OrderDetails.find({UserId:req.params.UserId,ActiveYn:req.params.ActiveYn,Status:req.params.Status})
                                .then(orderdetails=>res.send(orderdetails))
                                .catch((error)=>console.log(error));
                            });

                            app.get('/restaurants/orders/:userId/:activeYn',(req,res)=>{
                                console.log('hi '+req.params.userId);

                                Restaurant.find({UserId:req.params.userId})
                                .then(restaurants=>res.send(restaurants))
                                .catch((error)=>console.log(error));
                            });

                            app.get('/orderdetails/:RestaurantId/:ActiveYn',(req,res)=>{


                                OrderDetails.find({RestaurantId:req.params.RestaurantId,ActiveYn:req.params.ActiveYn})
                                .then(orderdetails=>res.send(orderdetails))
                                .catch((error)=>console.log(error));
                            });



                            app.patch('/orderdetails/:_id/:RestaurantId', (req,res)=>{



                                OrderDetails.findOneAndUpdate({RestaurantId: req.params.RestaurantId,_id:req.params._id}, {$set: {Status:req.body.Status,DeliveryPartnerStatus:req.body.Status}})
                                .then((orderdetails)=> res.send(orderdetails))
                                .catch((error)=>console.log(error));

                                }),



                                app.patch('/orders/orderdetails/:_id/:RestaurantId', (req,res)=>{



                                  OrderDetails.findOneAndUpdate({RestaurantId: req.params.RestaurantId,_id:req.params._id}, {$set: {Status:req.body.Status}})
                                  .then((orderdetails)=> res.send(orderdetails))
                                  .catch((error)=>console.log(error));

                                  }),

                                app.get('/orderdetails/:ActiveYn/',(req,res)=>{

console.log('get order entered');
                                    OrderDetails.find({ActiveYn:req.params.ActiveYn})
                                    .then(orderdetails=>res.send(orderdetails))
                                    .catch((error)=>console.log(error));
                                });

                                app.get('/deliveryboy/orderdetails/:ActiveYn/:Locality',(req,res)=>{

                                  console.log('get order entered 111');
                                                                      OrderDetails.find({ActiveYn:req.params.ActiveYn,Locality:req.params.Locality})
                                                                      .then(orderdetails=>res.send(orderdetails))
                                                                      .catch((error)=>console.log(error));
                                                                  });

                                app.get('/orderdetails',(req,res)=>{

                                  console.log("get all orders from order details");
                                  OrderDetails.find({})
                                 .then(orderdetails=>res.send(orderdetails))
                                  .catch((error)=>console.log(error));
                             });

//                                 app.get('/orderdetails/:ActiveYn/:UserId/:DeleteYn',(req,res)=>{

// console.log("get accepted order by delivery partner");
//                                   OrderDetails.find({ActiveYn:req.params.ActiveYn,_id:req.params.UserId})
//                                   .then(orderdetails=>res.send(orderdetails))
//                                   .catch((error)=>console.log(error));
//                               });

                                app.patch('/orderdetails/:_id/:RestaurantId/:ActiveYn/:DeleteYn/', (req,res)=>{

console.log('update accepted by delivery partner');
if(req.body.DeliveryPartnerStatus=='Completed'){
  OrderDetails.findOneAndUpdate({RestaurantId: req.params.RestaurantId,_id:req.params._id,ActiveYn:req.params.ActiveYn,DeleteYn:req.params.DeleteYn,DeliveryPartnerStatus:req.body.PreviousStatus}, {$set: {DeliveryPartnerStatus:req.body.DeliveryPartnerStatus,DeliveryPartnerDetails:req.body.DeliveryPartnerDetails,Status:'Completed'}})
  .then((orderdetails)=> res.send(orderdetails))
    .catch((error)=>console.log(error));

}
else{
  OrderDetails.findOneAndUpdate({RestaurantId: req.params.RestaurantId,_id:req.params._id,ActiveYn:req.params.ActiveYn,DeleteYn:req.params.DeleteYn,DeliveryPartnerStatus:req.body.PreviousStatus}, {$set: {DeliveryPartnerStatus:req.body.DeliveryPartnerStatus,DeliveryPartnerDetails:req.body.DeliveryPartnerDetails}})
  .then((orderdetails)=> res.send(orderdetails))
    .catch((error)=>console.log(error));
}



                                    }),


                                    // -------------------------------sms----------------------------------


                                    app.post('/sendMessage', (req,res)=>{

                                      var options = {authorization : 'eu4WQRvGTkypH5U1IJNzEislmfXc3b6S2t9P0rADnoOgZ8L7hq7ramfGJ1NWkQobOKjqVwY4pHZCn3Su' , message : req.body.message ,  numbers : [req.body.number]}
                                  fast2sms.sendMessage(options).then(response=>{
                                      console.log(response)
                                    })



                                  })

                                  app.get('/orderdetails/:ActiveYn/:DeleteYn/:RestId/:CreatedDate/',(req,res)=>{

                                    console.log("get all orders from order details 11111");
                                    OrderDetails.find({ActiveYn:req.params.ActiveYn,DeleteYn:req.params.DeleteYn,RestaurantId:req.params.RestId,CreatedDate:req.params.CreatedDate})
                                    .then(orderdetails=>res.send(orderdetails))
                                    .catch((error)=>console.log(error));
                                });




                                 app.get('/delivery/orderdetails/:ActiveYn/:DeleteYn/:CreatedDate/',(req,res)=>{
                                   console.log("delivery get filtered orders");

                                   console.log("get all orders from order details 11111");
                                   OrderDetails.find({ActiveYn:req.params.ActiveYn,DeleteYn:req.params.DeleteYn,CreatedDate:req.params.CreatedDate})
                                  .then(orderdetails=>res.send(orderdetails))
                                  .catch((error)=>console.log(error));
                               });

                              //   app.get('/orderdetails/:ActiveYn/:DeleteYn:/:CreatedDate/:UserId/',(req,res)=>{


                              //     OrderDetails.find({ActiveYn:req.params.ActiveYn,DeleteYn:req.params.DeleteYn,CreatedDate:req.params.CreatedDate,CreatedBy:req.params.UserId})
                              //     .then(orderdetails=>res.send(orderdetails))
                              //     .catch((error)=>console.log(error));
                              // });


                              app.get('/restaurants/:restId/mainmenus/products/:suggestion',(req,res)=>{
console.log("suggestion entered");
                                Products.find({RestaurantId: req.params.restId,Suggestion:req.params.suggestion,AvailableStatus:true})
                                .then(Products=>res.send(Products))
                                .catch((error)=>console.log(error));
                            });


                            app.get('/coupons/:Code/:ActiveYn/:ValidTo',(req,res)=>{
                              console.log("coupons entered");
                                                              Coupons.find({ActiveYn: true,DeleteYn:false,Code:req.params.Code,'ValidTo':req.params.ValidTo})
                                                              .then(Coupons=>res.send(Coupons))
                                                              .catch((error)=>console.log(error));
                                                          });

                                                          app.get('/coupons/:ActiveYn',(req,res)=>{
                                                            console.log("coupons entered");
                                                                                            Coupons.find({ActiveYn: true,DeleteYn:false})
                                                                                            .then(Coupons=>res.send(Coupons))
                                                                                            .catch((error)=>console.log(error));
                                                                                        });


                                                          app.get('/offers',(req,res)=>{
                                                            console.log("offers entered");
                                                                                            Offers.find({ActiveYn: true,DeleteYn:false})
                                                                                            .then(Offers=>res.send(Offers))
                                                                                            .catch((error)=>console.log(error));
                                                                                        });

                                                          app.post('/coupons',(req,res)=>{


                                                            (new Coupons ({'Code':req.body.Code,'CodeDescription':req.body.CodeDescription,'ValidFrom':req.body.ValidFrom,'ValidTo':req.body.ValidTo,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Discount':req.body.Discount}))
                                                            .save()
                                                            .then((Coupons)=> res.send(Coupons))
                                                            .catch((error)=>console.log(error));

                                                        });

                                                        app.post('/offers',(req,res)=>{


                                                          (new Offers ({'Code':req.body.Code,'CodeDescription':req.body.CodeDescription,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Discount':req.body.Discount,'RestaurantId':req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'MinimumAmount':req.body.MinimumAmount,'Discount':req.body.Discount}))
                                                          .save()
                                                          .then((Offers)=> res.send(Offers))
                                                          .catch((error)=>console.log(error));

                                                      });

                                                        app.patch('/restaurants/:_id', (req,res)=>{


                                                          updateProducts(req.params._id,req.body.availableStatus);
                                                          Restaurant.findOneAndUpdate({_id: req.params._id}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                          .then((restaurants)=> res.send(restaurants))
                                                          .catch((error)=>console.log(error));

                                                          }),



                                                          app.patch('/restaurants', (req,res)=>{



                                                            Restaurant.updateMany({ActiveYn:true,DeleteYn:false}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                            .then((restaurants)=> res.send(restaurants))
                                                            .catch((error)=>console.log(error));

                                                            }),

                                                          app.patch('/products/:restId/:menuId', (req,res)=>{

console.log("restId "+req.params.restId+" menuId "+req.params.menuId);
updateMainMenu(req.params.restId,req.params.menuId,req.body.availableStatus);
                                                            Products.updateMany({RestaurantId:req.params.restId,MenuId:req.params.menuId}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                           // MainMenu.updateMany({RestaurantId: req.params.restId,_id:req.params.menuId}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                            .then((products)=> res.send(products))
                                                            .catch((error)=>console.log(error));



                                                            }),

                                                            app.patch('/products/:restId/:menuId/:id', (req,res)=>{

                                                              console.log("restId "+req.params.restId+" menuId "+req.params.menuId);

                                                                                                                          Products.findOneAndUpdate({RestaurantId:req.params.restId,MenuId:req.params.menuId,_id:req.params.id}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                                                                                         // MainMenu.updateMany({RestaurantId: req.params.restId,_id:req.params.menuId}, {$set: {AvailableStatus:req.body.availableStatus}})
                                                                                                                          .then((products)=> res.send(products))
                                                                                                           .catch((error)=>console.log(error));



                                                                                                       }),

                                                                                                       app.get('/random/products/:category',(req,res)=>{
                                                                                                        //console.log("random products entered");
                                                                                                        Products.find({Category: req.params.category,AvailableStatus:true})
                                                                                                        .then(Products=>res.send(Products))
                                                                                                        .catch((error)=>console.log(error));
                                                                                                    });

                                                                                                    app.post('/categories',(req,res)=>{

                                                                                                      console.log("save Category");
                                                                                                                  (new Category ({'Category': req.body.Category,'ImageUrl':req.body.ImageUrl,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'RestaurantId':req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'AvailableStatus':req.body.AvailableStatus}))
                                                                                                                  .save()
                                                                                                                  .then((categories)=> res.send(categories))
                                                                                                                  .catch((error)=>console.log(error));

                                                                                                              });
                                                                                                              app.get('/categories/:type/:activeYn',(req,res)=>{

                                                                                                                Category.find({Type: req.params.type,ActiveYn:false,AvailableStatus:true})
                                                                                                                .then(categories=>res.send(categories))
                                                                                                                .catch((error)=>console.log(error));
                                                                                                            });





function updateMainMenu(restId,menuId,availableStatus){
  console.log('udate main menu entered'+restId)
  MainMenu.updateMany({RestaurantId: restId,_id:menuId}, {$set: {AvailableStatus:availableStatus}})
  .then()
  .catch((error)=>console.log(error));
}

function updateProducts(restId,availableStatus){
  console.log('udate produts entered'+restId)
  if(availableStatus==false){
  Products.updateMany({RestaurantId: restId}, {$set: {AvailableStatus:availableStatus}})
  .then()
  .catch((error)=>console.log(error));
}
else{}
}

function updateUserWelcomeOffer(userId){
  Register.updateMany({_id: userId,WelcomeOffer:true}, {$set: {WelcomeOffer:false}})
  .then()
  .catch((error)=>console.log(error));
}

app.post('/shopCategories',(req,res)=>{

  console.log("save Category");
 (new ShopCategory ({'Category': req.body.Category,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type}))
 .save()
 .then((shopCategories)=> res.send(shopCategories))
 .catch((error)=>console.log(error));

 });

 app.get('/shopCategories/:Type',(req,res)=>{

  ShopCategory.find({'ActiveYn':true,'DeleteYn':false,'Type':req.params.Type})
  .then(shopCategories=>res.send(shopCategories))
  .catch((error)=>console.log(error));
});

app.post('/maincategories',(req,res)=>{

  console.log("save Main Category");
 (new MainCategory ({'Category': req.body.Category,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'Description':req.body.Description,'AvailableStatus':req.body.AvailableStatus,'ImageUrl':req.body.ImageUrl}))
 .save()
 .then((maincategories)=> res.send(maincategories))
 .catch((error)=>console.log(error));

 });

 app.get('/maincategories',(req,res)=>{

  MainCategory.find({'ActiveYn':true,'DeleteYn':false,'AvailableStatus':true})
  .then(maincategories=>res.send(maincategories))
  .catch((error)=>console.log(error));
});

app.post('/addslides',(req,res)=>{

  console.log("save add slide");
 (new AddSlide ({'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'ImageUrl':req.body.ImageUrl}))
 .save()
 .then((addslides)=> res.send(addslides))
 .catch((error)=>console.log(error));

 });

 app.get('/addslides',(req,res)=>{

  AddSlide.find({'ActiveYn':true,'DeleteYn':false})
  .then(addslides=>res.send(addslides))
  .catch((error)=>console.log(error));
});

app.post('/buddyslides',(req,res)=>{

  console.log("save add slide");
 (new BuddySlide ({'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'ImageUrl':req.body.ImageUrl}))
 .save()
 .then((buddyslides)=> res.send(buddyslides))
 .catch((error)=>console.log(error));

 });
 app.get('/buddyslides',(req,res)=>{

  BuddySlide.find({'ActiveYn':true,'DeleteYn':false})
  .then(buddyslides=>res.send(buddyslides))
  .catch((error)=>console.log(error));
});

app.post('/bookingslides',(req,res)=>{

  console.log("save add slide");
 (new BookingSlide ({'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'ImageUrl':req.body.ImageUrl}))
 .save()
 .then((bookingslides)=> res.send(bookingslides))
 .catch((error)=>console.log(error));

 });
 app.post('/deliverycharges',(req,res)=>{

  console.log("save deliverycharges");
 (new DeliveryCharge ({'Category':req.body.Category,'MinimumDeliveryCharge':req.body.MinimumDeliveryCharge,'PerKm':req.body.PerKm,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'CategoryId':req.body.CategoryId}))
 .save()
 .then((deliverycharges)=> res.send(deliverycharges))
 .catch((error)=>console.log(error));

 });
 app.get('/deliverycharges/:type',(req,res)=>{

  DeliveryCharge.find({'ActiveYn':true,'DeleteYn':false,'Category':req.params.type})
  .then(deliverycharges=>res.send(deliverycharges))
  .catch((error)=>console.log(error));
});

                                                                               app.post('/specialoffers',(req,res)=>{

                                                                                                      console.log("save Offers");
                                                                                                                  (new SpecialOffers ({'Category': req.body.Category,'ImageUrl':req.body.ImageUrl,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'RestaurantId':req.body.RestaurantId,'RestaurantName':req.body.RestaurantName,'AvailableStatus':req.body.AvailableStatus}))
                                                                                                                  .save()
                                                                                                                  .then((specialoffers)=> res.send(specialoffers))
                                                                                                                  .catch((error)=>console.log(error));

                                                                                                              });
                                                                                                              app.get('/specialoffers/:type/:activeYn',(req,res)=>{

                                                                                                                SpecialOffers.find({Type: req.params.type,ActiveYn:true,AvailableStatus:true})
                                                                                                                .then(specialoffers=>res.send(specialoffers))
                                                                                                                .catch((error)=>console.log(error));
                                                                                                            });

                                                                                                            app.post('/specificcategories',(req,res)=>{

                                                                                                              console.log("save Category");
                                                                                                                          (new SpecificCategory ({'Category': req.body.Category,'ImageUrl':req.body.ImageUrl,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'Type':req.body.Type,'AvailableStatus':req.body.AvailableStatus}))
                                                                                                                          .save()
                                                                                                                          .then((specificcategories)=> res.send(specificcategories))
                                                                                                                          .catch((error)=>console.log(error));
        
                                                                                                                      });
                                                                                                                      app.get('/specificcategories/:type/:activeYn',(req,res)=>{
        
                                                                                                                        SpecificCategory.find({Type: req.params.type,ActiveYn:true,AvailableStatus:true})
                                                                                                                        .then(specificcategories=>res.send(specificcategories))
                                                                                                                        .catch((error)=>console.log(error));
                                                                                                                    });

                                                                                                                    app.get('/specificcategories/:type/:activeYn/:category',(req,res)=>{
        
                                                                                                                      SpecificCategory.find({Type: req.params.type,ActiveYn:true,AvailableStatus:true,Category:req.params.category})
                                                                                                                      .then(specificcategories=>res.send(specificcategories))
                                                                                                                      .catch((error)=>console.log(error));
                                                                                                                  });

                                                                                                                    app.post('/localities',(req,res)=>{

                                                                                                                      console.log("save locality");
                                                                                                                                  (new Locality ({'Locality': req.body.Locality,'ActiveYn':req.body.ActiveYn,'DeleteYn':req.body.DeleteYn,'AvailableStatus':req.body.AvailableStatus}))
                                                                                                                                  .save()
                                                                                                                                  .then((localities)=> res.send(localities))
                                                                                                                                  .catch((error)=>console.log(error));
                
                                                                                                                              });
                                                                                                                              app.get('/localities',(req,res)=>{
        
                                                                                                                                Locality.find({ActiveYn:true,AvailableStatus:true}).sort({"Locality":1})
                                                                                                                                .then(localities=>res.send(localities))
                                                                                                                                .catch((error)=>console.log(error));
                                                                                                                            });

                                                                                                                            app.patch('/userregisters/location/:id', (req,res)=>{
                                                                                                                              console.log('Update users location '+req.body.Locality);
                                                                                                                              Register.findOneAndUpdate({_id: req.params.id}, {$set:{Address1:req.body.address,Locality:req.body.locality}})
                                                                                                                              .then((userregister)=> res.send(userregister))
                                                                                                                              .catch((error)=>console.log(error));
                                                                                                                        
                                                                                                                              })

                                                                                                                              app.get('/deliveryboys/:locality',(req,res)=>{
        console.log("get delivery boy entered");
                                                                                                                                Register.find({ActiveYn:true,UserType:'D',ActiveStatus:true,Locality:req.params.locality})
                                                                                                                                .then(userregister=>res.send(userregister))
                                                                                                                                .catch((error)=>console.log(error));
                                                                                                                            });


 //app.listen(3000, () => console.log("Server is connected on port 3000"));
//const server=app.listen(port, () => console.log("Server is connected on port "+port));
//const io=socket(server);

