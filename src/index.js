
const express=require("express");
const {serverConfig,logger} =require("./config/index");
const rateLimit=require('express-rate-limit');
const {createProxyMiddleware}  = require('http-proxy-middleware');
const {AuthMiddleware}=require("./middlewares")

const apiRoutes=require("./routes/index"); 

const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const limiter = rateLimit({
	windowMs: 2* 60 * 1000, 
	limit: 10, 
})

app.use(limiter);
app.use("/api",apiRoutes);



app.use('/flightService',
    createProxyMiddleware({
      target: serverConfig.FLIGHT_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/flighService' : '/'}
    }),
  );

app.use('/bookingService',
    createProxyMiddleware({
      target: serverConfig.BOOKING_SERVICE,
      changeOrigin: true,
      pathRewrite: {'^/bookingService' : '/'}

    }),
  );
  


app.listen(serverConfig.PORT,()=>{
    console.log(`Listening to port ${serverConfig.PORT }`);
    //logger.info('succesfully started server');
  
}) 
