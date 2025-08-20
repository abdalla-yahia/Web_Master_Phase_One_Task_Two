const User_Information        = document.getElementById("userInfo")
const User_Name               = document.getElementById("user")
const Auth_Buttons            = document.getElementById("Auth_Buttons")
const Log_Out_Button          = document.getElementById("Log-Out")

// Check if user is logged in by checking localStorage
if (localStorage.getItem("userName")) {
    Auth_Buttons.remove();
    User_Name.style.display = 'block'
    User_Information.style.display = "flex";
    User_Name.innerHTML = "Welcom " + localStorage.getItem("userName");
}
// Log Out Functionality
const Log_Out =_=> {
    localStorage.clear();
    setTimeout(() => {
        window.location = "./index.html"
    }, 500);

}

// Add event listener to Log Out button
Log_Out_Button.addEventListener("click", Log_Out)
