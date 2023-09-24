import { loadStripe } from "@stripe/stripe-js";
import {placeOrder} from './apiService';



export async function initStripe() {

    //puplishable key which is provided at the client side 
  const stripe = await loadStripe(
    "pk_test_51NoonVSEs4TN3ileSAbMvmvcKFe6q52uBatGycEEQDwGst4VtqfmlcfLOtuF5kmYoUX1tNaoZJLJV1XjK58nQ3Cs00Bxyf4hfd"
  );

  let card=null;
  function mountWidget() {
    const elements = stripe.elements();
 // it is a style object which consists style of the widget
        let style = {
            base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
            },
            invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
            }
        };
    //return an instance
   card= elements.create('card',{style:style,hidePostalCode:true});
   card.mount('#card-element');//inject or mount this widget
  }

  let paymentType = document.querySelector(".pay");

  if(!paymentType){
     return ;
  }
  
  paymentType.addEventListener("change", (e) => {
     console.log(e.target.value);
    if (e.target.value == "card") {
      //Display Widget
      mountWidget();
    } else {
       //destroy widget
       card.destroy();

    }
  });



  let getForm=document.querySelector('#form');
  if(getForm){
  getForm.addEventListener('submit',(e)=>{
     e.preventDefault();
     //for acheiving the form data,create object
     let formData=new FormData(getForm);
    //  console.log(formData.entries()); //iterator we have to iterate this
  
     let formObj={};
    for(let [key,value] of formData.entries()){
      formObj[key]=value;
    }

     //verify card
     if(!card){
      placeOrder(formObj);
      return ;
    }

      stripe.createToken(card).then((result)=>{
         console.log(result);
         formObj.token=result.token.id;
         placeOrder(formObj); 
      }).catch(err =>{
        console.log(err);
      })

  })  

 

}
}
