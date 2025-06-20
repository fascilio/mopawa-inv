// const express = require('express');
// //const mongoose = require('mongoose');
// const cors = require('cors');
// const productRoutes = require('./routes/productRoutes');
// const dealerRoutes = require('./routes/dealerRoutes');
// const retailerRoutes = require('./routes/retailerRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const warrantyRoutes = require('./routes/warranty');
// const mpesaRoutes = require('./routes/mpesaRoutes');
// const path = require('path');
// require('dotenv').config();
// const app = express();

// //app.use(cors());
// // app.use(cors({
// //   origin: 'https://visitors.mopawa.co.ke',
// // }));

// const allowedOrigins = [
//   'https://visitors.mopawa.co.ke',
//   'https://mopawa.co.ke'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true); 
//     } else {
//       callback(new Error('Not allowed by CORS')); 
//     }
//   }
// }));

// app.use(express.json());

// // mongoose.connect(process.env.MONGO_URI, {
// //   tls: true,
// //   tlsCAFile: path.join(__dirname, 'warehouse.pem'),
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true
// // })
// // .then(() => console.log('✅ Connected to AWS DocumentDB'))
// // .catch((err) => console.error('❌ Failed to connect to DocumentDB', err))



// // mongoose.connect('mongodb://localhost:27017/inventoryDB', {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // }).then(() => {
// //   console.log('MongoDB connected');
// // }).catch((err) => {
// //   console.error(err);
// // });


// const sequelize = require('./models/index');
// const Dealer = require('./models/Dealer'); // import models here

// sequelize.authenticate()
// .then(() => {
//   console.log('✅ Connected to MySQL (HostAfrica)');
//   return sequelize.sync(); // create tables if they don't exist
// })
// .catch((err) => {
//   console.error('❌ MySQL connection failed:', err);
// });




// app.use('/api/products', productRoutes);
// app.use('/api/dealers', dealerRoutes);
// app.use('/api/retailers', retailerRoutes);
// app.use('/api/invoice', invoiceRoutes);
// app.use('/api/warranty', warrantyRoutes);
// app.use('/api/mpesa', mpesaRoutes);


// app.listen(5000, '0.0.0.0', () => {
//   console.log('Server running on port 5000');
// });











const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Routes
const productRoutes = require('./routes/productRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const retailerRoutes = require('./routes/retailerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const warrantyRoutes = require('./routes/warranty');
const mpesaRoutes = require('./routes/mpesaRoutes');

// CORS
// const allowedOrigins = [
//   'https://visitors.mopawa.co.ke',
//   'https://mopawa.co.ke'
// ];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   }
// }));

const allowedOrigins = [
  'https://visitors.mopawa.co.ke',
  'https://mopawa.co.ke'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Make sure to handle preflight requests
//app.options('*', cors());


app.use(express.json());

// Sequelize Init
const sequelize = require('./models/index');

sequelize.authenticate()
  .then(() => {
    console.log('✅ Connected to MySQL (HostAfrica)');
    return sequelize.sync(); // Sync all models
  })
  .catch((err) => {
    console.error('❌ MySQL connection failed:', err);
  });

// Route Middleware
app.use('/api/products', productRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/mpesa', mpesaRoutes);

// Server
app.listen(5000, '0.0.0.0', () => {
  console.log('🚀 Server running on port 5000');
});
