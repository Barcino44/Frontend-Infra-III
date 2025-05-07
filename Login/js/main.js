const passwordTF = document.getElementById('passwordTF')
const emailTF = document.getElementById('emailTF')
const loginBTN = document.getElementById('loginBTN')
loginBTN.addEventListener('click', login);
let userJSON= window.localStorage.getItem('client');

function login() {
        let email= emailTF.value;
        let password= passwordTF.value;
    
        let LoginRequest ={
            email: email,
            password: password,
        }
        postLogin(LoginRequest);
}

async function postLogin(LoginRequest){
    let json= JSON.stringify(LoginRequest);
    let response = await fetch('http://localhost:8080/client/login',{
       method: 'POST',
       headers:{
         'Content-Type': 'application/json'
       },
       body: json
    });
 
    let data= await response.json()
    if(response.ok) {
        let client= JSON.stringify(data);
        window.localStorage.setItem('client', client.name);
        window.location.href ='../Home/index.html'
     } else {
         if(response.status === 401) {
            alert(data.message);
     } else {
        //Si es otro error
         console.error('Request error: ', response.status);
         alert('An error occurred in the request. Please try again later.');
     }
  }
  emailTF.value=""
  passwordTF.value=""
 }
