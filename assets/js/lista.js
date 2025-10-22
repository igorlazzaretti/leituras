document.addEventListener('DOMContentLoaded', function() {
  // Cole aqui a URL gerada pelo "Publicar na web"
  const GOOGLE_SHEETS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQDqwNI58atBcOAe4UQlb9RSEvfDdFxH9b2R35rriNHh0mETJipv_vetmPPBqpAb5A1yOC2DNyEV9R5/pub?gid=0&single=true&output=csv';

  const portfolioContainer = document.querySelector('.isotope-container');

  /**
   * Converte o texto CSV em um array de objetos.
   * @param {string} csvText O texto completo do arquivo CSV.
   * @returns {Array<Object>} Um array de objetos, onde cada objeto representa um livro.
   */
  function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(header =>
      header.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')
    );

    const data = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const entry = {};
      headers.forEach((header, index) => {
        entry[header] = values[index] ? values[index].trim() : '';
      });
      data.push(entry);
    }
    return data;
  }

  if (!portfolioContainer) {
    console.error('Container do portfólio não encontrado.');
    return;
  }

  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.style.display = 'block';
  }

  fetch(GOOGLE_SHEETS_CSV_URL)
    .then(response => response.text())
    .then(csvText => {
      const data = parseCSV(csvText);

    console.log(data)
      portfolioContainer.innerHTML = '';

      data.forEach(livro => {
        // Transforma a string de gêneros (ex: "romance policial") em uma lista de classes (ex: "filter-romance filter-policial")
        const generosClasses = livro.generos
          ? livro.generos
              .trim()
              .toLowerCase()
              .split(/\s+/) // Divide a string por um ou mais espaços
              .map(g => `filter-${g.normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`) // Adiciona "filter-" a cada gênero
              .join(' ') // Junta tudo em uma única string de classes
          : 'filter-geral';

        const livroItem = `
          <div class="col-lg-4 col-md-6 portfolio-item isotope-item ${generosClasses}">
            <img src="${livro.imagem1 || 'assets/img/hogwarts-library-1.webp'}" class="img-fluid" alt="${livro.titulo}">
            <div class="portfolio-info">
              <h4>${livro.titulo}</h4>
              <p>${livro.autor}</p>
              <p>${livro.status}</p>
              <a href="${livro.imagem2 || livro.imagem1 || 'assets/img/hogwarts-library-1.webp'}" title="${livro.titulo}" data-gallery="portfolio-gallery-app" class="glightbox preview-link">
                <i class="bi bi-zoom-in"></i>
              </a>
            </div>
          </div>
        `;
        portfolioContainer.insertAdjacentHTML('beforeend', livroItem);
      });

      if (window.GLightbox) {
        GLightbox({
          selector: '.glightbox'
        });
      }

      imagesLoaded(portfolioContainer, function() {
        const isotope = new Isotope(portfolioContainer, {
          itemSelector: '.isotope-item',
          layoutMode: 'masonry'
        });

        const filters = document.querySelectorAll('.isotope-filters li');
        filters.forEach(function(filter) {
          filter.addEventListener('click', function() {
            portfolioContainer.parentElement.querySelector('.filter-active').classList.remove('filter-active');
            this.classList.add('filter-active');

            isotope.arrange({
              filter: this.getAttribute('data-filter')
            });
          });
        });
      });
    })
    .catch(error => console.error('Erro ao buscar dados do Google Sheets:', error))
    .finally(() => {
      if (preloader) {
        preloader.style.display = 'none';
      }
    });
});
