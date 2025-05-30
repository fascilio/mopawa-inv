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

// app.use(cors());
// app.use(express.json());

// mongoose.connect('mongodb://localhost:27017/inventoryDB', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log('MongoDB connected'))
//   .catch(err => console.log(err));

// app.use('/api/products', productRoutes);
// app.use('/api/dealers', dealerRoutes);
// app.use('/api/retailers', retailerRoutes);
// app.use('/api/invoice', invoiceRoutes);
// app.use('/api/warranty', warrantyRoutes);
// app.use('/api/mpesa', mpesaRoutes);
// const PORT = 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const productRoutes = require('./routes/productRoutes');
const dealerRoutes = require('./routes/dealerRoutes');
const retailerRoutes = require('./routes/retailerRoutes');
const invoiceRoutes = require('./routes/invoiceRoutes');
const warrantyRoutes = require('./routes/warranty');
const mpesaRoutes = require('./routes/mpesaRoutes');

const app = express();

app.use(cors());

// 🛠️ Apply raw parser ONLY for the callback route BEFORE json middleware
//app.use('/api/mpesa/callback', express.json());
// Apply raw only if needed
app.use((req, res, next) => {
  if (req.originalUrl === '/api/mpesa/callback') {
    express.raw({ type: '*/*' })(req, res, next);
  } else {
    express.json()(req, res, next);
  }
});


// 🧠 Apply JSON parser for everything else
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/inventoryDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// ✅ Use routes
app.use('/api/products', productRoutes);
app.use('/api/dealers', dealerRoutes);
app.use('/api/retailers', retailerRoutes);
app.use('/api/invoice', invoiceRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/mpesa', mpesaRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
