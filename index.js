document.getElementById('recipe-form').addEventListener('submit', function (e) {
    e.preventDefault();
    handleClick();
});
function handleClick() {
    var key = config.API_KEY;
    var ingredients = parseIngredients();
    var ranking = parseRanking();
    var pantry = parsePantry();
    var formNumber = document.getElementById('number-of-recipes').value;
    var number = "&number=".concat(formNumber);
    var apiUrl = "https://api.spoonacular.com/recipes/findByIngredients?apiKey=".concat(key).concat(ingredients).concat(number).concat(ranking).concat(pantry);
    var counter = document.querySelector('#counter');
    var x = parseInt(counter.innerHTML);
    x += 1;
    counter.innerHTML = x.toString();
    fetch(apiUrl)
        .then(function (res) { return res.json(); })
        .then(function (data) {
        renderData(data);
    });
}
// appends ingredients to URL with proper syntax
function parseIngredients() {
    var ingredients = '&ingredients=';
    var formIngredients = document.getElementById('ingredients').value;
    var ingredientArray = formIngredients.split(', ');
    ingredientArray.forEach(function (ingredient) {
        console.log(ingredient);
        ingredient = ingredient.replaceAll(' ', '%20');
        if (ingredient === ingredientArray[0]) {
            ingredients += "".concat(ingredient, ",");
        }
        else if (ingredient === ingredientArray[-1]) {
            ingredients += "+".concat(ingredient);
        }
        else {
            ingredients += "+".concat(ingredient, ",");
        }
    });
    return ingredients;
}
// defaults ranking to 1, but changes it if other option is selected
function parseRanking() {
    var ranking = "&ranking=".concat(2);
    var rankingButtons = document.getElementsByName('ranking');
    if (rankingButtons[0].checked) {
        ranking = "&ranking=".concat(1);
    }
    return ranking;
}
// same for pantry staples
function parsePantry() {
    var pantry = "&ignorePantry=".concat(true);
    var pantryButtons = document.getElementsByName('pantry');
    if (pantryButtons[0].checked) {
        pantry = "&ignorePantry=".concat(false);
    }
    return pantry;
}
function renderData(data) {
    clearSection();
    var section = document.createElement('section');
    section.id = 'results-list';
    data.forEach(function (_a) {
        var id = _a.id, image = _a.image, title = _a.title, missedIngredients = _a.missedIngredients, missedIngredientCount = _a.missedIngredientCount;
        var card = document.createElement('div');
        card.className = 'card';
        card.setAttribute('style', 'width: 20rem');
        var recipeImage = document.createElement('img');
        recipeImage.className = 'card-img-top';
        recipeImage.src = image;
        card.appendChild(recipeImage);
        var cardBody = document.createElement('div');
        cardBody.className = 'card-body mt-2';
        var recipeName = document.createElement('h3');
        recipeName.innerText = title;
        recipeName.className = 'card-title';
        cardBody.appendChild(recipeName);
        if (missedIngredientCount) {
            cardBody.appendChild(parseMissedIngredients(missedIngredients));
        }
        var linkButton = document.createElement('a');
        linkButton.href = "https://spoonacular.com/recipes/".concat(title.replaceAll(' ', '-'), "-").concat(id);
        linkButton.target = '_blank';
        linkButton.innerText = 'Go To Recipe';
        linkButton.className = 'btn btn-primary';
        cardBody.appendChild(linkButton);
        card.appendChild(cardBody);
        section.appendChild(card);
        var formSection = document.getElementById('form-section');
        formSection.after(section);
    });
}
function parseMissedIngredients(data) {
    if (data.length === 1) {
        var p = document.createElement('p');
        p.innerText = "You will still need ".concat(data[0].original, " for this recipe.");
        p.className = 'card-text';
        return p;
    }
    else if ((data.length = 2)) {
        var p = document.createElement('p');
        p.innerText = "You will still need ".concat(data[0].original, " and ").concat(data[1].original, " for this recipe.");
        p.className = 'card-text';
        return p;
    }
    else {
        var span = document.createElement('span');
        var ul_1 = document.createElement('ul');
        data.forEach(function (el) {
            var li = document.createElement('li');
            li.innerText = el.original;
            ul_1.appendChild(li);
        });
        var p1 = document.createElement('p');
        p1.innerText = 'You will still need:';
        var p2 = document.createElement('p');
        p2.innerText = 'for this recipe.';
        span.appendChild(p1);
        span.appendChild(ul_1);
        span.appendChild(p2);
        return span;
    }
}
var currentYear = new Date().getFullYear();
var pFooter = document.createElement('p');
pFooter.innerText = "\u00A9 ".concat(currentYear, " Bakely Industries");
document.querySelector('footer').appendChild(pFooter);
function clearSection() {
    if (document.getElementById('results-list')) {
        var oldSection = document.getElementById('results-list');
        oldSection.remove();
    }
}
