const jsonString = getUserLanguages(); //'[{"iso":"ar-rSA", "name":"Arabic"},{"iso":"bn", "name":"Bangla"}]';
const languages = JSON.parse(jsonString);

function gotoUserPage(){
  window.location.replace(user_page);
}


// Check if user is logged in when the page loads
document.addEventListener("DOMContentLoaded", function () {
  if (!isLoggedIn()) {
    // User is not logged in, redirect to login page
    window.location.href = "login.html";
  }
  const role = getFormCookie('role');
  if (role === 'admin'){
    const updateButton = document.getElementById("userButton");
    updateButton.classList.remove("d-none");
  }
});

// Function to generate dropdown items
function generateDropdownItems() {
 try {
  const languageDropdown = document.getElementById("languageDropdown");
  if (languageDropdown) {
    // Clear existing dropdown items
    languageDropdown.innerHTML = "";

    // Generate dropdown items for each language
    languages.forEach((language) => {
      const dropdownItem = document.createElement("li");
      dropdownItem.innerHTML = `<a class="dropdown-item" href="#" onclick="selectLanguage('${language.iso}')">${language.name}</a>`;
      languageDropdown.appendChild(dropdownItem);
    });
  }
 } catch (error) {
  window.location.replace(login_page);
 }
}

// Function to handle language selection
function selectLanguage(iso) {
  // Find the selected language object
  // Make Request to server to get Selected language
  const selectedLanguage = languages.find((language) => language.iso === iso);

  // Update the paragraph content with the selected language name
  const selectedLanguageParagraph = document.getElementById("selectedLanguage");
  if (selectedLanguageParagraph) {
    selectedLanguageParagraph.textContent = `Selected Language: ${
      selectedLanguage ? selectedLanguage.name : "Unknown"
    }`;
    // Save selected iso to cooke
  }
  saveToCookie("iso", iso);
  const requestData = {
    request: "get_home_strings",
    iso: iso,
    auth_token: "ZW1haWxAZW1haWwuY29tcGFzc3dvcmQ=",
  };
  // Call sendData() function with the dummy URL, data, and success callback function
  request(
    api_ulr,
    requestData,
    function (responseData) {
      // console.log("data ", responseData["message"]);
      var response = responseData;
      var data = response.data;
      // console.log(data);

      var defaultLanguage = data.defaultLanguage;
      var userLanguage = data.userLanguage;

      Swal.fire({
        icon: "success",
        title: "Communication Success",
        text: responseData.message,
        timer: 2000, // Automatically close after 2 seconds
        showConfirmButton: false,
      });
      processAndSaveDefaultLanguage(defaultLanguage);
      processAndUpdateString(userLanguage);
    },
    function (errorData) {
      window.alert("An error occurred: " + errorData);
    }
  );
}

// --------------------
function isLoggedIn() {
  return getFormCookie("token");
}
// Call the function to generate dropdown items
generateDropdownItems();
// Default select the first language when the page loads
if (languages && languages.length > 0) {
  var iso = getFormCookie("iso");
  selectLanguage(iso == null ? languages[0].iso : iso);
}


// Logout button click event handler
document
  .getElementById("logoutButton")
  .addEventListener("click", function (event) {
    // Remove token cookie
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Redirect to login page
    window.location.href = login_page;
  });
var modal = document.getElementById("myModal");
var editIndex;
var selectedData = null;
var selectedDataSetNameElement = document.getElementById("selectedDataSetName");
var userButton = document.getElementById("userButton");
var loadingModal = document.getElementById("loadingModal");

// Define dummy data sets
var dataSet1 = {
  key1: { string: "String 1" },
  key2: { string: "String 2" },
  key3: { string: "String 3" },
};

var dataSet2 = {
  key1: { description: "Description 1" },
  key2: { description: "Description 2" },
  key3: { description: "Description 3" },
};

