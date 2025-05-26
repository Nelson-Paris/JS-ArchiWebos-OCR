function validerEmail(email) {
  const emailRegExp = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+$/i;
  if (!emailRegExp.test(email)) {
    throw new Error("L'email n'est pas valide.");
  }
}

document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorMessage = document.getElementById("error-message");

  console.log("connexion", email);

  try {
    // vérif email
    validerEmail(email);
    console.log("Email ok");

    // envoi de la demande
   
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    console.log("réponse reçue");

    if (!response.ok) {
      throw new Error("Identifiants incorrects.");
    }

    const data = await response.json();
   

    // Stockage dans le localStorage
    localStorage.setItem("token", data.token);
    localStorage.setItem("userId", data.userId);
    console.log("stockés dans localStorage");


    // Rechargement de la page pour maj affichage
    window.location.href = "index.html";
    console.log("rechargement de la page");
    
  } catch (error) {
    console.error("erreur de connexion :", error.message);
    if (errorMessage) {
      errorMessage.textContent = error.message;
      errorMessage.style.display = "block";
    }
  }
});


window.addEventListener("DOMContentLoaded", function () {

  const loginOut = document.getElementById("loginOut");
  const token = localStorage.getItem("token");

  if (token && loginOut) {
    loginOut.textContent = "logout";
    loginOut.href = "#";
    
    loginOut.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      localStorage.removeItem("userId");

      // redirige vers index.html
      window.location.href = "index.html";
    });
  }
});