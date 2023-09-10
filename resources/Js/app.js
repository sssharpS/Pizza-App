import axios from 'axios';
import {tableBody } from './admin';
import Noty from 'noty';
import moment  from 'moment';


let addToCart=document.querySelectorAll('.add-to-cart');
let itemsCount=document.querySelector('.countItems');
  // console.log(itemsCount);
function updateCart(pizza){
  //ajax request
  axios.post('/update-cart',pizza).then(res =>{
      // console.log(res);
      itemsCount.innerText=res.data.itemsCount;
      
      new Noty({
        type:'success',
        timeout:1000,
        text: "Items added to Cart",
        progressBar:false
      }).show();
  }).catch(err =>{
    new Noty({
      type:'error',
      timeout:1000,
      text: "Something went wrong",
      progressBar:false
    }).show();
  });

}
addToCart.forEach(btn => {
    btn.addEventListener('click', (e) => {
        let pizza = JSON.parse(btn.dataset.pizza);
        updateCart(pizza);
    })
})


// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert')
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    }, 2000)
}

tableBody();



// Change order status
let statuses = document.querySelectorAll('.status_line')
let hiddenInput = document.querySelector('#hiddenInput');
let order = hiddenInput ? hiddenInput.value : null
//parse json string into object
order = JSON.parse(order);

//create element for time
let time = document.createElement('small');

function updateStatus(order) {
//reset the classList
statuses.forEach((status)=>{
   status.classList.remove('step-completed');
   status.classList.remove('current');
})
      let stepCompleted=true;
     statuses.forEach(status=>{
        let curr_status=status.dataset.status;
        if(stepCompleted){
           status.classList.add('step-completed');
        }
        if(curr_status==order.status){
            stepCompleted=false;
            time.innerText=moment(order.updatedAt).format('hh:mm A');
            status.appendChild(time);
            if(status.nextElementSibling){
            status.nextElementSibling.classList.add('current');
            }
        }
     })
}

updateStatus(order);


//socket

const socket=io();

//join
if(order){
socket.emit('join',`order_${order._id}`);
}

let AdminPath=window.location.pathname;
console.log(adminPath);
if(adminPath.includes('admin')){
  
  socket.emit('join','adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order }
  updatedOrder.updatedAt = moment().format()
  updatedOrder.status = data.status;
  console.log(data);
  updateStatus(updatedOrder);
  new Noty({
      type: 'success',
      timeout: 1000,
      text: 'Order updated',
      progressBar: false,
  }).show();
})
