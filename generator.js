// Add event listener to form
document.getElementById("generator-form").addEventListener("submit", function(e) {
  e.preventDefault();
  // Get form input
  var topics = document.getElementById("topics").value;
  var keywords = document.getElementById("keywords").value;
  var amount = document.getElementById("amount").value;
  var removeDuplicateTags = document.getElementById("duplicate-tags").value;

  // Validate input
  if (!topics || !keywords || !amount) {
      return displayError("All fields are required");
  }
  if (removeDuplicateTags !== "yes" && removeDuplicateTags !== "no") {
      return displayError("Invalid value for remove duplicate tags");
  }
  if (isNaN(amount) || amount < 1) {
      return displayError("Amount must be a number greater than 0");
  }

  // Sanitize input
  topics = sanitizeInput(topics);
  keywords = sanitizeInput(keywords);

  // Convert input strings to lists
  topics = topics.split(",");
  keywords = keywords.split(",");

  // Prepare data for Python script
  var data = {
    topics: topics,
    keywords: keywords,
    amount: amount,
    removeDuplicateTags: removeDuplicateTags
  };

  // Use Fetch API to send data to Python script
  fetch("generator.py", {
      method: "POST",
      body: JSON.stringify(data),
      headers: new Headers({
          'Content-Type': 'application/json'
      }),
  })
    .then(function(response) {
      if (!response.ok) {
          throw new Error(response.statusText);
      }
      return response.text();
    })
    .then(function(tags) {
      // Show generated tags in HTML
      var output = document.getElementById("output");
        if (!output) {
    console.log("output element not found");
    return;
         }
        if (tags === "") {
    output.innerHTML = "No tags generated.";
    output.classList.remove("show-output");
        } else {
    output.innerHTML = tags;
    output.classList.add("show-output");
       }

    })
    .catch(function(error) {
      console.log(error);
      var errorElement = document.getElementById("error");
      errorElement.classList.remove("none");
      errorElement.innerHTML = "An error occurred, please try again later.";
    });    
});

// Function to display errors
function displayError(error) {
  var errorElement = document.getElementById("error");
  errorElement.innerHTML = error;
}

// Function to sanitize input
function sanitizeInput(input) {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
