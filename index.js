const key = config.API_KEY;

fetch(
  `https://api.spoonacular.com/recipes/complexSearch?apiKey=${key}&ingredients=apples,+flour,+sugar&number=2`,
  {
    headers: { 'Content-Type': 'application/json' },
  }
)
  .then((res) => res.json())
  .then((data) => renderData(data));

function renderData(data) {
  const recipes = data.results;
  console.log(recipes);
}
