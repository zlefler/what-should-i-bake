document.getElementById('recipe-form')!.addEventListener('submit', (e) => {
  e.preventDefault();
  handleClick();
});

function handleClick(): void {
  const key = config.API_KEY;
  const ingredients = parseIngredients();
  const ranking = parseRanking();
  const pantry = parsePantry();
  const formNumber = (<HTMLInputElement>document.getElementById('number-of-recipes'))!.value;
  const number = `&number=${formNumber}`;

  const apiUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${key}${ingredients}${number}${ranking}${pantry}`;

  const counter = document.querySelector('#counter');
  let x = parseInt(counter!.innerHTML);
  x += 1;
  counter!.innerHTML = x.toString();

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      renderData(data);
    });
}

// appends ingredients to URL with proper syntax
function parseIngredients() {
  let ingredients = '&ingredients=';
  const formIngredients = (<HTMLInputElement>document.getElementById('ingredients'))!.value;
  let ingredientArray = formIngredients.split(', ');

  ingredientArray.forEach((ingredient) => {
    console.log(ingredient);
    ingredient = ingredient.replaceAll(' ', '%20');
    if (ingredient === ingredientArray[0]) {
      ingredients += `${ingredient},`;
    } else if (ingredient === ingredientArray[-1]) {
      ingredients += `+${ingredient}`;
    } else {
      ingredients += `+${ingredient},`;
    }
  });

  // for (let i = 0; i < ingredientArray.length; i++) {
  //   ingredientArray[i] = ingredientArray[i].replaceAll(' ', '%20');
  //   if (i === 0) {
  //     ingredients += `${ingredientArray[0]},`;
  //   } else if (i === ingredientArray.length - 1) {
  //     ingredients += `+${ingredientArray[i]}`;
  //   } else {
  //     ingredients += `+${ingredientArray[i]},`;
  //   }
  // }

  return ingredients;
}

// defaults ranking to 1, but changes it if other option is selected
function parseRanking() {
  let ranking = `&ranking=${2}`;
  const rankingButtons = document.getElementsByName('ranking');
  if (rankingButtons[0].checked) {
    ranking = `&ranking=${1}`;
  }
  return ranking;
}

// same for pantry staples
function parsePantry() {
  let pantry = `&ignorePantry=${true}`;
  const pantryButtons = document.getElementsByName('pantry');
  if (pantryButtons[0].checked) {
    pantry = `&ignorePantry=${false}`;
  }
  return pantry;
}

function renderData(data) {
  clearSection();
  const section = document.createElement('section');
  section.id = 'results-list';
  data.forEach(
    ({ id, image, title, missedIngredients, missedIngredientCount }) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style = 'width: 20rem';

      const recipeImage = document.createElement('img');
      recipeImage.className = 'card-img-top';
      recipeImage.src = image;
      card.appendChild(recipeImage);

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body mt-2';

      const recipeName = document.createElement('h3');
      recipeName.innerText = title;
      recipeName.className = 'card-title';
      cardBody.appendChild(recipeName);

      if (missedIngredientCount) {
        cardBody.appendChild(parseMissedIngredients(missedIngredients));
      }

      const linkButton = document.createElement('a');
      linkButton.href = `https://spoonacular.com/recipes/${title.replaceAll(
        ' ',
        '-'
      )}-${id}`;
      linkButton.target = '_blank';
      linkButton.innerText = 'Go To Recipe';
      linkButton.className = 'btn btn-primary';

      cardBody.appendChild(linkButton);
      card.appendChild(cardBody);
      section.appendChild(card);
      const formSection = document.getElementById('form-section');
      formSection.after(section);
    }
  );
}

function parseMissedIngredients(data) {
  if (data.length === 1) {
    const p = document.createElement('p');
    p.innerText = `You will still need ${data[0].original} for this recipe.`;
    p.className = 'card-text';
    return p;
  } else if ((data.length = 2)) {
    const p = document.createElement('p');
    p.innerText = `You will still need ${data[0].original} and ${data[1].original} for this recipe.`;
    p.className = 'card-text';
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

const currentYear = new Date().getFullYear();
const pFooter = document.createElement('p');
pFooter.innerText = `© ${currentYear} Bakely Industries`;
document.querySelector('footer').appendChild(pFooter);

function clearSection() {
  if (document.getElementById('results-list')) {
    const oldSection = document.getElementById('results-list');
    oldSection.remove();
  }
}