
const loginOut = document.getElementById("loginOut");
const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded', () => {

  if (loginOut) {
    const loginLink = loginOut.querySelector("a");

    if (token && loginLink) {
      loginLink.textContent = "logout";
      loginLink.href = "#";

      loginLink.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "index.html";
      });
    }
  }

});