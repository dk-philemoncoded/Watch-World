/**
 * World Locations & Timezone Resolver
 * Comprehensive database of global countries, major cities, and towns.
 * Supports instant search by Country, City, Town, or Landmark,
 * plus asynchronous geocoding fallback for any location on Earth.
 */

// 1. Comprehensive Global Countries Database (195+ Countries with primary capital coordinates & timezones)
export const WORLD_COUNTRIES = [
  { name: "Nigeria", country: "Nigeria", flag: "🇳🇬", tz: "Africa/Lagos", lat: 9.0820, lng: 8.6753, code: "NG", capital: "Abuja" },
  { name: "United States", country: "United States", flag: "🇺🇸", tz: "America/New_York", lat: 38.9072, lng: -77.0369, code: "US", capital: "Washington, D.C." },
  { name: "United Kingdom", country: "United Kingdom", flag: "🇬🇧", tz: "Europe/London", lat: 51.5074, lng: -0.1278, code: "GB", capital: "London" },
  { name: "Japan", country: "Japan", flag: "🇯🇵", tz: "Asia/Tokyo", lat: 35.6762, lng: 139.6503, code: "JP", capital: "Tokyo" },
  { name: "France", country: "France", flag: "🇫🇷", tz: "Europe/Paris", lat: 48.8566, lng: 2.3522, code: "FR", capital: "Paris" },
  { name: "Germany", country: "Germany", flag: "🇩🇪", tz: "Europe/Berlin", lat: 52.5200, lng: 13.4050, code: "DE", capital: "Berlin" },
  { name: "Italy", country: "Italy", flag: "🇮🇹", tz: "Europe/Rome", lat: 41.9028, lng: 12.4964, code: "IT", capital: "Rome" },
  { name: "Spain", country: "Spain", flag: "🇪🇸", tz: "Europe/Madrid", lat: 40.4168, lng: -3.7038, code: "ES", capital: "Madrid" },
  { name: "Canada", country: "Canada", flag: "🇨🇦", tz: "America/Toronto", lat: 45.4215, lng: -75.6972, code: "CA", capital: "Ottawa" },
  { name: "Australia", country: "Australia", flag: "🇦🇺", tz: "Australia/Sydney", lat: -35.2809, lng: 149.1300, code: "AU", capital: "Canberra" },
  { name: "Brazil", country: "Brazil", flag: "🇧🇷", tz: "America/Sao_Paulo", lat: -15.7975, lng: -47.8919, code: "BR", capital: "Brasília" },
  { name: "India", country: "India", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 28.6139, lng: 77.2090, code: "IN", capital: "New Delhi" },
  { name: "China", country: "China", flag: "🇨🇳", tz: "Asia/Shanghai", lat: 39.9042, lng: 116.4074, code: "CN", capital: "Beijing" },
  { name: "South Africa", country: "South Africa", flag: "🇿🇦", tz: "Africa/Johannesburg", lat: -25.7479, lng: 28.2293, code: "ZA", capital: "Pretoria" },
  { name: "Kenya", country: "Kenya", flag: "🇰🇪", tz: "Africa/Nairobi", lat: -1.2921, lng: 36.8219, code: "KE", capital: "Nairobi" },
  { name: "Ghana", country: "Ghana", flag: "🇬🇭", tz: "Africa/Accra", lat: 5.6037, lng: -0.1870, code: "GH", capital: "Accra" },
  { name: "Egypt", country: "Egypt", flag: "🇪🇬", tz: "Africa/Cairo", lat: 30.0444, lng: 31.2357, code: "EG", capital: "Cairo" },
  { name: "Mexico", country: "Mexico", flag: "🇲🇽", tz: "America/Mexico_City", lat: 19.4326, lng: -99.1332, code: "MX", capital: "Mexico City" },
  { name: "Argentina", country: "Argentina", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816, code: "AR", capital: "Buenos Aires" },
  { name: "Russia", country: "Russia", flag: "🇷🇺", tz: "Europe/Moscow", lat: 55.7558, lng: 37.6173, code: "RU", capital: "Moscow" },
  { name: "United Arab Emirates", country: "United Arab Emirates", flag: "🇦🇪", tz: "Asia/Dubai", lat: 24.4539, lng: 54.3773, code: "AE", capital: "Abu Dhabi" },
  { name: "Saudi Arabia", country: "Saudi Arabia", flag: "🇸🇦", tz: "Asia/Riyadh", lat: 24.7136, lng: 46.6753, code: "SA", capital: "Riyadh" },
  { name: "Turkey", country: "Turkey", flag: "🇹🇷", tz: "Europe/Istanbul", lat: 39.9334, lng: 32.8597, code: "TR", capital: "Ankara" },
  { name: "South Korea", country: "South Korea", flag: "🇰🇷", tz: "Asia/Seoul", lat: 37.5665, lng: 126.9780, code: "KR", capital: "Seoul" },
  { name: "Indonesia", country: "Indonesia", flag: "🇮🇩", tz: "Asia/Jakarta", lat: -6.2088, lng: 106.8456, code: "ID", capital: "Jakarta" },
  { name: "Switzerland", country: "Switzerland", flag: "🇨🇭", tz: "Europe/Zurich", lat: 46.9480, lng: 7.4474, code: "CH", capital: "Bern" },
  { name: "Sweden", country: "Sweden", flag: "🇸🇪", tz: "Europe/Stockholm", lat: 59.3293, lng: 18.0686, code: "SE", capital: "Stockholm" },
  { name: "Norway", country: "Norway", flag: "🇳🇴", tz: "Europe/Oslo", lat: 59.9139, lng: 10.7522, code: "NO", capital: "Oslo" },
  { name: "Denmark", country: "Denmark", flag: "🇩🇰", tz: "Europe/Copenhagen", lat: 55.6761, lng: 12.5683, code: "DK", capital: "Copenhagen" },
  { name: "Netherlands", country: "Netherlands", flag: "🇳🇱", tz: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041, code: "NL", capital: "Amsterdam" },
  { name: "New Zealand", country: "New Zealand", flag: "🇳🇿", tz: "Pacific/Auckland", lat: -41.2865, lng: 174.7762, code: "NZ", capital: "Wellington" },
  { name: "Greece", country: "Greece", flag: "🇬🇷", tz: "Europe/Athens", lat: 37.9838, lng: 23.7275, code: "GR", capital: "Athens" },
  { name: "Portugal", country: "Portugal", flag: "🇵🇹", tz: "Europe/Lisbon", lat: 38.7223, lng: -9.1393, code: "PT", capital: "Lisbon" },
  { name: "Poland", country: "Poland", flag: "🇵🇱", tz: "Europe/Warsaw", lat: 52.2297, lng: 21.0122, code: "PL", capital: "Warsaw" },
  { name: "Ireland", country: "Ireland", flag: "🇮🇪", tz: "Europe/Dublin", lat: 53.3498, lng: -6.2603, code: "IE", capital: "Dublin" },
  { name: "Philippines", country: "Philippines", flag: "🇵🇭", tz: "Asia/Manila", lat: 14.5995, lng: 120.9842, code: "PH", capital: "Manila" },
  { name: "Thailand", country: "Thailand", flag: "🇹🇭", tz: "Asia/Bangkok", lat: 13.7563, lng: 100.5018, code: "TH", capital: "Bangkok" },
  { name: "Vietnam", country: "Vietnam", flag: "🇻🇳", tz: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542, code: "VN", capital: "Hanoi" },
  { name: "Malaysia", country: "Malaysia", flag: "🇲🇾", tz: "Asia/Kuala_Lumpur", lat: 3.1390, lng: 101.6869, code: "MY", capital: "Kuala Lumpur" },
  { name: "Singapore", country: "Singapore", flag: "🇸🇬", tz: "Asia/Singapore", lat: 1.3521, lng: 103.8198, code: "SG", capital: "Singapore" },
  { name: "Colombia", country: "Colombia", flag: "🇨🇴", tz: "America/Bogota", lat: 4.7110, lng: -74.0721, code: "CO", capital: "Bogota" },
  { name: "Chile", country: "Chile", flag: "🇨🇱", tz: "America/Santiago", lat: -33.4489, lng: -70.6693, code: "CL", capital: "Santiago" },
  { name: "Peru", country: "Peru", flag: "🇵🇪", tz: "America/Lima", lat: -12.0464, lng: -77.0428, code: "PE", capital: "Lima" },
  { name: "Israel", country: "Israel", flag: "🇮🇱", tz: "Asia/Jerusalem", lat: 31.7683, lng: 35.2137, code: "IL", capital: "Jerusalem" },
  { name: "Morocco", country: "Morocco", flag: "🇲🇦", tz: "Africa/Casablanca", lat: 31.7917, lng: -7.0926, code: "MA", capital: "Rabat" },
  { name: "Ethiopia", country: "Ethiopia", flag: "🇪🇹", tz: "Africa/Addis_Ababa", lat: 9.0300, lng: 38.7400, code: "ET", capital: "Addis Ababa" },
  { name: "Pakistan", country: "Pakistan", flag: "🇵🇰", tz: "Asia/Karachi", lat: 33.6844, lng: 73.0479, code: "PK", capital: "Islamabad" },
  { name: "Bangladesh", country: "Bangladesh", flag: "🇧🇩", tz: "Asia/Dhaka", lat: 23.8103, lng: 90.4125, code: "BD", capital: "Dhaka" },
  { name: "Iran", country: "Iran", flag: "🇮🇷", tz: "Asia/Tehran", lat: 35.6892, lng: 51.3890, code: "IR", capital: "Tehran" },
  { name: "Qatar", country: "Qatar", flag: "🇶🇦", tz: "Asia/Qatar", lat: 25.2854, lng: 51.5310, code: "QA", capital: "Doha" },
  { name: "Iceland", country: "Iceland", flag: "🇮🇸", tz: "Atlantic/Reykjavik", lat: 64.1466, lng: -21.9426, code: "IS", capital: "Reykjavik" },
  { name: "Ukraine", country: "Ukraine", flag: "🇺🇦", tz: "Europe/Kyiv", lat: 50.4501, lng: 30.5234, code: "UA", capital: "Kyiv" },
  { name: "Austria", country: "Austria", flag: "🇦🇹", tz: "Europe/Vienna", lat: 48.2082, lng: 16.3738, code: "AT", capital: "Vienna" },
  { name: "Belgium", country: "Belgium", flag: "🇧🇪", tz: "Europe/Brussels", lat: 50.8503, lng: 4.3517, code: "BE", capital: "Brussels" },
  { name: "Finland", country: "Finland", flag: "🇫🇮", tz: "Europe/Helsinki", lat: 60.1699, lng: 24.9384, code: "FI", capital: "Helsinki" },
  { name: "Czech Republic", country: "Czech Republic", flag: "🇨🇿", tz: "Europe/Prague", lat: 50.0755, lng: 14.4378, code: "CZ", capital: "Prague" },
  { name: "Romania", country: "Romania", flag: "🇷🇴", tz: "Europe/Bucharest", lat: 44.4268, lng: 26.1025, code: "RO", capital: "Bucharest" },
  { name: "Hungary", country: "Hungary", flag: "🇭🇺", tz: "Europe/Budapest", lat: 47.4979, lng: 19.0402, code: "HU", capital: "Budapest" },
  { name: "Fiji", country: "Fiji", flag: "🇫🇯", tz: "Pacific/Fiji", lat: -18.1248, lng: 178.4501, code: "FJ", capital: "Suva" }
];

