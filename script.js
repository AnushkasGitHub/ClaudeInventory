document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // IMPORTANT: This should be your deployed Google Apps Script Web App BASE URL.
    // DO NOT include "?action=getData" or any other parameters here.
    const GOOGLE_SCRIPT_BASE_URL = 'https://script.google.com/macros/s/AKfycbyiQc2oskO7kHchGoAL0pSWrAE-kshlp_WxVJUcxDJl6E3mE6_MiDVk15surBugZnsS0w/exec'; // Make sure this matches your actual base URL
    const SHEET_NAME = 'Sheet1'; // This is used by your Apps Script, not directly here.

    // --- DATA MANAGEMENT ---
    let explosiveData = [];
    let isLoading = false;

    // --- DOM ELEMENTS ---
    const searchInput = document.getElementById('searchInput');
    const autocompleteList = document.getElementById('autocomplete-list');
    const resultsContainer = document.getElementById('results-container');
    const placeholderText = document.getElementById('placeholder-text');
    const errorMessage = document.getElementById('error-message'); // Ensure this element exists in your HTML if not already
    const loadingOverlay = document.getElementById('loadingOverlay'); // Ensure this element exists in your HTML if not already
    const modal = document.getElementById('addExplosiveModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeBtn = document.querySelector('.close-btn');
    const addExplosiveForm = document.getElementById('addExplosiveForm');

    // --- UTILITY FUNCTIONS ---
    function showLoading() {
        isLoading = true;
        if (loadingOverlay) loadingOverlay.style.display = 'flex';
        if (searchInput) searchInput.disabled = true;
        if (openModalBtn) openModalBtn.disabled = true;
    }

    function hideLoading() {
        isLoading = false;
        if (loadingOverlay) loadingOverlay.style.display = 'none';
        if (searchInput) searchInput.disabled = false;
        if (openModalBtn) openModalBtn.disabled = false;
    }

    function showError(message = 'Failed to connect to database. Please try again later.') {
        if (errorMessage) {
            errorMessage.querySelector('p').textContent = message;
            errorMessage.style.display = 'block';
        }
        if (placeholderText) placeholderText.style.display = 'none';
        if (resultsContainer) resultsContainer.style.display = 'none';
    }

    function hideError() {
        if (errorMessage) errorMessage.style.display = 'none';
    }

    // --- API FUNCTIONS ---
    async function fetchExplosiveData() {
        try {
            showLoading();
            hideError();

            // CORRECTED: Appending action parameter only for GET requests
            const response = await fetch(`${GOOGLE_SCRIPT_BASE_URL}?action=getData`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                explosiveData = data.data;
                console.log('Data loaded successfully:', explosiveData.length, 'records');
            } else {
                throw new Error(data.error || 'Failed to fetch data');
            }

        } catch (error) {
            console.error('Error fetching data:', error);
            showError('Failed to load explosives database. Please check your internet connection and try again.');
            explosiveData = getFallbackData(); // Use fallback data if API fails
        } finally {
            hideLoading();
        }
    }

    async function addExplosiveData(explosiveItem) {
        try {
            showLoading();

            // CORRECTED: Using base URL directly for POST requests
            const response = await fetch(GOOGLE_SCRIPT_BASE_URL, {
                method: 'POST',
                redirect: 'follow',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    action: 'addData', // Action sent in the body for POST
                    data: explosiveItem
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                // Add to local data immediately for better UX
                explosiveData.push(explosiveItem);
                explosiveData.sort((a, b) => a.code.localeCompare(b.code));
                return true;
            } else {
                throw new Error(result.error || 'Failed to add data');
            }

        } catch (error) {
            console.error('Error adding data:', error);
            throw error; // Re-throw to be caught by the form submit handler
        } finally {
            hideLoading();
        }
    }

    // --- FALLBACK DATA (as provided in your script.js) ---


    // --- SEARCH & AUTOCOMPLETE (Code as previously provided by you, no changes needed here) ---
    searchInput.addEventListener('input', function() {
        const value = this.value;
        closeAllLists();
        if (!value || isLoading) return false;
        hideError();
        let matches = explosiveData.filter(item => item.code.toUpperCase().includes(value.toUpperCase()));
        matches.forEach(item => {
            let div = document.createElement("DIV");
            const matchIndex = item.code.toUpperCase().indexOf(value.toUpperCase());
            const beforeMatch = item.code.substring(0, matchIndex);
            const matchText = item.code.substring(matchIndex, matchIndex + value.length);
            const afterMatch = item.code.substring(matchIndex + value.length);
            div.innerHTML = `${beforeMatch}<strong>${matchText}</strong>${afterMatch}`;
            div.addEventListener('click', function() {
                searchInput.value = item.code;
                displayResult(item);
                closeAllLists();
            });
            autocompleteList.appendChild(div);
        });
    });

    function displayResult(item) {
        document.getElementById('result-title').innerText = `Hazard Division ${item.code}`;
        // Ensure these elements exist in index.html, if not already:
        document.getElementById('result-compatibility-group').innerText = item.compatibilityGroup || 'N/A';
        document.getElementById('result-subdivision').innerText = item.subDivision || 'N/A';
        document.getElementById('result-description').innerText = item.description;

        const compatibility = item.compatibleExplosives ? item.compatibleExplosives : "None specified";
        document.getElementById('result-compatibility').innerText = compatibility;

        if (placeholderText) placeholderText.style.display = 'none';
        hideError(); // Hide any error message
        if (resultsContainer) resultsContainer.style.display = 'block';
    }

    function closeAllLists() {
        while (autocompleteList.firstChild) {
            autocompleteList.removeChild(autocompleteList.firstChild);
        }
    }

    document.addEventListener('click', function (e) {
        if (e.target !== searchInput) {
            closeAllLists();
        }
    });

    // --- MODAL & FORM HANDLING (Code as previously provided by you, with minor error handling additions) ---
    openModalBtn.onclick = function() {
        if (!isLoading) {
            modal.style.display = "block";
        }
    }

    closeBtn.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    addExplosiveForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (isLoading) return;

        const newCode = document.getElementById('addCode').value.toUpperCase().trim();
        const newCompatibilityGroup = document.getElementById('addCompatibilityGroup').value.toUpperCase().trim(); // Ensure this input exists in index.html
        const newSubDivision = document.getElementById('addSubDivision').value.trim(); // Ensure this input exists in index.html
        const newDescription = document.getElementById('addDescription').value.trim();
        const newCompatible = document.getElementById('addCompatible').value.trim();

        // Validation
        if (!newCode || !newDescription || !newCompatibilityGroup || !newSubDivision) {
            alert('Please fill out all required fields (Classification Code, Compatibility Group, Sub Division, and Description).');
            return;
        }

        // Check for duplicates
        const existing = explosiveData.find(item => item.code === newCode);
        if (existing) {
            alert(`Error: Classification code '${newCode}' already exists in the database.`);
            return;
        }

        const newExplosive = {
            code: newCode,
            compatibilityGroup: newCompatibilityGroup,
            subDivision: newSubDivision,
            description: newDescription,
            compatibleExplosives: newCompatible
        };

        try {
            // Disable form inputs during submission
            const formInputs = addExplosiveForm.querySelectorAll('input, textarea, button');
            formInputs.forEach(input => input.disabled = true);

            await addExplosiveData(newExplosive); // Call the async function to add data

            alert(`Explosive ${newExplosive.code} has been added successfully!`);
            addExplosiveForm.reset();
            modal.style.display = "none";
            // Re-fetch data to update the local `explosiveData` array and reflect changes
            await fetchExplosiveData();

        } catch (error) {
            alert(`Failed to add explosive: ${error.message}`);
        } finally {
            // Re-enable form inputs
            const formInputs = addExplosiveForm.querySelectorAll('input, textarea, button');
            formInputs.forEach(input => input.disabled = false);
        }
    });

    // --- INITIALIZATION ---
    async function initialize() {
        console.log('Initializing Explosives Database...');

        // Check if Google Apps Script URL is configured correctly (base URL only)
        if (GOOGLE_SCRIPT_BASE_URL.includes('YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE')) { // Check for placeholder
             console.warn('Google Apps Script URL not configured. Using fallback data.');
            explosiveData = getFallbackData();
            hideLoading();
            showError('Google Sheets integration not configured. Using offline data.');
            return;
        }

        await fetchExplosiveData();
    }

    // Start the application
    initialize();
});
