var imgs = Array.from(document.querySelectorAll('.item img'));
var lightboxContainer = document.querySelector('.lightbox-container');
var lightboxItem = document.querySelector('.lightbox-item');
var closeIcone = document.getElementById('close');
var prevIcone = document.getElementById('prev');
var nextIcone = document.getElementById('next');
// var imgArr = [];
var currentIndex = 0;

for (let i = 0; i < imgs.length; i++) {
    // imgArr.push(imgs[i]);
    imgs[i].addEventListener('click' , function(eventInfo){
        openSlider(eventInfo)
    })
}

function openSlider(eventInfo) {
    // console.log(imgs.indexOf(eventInfo.target)); // imgs.indexOf is not a function
    // console.log(imgArr.indexOf(eventInfo.target));
    currentIndex = imgs.indexOf(eventInfo.target);
    var currentSrc = eventInfo.target.src;
    lightboxContainer.style.display = 'flex';
    lightboxItem.style.backgroundImage = `url(${currentSrc})`;
}

closeIcone.addEventListener('click' , closeSlider)

function closeSlider(){
    lightboxContainer.style.display = 'none';
}

nextIcone.addEventListener('click' , getNextSlide);
function getNextSlide(){
    currentIndex++;
    if(currentIndex == imgs.length){
        currentIndex = 0;
    }
    var currentSrc = imgs[currentIndex].src;
    lightboxItem.style.backgroundImage = `url(${currentSrc})`;
}

prevIcone.addEventListener('click' , getPrevSlide);
function getPrevSlide(){
    currentIndex--;
    if(currentIndex < 0){
        currentIndex = imgs.length - 1;
    }
    var currentSrc = imgs[currentIndex].src;
    lightboxItem.style.backgroundImage = `url(${currentSrc})`;
}

document.addEventListener('keydown' , function(e){
    // console.log(e);
    if(e.key == 'ArrowRight'){
        getNextSlide();
    } else if(e.key == 'ArrowLeft'){
        getPrevSlide();
    } else if(e.key == 'Escape') {
        closeSlider();
    }
})

// ------------------------------------------------------

var links = document.querySelectorAll('.navbar .nav-link');
var recipes = [];

for (let i = 0; i < links.length; i++) {
    links[i].addEventListener('click',function(e){
        console.log(e.target.text);
        getRecipes(e.target.text);
    })
}

getRecipes('pizza');
function getRecipes(meal) {
    var httpRequest = new XMLHttpRequest(); // NEW Instance
    httpRequest.open(`GET`, `https://forkify-api.herokuapp.com/api/search?q=${meal}`);
    httpRequest.send();
    httpRequest.addEventListener('readystatechange', function () {
        // console.log(httpRequest.readyState); // 2 3 4
        if (httpRequest.readyState == 4 && httpRequest.status == 200) {
            recipes = JSON.parse(httpRequest.response).recipes;
            console.log(recipes);
            displayData();
        }
    })
}

function displayData(){
    var cols = ``;
    for(var i=0 ; i<recipes.length ; i++){
        cols += 
        `
        <div class="col-md-3">
                <div class="post">       
                    <img class="w-100 recipes-img" src="${recipes[i].image_url}" />
                    <h2>${recipes[i].publisher}</h2>
                    <h4>${recipes[i].title}</h4>
                    <h5>${recipes[i].recipe_id}</h5>
                    <h5>${recipes[i].social_rank}</h5>
                    <a target="_blank" href="${recipes[i].source_url}" class="btn btn-info ">Source</a>
                    <a target="_blank" href="${recipes[i].publisher_url}" class="btn btn-success ">Details</a>
                    <a onclick='getReceipesDetails(${recipes[i].recipe_id})' data-bs-toggle="modal" data-bs-target="#receipesData" class="btn btn-warning ">Details</a>
                </div>
            </div>
        `
    }
    document.getElementById('recipesData').innerHTML = cols;
}

async function getReceipesDetails(receipeId){
    var response = await fetch(`https://forkify-api.herokuapp.com/api/get?rId=${receipeId}`);
    var receipesData = await response.json();
    // console.log(receipesData);
    var receipesData = receipesData.recipe;
    var receipe = 
    `
    <img class="w-100 recipes-img" src="${receipesData.image_url}" />
    <h3>${receipesData.publisher}</h3>
    <h5>${receipesData.title}</h5>
    `
    document.getElementById('receipesInfo').innerHTML = receipe;
}