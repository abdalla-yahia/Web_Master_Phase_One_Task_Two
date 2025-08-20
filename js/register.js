const userName = document.getElementById("userName")
const password = document.getElementById("password")
const email    = document.getElementById("email")
const Register = document.getElementById("Register")

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
            window.location = "./login.html"
        }, 500);
    }  
})