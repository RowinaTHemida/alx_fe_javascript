// Initial Quotes or Load from localStorage
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Stay hungry, stay foolish.", category: "Inspiration" },
  { text: "Be yourself; everyone else is already taken.", category: "Motivation" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show Random Quote
function showRandomQuote() {
  const filtered = getFilteredQuotes();
  if (filtered.length === 0) {
    document.getElementById("quoteDisplay").innerHTML = "No quotes found.";
    return;
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  document.getElementById("quoteDisplay").innerHTML = `${randomQuote.text}<br><i>${randomQuote.category}</i>`;
}

// Add New Quote from Form
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return alert("Please fill both fields!");

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  alert("Quote added successfully!");
}

// Create the Quote Form Dynamically
function createAddQuoteForm() {
  const container = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.placeholder = "Enter a new quote";

  const inputCat = document.createElement("input");
  inputCat.id = "newQuoteCategory";
  inputCat.placeholder = "Enter quote category";

  const addBtn = document.createElement("button");
  addBtn.textContent = "Add Quote";
  addBtn.onclick = addQuote;

  container.appendChild(inputText);
  container.appendChild(inputCat);
  container.appendChild(addBtn);
  document.body.appendChild(container);
}

// Get quotes matching selected category
function getFilteredQuotes() {
  const selected = localStorage.getItem("selectedCategory") || "all";
  return selected === "all" ? quotes : quotes.filter(q => q.category === selected);
}

// Populate Dropdown with Unique Categories
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  select.innerHTML = `<option value="all">All Categories</option>`;
  const cats = [...new Set(quotes.map(q => q.category))];
  cats.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    select.appendChild(opt);
  });
  const stored = localStorage.getItem("selectedCategory");
  if (stored) select.value = stored;
}

// Handle Filter Change
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// Export Quotes to JSON
function exportQuotesToJSON() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import Quotes from JSON file
function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (Array.isArray(imported)) {
        quotes.push(...imported);
        saveQuotes();
        populateCategories();
        showRandomQuote();
        alert("Quotes imported!");
      }
    } catch (err) {
      alert("Invalid JSON format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

// Fetch quotes from simulated server (JSONPlaceholder)
async function fetchQuotesFromServer() {
  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    const serverQuotes = data.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));
    quotes = serverQuotes; // server wins in conflict
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Quotes synced from server!");
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}

// Load Everything on Start
window.onload = function () {
  populateCategories();
  createAddQuoteForm();
  showRandomQuote();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  document.getElementById("categoryFilter").addEventListener("change", filterQuotes);
  document.getElementById("exportBtn").addEventListener("click", exportQuotesToJSON);
  document.getElementById("importFile").addEventListener("change", importFromJsonFile);

  setInterval(fetchQuotesFromServer, 20000); // Every 20 seconds
};
