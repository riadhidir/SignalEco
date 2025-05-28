
import { showError } from "./toast";

// Function to handle API errors
export const handleApiError = (error: any) => {
  let errorMessage = "An error occurred. Please try again.";

  // Check if the error is an Axios error
  if (error.isAxiosError) {
    // If the response exists, handle the error based on status or response data
    if (error.response) {
      // If the API provides a message, use that
      if (error.response.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response.status === 401) {
        errorMessage = "Invalid credentials. Please try again.";
      } else if (error.response.status === 500) {
        errorMessage = "Server error. Please try again later.";
      } else {
        errorMessage = `Unexpected error occurred. Status code: ${error.response.status}`;
      }
    } else {
      // Handle network or timeout errors
      errorMessage = "Network error. Please check your connection.";
    }
  } else {
    if(error.message) {
    errorMessage = error.message;
    }else {
        // If it's not an Axios error, just display a generic message
        errorMessage = "An error occurred. Please try again.";
    }
  }

  // Show the error message using Toast
  showError(errorMessage)

};
