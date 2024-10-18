document.addEventListener('DOMContentLoaded', () => {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const newQuoteButton = document.getElementById('newQuote');
    const addQuoteButton = document.getElementById('addQuote');
    const exportQuotesButton = document.getElementById('exportQuotes');
    const importFileInput = document.getElementById('importFile');
    const categoryFilter = document.getElementById('categoryFilter');
    const notification = document.getElementById('notification');

    let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

    function saveQuotes() {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    }

    function showRandomQuote() {
        const filteredQuotes = filterQuotesArray();
        if (filteredQuotes.length === 0) {
            quoteDisplay.innerHTML = '<p>No quotes available for the selected category.</p>';
            return;
        }
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        const randomQuote = filteredQuotes[randomIndex];
        quoteDisplay.innerHTML = <p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>;
    }

    function addQuote() {
        const newQuoteText = document.getElementById('newQuoteText').value.trim();
        const newQuoteCategory = document.getElementById('newQuoteCategory').value.trim();
        if (newQuoteText && newQuoteCategory) {
            quotes.push({ text: newQuoteText, category: newQuoteCategory });
            saveQuotes();
            populateCategories();
            document.getElementById('newQuoteText').value = '';
            document.getElementById('newQuoteCategory').value = '';
            alert('Quote added successfully!');
            syncQuotes();
        } else {
            alert('Please enter both a quote and a category.');
        }
    }

    function filterQuotesArray() {
        const selectedCategory = categoryFilter.value;
        if (selectedCategory === 'all') {
            return quotes;
        }
        return quotes.filter(quote => quote.category === selectedCategory);
    }

    function filterQuotes() {
        const filteredQuotes = filterQuotesArray();
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            const randomQuote = filteredQuotes[randomIndex];
            quoteDisplay.innerHTML = <p>"${randomQuote.text}" - <em>${randomQuote.category}</em></p>;
        } else {
            quoteDisplay.innerHTML = '<p>No quotes available for the selected category.</p>';
        }
        localStorage.setItem('selectedCategory', categoryFilter.value);
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
        const selectedCategory = localStorage.getItem('selectedCategory');
        if (selectedCategory) {
            categoryFilter.value = selectedCategory;
        }
    }

    function exportQuotesToJson() {
        const json = JSON.stringify(quotes, null, 2);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    function importFromJsonFile(event) {
        const fileReader = new FileReader();
        fileReader.onload = function(event) {
            const importedQuotes = JSON.parse(event.target.result);
            quotes.push(...importedQuotes);
            saveQuotes();
            alert('Quotes imported successfully!');
            populateCategories();
            filterQuotes();
        };
        fileReader.readAsText(event.target.files[0]);
    }

    async function fetchQuotesFromServer() {
        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts');
            const serverQuotes = await response.json();
            return serverQuotes.map(post => ({
                text: post.title,
                category: 'Server'
            }));
        } catch (error) {
            console.error('Error fetching quotes from server:', error);
            return [];
        }
    }

    async function postQuotesToServer(newQuotes) {
        try {
            await Promise.all(newQuotes.map(quote =>
                fetch('https://jsonplaceholder.typicode.com/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: quote.text, body: quote.category, userId: 1 })
                })
            ));
        } catch (error) {
            console.error('Error posting quotes to server:', error);
        }
    }

    async function syncQuotes() {
        const serverQuotes = await fetchQuotesFromServer();
        const newLocalQuotes = quotes.filter(quote => !quote.synced);
        const combinedQuotes = resolveConflicts(quotes, serverQuotes);
        quotes = combinedQuotes;
        saveQuotes();
        await postQuotesToServer(newLocalQuotes);
        populateCategories();
        filterQuotes();
        showNotification('Quotes synced with server!');
    }

    function resolveConflicts(localQuotes, serverQuotes) {
        // Simple conflict resolution: server quotes take precedence
        const combined = serverQuotes.concat(localQuotes.filter(lq => !serverQuotes.some(sq => sq.text === lq.text)));
        combined.forEach(quote => {
            quote.synced = true;
        });
        return combined;
    }

    function showNotification(message) {
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    newQuoteButton.addEventListener('click', showRandomQuote);
    addQuoteButton.addEventListener('click', addQuote);
    exportQuotesButton.addEventListener('click', exportQuotesToJson);
    importFileInput.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);

    populateCategories();
    filterQuotes();
    showRandomQuote();
    syncQuotes();
    setInterval(syncQuotes, 60000); // Periodically sync with server every 60 seconds
})