// Function to populate the list based on the selected data set
function populateList() {
  var stringList = document.getElementById("stringList");
  stringList.innerHTML = ""; // Clear existing cards
  var data = dataSet1; //selectedData || {};
  // console.log("----------------------");
  // console.log(data);
  Object.entries(data).forEach(([key, value]) => {
    var card = document.createElement("div");
    card.className = "card string-card";
    card.style.cursor = "pointer"; // Change cursor on hover
    card.addEventListener("click", function () {
      openModal(key);
    });
    var cardBody = document.createElement("div");
    cardBody.className = "string-card-body";
    var string = value.string || ""; // If string is not available, set to empty string
    var description = value.description || ""; // If description is not available, set to empty string
    cardBody.innerHTML = "<p>" + string + "</p>";
    card.appendChild(cardBody);
    stringList.appendChild(card);
  });
}
function populateString(data, isHideUpdateButton = true) {
  var stringList = document.getElementById("stringList");
  stringList.innerHTML = ""; // Clear existing cards
  //   data = JSON.parse(data);
  for (const key in data) {
    var card = document.createElement("div");
    card.className = "card string-card";
    card.style.cursor = "pointer"; // Change cursor on hover
    card.addEventListener("click", function () {
      openModal(key);
    });
    var cardBody = document.createElement("div");
    cardBody.className = "string-card-body";
    var string = data[key]; // || ""; // If string is not available, set to empty string
    var description = dataSet2[key] || ""; // If description is not available, set to empty string
    cardBody.innerHTML = "<p>" + string + "</p>";
    card.appendChild(cardBody);
    stringList.appendChild(card);
  }
  if (isHideUpdateButton) {
    isStringUpdated = false;
    hideUpdateButton();
  }
}

// Initial population of the list and selection of default data set
// populateString(data);
// selectData("dataSet1");

// Function to select a data set
// function selectData(dataSet) {
//   selectedData = { ...dataSet1 }; // Initialize selected data with dataSet1
//   if (dataSet === "dataSet2") {
//     Object.keys(dataSet2).forEach((key) => {
//       if (selectedData[key]) {
//         selectedData[key].description = dataSet2[key].description; // Merge descriptions from dataSet2
//       } else {
//         selectedData[key] = { description: dataSet2[key].description }; // Add descriptions from dataSet2
//       }
//     });
//   }
//   populateList() // Populate the list with the selected data set
//   // selectedDataSetNameElement.textContent =
//   //   "Selected Data Set: " + dataSet;
// }

// Function to open the modal for editing a string
var perviousString = "";
function openModal(key) {
  var string = dataSet1[key]; //selectedData[key].string || ""; // If string is not available, set to empty string
  var description = dataSet2[key] || ""; // If description is not available, set to empty string
  document.getElementById("newString").value = string;
  document.getElementById("description").innerHTML = description;
  editIndex = key;
  var myModal = new bootstrap.Modal(document.getElementById("myModal"), {
    keyboard: false,
  });
  myModal.show();
  perviousString = string;
}

function processAndUpdateString(stringData) {
  const newData = stringData;
  // Modify dataSet1
  //   console.log(newData);
  const updatedData = {};
  for (const key in newData) {
    updatedData[key] = newData[key].value;
  }
  dataSet1 = updatedData;
  //   console.log(updatedData.app_name);
  populateString(updatedData);
}
function processAndSaveDefaultLanguage(defaultLanguage) {
  var updatedData = {};
  for (const key in defaultLanguage) {
    updatedData[key] = defaultLanguage[key].value;
  }
  dataSet2 = updatedData;
}

// Function to update the string and description
var isStringUpdated = false;
function updateString() {
  var newString = document.getElementById("newString").value;
  dataSet1[editIndex] = newString; // Update string value
  //checkForChanges(); // Check if there are any changes after updating
  var myModal = bootstrap.Modal.getInstance(document.getElementById("myModal"));
  myModal.hide();
  if (newString != perviousString) {
    populateString(dataSet1, false); // Update the list
    if (!isShowingUpdateButton) showUpdateButton();
  }

  // showLoadingModal(); // Show loading modal when updating data
  // // Simulate API request delay (replace with actual API call)
  // setTimeout(function () {
  //   //updateData(); // Call updateData function after a delay
  // }, 2000);
}

