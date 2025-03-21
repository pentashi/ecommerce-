const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadImageRoute = require('./routes/uploadImage');

require('./config/passport'); // Ensure this path is correct

const app = express();
app.use(cors());
app.use(express.json());

// Session middleware configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'yourStrongUniqueSecretKeyHere123!@#', // Use environment variable for production
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' } // Set to true if using HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/uploads', express.static('uploads'));

app.use('/api/orders', orderRoutes);
app.use('/api', uploadImageRoute);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.error(err));

app.get('/', (req, res) => res.send('Ecommerce API is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
