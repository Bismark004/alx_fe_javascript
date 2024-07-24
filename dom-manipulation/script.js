document.addEventListener('DOMContentLoaded', function () {
  let quotes = JSON.parse(localStorage.getItem('quotes')) || [
      { text: "Life is what happens when you're busy making other plans.", category: "Life" },
      { text: "The purpose of our lives is to be happy.", category: "Happiness" },
      { text: "Get busy living or get busy dying.", category: "Motivation" }
  ];

  const quoteDisplay = document.getElementById('quoteDisplay');
  const newQuoteButton = document.getElementById('newQuote');
  const addQuoteButton = document.getElementById('addQuote');
  const newQuoteText = document.getElementById('newQuoteText');
  const newQuoteCategory = document.getElementById('newQuoteCategory');
  const exportQuotesButton = document.getElementById('exportQuotes');
  const importFileInput = document.getElementById('importFile');
  const categoryFilter = document.getElementById('categoryFilter');

  function saveQuotes() {
      localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  function showRandomQuote() {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const randomQuote = quotes[randomIndex];
      quoteDisplay.innerHTML = `<p>"${randomQuote.text}" - ${randomQuote.category}</p>`;
      sessionStorage.setItem('lastQuote', JSON.stringify(randomQuote));
  }

  function createAddQuoteForm() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();

      if (text && category) {
          const newQuote = { text, category };
          quotes.push(newQuote);
          saveQuotes();
          postQuoteToServer(newQuote); // Post the new quote to the server
          newQuoteText.value = '';
          newQuoteCategory.value = '';
          alert('New quote added!');
          populateCategories();
      } else {
          alert('Please enter both quote and category.');
      }
  }

  function exportToJsonFile() {
      const dataStr = JSON.stringify(quotes, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'quotes.json';
      a.click();
      URL.revokeObjectURL(url);
  }

  function importFromJsonFile(event) {
      const fileReader = new FileReader();
      fileReader.onload = function (event) {
          const importedQuotes = JSON.parse(event.target.result);
          quotes = quotes.concat(importedQuotes);
          saveQuotes();
          alert('Quotes imported successfully!');
          populateCategories();
      };
      fileReader.readAsText(event.target.files[0]);
  }

  function populateCategories() {
      const categories = [...new Set(quotes.map(quote => quote.category))];
      categoryFilter.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
      });
  }

  function filterQuotes() {
      const selectedCategory = categoryFilter.value;
      quoteDisplay.innerHTML = '';
      const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
      filteredQuotes.forEach(quote => {
          const quoteElement = document.createElement('p');
          quoteElement.textContent = `"${quote.text}" - ${quote.category}`;
          quoteDisplay.appendChild(quoteElement);
      });
  }

  async function fetchQuotesFromServer() {
      try {
          const response = await fetch('https://jsonplaceholder.typicode.com/posts');
          const serverQuotes = await response.json();
          const formattedServerQuotes = serverQuotes.map(post => ({ text: post.title, category: 'Server' }));
          const mergedQuotes = [...quotes, ...formattedServerQuotes];
          const uniqueQuotes = Array.from(new Set(mergedQuotes.map(q => JSON.stringify(q)))).map(q => JSON.parse(q));
          quotes = uniqueQuotes;
          saveQuotes();
          populateCategories();
          alert('Quotes synced with server!');
      } catch (error) {
          console.error('Error syncing with server:', error);
      }
  }

  async function postQuoteToServer(quote) {
      try {
          await fetch('https://jsonplaceholder.typicode.com/posts', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                  title: quote.text,
                  body: quote.category,
                  userId: 1
              })
          });
      } catch (error) {
          console.error('Error posting quote to server:', error);
      }
  }

  function syncQuotes() {
      fetchQuotesFromServer();
      setInterval(fetchQuotesFromServer, 60000); // Sync every 60 seconds
  }

  function notifyUser(message) {
      const notification = document.createElement('div');
      notification.className = 'notification';
      notification.textContent = message;
      document.body.appendChild(notification);
      setTimeout(() => {
          document.body.removeChild(notification);
      }, 3000);
  }

  newQuoteButton.addEventListener('click', showRandomQuote);
  addQuoteButton.addEventListener('click', createAddQuoteForm);
  exportQuotesButton.addEventListener('click', exportToJsonFile);
  importFileInput.addEventListener('change', importFromJsonFile);

  const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
  if (lastQuote) {
      quoteDisplay.innerHTML = `<p>"${lastQuote.text}" - ${lastQuote.category}</p>`;
  } else {
      showRandomQuote();
  }

  populateCategories();

  const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
  if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
  }

  categoryFilter.addEventListener('change', () => {
      const selectedCategory = categoryFilter.value;
      localStorage.setItem('lastSelectedCategory', selectedCategory);
      filterQuotes();
  });

  filterQuotes();
  syncQuotes();
});
