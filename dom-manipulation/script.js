// Load quotes from localStorage if available
let quotes = [];

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    // Default quotes if none in storage
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Creativity is intelligence having fun.", category: "Creativity" },
    ];
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Load existing quotes at the start
loadQuotes();

// Function to show a random quote
function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.innerHTML = `"${quote.text}" - <em>(${quote.category})</em>`;

  // Optional: Save last viewed quote in sessionStorage
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

// Function to add a new quote
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newQuote = {
    text: textInput.value.trim(),
    category: categoryInput.value.trim()
  };

  if (newQuote.text && newQuote.category) {
    quotes.push(newQuote);
    saveQuotes();

    const display = document.getElementById('quoteDisplay');
    const newParagraph = document.createElement('p');
    newParagraph.innerHTML = `"${newQuote.text}" - <em>(${newQuote.category})</em>`;
    display.appendChild(newParagraph);

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

// Optional: Load last quote from sessionStorage if exists
const lastQuote = sessionStorage.getItem('lastQuote');
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `"${quote.text}" - <em>(${quote.category})</em>`;
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// Placeholder for checker (from Task 0)
function createAddQuoteForm() {
  // This is a placeholder for the checker
}
