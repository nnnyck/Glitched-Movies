document.addEventListener('DOMContentLoaded', function () {
  const api_key = '42b154929c7ff4e46d6e64691b911d37';
  const base_url = 'https://api.themoviedb.org/3';
  const popularEndpoint = '/movie/popular';
  const detailsEndpoint = '/movie/';

  // Array de IDs dos elementos div (cards)
  const cardIds = ['movie1', 'movie2', 'movie3', 'movie4'];

  // Verifica se os dados já estão armazenados em localStorage
  const cachedData = localStorage.getItem('cachedMovieData');
  if (cachedData) {
      // Utiliza os dados armazenados localmente
      const parsedData = JSON.parse(cachedData);
      updateMovieCards(parsedData);
  } else {
      // Faz a requisição à API do TMDb se os dados não estiverem armazenados
      fetch(`${base_url}${popularEndpoint}?api_key=${api_key}`)
          .then(response => response.json())
          .then(data => {
              // Armazena os dados localmente
              localStorage.setItem('cachedMovieData', JSON.stringify(data));
              // Atualiza os cards com as informações dos filmes
              updateMovieCards(data);
          })
          .catch(error => console.error('Erro ao obter dados da API do TMDb:', error));
  }

  function updateMovieCards(data) {
      data.results.slice(0, 4).forEach((movie, index) => {
          const posterPath = movie.poster_path;
          const title = movie.title;
          const genres = getGenresNames(movie.genre_ids);
          const rating = formatRating(movie.vote_average);
          const movieId = movie.id;

          const imageUrl = `https://image.tmdb.org/t/p/w500/${posterPath}`;

          const cardElement = document.getElementById(cardIds[index]);
          const imgElement = cardElement.querySelector('.movie-poster');
          const titleElement = cardElement.querySelector('.movie-title');
          const genresElement = cardElement.querySelector('.movie-genres');
          const ratingElement = cardElement.querySelector('.movie-rating');
          const runtimeElement = cardElement.querySelector('.movie-runtime');

          imgElement.src = imageUrl;
          imgElement.alt = 'Movie Poster';

          // Adiciona o título e gêneros
          titleElement.textContent = title;
          genresElement.textContent = `Genres: ${genres.join(', ')}`;

          // Criar um elemento span para a bolinha amarela
          const yellowDot = document.createElement('span');
          yellowDot.className = 'yellow-dot';
          ratingElement.appendChild(yellowDot);

          // Adiciona a avaliação IMDb
          ratingElement.innerHTML += ` IMDb ${rating}/10`;

          // Faz a solicitação para obter os detalhes do filme (incluindo runtime)
          fetch(`${base_url}${detailsEndpoint}${movieId}?api_key=${api_key}`)
              .then(response => response.json())
              .then(movieDetails => {
                  const runtime = movieDetails.runtime;

                  // Adiciona o ícone do relógio e a duração ao elemento runtime
                  runtimeElement.innerHTML = `<i class="fa-regular fa-clock" style="color: #000000;"></i> ${runtime} minutos`;
              })
              .catch(error => console.error('Erro ao obter detalhes do filme:', error));
      });
  }

  function getGenresNames(genreIds) {
      // Mapeia os IDs de gêneros para seus respectivos nomes
      const genreNames = {
          16: 'Animação',
          10751: 'Família',
          10402: 'Música',
          14: 'Fantasia',
          35: 'Comédia',
          878: 'Ficção Científica',
          28: 'Ação',
          53: 'Suspense',
          18: 'Drama',
          36: 'História',
          27: 'Terror',
          9648: 'Mistério',
          // Adicione mais conforme necessário
      };

      // Obtém os nomes dos gêneros com base nos IDs fornecidos, limitando a dois gêneros
      return genreIds.slice(0, 2).map(id => genreNames[id]).filter(Boolean);
  }

  function formatRating(rating) {
      // Formata a avaliação para mostrar apenas um número decimal
      return rating.toFixed(1);
  }
});
