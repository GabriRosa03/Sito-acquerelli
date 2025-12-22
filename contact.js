// Contact form & Painting Selector functionality
document.addEventListener('DOMContentLoaded', function () {
    const paintingGrid = document.getElementById('painting-grid');
    const paintingInput = document.getElementById('painting');
    const contactForm = document.getElementById('contact-form');
    const toggleBtn = document.getElementById('toggle-selector');
    const selectorContent = document.getElementById('selector-content');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const pageNum = document.getElementById('page-num');
    const feedback = document.getElementById('selection-feedback');

    let currentPage = 1;
    const itemsPerPage = 6;
    let selectedPaintings = []; // Changed to array for multi-selection

    // Toggle Collapsible Section
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isCollapsed = selectorContent.classList.toggle('collapsed');
            toggleBtn.classList.toggle('active', !isCollapsed);
        });
    }

    // Initialize Grid
    function renderGrid(page) {
        if (!paintingGrid || typeof paintings === 'undefined') return;

        paintingGrid.innerHTML = '';
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = paintings.slice(start, end);

        currentItems.forEach((painting) => {
            const gridItem = document.createElement('div');
            gridItem.className = 'painting-grid-item';

            // Use src as a unique identifier because titles might be duplicates
            const isSelected = selectedPaintings.some(p => p.src === painting.src);
            if (isSelected) {
                gridItem.classList.add('selected');
            }

            gridItem.innerHTML = `
                <img src="${painting.src}" alt="${painting.alt}">
                <p class="painting-grid-title">${painting.title}</p>
            `;

            gridItem.addEventListener('click', () => {
                const index = selectedPaintings.findIndex(p => p.src === painting.src);

                if (index > -1) {
                    // Already selected, so DESELECT
                    selectedPaintings.splice(index, 1);
                    gridItem.classList.remove('selected');
                } else {
                    // Not selected, so ADD to selection
                    selectedPaintings.push(painting);
                    gridItem.classList.add('selected');
                }

                updateFeedback();
            });

            paintingGrid.appendChild(gridItem);
        });

        // Update Pagination Controls
        pageNum.textContent = page;
        prevBtn.disabled = page === 1;
        nextBtn.disabled = end >= paintings.length;
    }

    function updateFeedback() {
        if (selectedPaintings.length === 0) {
            feedback.textContent = '';
            paintingInput.value = '';
        } else {
            const titles = selectedPaintings.map(p => p.title);
            feedback.textContent = `Hai selezionato: ${titles.join(', ')}`;
            paintingInput.value = titles.join(', ');
        }
    }

    // Pagination Click Listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderGrid(currentPage);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(paintings.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                renderGrid(currentPage);
            }
        });
    }

    // Initial Render
    if (typeof paintings !== 'undefined') {
        renderGrid(currentPage);

        updateFeedback();
    }

    // Form Submission with FormSubmit.co (AJAX)
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('--- Form submit event triggered ---');

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Invio in corso...';
            submitBtn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // Prepare description of selected paintings
            // If no paintings are selected, mention it explicitly or leave empty
            let paintingsList = "Nessun quadro selezionato";
            if (selectedPaintings && selectedPaintings.length > 0) {
                paintingsList = selectedPaintings.map(p => `- ${p.title}`).join('\n');
            }

            // Data to send
            const data = {
                _subject: `Nuovo messaggio da ${name} - Sito Acquerelli`,
                _template: "box", // 'box' invia una mail più ordinata rispetto a 'table'
                _captcha: "false",
                _replyto: email, // Fondamentale per far funzionare il tasto "Rispondi" se rinominiamo il campo email

                // I nomi di queste proprietà saranno le "etichette" nella mail che ricevi
                "Nome Cliente": name,
                "Indirizzo Email": email,
                "Messaggio": message,
                "Quadri Selezionati": paintingsList
            };

            console.log('Preparing to send data:', data);

            fetch("https://formsubmit.co/ajax/drixtrb@gmail.com", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
                .then(response => {
                    console.log('Server responded with status:', response.status);
                    return response.json();
                })
                .then(data => {
                    console.log('Response body parsed:', data);
                    console.log('Success:', data);
                    alert('Messaggio inviato con successo! Riceverai una risposta presto.');

                    // Reset UI
                    contactForm.reset();
                    selectedPaintings = [];
                    paintingInput.value = '';
                    updateFeedback();
                    document.querySelectorAll('.painting-grid-item').forEach(item => item.classList.remove('selected'));
                })
                .catch((error) => {
                    console.error('Fetch error:', error);
                    alert('C\'è stato un errore nell\'invio del messaggio. Per favore riprova o scrivi direttamente a gabrielerosa1783@gmail.com');
                })
                .finally(() => {
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
        });
    }
});
