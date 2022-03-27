const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/Wobot', {
    useUnifiedTopology: true,
    useNewUrlParser: true
});