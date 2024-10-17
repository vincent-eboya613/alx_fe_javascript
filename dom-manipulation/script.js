// script.js

// Initial quotes array with quote objects
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Success" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", category: "Happiness" }
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length); // Get a random index
    const randomQuote = quotes[randomIndex]; // Access the random quote object
  
    // Displaying the quote in the DOM
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${randomQuote.text}</p><p><em>Category: ${randomQuote.category}</em></p>`;
  }
  
  // Function to add a new quote
  function addQuote() {
    // Get the values from the input fields
    const newQuoteText = document.getElementById("newQuoteText").value;
    const newQuoteCategory = document.getElementById("newQuoteCategory").value;
  
    // Ensuring the inputs are not empty
    if (newQuoteText && newQuoteCategory) {
      // Create a new quote object
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
  
      // Adding the new quote to the quotes array
      quotes.push(newQuote);
  
      // Clearing the input fields
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
  
      // Displaying a confirmation message or refresh the random quote
      showRandomQuote();
    } else {
      alert("Please enter both a quote and a category.");
    }
  }
  
  // Event listener to display a random quote when the button is clicked
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initial call to display a random quote when the page loads
  showRandomQuote();
  