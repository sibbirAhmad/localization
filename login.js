var app_languages;
var user_languages;
var user_selected_language;
document
  .getElementById("loginForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;

    // Show loading indicator while processing login
    Swal.fire({
      title: "Logging in...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    fetch(api_ulr, {
      method: "POST",
      headers: {
        // 'Content-Type': 'application/json',
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: JSON.stringify({
        request: "login",
        email: email,
        password: password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status == 200 && data.metadata.token) {
          var role = data.data.role;
          saveToCookie("role", role);
          if (role === "admin") {
            saveAppLanguages(data.data.app_languages);
          }
          saveUserLanguages(data.data.languages);

          //   alert(JSON.stringify(data.data.app_languages));
          // Save token to cookie
          saveToCookie("token", data.metadata.token);
          

          // Redirect to index page
          window.location.replace(home_page);
        } else {
          showFailure("Login Failed",data.message);
        }
      })
      .catch((error) => {
        // console.error("Error:", error);
        // Display error message
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "An error occurred while logging in. Please try again later.",
        });
      });
  });
