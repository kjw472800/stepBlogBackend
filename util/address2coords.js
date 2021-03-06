const Axios =require('axios');
const HttpError = require('../models/http-error');

async function address2coords(address){
    
    const response= await Axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(address)}&key=${process.env.GOOGLE_API_KEY}`);
    const data=response.data;

    if(!data||data.status==='ZERO_RESULTS'){
        const error = new HttpError('Cannot find this address! Please offer a more specific address or a real place');
        throw error;
    }

    const coordinates= data.results[0].geometry.location;
    return coordinates;
};

module.exports=address2coords;