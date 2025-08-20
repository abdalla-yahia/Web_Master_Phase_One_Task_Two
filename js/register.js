const userName = document.querySelector("#userName")
const password = document.querySelector("#password")
const email    = document.querySelector("#email")
const Register = document.querySelector("#Register")

//Focus On User Name Field After Page Loaded
window.onload = function() {
    userName.focus();
  };

//Register Event
Register.addEventListener("click", function(e){
    e.preventDefault();
    if (userName.value === "" || password.value === "" || email.value === "") {
         alert("please Fill The Fields")        
    } else {
        localStorage.setItem("userName" , userName.value);
        localStorage.setItem("password" , password.value);
        localStorage.setItem("email" , email.value);

        setTimeout(() => {
            window.location = "./Pages/login.html"
        }, 500);
    }  
})