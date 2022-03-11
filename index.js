const key = config.API_KEY;

function fetchData() {
  let ingredients = '&ingredients=';
  const formIngredients = document.getElementById('ingredients').value;
  const ingredientArray = formIngredients.split(' ');

  for (let i = 0; i < ingredientArray.length; i++) {
    if (i === 0) {
      ingredients += `${ingredientArray[0]},`;
    } else if (i === ingredientArray.length - 1) {
      ingredients += `+${ingredientArray[i]}`;
    } else {
      ingredients += `+${ingredientArray[i]},`;
    }
  }

  const formNumber = document.getElementById('number-of-recipes').value;
  const number = `&number=${formNumber}`;

  // defaults ranking to 1, but changes it if other option is selected
  let ranking = `&ranking=${2}`;
  const radioButtons = document.getElementsByName('ranking');
  if (radioButtons[0].checked) {
    ranking = `&ranking=${1}`;
  }

  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${key}${ingredients}${number}${ranking}`;
  console.log(apiUrl);
  fetch(apiUrl, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => renderData(data));
}

function renderData(data) {
  console.log(data);
}

const form = document.getElementById('recipe-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchData();
});
