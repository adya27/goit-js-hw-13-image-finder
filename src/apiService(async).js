import listTemplate from "./templates/list.hbs";
import buttonLoadMore from "./templates/buttonLoadMore.hbs";
import * as basicLightbox from "basiclightbox";

const searchBtn = document.querySelector(".searchBtn");
const form = document.querySelector(".js-search-form");
let bodyItem = document.querySelector(".js-gallery");
let previos = "";
let pageNumber = 1;
let scrollY;

form.addEventListener("submit", onSubmitBtnClick);

async function fetchIt(keyword = "error", pageNumber) {
  let url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${keyword}&page=${pageNumber}&per_page=12&key=17537629-2ee3a1e1cfb1c48a1e1039472`;
  const urlFetch = await fetch(url);
  const response = await urlFetch.json();
  const src = await response.hits;

  return src;
}

function markupFirstSearch(keyword, pageNumber) {
  //   let bodyItem = document.querySelector(".js-gallery");

  fetchIt(keyword, pageNumber)
    .then((src) => {
      bodyItem.innerHTML = listTemplate(src);
    })
    .then(createLoadMoreBtn)
    .then(createListener);
}

function onSubmitBtnClick(event) {
  event.preventDefault();
  let query = form.elements.query.value;
  if (previos === query) {
    pageNumber += 1;
  } else {
    pageNumber = 1;
  }
  markupFirstSearch(query, pageNumber);

  previos = query;
  scrollY = 300;
}

function createLoadMoreBtn() {
  bodyItem.insertAdjacentHTML("beforeend", buttonLoadMore());
  let loadMoreBtn = document.querySelector(".js-loadMoreBtn");

  //   console.log("createLoadMoreBtn -> loadMoreBtn", loadMoreBtn);
  loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

  // let loadBtn = document.createElement("button");
}

function onLoadMoreBtnClick(e) {
  e.preventDefault();
  console.log("onLoadMoreBtnClick");
  let query = form.elements.query.value;
  console.log("onLoadMoreBtnClick -> query", query);
  pageNumber += 1;

  markupMoreSearch(query, pageNumber).then(() => setTimeout(scroll, 1000));

  //   createLoadMoreBtn();
}

function scroll() {
  scrollY += window.innerHeight;
  console.log(scrollY);
  window.scrollTo({
    top: scrollY,
    left: 0,
    behavior: "smooth",
  });
}

function markupMoreSearch(keyword, pageNumber) {
  //   let bodyItem = document.querySelector(".js-gallery");

  return fetchIt(keyword, pageNumber)
    .then((src) => {
      console.log(src);
      bodyItem.insertAdjacentHTML("beforeend", listTemplate(src));
    })
    .then(() => {
      deleteOldLoadMoreBtn();
      createLoadMoreBtn();
      createListener();
    });
}

function deleteOldLoadMoreBtn() {
  let loadMoreBtn = document.querySelector(".js-loadMoreBtn");

  loadMoreBtn.remove();
}

function createListener() {
  const allGalleryCards = document.querySelector(".js-gallery");
  console.log("createListener -> allGalleryCards", allGalleryCards);

  allGalleryCards.addEventListener("click", onCardClick);
}

function onCardClick(e) {
  if (e.target.nodeName === "IMG") {
    console.log(e.target.dataset.large);

    const instance = basicLightbox.create(`
 <img src=${e.target.dataset.large} alt=${e.target.dataset.large}/>
`);

    instance.show();
  }
}
