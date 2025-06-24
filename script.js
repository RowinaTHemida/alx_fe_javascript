const quotes = [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteBox = document.getElementById("quoteDisplay");
  quoteBox.textContent = `"${quote.text}" — [${quote.category}]`;
}

document.getElementById("newQuote").addEventListener("click", displayRandomQuote);

function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (text && category) {
    quotes.push({ text, category });
    textInput.value = "";
    categoryInput.value = "";
    displayRandomQuote();
  } else {
    alert("Please fill in both fields.");
  }
}
