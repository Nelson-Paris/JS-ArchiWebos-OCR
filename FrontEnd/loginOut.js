document.addEventListener('DOMContentLoaded', () => {
  const loginOut = document.getElementById("loginOut");
  const token = localStorage.getItem("token");

  if (loginOut) {
    const logoutLink = loginOut.querySelector("a");

    if (token && logoutLink) {
      logoutLink.textContent = "logout";
      logoutLink.href = "#";

      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "index.html";
      });
    }
  }
});