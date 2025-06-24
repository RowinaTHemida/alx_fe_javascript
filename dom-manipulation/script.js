// Load quotes from localStorage if available, otherwise use default
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

// Save to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = `"${randomQuote.text}" — [${randomQuote.category}]`;

  // Save to sessionStorage (optional)
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Add a new quote
function addQuote() {
  const newQuoteText = document.getElementById("newQuoteText").value.trim();
  const newQuoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newQuoteText && newQuoteCategory) {
    quotes.push({ text: newQuoteText, category: newQuoteCategory });
    saveQuotes();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  }
}

// Export quotes to JSON
function exportQuotes() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Show last quote on page load if available
window.onload = function () {
  const last = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (last) {
    document.getElementById("quoteDisplay").innerHTML = `"${last.text}" — [${last.category}]`;
  } else {
    showRandomQuote();
  }
};

// Event listener for Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
