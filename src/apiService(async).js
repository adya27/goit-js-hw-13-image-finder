import listTemplate from "./templates/list.hbs";
import buttonLoadMore from "./templates/buttonLoadMore.hbs";
import * as basicLightbox from "basiclightbox";

const searchBtn = document.querySelector(".searchBtn");
const form = document.querySelector(".js-search-form");
let galleryItem = document.querySelector(".js-gallery");
let bodyItem = document.querySelector("body");
let previos = "";
let pageNumber = 1;
let scrollY;

form.addEventListener("submit", onSubmitBtnClick);

async function fetchIt(keyword = "error", pageNumber) {
  let url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${keyword}&page=${pageNumber}&per_page=12&key=17537629-2ee3a1e1cfb1c48a1e1039472`;
  const urlFetch = await fetch(url);
  const response = await urlFetch.json();
  const src = await response.hits;

  console.log("fetchIt -> src", src);
  return src;
}

async function markupFirstSearch(keyword, pageNumber) {
  //   let galleryItem = document.querySelector(".js-gallery");

  const src = await fetchIt(keyword, pageNumber);

  galleryItem.innerHTML = listTemplate(src);
  // console.log("markupFirstSearch -> src.length", src.length);
  if (src.length === 12) {
    createLoadMoreBtn();
    createListener();
  }
}

function onSubmitBtnClick(event) {
  event.preventDefault();
  let query = form.elements.query.value;
  // if (previos === query) {
  //   pageNumber += 1;
  // } else {
  //   pageNumber = 1;
  // }
  pageNumber = 1;
  //
  markupFirstSearch(query, pageNumber);

  previos = query;
  scrollY = 0;
}

function createLoadMoreBtn() {
  galleryItem.insertAdjacentHTML("beforeend", buttonLoadMore());
  let loadMoreBtn = document.querySelector(".js-loadMoreBtn");

  //   console.log("createLoadMoreBtn -> loadMoreBtn", loadMoreBtn);
  loadMoreBtn.addEventListener("click", onLoadMoreBtnClick);

  // let loadBtn = document.createElement("button");
}

function onLoadMoreBtnClick(e) {
  e.preventDefault();
  // console.log("onLoadMoreBtnClick");
  let query = form.elements.query.value;
  // console.log("onLoadMoreBtnClick -> query", query);
  pageNumber += 1;

  markupMoreSearch(query, pageNumber).then(() => setTimeout(scroll, 1000));

  //   createLoadMoreBtn();
}

async function scroll() {
  scrollY += document.body.scrollHeight;
  // console.log(scrollY);
  window.scrollTo({
    top: scrollY,
    left: 0,
    behavior: "smooth",
  });
}

async function markupMoreSearch(keyword, pageNumber) {
  //   let galleryItem = document.querySelector(".js-gallery");

  const src = await fetchIt(keyword, pageNumber);
  // console.log(src);
  galleryItem.insertAdjacentHTML("beforeend", listTemplate(src));
  deleteOldLoadMoreBtn();

  if (src.length === 12) {
    createLoadMoreBtn();
    createListener();
  }
  // await scroll();
}

function deleteOldLoadMoreBtn() {
  let loadMoreBtn = document.querySelector(".js-loadMoreBtn");

  loadMoreBtn.remove();
}

function createListener() {
  const allGalleryCards = document.querySelector(".js-gallery");

  allGalleryCards.addEventListener("click", onCardClick);
}

function onCardClick(e) {
  if (e.target.nodeName === "IMG") {
    const instance = basicLightbox.create(`
 <img class="lightbox-image" src=${e.target.dataset.large} alt=${e.target.dataset.large}/>
`);

    instance.show();
    const lightboxImg = document.querySelector(".lightbox-image");
    document.body.style.overflow = "hidden";
    event.stopPropagation();
    document.addEventListener("click", onBackdropClick);
  }
}

function onBackdropClick(e) {
  document.body.style.overflow = "scroll";
  document.removeEventListener("click", onBackdropClick);
}
