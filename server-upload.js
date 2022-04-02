const express = require('express');
const multer  = require('multer');
const send = require('./controller/send');
const reader = require('xlsx')
const bodyparser = require('body-parser');
const path = require('path');
const port = 3000;



const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        // console.log(file)
        cb(null,'uploads');
    },
    filename: (req,file,cb) => {
        const {originalname} = file;
        cb(null,originalname);
    }
});

const upload = multer({ storage });
const app = express();
app.use(express.static('public'));


// ---- test begin ----
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

// ------ test ends -----

app.post('/upload', upload.single('data'),send.check);
// app.post('/upload', upload.single('data'),(req,res) =>{
//     return res.json({status: 'OK'});
// })

app.listen(process.env.PORT || port,() => console.log(`App is running on port ${port}`));
