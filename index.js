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

    const link = document.createElement('a');
    link.href = `https://spoonacular.com/recipes/${data.title.replaceAll(
      ' ',
      '-'
    )}-${data.id}`;

    const image = document.createElement('img');
    image.src = data.image;
    link.appendChild(image);

    const recipeName = document.createElement('h3');
    recipeName.innerText = data.title;

    if (data.missedIngredientCount) {
      article.appendChild(parseMissedIngredients(data.missedIngredients));
    }

    article.appendChild(link);
    section.appendChild(article);
  });
}

function parseMissedIngredients(data) {
  if (data.length === 1) {
    const p = document.createElement('p');
    p.innerText = `You will still need ${data[0].original} for this recipe.`;
    return p;
  } else if ((data.length = 2)) {
    const p = document.createElement('p');
    p.innerText = `You will still need ${data[0].original} and ${data[1].original} for this recipe.`;
    return p;
  } else {
    const span = document.createElement('span');
    const ul = document.createElement('ul');
    data.forEach((el) => {
      const li = document.createElement('li');
      li.innerText = el.original;
      ul.appendChild(li);
    });
    const p1 = document.createElement('p');
    p1.innerText = 'You will still need:';
    const p2 = document.createElement('p');
    p2.innerText = 'for this recipe.';
    span.appendChild(p1);
    span.appendChild(ul);
    span.appendChild(p2);
    return span;
  }
}

const form = document.getElementById('recipe-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  fetchData();
});

const currentYear = new Date().getFullYear();
const pFooter = document.createElement('p');
pFooter.innerText = `© ${currentYear} Bakely Industries`;
document.querySelector('footer').appendChild(pFooter);