// Function to check if there are any changes after updating
function checkForChanges() {
  //   var hasChanges = false;
  //   Object.entries(selectedData).forEach(([key, value]) => {
  //     if (dataSet1[key] && value.string !== dataSet1[key].string) {
  //       // Corrected comparison logic
  //       hasChanges = true;
  //     }
  //   });
  //   if (hasChanges) {
  //     updateButton.classList.remove("d-none"); // Show update button if there are changes
  //   } else {
  //     updateButton.classList.add("d-none"); // Hide update button if there are no changes
  //   }
}
var isShowingUpdateButton = false;
function showUpdateButton() {
  updateButton.classList.remove("d-none");
  isShowingUpdateButton = true;
}
function hideUpdateButton() {
  const updateButton = document.getElementById("updateButton");
  //   if (element.classList.contains('d-none')) return; //Alreadt
  updateButton.classList.add("d-none");
  isShowingUpdateButton = false;
}

// Function to update the data
function updateData() {
  hideUpdateButton();

  const requestData = {
    request: "update_translation",
    iso: getFormCookie("iso"),
    translation: dataSet1,
    auth_token: "ZW1haWxAZW1haWwuY29tcGFzc3dvcmQ=",
  };
  // Call sendData() function with the dummy URL, data, and success callback function
  request(
    api_ulr,
    requestData,
    function (responseData) {
      var response = responseData;
      var data = response.data;
        showSuccess("Updated",response.message);
     
    },
    function (errorData) {
      window.alert("An error occurred: " + errorData);
    }
  );
}

// Function to show the loading modal
function showLoadingModal() {
  var myModal = new bootstrap.Modal(loadingModal, {
    keyboard: false,
    backdrop: "static",
  });
  myModal.show();
}

// Function to hide the loading modal
function hideLoadingModal() {
  var myModal = bootstrap.Modal.getInstance(loadingModal);
  myModal.hide();
}

//#region ? Translation
function myTranslation() {
  const saveButton = document.getElementById("translateButton");
  const saveButtonContent = document.getElementById("translateButtonContent");
  const newString = document.getElementById("newString");
  var text = newString.value;

  // Show loading spinner
  saveButton.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Translating...`;
  saveButton.disabled = true;
  // Simulate update (replace with your actual update logic)

  var iso = getFormCookie("iso").split("-")[0];
  request(
    api_ulr,
    {
      request: "translate",
      tl: iso,
      sl: "en",
      text: text,
      auth_token: "ZW1haWxAZW1haWwuY29tcGFzc3dvcmQ=",
    },
    function (responseData) {
      //Success
      newString.value = responseData.message;
      saveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
      <path d="M13.646 2.354a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
    </svg> Translated`;
      setTimeout(() => {
        // Hide loading spinner and show success tick icon
        saveButton.innerHTML = "Translate by Machine";
        saveButton.disabled = false;
      }, 2000); // Simulate update for 2 seconds (replace with actual update time)
    },
    function (errorData) {
      window.alert("An error occurred: " + errorData);

      saveButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16">
          <path d="M13.646 2.354a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L6 9.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
        </svg> Translated`;
      setTimeout(() => {
        // Hide loading spinner and show success tick icon
        saveButton.innerHTML = "Translate by Machine";
        saveButton.disabled = false;
      }, 2000); // Simulate update for 2 seconds (replace with actual update time)
    },
    false
  );
}

window.onbeforeunload = function(event)
{
  if(!isShowingUpdateButton) return ;
  alert("Please update your changes first. otherwise it will discard")
  return confirm("Confirm refresh");
};

//#endregion ? END : Translation
