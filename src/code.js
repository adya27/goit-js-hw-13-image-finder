import listTemplate from "./templates/list.hbs";
import buttonLoadMore from "./templates/buttonLoadMore.hbs";
import * as basicLightbox from "basiclightbox";

const searchBtn = document.querySelector(".searchBtn");
const form = document.querySelector(".js-search-form");
let bodyItem = document.querySelector(".js-gallery");
let previos = "";
let pageNumber = 1;
let scrollY;

// form.addEventListener("submit", onSubmitBtnClick);

async function fetchIt(keyword, pageNumber) {
  let url = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${keyword}&page=${pageNumber}&per_page=12&key=17537629-2ee3a1e1cfb1c48a1e1039472`;

  const data = await fetch(url);

  console.log(data);
}

fetchIt("s", 1);
