let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Simplicity is the ultimate sophistication.", category: "Design" }
];

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function populateCategories() {
  const dropdown = document.getElementById("categoryFilter");
  const selected = localStorage.getItem("selectedCategory") || "all";

  dropdown.innerHTML = `<option value="all">All Categories</option>`;
  const categories = [...new Set(quotes.map(q => q.category))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    if (cat === selected) option.selected = true;
    dropdown.appendChild(option);
  });
}

function getFilteredQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);
  return selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
}

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" — [${quote.category}]`;
  sessionStorage.setItem("lastQuote", JSON.stringify(quote));
}

function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    populateCategories();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote();
  }
}

function filterQuotes() {
  const filtered = getFilteredQuotes();
  const quoteDisplay = document.getElementById("quoteDisplay");

  if (filtered.length > 0) {
    const randomIndex = Math.floor(Math.random() * filtered.length);
    const quote = filtered[randomIndex];
    quoteDisplay.innerHTML = `"${quote.text}" — [${quote.category}]`;
  } else {
    quoteDisplay.innerHTML = "No quotes found for this category.";
  }
}

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

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Run on load
window.onload = function () {
  populateCategories();
  const last = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (last) {
    document.getElementById("quoteDisplay").innerHTML = `"${last.text}" — [${last.category}]`;
  } else {
    showRandomQuote();
  }
};

document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// ✅ Task 3: Sync with server and resolve conflict
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts/1';

async function syncWithServer() {
  const syncMessage = document.getElementById("syncMessage");

  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();

    const serverQuote = {
      text: serverData.title || "Server Quote Placeholder",
      category: "Server"
    };

    const exists = quotes.some(q => q.text === serverQuote.text);

    if (!exists) {
      quotes.push(serverQuote);
      saveQuotes();
      populateCategories();
      showRandomQuote();
      syncMessage.textContent = "✅ New quote synced from server!";
    } else {
      syncMessage.textContent = "🔁 Already synced with server.";
    }

    setTimeout(() => syncMessage.textContent = "", 3000);
  } catch (err) {
    syncMessage.textContent = "❌ Sync failed. Try again.";
    setTimeout(() => syncMessage.textContent = "", 3000);
  }
}
