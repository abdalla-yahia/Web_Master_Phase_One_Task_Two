const userName    = document.querySelector("#userName");
const password    = document.querySelector("#password");
const signInBtn   = document.querySelector("#signIn");
const getUserName = localStorage.getItem("userName");
const getPassword = localStorage.getItem("password");

window.onload = function() {
    userName.focus();
  };
// Login User Event
signInBtn.addEventListener("click", function (e) {
    e.preventDefault();

    if (userName.value === "" || password.value === "") {
        alert("Fill Your Data");
    } else {
        if (getUserName && getUserName.trim() === userName.value.trim() && getPassword && getPassword.trim() === password.value.trim()) {

            setTimeout(() => {
                window.location = "./index.html"
            }, 500)
        } else {
            alert("not valid")
        }
    }
})



