let quotes = [];

function loadQuotes() {
  const savedQuotes = localStorage.getItem('quotes');
  if (savedQuotes) {
    quotes = JSON.parse(savedQuotes);
  } else {
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

// Load quotes and categories at start
loadQuotes();
populateCategories();

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

    populateCategories(); // update dropdown if new category
    filterQuotes(); // show only matching quotes

    textInput.value = "";
    categoryInput.value = "";
  } else {
    alert("Please fill in both fields.");
  }
}

function populateCategories() {
  const select = document.getElementById('categoryFilter');
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear and re-add default option
  select.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  // Restore saved filter if exists
  const savedFilter = localStorage.getItem('selectedCategory');
  if (savedFilter) {
    select.value = savedFilter;
    filterQuotes(); // apply it
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

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);

function createAddQuoteForm() {}


// === Sync with Server Simulation ===

// Fake server URL using JSONPlaceholder (simulate only)
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// Simulate sending local quotes to the server
function syncQuotesToServer() {
  fetch(SERVER_URL, {
    method: "POST",
    body: JSON.stringify(quotes),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(response => response.json())
    .then(data => {
      console.log("✅ Quotes synced to server:", data);
      showSyncNotification("Quotes synced to server successfully.");
    })
    .catch(error => {
      console.error("❌ Sync failed:", error);
      showSyncNotification("Failed to sync quotes to server.");
    });
}

// Simulate fetching quotes from the server
function fetchQuotesFromServer() {
  fetch(SERVER_URL)
    .then(response => response.json())
    .then(serverQuotes => {
      // Simulate getting new quotes
      const fakeQuotes = [
        { text: "Server quote 1", category: "Server" },
        { text: "Server quote 2", category: "Server" }
      ];

      // Conflict Resolution: Server wins (replace local)
      quotes = fakeQuotes;
      saveQuotes();
      populateCategories();
      filterQuotes();
      showSyncNotification("Quotes updated from server (Server version used).");
    })
    .catch(error => {
      console.error("❌ Fetch from server failed:", error);
    });
}

// Show notification to user
function showSyncNotification(message) {
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.background = '#222';
  notification.style.color = '#fff';
  notification.style.padding = '10px';
  notification.style.marginTop = '10px';
  notification.style.borderRadius = '5px';
  document.body.prepend(notification);
  setTimeout(() => notification.remove(), 4000);
}

// Periodic sync every 30 seconds
setInterval(fetchQuotesFromServer, 30000);
setInterval(syncQuotesToServer, 60000);
