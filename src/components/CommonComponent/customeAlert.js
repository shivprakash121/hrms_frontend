// Create a reusable alert function
export function showCustomAlert(message, type = "success") {
    // Remove any existing alert
    console.log('hello',)
    const existingAlert = document.getElementById("customAlert");
    if (existingAlert) {
      existingAlert.remove();
    }
  
    // Create a new alert container
    const alertContainer = document.createElement("div");
    alertContainer.id = "customAlert";
    alertContainer.className = `custom-alert ${type}`;
    alertContainer.innerText = message;
  
    // Append to the body
    document.body.appendChild(alertContainer);
  
    // Automatically remove the alert after 3 seconds
    setTimeout(() => {
      alertContainer.remove();
    }, 3000);
  }
  