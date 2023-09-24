import axios from 'axios';
import Noty from 'noty';


export function placeOrder(formObj){
      //ajax request

  axios.post('/orders',formObj).then((res)=>{
    //  console.log(res.data);
    new Noty({
      type:'success',
      timeout:1000,
      text: res.data.success,
      progressBar:false
    }).show();

    setTimeout(() => {
        window.location.href='/customers/order';
    }, 1000);  
    
  }).catch(err=>{
    // console.log(err);
    new Noty({
      type:'error',
      timeout:1000,
      text: err.res.data.error,
      progressBar:false
    }).show();

  })





}