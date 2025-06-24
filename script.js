// ✅ Array of quote objects
const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

// ✅ EXACT function name: showRandomQuote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
}

// ✅ EXACT listener on the “Show New Quote” button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ Function name: addQuote
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote(); // Show the new quote after adding
  }
}
