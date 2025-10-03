// Streaming service to help users find where movies are available
export interface StreamingProvider {
  name: string;
  url: string;
  description: string;
}

export const streamingProviders: StreamingProvider[] = [
  {
    name: 'JustWatch',
    url: 'https://www.justwatch.com',
    description: 'Find where movies and TV shows are available to stream, rent, or buy'
  },
  {
    name: 'Netflix',
    url: 'https://www.netflix.com',
    description: 'Subscription streaming service with original content'
  },
  {
    name: 'Amazon Prime Video',
    url: 'https://www.primevideo.com',
    description: 'Stream, rent, or buy movies and TV shows'
  },
  {
    name: 'Hulu',
    url: 'https://www.hulu.com',
    description: 'Subscription streaming with current TV shows and movies'
  },
  {
    name: 'Disney+',
    url: 'https://www.disneyplus.com',
    description: 'Disney, Marvel, Star Wars, and National Geographic content'
  },
  {
    name: 'HBO Max',
    url: 'https://www.hbomax.com',
    description: 'HBO content plus Warner Bros. movies and shows'
  },
  {
    name: 'Apple TV+',
    url: 'https://tv.apple.com',
    description: 'Apple original content and movie rentals'
  },
  {
    name: 'Paramount+',
    url: 'https://www.paramountplus.com',
    description: 'CBS, Paramount, and Nickelodeon content'
  }
];

// Generate search URLs for different platforms
export const getStreamingSearchUrls = (movieTitle: string, year?: string) => {
  const searchQuery = year ? `${movieTitle} ${year}` : movieTitle;
  const encodedQuery = encodeURIComponent(searchQuery);
  
  return {
    justWatch: `https://www.justwatch.com/us/search?q=${encodedQuery}`,
    tubi: `https://tubitv.com/search/${encodedQuery}`,
    google: `https://www.google.com/search?q=${encodedQuery} watch online streaming`,
    youtube: `https://www.youtube.com/results?search_query=${encodedQuery} trailer`,
    imdb: `https://www.imdb.com/find?q=${encodedQuery}&s=tt&ttype=ft`,
    rottentomatoes: `https://www.rottentomatoes.com/search?search=${encodedQuery}`,
  };
};

// Tubi-specific integration functions
export const tubiIntegration = {
  // Generate Tubi search URL
  getSearchUrl: (movieTitle: string, year?: string) => {
    const query = year ? `${movieTitle} ${year}` : movieTitle;
    return `https://tubitv.com/search/${encodeURIComponent(query)}`;
  },

  // Generate Tubi browse URL by genre
  getBrowseUrl: (genre?: string) => {
    const genreMap: { [key: string]: string } = {
      'action': 'action',
      'comedy': 'comedy',
      'drama': 'drama',
      'horror': 'horror',
      'thriller': 'thriller',
      'romance': 'romance',
      'documentary': 'documentaries',
      'family': 'kids-family',
      'animation': 'animation',
      'crime': 'crime',
      'mystery': 'mystery',
      'adventure': 'action-adventure'
    };
    
    if (genre && genreMap[genre.toLowerCase()]) {
      return `https://tubitv.com/category/${genreMap[genre.toLowerCase()]}`;
    }
    return 'https://tubitv.com/movies';
  },

  // Check if a movie might be available on Tubi (heuristic approach)
  isPotentiallyAvailable: (movie: any) => {
    // Tubi typically has older movies, B-movies, and independent films
    const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
    const currentYear = new Date().getFullYear();
    const movieAge = currentYear - releaseYear;
    
    // Higher chance for movies that are:
    // - Older than 3 years
    // - Lower budget (revenue < $50M)
    // - Independent or smaller studio films
    const isOlderMovie = movieAge >= 3;
    const isLowerBudget = !movie.budget || movie.budget < 50000000;
    const hasModerateRating = movie.vote_average >= 5.0 && movie.vote_average <= 8.0;
    
    return isOlderMovie && (isLowerBudget || hasModerateRating);
  }
};

// Check if a movie might be available on free platforms
export const getFreeStreamingOptions = () => {
  return [
    {
      name: 'Tubi',
      url: 'https://tubitv.com',
      description: 'Free movies and TV shows with ads'
    },
    {
      name: 'Crackle',
      url: 'https://www.crackle.com',
      description: 'Free Sony movies and shows with ads'
    },
    {
      name: 'Pluto TV',
      url: 'https://pluto.tv',
      description: 'Free live TV and on-demand content'
    },
    {
      name: 'YouTube Movies',
      url: 'https://www.youtube.com/movies',
      description: 'Free movies with ads and paid rentals'
    },
    {
      name: 'Internet Archive',
      url: 'https://archive.org/details/movies',
      description: 'Public domain and classic films'
    }
  ];
};

// Legal notice about streaming
export const streamingLegalNotice = `
This platform provides movie information and trailers from The Movie Database (TMDB). 
We do not host or stream copyrighted content. To watch full movies legally, please use 
official streaming services, digital rental platforms, or purchase from authorized retailers.
`;

export default {
  streamingProviders,
  getStreamingSearchUrls,
  getFreeStreamingOptions,
  streamingLegalNotice
};
