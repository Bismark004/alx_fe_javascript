document.addEventListener('DOMContentLoaded', function (){

    const quotes = [
        { text: "Life is what happens when you're busy making other plans.", category: "Life" },
        { text: "The purpose of our lives is to be happy.", category: "Happiness" },
        { text: "Get busy living or get busy dying.", category: "Motivation" }
    ];

    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');
    const newQuoteText = document.getElementById('newQuoteText');
    const newQuoteCategory = document.getElementById('newQuoteCategory');

    function showRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        quoteDisplay.innerHTML = `<p>"${randomQuote.text}" -  ${randomQuote.category}</p>`;

    }

    function addQuote() {
        const text = newQuoteText.value.trim();
        const category = newQuoteCategory.value.trim();

        if (text && category) {
            quotes.push({ text, category });
            newQuoteText.value = '';
            newQuoteCategory.value = '';
            alert('New quote added!');
        } else {
            alert('Please enter both quote and category.');
        }
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);

    // Show a random quote on initial load
    showRandomQuote();
});
