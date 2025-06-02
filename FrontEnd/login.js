document.addEventListener('DOMContentLoaded', () => {
  function validEmail(email) {
    const emailRegExp = /^[a-z0-9._-]+@[a-z0-9._-]+\.[a-z0-9._-]+$/i;
    if (!emailRegExp.test(email)) {
      throw new Error("L'email n'est pas valide.");
    }
  }

  console.log("connexion");

  document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const errorMessage = document.getElementById("error-message");


    console.log("connexion1");

    try {
    
      validEmail(email);
      console.log("Email ok");

  
      const serverAPI = 'http://localhost:5678';
      const response = await fetch((`${serverAPI}/api/users/login`), {
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



      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.userId);
      console.log("stockés dans localStorage");


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
});