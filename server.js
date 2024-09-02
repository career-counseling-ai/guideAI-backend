const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();

const dbConnect = require('./config/db/dbConnect');

const { userRoutes } = require('./routes/user/usersRoute');
const { errorHandler, notFound } = require('./middleware/error/errorHandler');
const PORT = process.env.PORT || 5000;

//db
dbConnect();

//middleware
app.use(express.json());

//User Routes
app.use('/api/users', userRoutes);

//notFound error
app.use(notFound);

//error Handler
app.use(errorHandler);

// ---------------
app.listen(PORT, console.log(`server listening on ${PORT}`));
