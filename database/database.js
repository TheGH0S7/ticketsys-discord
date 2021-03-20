const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/ticket', {useNewUrlParser: true, useUnifiedTopology: true});