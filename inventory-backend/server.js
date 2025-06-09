const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const retailerRoutes = require('./routes/retailerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const warrantyRoutes = require('./routes/warranty');
const mpesaRoutes = require('./routes/mpesaRoutes');

require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
//mongoose.connect(process.env.MONGO_URI)
//mongoose.connect('mongodb+srv://fascilior:Adrenali6.@cluster1.fopqtud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1')
//   .then(() => console.log('MongoDB connected'))
// .catch(err => console.log(err));


app.use('/api/products', productRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/mpesa', mpesaRoutes);


// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//mongodb+srv://fascilior:Adrenali6.@cluster1.fopqtud.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1

app.listen(5000, '0.0.0.0', () => {
  console.log('Server running on port 5000');
});











// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const productRoutes = require('./routes/productRoutes');
// const dealerRoutes = require('./routes/dealerRoutes');
// const retailerRoutes = require('./routes/retailerRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const warrantyRoutes = require('./routes/warranty');
// const mpesaRoutes = require('./routes/mpesaRoutes');

// const app = express();

// //app.use(cors());
// app.use(cors({
//   origin: 'https://visitors.mopawa.co.ke', // ✅ allow your frontend domain
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   //credentials: true, // ✅ if you're sending cookies or auth headers
// }));

// //app.options('*', cors());

// // 🛠️ Apply raw parser ONLY for the callback route BEFORE json middleware
// //app.use('/api/mpesa/callback', express.json());
// // Apply raw only if needed
// app.use((req, res, next) => {
//   if (req.originalUrl === '/api/mpesa/callback') {
//     express.raw({ type: '*/*' })(req, res, next);
//   } else {
//     express.json()(req, res, next);
//   }
// });


// // 🧠 Apply JSON parser for everything else
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/inventoryDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // ✅ Use routes
// app.use('/api/products', productRoutes);
// app.use('/api/dealers', dealerRoutes);
// app.use('/api/retailers', retailerRoutes);
// app.use('/api/invoice', invoiceRoutes);
// app.use('/api/warranty', warrantyRoutes);
// app.use('/api/mpesa', mpesaRoutes);

// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));













// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');

// const productRoutes = require('./routes/productRoutes');
// const dealerRoutes = require('./routes/dealerRoutes');
// const retailerRoutes = require('./routes/retailerRoutes');
// const invoiceRoutes = require('./routes/invoiceRoutes');
// const warrantyRoutes = require('./routes/warranty');
// const mpesaRoutes = require('./routes/mpesaRoutes');

// const app = express();

// // 1. CORS middleware before any other middleware
// app.use(cors({
//   origin: 'https://visitors.mopawa.co.ke',
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
//   // credentials: true, // enable if you send cookies/auth headers
// }));

// // 2. Explicitly handle OPTIONS preflight for all routes
// //app.options('*', cors());
// app.use((req, res, next) => {
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Origin', 'https://visitors.mopawa.co.ke');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//     return res.sendStatus(204);
//   }
//   next();
// });

// // 3. Body parser middleware
// // Apply raw parser ONLY for the mpesa callback route
// app.use((req, res, next) => {
//   if (req.originalUrl === '/api/mpesa/callback') {
//     express.raw({ type: '*/*' })(req, res, next);
//   } else {
//     express.json()(req, res, next);
//   }
// });

// // 4. Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/inventoryDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// // 5. Use routes
// app.use('/api/products', productRoutes);
// app.use('/api/dealers', dealerRoutes);
// app.use('/api/retailers', retailerRoutes);
// app.use('/api/invoice', invoiceRoutes);
// app.use('/api/warranty', warrantyRoutes);
// app.use('/api/mpesa', mpesaRoutes);

// // 6. Start server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
