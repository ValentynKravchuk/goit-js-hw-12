const API_KEY = '46051514-586eb2ff38120a16ff3b43d50';
const BASE_URL = 'https://pixabay.com/api/';

import axios from 'axios';

export async function fetchImages(query, page = 1, perPage = 15) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        key: API_KEY,
        q: query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: page,
        per_page: perPage,
      },
    });

    return {
      hits: response.data.hits,
      totalHits: response.data.totalHits,
    };
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error(
      'Sorry, there was an error fetching images. Please try again later.'
    );
  }
}
