const key = config.API_KEY;

function fetchData(e) {
  fetch(`https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&`, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => renderData(data));
}

function renderData(data) {
  const recipes = data.results;
  console.log(recipes);
}

const form = document.getElementById('recipe-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchData(e);
});
