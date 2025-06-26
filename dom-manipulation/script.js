let quotes = [];

// Load quotes from localStorage
function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  quotes = storedQuotes ? JSON.parse(storedQuotes) : [];
}

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }
  const randomIndex = Math.floor(Math.random() * quotes.length);
  quoteDisplay.innerHTML = quotes[randomIndex].text;
}

// Add quote to list and localStorage
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !category) return;

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  showRandomQuote();
  postQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
}

// UI to add quote
function createAddQuoteForm() {
  const formDiv = document.createElement("div");
  formDiv.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  `;
  document.body.appendChild(formDiv);
}

// Filter system
function populateCategories() {
  const filter = document.getElementById("categoryFilter");
  const uniqueCategories = [...new Set(quotes.map(q => q.category))];

  filter.innerHTML = `<option value="all">All Categories</option>`;
  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    filter.appendChild(opt);
  });

  const lastCategory = localStorage.getItem("lastCategory");
  if (lastCategory) filter.value = lastCategory;
}

function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastCategory", selected);
  const display = document.getElementById("quoteDisplay");

  if (selected === "all") {
    showRandomQuote();
  } else {
    const filtered = quotes.filter(q => q.category === selected);
    display.innerHTML = filtered.length
      ? filtered[Math.floor(Math.random() * filtered.length)].text
      : "No quotes in this category.";
  }
}

// ====== ✅ Server Interaction =======

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

    // Notification
    const notice = document.createElement("div");
    notice.style.background = "#fffae6";
    notice.style.padding = "10px";
    notice.style.border = "1px solid #aaa";
    notice.innerText = "Synced quotes from server.";
    document.body.prepend(notice);
    setTimeout(() => notice.remove(), 3000);
  } catch (err) {
    console.error("Fetch failed", err);
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    const result = await response.json();
    console.log("Quote posted:", result);
  } catch (err) {
    console.error("POST failed:", err);
  }
}

function syncQuotes() {
  fetchQuotesFromServer(); // simulate periodic sync
}

// Periodic Sync
setInterval(syncQuotes, 30000); // every 30 seconds

// Init
window.onload = function () {
  loadQuotes();
  createAddQuoteForm();
  populateCategories();
  showRandomQuote();

  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
};
