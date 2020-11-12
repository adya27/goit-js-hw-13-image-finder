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

  // console.log("fetchIt -> src", src);
  return src;
}

async function markupFirstSearch(keyword, pageNumber) {
  let canFetch = true;

  const src = await fetchIt(keyword, pageNumber);

  galleryItem.innerHTML = listTemplate(src);

  const sentinel = document.querySelector("#sentinel");
  infiniteLoad();
}

function onSubmitBtnClick(event) {
  event.preventDefault();
  let query = form.elements.query.value;

  pageNumber = 1;

  markupFirstSearch(query, pageNumber);

  previos = query;
  scrollY = 0;
}

async function markupMoreSearch(keyword, pageNumber) {
  pageNumber += 1;
  const src = await fetchIt(keyword, pageNumber);
  if (src.length >= 12) {
    galleryItem.insertAdjacentHTML("beforeend", listTemplate(src));
    createListener();
  }

  return src.length;
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

function infiniteLoad() {
  sentinel.classList.add("sentinel");

  // console.log("infiniteLoad -> sentinel", sentinel);

  const sentinelC = document.querySelector(".sentinel");

  const observer = new IntersectionObserver(callback, options);
  observer.observe(sentinelC);
  const options = {};

  function callback(entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let query = form.elements.query.value;
        // console.log("onLoadMoreBtnClick -> query", query);
        pageNumber += 1;

        markupMoreSearch(query, pageNumber).then((len) => {
          if (len < 12) {
            observer.unobserve(sentinelC);
          }
        });
      }
    });
  }
}
