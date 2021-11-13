import mongoose from 'mongoose';
const URI: string = process.env.MONGODB_URI;


mongoose.set('useFindAndModify', false);

mongoose.connect( URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(db => console.log('DB is conected')).catch(err => console.error(err));