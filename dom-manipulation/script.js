// ----------------------------
// 1. Initial Quotes Setup
// ----------------------------
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Be yourself; everyone else is already taken.", category: "Inspiration" },
  { text: "Simplicity is the ultimate sophistication.", category: "Philosophy" }
];

// ----------------------------
// 2. Display Random Quote
// ----------------------------
function showRandomQuote() {
  const display = document.getElementById("quoteDisplay");
  const selectedCategory = localStorage.getItem("selectedCategory") || "all";
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);
  const random = filtered[Math.floor(Math.random() * filtered.length)];
  display.innerHTML = random ? `"${random.text}" - (${random.category})` : "No quotes available.";
}

// ----------------------------
// 3. Add New Quote
// ----------------------------
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (text && category) {
    quotes.push({ text, category });
    saveQuotes();
    populateCategories();
    showRandomQuote();
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// ----------------------------
// 4. Save to Local Storage
// ----------------------------
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ----------------------------
// 5. Filtering by Category
// ----------------------------
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const unique = ["all", ...new Set(quotes.map(q => q.category))];
  filter.innerHTML = "";
  unique.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    filter.appendChild(option);
  });
  const selected = localStorage.getItem("selectedCategory") || "all";
  filter.value = selected;
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// ----------------------------
// 6. Import/Export JSON
// ----------------------------
function exportToJsonFile() {
  const data = JSON.stringify(quotes, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "quotes.json";
  link.click();
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = function (e) {
    const imported = JSON.parse(e.target.result);
    quotes.push(...imported);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  reader.readAsText(event.target.files[0]);
}

// ----------------------------
// 7. Server Sync & Conflict Resolution
// ----------------------------
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();
    const serverQuotes = data.slice(0, 5).map(post => ({
      text: post.title,
      category: "Server"
    }));
    quotes = [...serverQuotes, ...quotes.filter(q => q.category !== "Server")];
    saveQuotes();
    populateCategories();
    showRandomQuote();
    alert("Quotes synced with server!");
  } catch (err) {
    console.error("Failed to fetch from server", err);
  }
}

async function postQuotesToServer() {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quotes)
    });
  } catch (err) {
    console.error("Failed to POST", err);
  }
}

function syncQuotes() {
  fetchQuotesFromServer();
  postQuotesToServer();
}

setInterval(syncQuotes, 30000); // Sync every 30s

// ----------------------------
// 8. Initialize Page
// ----------------------------
window.onload = function () {
  populateCategories();
  showRandomQuote();
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};


function createAddQuoteForm() {
  const formContainer = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.id = 'newQuoteText';
  quoteInput.type = 'text';
  quoteInput.placeholder = 'Enter a new quote';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.type = 'text';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.textContent = 'Add Quote';
  addButton.onclick = addQuote;

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}
