import { fetchImages } from './js/pixabay-api';
import { renderImages } from './js/render-functions';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('#gallery');
const loader = document.querySelector('.loader');
const loadMoreButton = document.querySelector('#load-more');

let currentPage = 1;
let query = '';

form.addEventListener('submit', onFormSubmit);
loadMoreButton.addEventListener('click', loadMoreImages);

async function onFormSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = ''; 
  query = event.target.elements['search-query'].value.trim();
  currentPage = 1; 

  if (query === '') {
    iziToast.error({
      title: 'Error',
      message: 'Please enter a search query!',
    });
    return;
  }

  loadMoreButton.style.display = 'none';
  await fetchAndRenderImages(query);
}

async function fetchAndRenderImages(query) {
  loader.style.display = 'block';

  try {
    const { hits, totalHits } = await fetchImages(query, currentPage, 15);
    loader.style.display = 'none';

    if (hits.length === 0) {
      iziToast.warning({
        title: 'No Results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      loadMoreButton.style.display = 'none';
      return;
    }

    renderImages(hits);
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh();

    iziToast.success({
      title: 'Success',
      message: `Found ${totalHits} images!`,
      position: 'topRight',
    });

    if (currentPage * 15 < totalHits) {
      loadMoreButton.style.display = 'block';
    } else {
      loadMoreButton.style.display = 'none';
      iziToast.info({
        title: 'End of Results',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }

    const galleryItem = gallery.lastElementChild;
    if (galleryItem) {
      const { height } = galleryItem.getBoundingClientRect();
      window.scrollBy({
        top: height * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    loader.style.display = 'none';
    iziToast.error({
      title: 'Error',
      message: error.message,
      position: 'topRight',
    });
  }
}

async function loadMoreImages() {
  currentPage += 1;
  await fetchAndRenderImages(query);
}
