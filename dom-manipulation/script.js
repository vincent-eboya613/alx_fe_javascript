// Array to store quotes with text and category
const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "In the middle of difficulty lies opportunity.", category: "Inspiration" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Perseverance" },
  ];
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteText').innerText = randomQuote.text;
    document.getElementById('quoteCategory').innerText = `Category: ${randomQuote.category}`;
  }
  
  // Event listener for the "Show New Quote" button
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Function to add a new quote to the array and update the DOM
  function addQuote() {
    const newText = document.getElementById('newQuoteText').value;
    const newCategory = document.getElementById('newQuoteCategory').value;
  
    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      document.getElementById('newQuoteText').value = '';  // Clear input fields
      document.getElementById('newQuoteCategory').value = '';
      alert("New quote added successfully!");
    } else {
      alert("Please enter both a quote and a category!");
    }
  }
  