const apiKey = '42b154929c7ff4e46d6e64691b911d37'; 

function searchMedia() {
  const query = document.getElementById('search').value;
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;

  $.ajax({
    url: url,
    method: 'GET',
    success: function (data) {
      displayResults(data.results);
    },
    error: function (error) {
      console.error('Error fetching data:', error);
    }
  });
}

function displayResults(results) {
  const resultsContainer = document.getElementById('results');
  resultsContainer.innerHTML = '';

  if (results.length === 0) {
    resultsContainer.innerHTML = '<p>No results found</p>';
    return;
  }

  results.forEach(media => {
    const mediaElement = document.createElement('div');
    let mediaType = media.media_type === 'movie' ? 'Movie' : 'TV Show';
    mediaElement.innerHTML = `<h2>${mediaType}: ${media.title || media.name}</h2><p>${media.overview}</p>`;
    resultsContainer.appendChild(mediaElement);
  });
}