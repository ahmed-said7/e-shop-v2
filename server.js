let express=require('express');
let app = express();
let dotenv=require('dotenv');
let cors=require('cors');
let compression=require('compression');
dotenv.config({path:"./environment.env"});
let morgan=require('morgan');
app.use(morgan('dev'))
app.use(express.json());
let globalError=require('./middlewares/errorMiddleware')
const {databaseConnect}=require('./config/database');
databaseConnect(process.env.URL)
let categoryRoute=require('./routes/categoryRoute');
let subCategoryRoute=require('./routes/subcategoryRoute');
let brandRoute=require('./routes/brandRoute');
let productRoute=require('./routes/productRoute');
let userRoute=require('./routes/userRoute');
let authRoute=require('./routes/authRoute');
let reviewRoute=require('./routes/reviewRoute');
let wishlistRoute=require('./routes/wishlistRoute');
let addresseRoute=require('./routes/addresseRoute');
let couponRoute=require('./routes/couponRoute');
let cartRoute=require('./routes/cartRoute');
let orderRoute=require('./routes/orderRoute');
let apiError = require('./utils/apiError');


app.use(cors());
app.options('*', cors());

// app.use(compression());
let {webhookCheckout}=require('./services/orderServices');
app.post('/webhook', express.raw({type: 'application/json'}),webhookCheckout);

app.use('/api/v1/categories',categoryRoute);
app.use('/api/v1/subcategories',subCategoryRoute);
app.use('/api/v1/brands',brandRoute);
app.use('/api/v1/products',productRoute);
app.use('/api/v1/users',userRoute);
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/reviews',reviewRoute);
app.use('/api/v1/wishlist',wishlistRoute);
app.use('/api/v1/addresse',addresseRoute);
app.use('/api/v1/coupon',couponRoute);
app.use('/api/v1/cart',cartRoute);
app.use('/api/v1/order',orderRoute);
app.all('*', (req, res, next) => {
    next(new apiError(`Can't find this route}`, 400));
});
app.use(globalError)
// 

console.log(process.env.PORT)
app.listen(process.env.PORT,()=>{
    console.log('listening on port');
})
process.on('unhandledRejection',(err)=>{
    console.log(err);
});

