
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
  
    function addQuote() {
      const text = newQuoteText.value.trim();
      const category = newQuoteCategory.value.trim();
  
      if (text && category) {
        quotes.push({ text, category });
        saveQuotes();
        newQuoteText.value = '';
        newQuoteCategory.value = '';
        alert('New quote added!');
        updateCategories();
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
      fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes = quotes.concat(importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        updateCategories();
      };
      fileReader.readAsText(event.target.files[0]);
    }
  
    function updateCategories() {
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
  
    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportQuotesButton.addEventListener('click', exportToJsonFile);
    importFileInput.addEventListener('change', importFromJsonFile);
  
    const lastQuote = JSON.parse(sessionStorage.getItem('lastQuote'));
    if (lastQuote) {
      quoteDisplay.innerHTML = `<p>"${lastQuote.text}" - ${lastQuote.category}</p>`;
    } else {
      showRandomQuote();
    }
  
    updateCategories();
  
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
  });
  