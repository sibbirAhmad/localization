var api_ulr =
  "https://script.google.com/macros/s/AKfycbyX7l85AJZuu-pGiuSi0YypKzYjWo1YvEPoWNMR3pFruS8M7F91iLE5yxqgGoZtEqb_fA/exec";

function saveToSession(key, value) {
  sessionStorage.setItem(key, value);
}

function saveAppLanguages(app_languages) {
  saveToSession("app_languages", app_languages);
}
function saveUserLanguages(user_languages) {
  saveToSession("user_languages", user_languages);
}
function getAppLanguages() {
  return sessionStorage.getItem("app_languages");
}
function getUserLanguages() {
  return sessionStorage.getItem("user_languages");
}
function saveToCookie(name, value, days = 60) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie =
    name + "=" + encodeURIComponent(value) + expires + "; path=/";
}
function getFormCookie(name) {
  const cookies = document.cookie.split("; ");
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    // console.log(cookie);
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}
function showSuccess(title = 'Success',message='',showConfirm = false){
  Swal.fire({
    icon: "success",
    title:title,
    text: message,
    timer: 2000, // Automatically close after 2 seconds
    showConfirmButton: showConfirm,
  });
}
function showFailure(title = 'Success',message='',showConfirm = false){
  Swal.fire({
    icon: "failure",
    title:title,
    text: message,
    timer: 2000, // Automatically close after 2 seconds
    showConfirmButton: showConfirm,
  });
}

function request(
  url,
  data,
  successCallback,
  errorCallback,
  showLoading = true
) {
  // Show loading spinner
  if (showLoading) {
    Swal.fire({
      title: "Contracting to serve",
      html: "Please wait...",
      showConfirmButton: false, // Hide the "OK" button
      allowOutsideClick: false,
      onBeforeOpen: () => {
        Swal.showLoading();
      },
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  // Fetch POST request
  fetch(url, {
    method: "POST",
    headers: {
      //   "Content-Type": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // Close loading spinner
      if (showLoading) Swal.close();
      // Call success callback with response data
      if (successCallback && typeof successCallback === "function") {
        successCallback(data);
      }
    })
    .catch((error) => {
      // Close loading spinner
      if (showLoading) Swal.close();
      // Call error callback with error message
      if (errorCallback && typeof errorCallback === "function") {
        errorCallback(error);
      }
    });
}
