const userName    = document.getElementById("userName");
const email       = document.getElementById("email");
const password    = document.getElementById("password");
const signInBtn   = document.getElementById("signIn");


const getUserName = localStorage.getItem("userName");
const getEmail    = localStorage.getItem("email");
const getPassword = localStorage.getItem("password");

window.onload = function() {
    email.focus();
  };
// Login User Event
signInBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (email.value === "" || password.value === "") {
        alert("Fill Your Data");
    } else {
        if (getEmail && getEmail.trim() === email.value.trim() && getPassword && getPassword.trim() === password.value.trim()) {

            setTimeout(() => {
                window.location = "../index.html"
            }, 500)
        } else {
            alert("not valid")
        }
    }
})