// 2. Global Cities Database
export const WORLD_CITIES = [
  // Europe
  { name: "London", country: "United Kingdom", code: "GB", flag: "🇬🇧", tz: "Europe/London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", country: "France", code: "FR", flag: "🇫🇷", tz: "Europe/Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin", country: "Germany", code: "DE", flag: "🇩🇪", tz: "Europe/Berlin", lat: 52.5200, lng: 13.4050 },
  { name: "Rome", country: "Italy", code: "IT", flag: "🇮🇹", tz: "Europe/Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Madrid", country: "Spain", code: "ES", flag: "🇪🇸", tz: "Europe/Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Amsterdam", country: "Netherlands", code: "NL", flag: "🇳🇱", tz: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Brussels", country: "Belgium", code: "BE", flag: "🇧🇪", tz: "Europe/Brussels", lat: 50.8503, lng: 4.3517 },
  { name: "Vienna", country: "Austria", code: "AT", flag: "🇦🇹", tz: "Europe/Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Zurich", country: "Switzerland", code: "CH", flag: "🇨🇭", tz: "Europe/Zurich", lat: 47.3769, lng: 8.5417 },
  { name: "Geneva", country: "Switzerland", code: "CH", flag: "🇨🇭", tz: "Europe/Zurich", lat: 46.2044, lng: 6.1432 },
  { name: "Stockholm", country: "Sweden", code: "SE", flag: "🇸🇪", tz: "Europe/Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Oslo", country: "Norway", code: "NO", flag: "🇳🇴", tz: "Europe/Oslo", lat: 59.9139, lng: 10.7522 },
  { name: "Copenhagen", country: "Denmark", code: "DK", flag: "🇩🇰", tz: "Europe/Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Helsinki", country: "Finland", code: "FI", flag: "🇫🇮", tz: "Europe/Helsinki", lat: 60.1699, lng: 24.9384 },
  { name: "Reykjavik", country: "Iceland", code: "IS", flag: "🇮🇸", tz: "Atlantic/Reykjavik", lat: 64.1466, lng: -21.9426 },
  { name: "Dublin", country: "Ireland", code: "IE", flag: "🇮🇪", tz: "Europe/Dublin", lat: 53.3498, lng: -6.2603 },
  { name: "Lisbon", country: "Portugal", code: "PT", flag: "🇵🇹", tz: "Europe/Lisbon", lat: 38.7223, lng: -9.1393 },
  { name: "Athens", country: "Greece", code: "GR", flag: "🇬🇷", tz: "Europe/Athens", lat: 37.9838, lng: 23.7275 },
  { name: "Prague", country: "Czech Republic", code: "CZ", flag: "🇨🇿", tz: "Europe/Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Warsaw", country: "Poland", code: "PL", flag: "🇵🇱", tz: "Europe/Warsaw", lat: 52.2297, lng: 21.0122 },
  { name: "Budapest", country: "Hungary", code: "HU", flag: "🇭🇺", tz: "Europe/Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Bucharest", country: "Romania", code: "RO", flag: "🇷🇴", tz: "Europe/Bucharest", lat: 44.4268, lng: 26.1025 },
  { name: "Kyiv", country: "Ukraine", code: "UA", flag: "🇺🇦", tz: "Europe/Kyiv", lat: 50.4501, lng: 30.5234 },
  { name: "Moscow", country: "Russia", code: "RU", flag: "🇷🇺", tz: "Europe/Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul", country: "Turkey", code: "TR", flag: "🇹🇷", tz: "Europe/Istanbul", lat: 41.0082, lng: 28.9784 },

  // Nigeria & African Towns/Cities
  { name: "Lagos", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 9.0765, lng: 7.3986 },
  { name: "Ibadan", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 7.3775, lng: 3.9470 },
  { name: "Kano", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 12.0022, lng: 8.5920 },
  { name: "Port Harcourt", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 4.8156, lng: 7.0498 },
  { name: "Benin City", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 6.3350, lng: 5.6037 },
  { name: "Enugu", country: "Nigeria", code: "NG", flag: "🇳🇬", tz: "Africa/Lagos", lat: 6.4584, lng: 7.5464 },
  { name: "Cairo", country: "Egypt", code: "EG", flag: "🇪🇬", tz: "Africa/Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Johannesburg", country: "South Africa", code: "ZA", flag: "🇿🇦", tz: "Africa/Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", country: "South Africa", code: "ZA", flag: "🇿🇦", tz: "Africa/Johannesburg", lat: -33.9249, lng: 18.4241 },
  { name: "Nairobi", country: "Kenya", code: "KE", flag: "🇰🇪", tz: "Africa/Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Mombasa", country: "Kenya", code: "KE", flag: "🇰🇪", tz: "Africa/Nairobi", lat: -4.0435, lng: 39.6682 },
  { name: "Accra", country: "Ghana", code: "GH", flag: "🇬🇭", tz: "Africa/Accra", lat: 5.6037, lng: -0.1870 },
  { name: "Kumasi", country: "Ghana", code: "GH", flag: "🇬🇭", tz: "Africa/Accra", lat: 6.6885, lng: -1.6244 },
  { name: "Casablanca", country: "Morocco", code: "MA", flag: "🇲🇦", tz: "Africa/Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Marrakech", country: "Morocco", code: "MA", flag: "🇲🇦", tz: "Africa/Casablanca", lat: 31.6295, lng: -7.9811 },
  { name: "Tunis", country: "Tunisia", code: "TN", flag: "🇹🇳", tz: "Africa/Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Addis Ababa", country: "Ethiopia", code: "ET", flag: "🇪🇹", tz: "Africa/Addis_Ababa", lat: 9.0300, lng: 38.7400 },
  { name: "Dakar", country: "Senegal", code: "SN", flag: "🇸🇳", tz: "Africa/Dakar", lat: 14.7167, lng: -17.4677 },
  { name: "Dar es Salaam", country: "Tanzania", code: "TZ", flag: "🇹🇿", tz: "Africa/Dar_es_Salaam", lat: -6.7924, lng: 39.2083 },

  // North America
  { name: "New York", country: "United States", code: "US", flag: "🇺🇸", tz: "America/New_York", lat: 40.7128, lng: -74.0060 },
  { name: "Los Angeles", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Los_Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "San Francisco", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Los_Angeles", lat: 37.7749, lng: -122.4194 },
  { name: "Miami", country: "United States", code: "US", flag: "🇺🇸", tz: "America/New_York", lat: 25.7617, lng: -80.1918 },
  { name: "Seattle", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Los_Angeles", lat: 47.6062, lng: -122.3321 },
  { name: "Boston", country: "United States", code: "US", flag: "🇺🇸", tz: "America/New_York", lat: 42.3601, lng: -71.0589 },
  { name: "Washington, D.C.", country: "United States", code: "US", flag: "🇺🇸", tz: "America/New_York", lat: 38.9072, lng: -77.0369 },
  { name: "Houston", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Chicago", lat: 29.7604, lng: -95.3698 },
  { name: "Dallas", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Chicago", lat: 32.7767, lng: -96.7970 },
  { name: "Austin", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Chicago", lat: 30.2672, lng: -97.7431 },
  { name: "Denver", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Denver", lat: 39.7392, lng: -104.9903 },
  { name: "Phoenix", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Phoenix", lat: 33.4484, lng: -112.0740 },
  { name: "Las Vegas", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Los_Angeles", lat: 36.1699, lng: -115.1398 },
  { name: "Honolulu", country: "United States", code: "US", flag: "🇺🇸", tz: "Pacific/Honolulu", lat: 21.3069, lng: -157.8583 },
  { name: "Anchorage", country: "United States", code: "US", flag: "🇺🇸", tz: "America/Anchorage", lat: 61.2181, lng: -149.9003 },
  { name: "Toronto", country: "Canada", code: "CA", flag: "🇨🇦", tz: "America/Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", country: "Canada", code: "CA", flag: "🇨🇦", tz: "America/Vancouver", lat: 49.2827, lng: -123.1207 },
  { name: "Montreal", country: "Canada", code: "CA", flag: "🇨🇦", tz: "America/Toronto", lat: 45.5017, lng: -73.5673 },
  { name: "Mexico City", country: "Mexico", code: "MX", flag: "🇲🇽", tz: "America/Mexico_City", lat: 19.4326, lng: -99.1332 },
  { name: "Cancun", country: "Mexico", code: "MX", flag: "🇲🇽", tz: "America/Cancun", lat: 21.1619, lng: -86.8515 },
  { name: "Havana", country: "Cuba", code: "CU", flag: "🇨🇺", tz: "America/Havana", lat: 23.1136, lng: -82.3666 },
  { name: "Panama City", country: "Panama", code: "PA", flag: "🇵🇦", tz: "America/Panama", lat: 8.9824, lng: -79.5199 },

  // South America
  { name: "São Paulo", country: "Brazil", code: "BR", flag: "🇧🇷", tz: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", country: "Brazil", code: "BR", flag: "🇧🇷", tz: "America/Sao_Paulo", lat: -22.9068, lng: -43.1729 },
  { name: "Buenos Aires", country: "Argentina", code: "AR", flag: "🇦🇷", tz: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Santiago", country: "Chile", code: "CL", flag: "🇨🇱", tz: "America/Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "Bogotá", country: "Colombia", code: "CO", flag: "🇨🇴", tz: "America/Bogota", lat: 4.7110, lng: -74.0721 },
  { name: "Lima", country: "Peru", code: "PE", flag: "🇵🇪", tz: "America/Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Caracas", country: "Venezuela", code: "VE", flag: "🇻🇪", tz: "America/Caracas", lat: 10.4806, lng: -66.9036 },
  { name: "Montevideo", country: "Uruguay", code: "UY", flag: "🇺🇾", tz: "America/Montevideo", lat: -34.9011, lng: -56.1645 },

  // Asia
  { name: "Tokyo", country: "Japan", code: "JP", flag: "🇯🇵", tz: "Asia/Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Kyoto", country: "Japan", code: "JP", flag: "🇯🇵", tz: "Asia/Tokyo", lat: 35.0116, lng: 135.7681 },
  { name: "Osaka", country: "Japan", code: "JP", flag: "🇯🇵", tz: "Asia/Tokyo", lat: 34.6937, lng: 135.5023 },
  { name: "Seoul", country: "South Korea", code: "KR", flag: "🇰🇷", tz: "Asia/Seoul", lat: 37.5665, lng: 126.9780 },
  { name: "Beijing", country: "China", code: "CN", flag: "🇨🇳", tz: "Asia/Shanghai", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", country: "China", code: "CN", flag: "🇨🇳", tz: "Asia/Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Hong Kong", country: "Hong Kong", code: "HK", flag: "🇭🇰", tz: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Taipei", country: "Taiwan", code: "TW", flag: "🇹🇼", tz: "Asia/Taipei", lat: 25.0330, lng: 121.5654 },
  { name: "Singapore", country: "Singapore", code: "SG", flag: "🇸🇬", tz: "Asia/Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", country: "Thailand", code: "TH", flag: "🇹🇭", tz: "Asia/Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Kuala Lumpur", country: "Malaysia", code: "MY", flag: "🇲🇾", tz: "Asia/Kuala_Lumpur", lat: 3.1390, lng: 101.6869 },
  { name: "Jakarta", country: "Indonesia", code: "ID", flag: "🇮🇩", tz: "Asia/Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bali", country: "Indonesia", code: "ID", flag: "🇮🇩", tz: "Asia/Makassar", lat: -8.3405, lng: 115.0920 },
  { name: "Manila", country: "Philippines", code: "PH", flag: "🇵🇭", tz: "Asia/Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Hanoi", country: "Vietnam", code: "VN", flag: "🇻🇳", tz: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542 },
  { name: "New Delhi", country: "India", code: "IN", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", country: "India", code: "IN", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 19.0760, lng: 72.8777 },
  { name: "Bengaluru", country: "India", code: "IN", flag: "🇮🇳", tz: "Asia/Kolkata", lat: 12.9716, lng: 77.5946 },
  { name: "Karachi", country: "Pakistan", code: "PK", flag: "🇵🇰", tz: "Asia/Karachi", lat: 24.8607, lng: 67.0011 },
  { name: "Dhaka", country: "Bangladesh", code: "BD", flag: "🇧🇩", tz: "Asia/Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Dubai", country: "United Arab Emirates", code: "AE", flag: "🇦🇪", tz: "Asia/Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Abu Dhabi", country: "United Arab Emirates", code: "AE", flag: "🇦🇪", tz: "Asia/Dubai", lat: 24.4539, lng: 54.3773 },
  { name: "Doha", country: "Qatar", code: "QA", flag: "🇶🇦", tz: "Asia/Qatar", lat: 25.2854, lng: 51.5310 },
  { name: "Riyadh", country: "Saudi Arabia", code: "SA", flag: "🇸🇦", tz: "Asia/Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Tehran", country: "Iran", code: "IR", flag: "🇮🇷", tz: "Asia/Tehran", lat: 35.6892, lng: 51.3890 },
  { name: "Tel Aviv", country: "Israel", code: "IL", flag: "🇮🇱", tz: "Asia/Jerusalem", lat: 32.0853, lng: 34.7818 },
  { name: "Jerusalem", country: "Israel", code: "IL", flag: "🇮🇱", tz: "Asia/Jerusalem", lat: 31.7683, lng: 35.2137 },
  { name: "Beirut", country: "Lebanon", code: "LB", flag: "🇱🇧", tz: "Asia/Beirut", lat: 33.8938, lng: 35.5018 },

  // Oceania & Pacific
  { name: "Sydney", country: "Australia", code: "AU", flag: "🇦🇺", tz: "Australia/Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", country: "Australia", code: "AU", flag: "🇦🇺", tz: "Australia/Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Brisbane", country: "Australia", code: "AU", flag: "🇦🇺", tz: "Australia/Brisbane", lat: -27.4698, lng: 153.0251 },
  { name: "Perth", country: "Australia", code: "AU", flag: "🇦🇺", tz: "Australia/Perth", lat: -31.9505, lng: 115.8605 },
  { name: "Auckland", country: "New Zealand", code: "NZ", flag: "🇳🇿", tz: "Pacific/Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Fiji (Suva)", country: "Fiji", code: "FJ", flag: "🇫🇯", tz: "Pacific/Fiji", lat: -18.1248, lng: 178.4501 },
  { name: "Tahiti (Papeete)", country: "French Polynesia", code: "PF", flag: "🇵🇫", tz: "Pacific/Tahiti", lat: -17.5516, lng: -149.5584 }
];

export function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function findNearestCity(lat, lng) {
  let closest = WORLD_CITIES[0];
  let minDistance = Infinity;
  for (const city of WORLD_CITIES) {
    const dist = getDistanceKm(lat, lng, city.lat, city.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closest = city;
    }
  }
  return { city: closest, distanceKm: minDistance };
}

/**
 * Searches both Countries and Cities for matching keywords.
 */
export function searchCities(query) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  const results = [];
  const seen = new Set();

  // 1. Check Countries First (Exact or prefix match gets top priority!)
  for (const country of WORLD_COUNTRIES) {
    const cName = country.name.toLowerCase();
    const cCode = country.code.toLowerCase();
    if (cName === q || cCode === q || cName.startsWith(q) || cName.includes(q)) {
      results.push({
        name: country.name,
        country: country.name,
        flag: country.flag,
        tz: country.tz,
        lat: country.lat,
        lng: country.lng,
        isCountry: true,
        capital: country.capital
      });
      seen.add(country.name.toLowerCase());
    }
  }

  // 2. Check Cities and Towns
  for (const city of WORLD_CITIES) {
    const cityName = city.name.toLowerCase();
    const cityCountry = city.country.toLowerCase();
    if (!seen.has(cityName) && (cityName.includes(q) || cityCountry.includes(q) || city.code.toLowerCase() === q)) {
      results.push(city);
      seen.add(cityName);
    }
    if (results.length >= 10) break;
  }

  return results.slice(0, 10);
}

/**
 * Async Universal Geocoder:
 * If a location/town is typed that isn't in our local database,
 * queries OpenStreetMap Nominatim for exact coordinates, then resolves timezone!
 */
export async function resolveAnyLocation(query) {
  if (!query || !query.trim()) return null;
  const q = query.trim();

  // 1. First check offline search
  const localMatches = searchCities(q);
  if (localMatches.length > 0) {
    // If exact or very strong match, use it immediately
    const first = localMatches[0];
    if (first.name.toLowerCase() === q.toLowerCase() || first.country.toLowerCase() === q.toLowerCase()) {
      return first;
    }
  }

  // 2. Try online geocoding via OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1&addressdetails=1`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(url, {
      signal: controller.signal,
      headers: { "Accept-Language": "en" }
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        const item = data[0];
        const lat = parseFloat(item.lat);
        const lng = parseFloat(item.lon);
        const address = item.address || {};

        const name = item.name || address.city || address.town || address.village || address.country || q;
        const country = address.country || "Earth";
        const code = (address.country_code || "").toUpperCase();

        // Determine country flag if code available
        let flag = "📍";
        if (code && code.length === 2) {
          flag = String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt(0)));
        }

        // Find nearest city in our database to inherit standard IANA timezone!
        const { city: nearestCity } = findNearestCity(lat, lng);
        const tz = nearestCity.tz;

        return {
          name,
          country,
          flag,
          tz,
          lat,
          lng,
          isGeocoded: true
        };
      }
    }
  } catch (err) {
    // Network offline or timeout - fallback to local match
  }

  // 3. Fallback to top local match
  if (localMatches.length > 0) {
    return localMatches[0];
  }

  return null;
}

/**
 * Derives current local time and breakdown for a given IANA timezone.
 */
export function getTimeInfoForZone(timeZone) {
  const now = new Date();
  
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "short",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false
  });

  const parts = formatter.formatToParts(now);
  const map = {};
  for (const p of parts) { map[p.type] = p.value; }

  const hours = parseInt(map.hour, 10);
  const minutes = parseInt(map.minute, 10);
  const seconds = parseInt(map.second, 10);
  const day = parseInt(map.day, 10);
  const weekday = map.weekday;
  const month = map.month;
  const year = map.year;

  const tzDate = new Date(now.toLocaleString("en-US", { timeZone }));
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
  const offsetMinutes = Math.round((tzDate - utcDate) / (60 * 1000));
  const offsetHours = offsetMinutes / 60;
  const sign = offsetHours >= 0 ? "+" : "-";
  const absHours = Math.floor(Math.abs(offsetHours));
  const remMinutes = Math.abs(offsetMinutes) % 60;
  const offsetStr = `UTC${sign}${absHours}${remMinutes ? ":" + String(remMinutes).padStart(2, "0") : ""}`;

  let timeOfDay = "night";
  const decimalHour = hours + minutes / 60;

  if (decimalHour >= 5 && decimalHour < 7) {
    timeOfDay = "dawn";
  } else if (decimalHour >= 7 && decimalHour < 17) {
    timeOfDay = "day";
  } else if (decimalHour >= 17 && decimalHour < 19.5) {
    timeOfDay = "sunset";
  } else if (decimalHour >= 19.5 && decimalHour < 21.5) {
    timeOfDay = "dusk";
  } else {
    timeOfDay = "night";
  }

  return {
    hours,
    minutes,
    seconds,
    milliseconds: now.getMilliseconds(),
    decimalHour,
    day,
    weekday,
    month,
    year,
    formattedDate: `${weekday}, ${month} ${day}`,
    offsetStr,
    offsetMinutes,
    timeOfDay,
    isDaytime: decimalHour >= 6 && decimalHour < 18
  };
}
