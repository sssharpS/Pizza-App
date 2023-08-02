import axios from 'axios';
import Noty from 'noty';

let addToCart=document.querySelectorAll('.add-to-cart');
let itemsCount=document.querySelector('.countItems');
  console.log(itemsCount);
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
