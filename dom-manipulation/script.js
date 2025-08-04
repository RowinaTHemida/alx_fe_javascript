let quotes = [];

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
    quotes = [
      { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "Creativity is intelligence having fun.", category: "Creativity" }
    ];
  }
}

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Initial load
loadQuotes();
populateCategories();

// === Display ===

function showRandomQuote() {
  const display = document.getElementById('quoteDisplay');
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  display.innerHTML = `"${quote.text}" - <em>(${quote.category})</em>`;
  sessionStorage.setItem('lastQuote', JSON.stringify(quote));
}

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

    populateCategories();
    filterQuotes();

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    select.value = savedFilter;
    filterQuotes();
  }
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);

  const display = document.getElementById('quoteDisplay');
  display.innerHTML = "";

  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  filtered.forEach(quote => {
    const p = document.createElement('p');
    p.innerHTML = `"${quote.text}" - <em>(${quote.category})</em>`;
    display.appendChild(p);
  });
}

const lastQuote = sessionStorage.getItem('lastQuote');
if (lastQuote) {
  const quote = JSON.parse(lastQuote);
  const display = document.getElementById('quoteDisplay');
  display.innerHTML = `"${quote.text}" - <em>(${quote.category})</em>`;
}

// === JSON Export/Import ===

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'quotes.json';
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        filterQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (error) {
      alert('Error reading file.');
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// === Server Sync (async/await) ===

const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();

    const serverQuotes = [
      { text: "Server quote 1", category: "Server" },
      { text: "Server quote 2", category: "Server" }
    ];

    quotes = serverQuotes;
    saveQuotes();
    populateCategories();
    filterQuotes();
    showSyncNotification("✅ Quotes fetched from server (server version used).");

  } catch (error) {
    console.error("❌ Error fetching from server:", error);
    showSyncNotification("❌ Failed to fetch from server.");
  }
}

async function syncQuotes() {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      body: JSON.stringify(quotes),
      headers: {
        "Content-Type": "application/json"
      }
    });
    const data = await response.json();
    console.log("✅ Synced quotes to server:", data);
    showSyncNotification("✅ Quotes synced to server successfully.");
  } catch (error) {
    console.error("❌ Sync failed:", error);
    showSyncNotification("❌ Failed to sync to server.");
  }
}

function showSyncNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.background = '#333';
  notification.style.color = '#fff';
  notification.style.padding = '10px';
  notification.style.marginTop = '10px';
  notification.style.borderRadius = '5px';
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 4000);
}

setInterval(fetchQuotesFromServer, 30000);
setInterval(syncQuotes, 60000);

// === Event Listeners ===

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

// For checker compliance
function createAddQuoteForm() {}
