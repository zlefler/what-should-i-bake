const key = config.API_KEY;

function fetchData() {
  let ingredients = '&ingredients=';
  const formIngredients = document.getElementById('ingredients').value;
  const ingredientArray = formIngredients.split(' ');

  // appends ingredients to URL with proper syntax
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
  const rankingButtons = document.getElementsByName('ranking');
  if (rankingButtons[0].checked) {
    ranking = `&ranking=${1}`;
  }
  // same for pantry staples
  let pantry = `&ignorePantry=${true}`;
  const pantryButtons = document.getElementsByName('pantry');
  if (pantryButtons[0].checked) {
    pantry = `&ignorePantry=${false}`;
  }

  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${key}${ingredients}${number}${ranking}${pantry}`;
  console.log(apiUrl);
  fetch(apiUrl, {
    headers: { 'Content-Type': 'application/json' },
  })
    .then((res) => res.json())
    .then((data) => renderData(data));
}

function renderData(data) {
  const section = document.getElementById('results-list');
  data.forEach((data) => {
    const article = document.createElement('article');
    const image = document.createElement('img');
    image.src = data.image;
    const link = document.createElement('a');
    link.href = `https://spoonacular.com/recipes/${data.title.replaceAll(
      ' ',
      '-'
    )}-${data.id}`;
    image.appendChild(link);
    article.appendChild(image);
    section.appendChild(article);
  });
}

const form = document.getElementById('recipe-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchData();
});
