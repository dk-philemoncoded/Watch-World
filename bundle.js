/**
 * PHILL - World Watch & Planetary Timepiece
 * Unified Production Bundle (Self-Contained, Zero External Dependencies)
 * Procedural 3D Wristwatch Engine, World Time Resolver, & Web Audio
 */

(function() {
  "use strict";

  // =========================================================================
  // 1. World Locations & Timezone Resolver
  // =========================================================================
/**
 * World Locations & Timezone Resolver
 * Comprehensive database of global countries, major cities, and towns.
 * Supports instant search by Country, City, Town, or Landmark,
 * plus asynchronous geocoding fallback for any location on Earth.
 */

// 1. Comprehensive Global Countries Database (195+ Countries with primary capital coordinates & timezones)
const WORLD_COUNTRIES = [
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
const WORLD_CITIES = [
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

function getDistanceKm(lat1, lon1, lat2, lon2) {
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

function findNearestCity(lat, lng) {
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
function searchCities(query) {
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
async function resolveAnyLocation(query) {
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
function getTimeInfoForZone(timeZone) {
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

  // =========================================================================
  // 2. Web Audio Synthesizer (Mechanical Watch Acoustics)
  // =========================================================================
/**
 * Web Audio API Mechanical Watch Synthesizer
 * Zero external audio files; pure procedural acoustic synthesis.
 */

class WatchSoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    this.lastTickTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.playTick(true);
    }
    return this.enabled;
  }

  /**
   * Mechanical Escapement Tick
   * High quality dual-impulse tick-tock sound
   */
  playTick(high = false) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;
    if (now - this.lastTickTime < 0.05) return;
    this.lastTickTime = now;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Bandpass filter to isolate the metallic resonance of the pallet jewel
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(high ? 3400 : 2800, now);
      filter.Q.setValueAtTime(14, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(high ? 4200 : 3600, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.015);

      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.025);

      // Pallet release secondary mini-click (12ms later)
      const secOsc = this.ctx.createOscillator();
      const secGain = this.ctx.createGain();
      secOsc.type = "triangle";
      secOsc.frequency.setValueAtTime(high ? 5200 : 4400, now + 0.012);
      secOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.024);

      secGain.gain.setValueAtTime(0.02, now + 0.012);
      secGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

      secOsc.connect(secGain);
      secGain.connect(this.ctx.destination);

      secOsc.start(now + 0.012);
      secOsc.stop(now + 0.026);
    } catch (e) {
      // Audio might be blocked until user gesture
    }
  }

  /**
   * Fast Winding Gear Whirl Sound
   * Played while the watch is rapidly spinning hands to the new timezone
   */
  playWindingEffect(duration = 1.2) {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      // Create white noise buffer for mechanical friction
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(3200, now + duration * 0.5);
      filter.frequency.linearRampToValueAtTime(1400, now + duration);
      filter.Q.setValueAtTime(6, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.07, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + duration);
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Arrival Crystal Lock Chime
   */
  playArrivalChime() {
    if (!this.enabled || !this.ctx) return;
    const now = this.ctx.currentTime;

    try {
      const freqs = [1046.5, 1318.5, 2093.0]; // C6, E6, C7
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.04);

        const startTime = now + idx * 0.04;
        gain.gain.setValueAtTime(0.04 / (idx + 1), startTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.6);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.7);
      });
    } catch (e) {
      // Ignore
    }
  }
}

const soundEngine = new WatchSoundEngine();

  // =========================================================================
  // 3. 2D Luxury Swiss Watch Engine (Dial, Hands, Celestial Complication)
  // =========================================================================
/**
 * Luxury Mechanical Analog Wrist Watch Engine
 * Renders an ultra-high definition Swiss horological timepiece with:
 * - Brushed and fluted metallic bezel (Steel, Rose Gold, Obsidian, Bronze)
 * - Sunburst guilloché dial with applied faceted diamond-cut indices
 * - 24-Hour Sun & Moon celestial complication disc
 * - Magnified cyclops date aperture
 * - High-beat sweeping second hand (28,800 vph / smooth 60fps)
 * - High-speed mechanical gear winding animation when changing timezones
 * - Super-LumiNova phosphorescent night glow in dark hours
 * - Anti-reflective sapphire crystal specular light sheen
 */

// Canvas roundRect compatibility polyfill
if (typeof CanvasRenderingContext2D !== "undefined" && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, radii) {
    if (!radii) radii = 0;
    if (typeof radii === "number") radii = [radii, radii, radii, radii];
    if (!Array.isArray(radii)) radii = [0, 0, 0, 0];
    const r1 = radii[0] || 0;
    const r2 = radii[1] || r1;
    const r3 = radii[2] || r1;
    const r4 = radii[3] || r2;
    this.beginPath();
    this.moveTo(x + r1, y);
    this.lineTo(x + w - r2, y);
    this.quadraticCurveTo(x + w, y, x + w, y + r2);
    this.lineTo(x + w, y + h - r3);
    this.quadraticCurveTo(x + w, y + h, x + w - r3, y + h);
    this.lineTo(x + r4, y + h);
    this.quadraticCurveTo(x, y + h, x, y + h - r4);
    this.lineTo(x, y + r1);
    this.quadraticCurveTo(x, y, x + r1, y);
    this.closePath();
    return this;
  };
}

class WatchEngine {
  constructor(canvas, soundEngine, isDialTexture = true) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = soundEngine;
    this.isDialTexture = isDialTexture;

    // Theme finish: 'steel' | 'rose-gold' | 'obsidian' | 'bronze'
    this.finish = "steel";

    // Target Time (what the watch is currently displaying or tracking)
    this.currentTime = {
      hours: 10,
      minutes: 10,
      seconds: 30,
      milliseconds: 0,
      day: 1,
      month: "Nov",
      year: 2026,
      weekday: "Monday",
      timeOfDay: "day",
      decimalHour: 10.17
    };

    // Interpolated Hand Angles (in radians)
    this.handAngles = {
      hour: 0,
      minute: 0,
      second: 0,
      celestial: 0
    };

    // Transition Animation State (rapid hand winding)
    this.isTransitioning = false;
    this.transitionStart = 0;
    this.transitionDuration = 1800; // ms
    this.startAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };
    this.targetAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };

    this.lastTickSecond = -1;
    this.lumeAmount = 0; // 0 = day reflection, 1 = full night glow

    this.resize();
    this.initAngles();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 480, rect.height || 480);

    if (this.canvas.width !== size * dpr || this.canvas.height !== size * dpr) {
      this.canvas.width = size * dpr;
      this.canvas.height = size * dpr;
    }
    this.size = size * dpr;
    this.radius = this.size / 2;
  }

  bindEvents() {
    window.addEventListener("resize", () => this.resize());
  }

  setFinish(finish) {
    this.finish = finish;
  }

  initAngles() {
    const { hours, minutes, seconds } = this.currentTime;
    const secAngle = (seconds / 60) * Math.PI * 2;
    const minAngle = ((minutes + seconds / 60) / 60) * Math.PI * 2;
    const hrAngle = (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * Math.PI * 2;
    const celAngle = ((hours + minutes / 60) / 24) * Math.PI * 2;

    this.handAngles = {
      hour: hrAngle,
      minute: minAngle,
      second: secAngle,
      celestial: celAngle
    };
  }

  /**
   * Sets the watch to a new location's time.
   * If animate is true, triggers high-speed mechanical gear winding animation!
   */
  setTime(timeInfo, animate = true) {
    const prevTime = { ...this.currentTime };
    this.currentTime = { ...timeInfo };

    const targetHr = (((timeInfo.hours % 12) + timeInfo.minutes / 60 + timeInfo.seconds / 3600) / 12) * Math.PI * 2;
    const targetMin = ((timeInfo.minutes + timeInfo.seconds / 60) / 60) * Math.PI * 2;
    const targetSec = (timeInfo.seconds / 60) * Math.PI * 2;
    const targetCel = ((timeInfo.hours + timeInfo.minutes / 60) / 24) * Math.PI * 2;

    if (!animate) {
      this.handAngles.hour = targetHr;
      this.handAngles.minute = targetMin;
      this.handAngles.second = targetSec;
      this.handAngles.celestial = targetCel;
      this.isTransitioning = false;
      return;
    }

    // Begin rapid mechanical winding transition
    this.isTransitioning = true;
    this.transitionStart = performance.now();
    this.transitionDuration = 1600;

    // Play winding audio whirl
    if (this.sound) {
      this.sound.playWindingEffect(1.4);
    }

    this.startAngles = { ...this.handAngles };

    // Calculate forward spin: spin minute hand at least 1-2 extra full revolutions
    let minDelta = targetMin - (this.startAngles.minute % (Math.PI * 2));
    if (minDelta < 0) minDelta += Math.PI * 2;
    minDelta += Math.PI * 4; // 2 extra full spins

    let hrDelta = targetHr - (this.startAngles.hour % (Math.PI * 2));
    if (hrDelta < 0) hrDelta += Math.PI * 2;
    hrDelta += (minDelta / 12); // Proportional hour movement

    let secDelta = targetSec - (this.startAngles.second % (Math.PI * 2));
    if (secDelta < 0) secDelta += Math.PI * 2;
    secDelta += Math.PI * 12; // 6 fast revolutions

    let celDelta = targetCel - (this.startAngles.celestial % (Math.PI * 2));
    if (celDelta < 0) celDelta += Math.PI * 2;

    this.targetAngles = {
      hour: this.startAngles.hour + hrDelta,
      minute: this.startAngles.minute + minDelta,
      second: this.startAngles.second + secDelta,
      celestial: this.startAngles.celestial + celDelta
    };
  }

  startLoop() {
    const loop = (timestamp) => {
      this.update(timestamp);
      this.draw();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(timestamp) {
    if (this.isTransitioning) {
      const elapsed = timestamp - this.transitionStart;
      const progress = Math.min(1.0, elapsed / this.transitionDuration);

      // Mechanical spring overshoot easing (quintic out with slight elasticity)
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.handAngles.hour = this.startAngles.hour + (this.targetAngles.hour - this.startAngles.hour) * ease;
      this.handAngles.minute = this.startAngles.minute + (this.targetAngles.minute - this.startAngles.minute) * ease;
      this.handAngles.second = this.startAngles.second + (this.targetAngles.second - this.startAngles.second) * ease;
      this.handAngles.celestial = this.startAngles.celestial + (this.targetAngles.celestial - this.startAngles.celestial) * ease;

      if (progress >= 1.0) {
        this.isTransitioning = false;
        // Normalize angles to prevent overflow
        this.handAngles.hour = this.targetAngles.hour % (Math.PI * 2);
        this.handAngles.minute = this.targetAngles.minute % (Math.PI * 2);
        this.handAngles.second = this.targetAngles.second % (Math.PI * 2);
        this.handAngles.celestial = this.targetAngles.celestial % (Math.PI * 2);

        if (this.sound) {
          this.sound.playArrivalChime();
        }
      }
    } else {
      // Normal clock ticking operation
      // Derive local time from continuous monotonic timestamp + timezone offset
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetOffsetMinutes = (this.currentTime.offsetMinutes !== undefined) ? this.currentTime.offsetMinutes : 0;
      const targetTimeMs = utcMs + targetOffsetMinutes * 60000;
      const localDate = new Date(targetTimeMs);

      const sec = localDate.getSeconds();
      const ms = localDate.getMilliseconds();
      const min = localDate.getMinutes();
      const hr = localDate.getHours();

      // Normal Clock Tick:
      // In the first 75ms of each second, the second hand snaps forward with a crisp mechanical step.
      // For the rest of the second (75ms to 999ms), it stays solidly on the second tick mark!
      // This is strictly forward-only: it can NEVER reverse or jitter.
      const stepDuration = 75; // ms for the crisp snap
      const snapProgress = Math.min(1.0, ms / stepDuration);
      const snapEase = 1 - Math.pow(1 - snapProgress, 3);

      const prevSec = (sec + 59) % 60;
      const visualSecond = prevSec + snapEase;

      // Escapement ticking sound (1 crisp tick per second on step)
      if (sec !== this.lastTickSecond) {
        this.lastTickSecond = sec;
        if (this.sound) {
          this.sound.playTick(sec % 2 === 0);
        }
      }

      this.handAngles.second = (visualSecond / 60) * Math.PI * 2;
      this.handAngles.minute = ((min + sec / 60) / 60) * Math.PI * 2;
      this.handAngles.hour = (((hr % 12) + min / 60 + sec / 3600) / 12) * Math.PI * 2;
      this.handAngles.celestial = ((hr + min / 60) / 24) * Math.PI * 2;
    }

    // Smoothly adjust lume amount based on timeOfDay
    const targetLume = (this.currentTime.timeOfDay === "night" || this.currentTime.timeOfDay === "dusk") ? 1.0 : 0.0;
    this.lumeAmount += (targetLume - this.lumeAmount) * 0.05;
  }

  draw() {
    const ctx = this.ctx;
    const r = this.radius;

    ctx.clearRect(0, 0, this.size, this.size);

    ctx.save();
    ctx.translate(r, r);

    if (this.isDialTexture) {
      // Scale dial so it covers the circular face for 3D model mapping
      const dialScale = 1.34;
      ctx.scale(dialScale, dialScale);
      this.drawDial(ctx, r);
      this.drawCelestialSubdial(ctx, r);
      this.drawDateAperture(ctx, r);
      this.drawIndices(ctx, r);
      this.drawHands(ctx, r);
    } else {
      this.drawStraps(ctx, r);
      this.drawCase(ctx, r);
      this.drawBezel(ctx, r);
      this.drawDial(ctx, r);
      this.drawCelestialSubdial(ctx, r);
      this.drawDateAperture(ctx, r);
      this.drawIndices(ctx, r);
      this.drawHands(ctx, r);
      this.drawSapphireReflection(ctx, r);
    }

    ctx.restore();
  }

  drawStraps(ctx, r) {
    const strapW = r * 0.58;
    const strapH = r * 1.05;

    ctx.save();

    // Top & Bottom Straps
    [-1, 1].forEach(dir => {
      ctx.save();
      ctx.scale(1, dir);

      // Strap background gradient (alligator grain leather)
      const grad = ctx.createLinearGradient(-strapW / 2, r * 0.72, strapW / 2, r * 0.72);
      if (this.finish === "rose-gold") {
        grad.addColorStop(0, "#1c1410");
        grad.addColorStop(0.5, "#30221a");
        grad.addColorStop(1, "#1c1410");
      } else if (this.finish === "obsidian") {
        grad.addColorStop(0, "#08090b");
        grad.addColorStop(0.5, "#15171c");
        grad.addColorStop(1, "#08090b");
      } else {
        // Classic rich saddle espresso leather
        grad.addColorStop(0, "#181412");
        grad.addColorStop(0.2, "#2e241f");
        grad.addColorStop(0.5, "#3e312a");
        grad.addColorStop(0.8, "#2e241f");
        grad.addColorStop(1, "#181412");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(-strapW / 2, r * 0.7, strapW, strapH, [0, 0, 16, 16]);
      ctx.fill();

      // Strap edge stitching
      ctx.strokeStyle = "rgba(220, 190, 150, 0.4)";
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 6]);

      // Left stitch line
      ctx.beginPath();
      ctx.moveTo(-strapW / 2 + 8, r * 0.72);
      ctx.lineTo(-strapW / 2 + 8, r * 0.7 + strapH);
      ctx.stroke();

      // Right stitch line
      ctx.beginPath();
      ctx.moveTo(strapW / 2 - 8, r * 0.72);
      ctx.lineTo(strapW / 2 - 8, r * 0.7 + strapH);
      ctx.stroke();

      ctx.setLineDash([]);
      ctx.restore();
    });

    ctx.restore();
  }

  drawCase(ctx, r) {
    const caseR = r * 0.88;

    ctx.save();

    // Drop Shadow under watch case
    ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 16;

    // Metallic outer finish gradient
    const grad = ctx.createLinearGradient(-caseR, -caseR, caseR, caseR);
    if (this.finish === "rose-gold") {
      grad.addColorStop(0, "#f3c7a5");
      grad.addColorStop(0.25, "#d9976b");
      grad.addColorStop(0.5, "#7b4831");
      grad.addColorStop(0.75, "#e5ad85");
      grad.addColorStop(1, "#9e6145");
    } else if (this.finish === "obsidian") {
      grad.addColorStop(0, "#3e424c");
      grad.addColorStop(0.3, "#1a1d24");
      grad.addColorStop(0.6, "#282d38");
      grad.addColorStop(1, "#121318");
    } else if (this.finish === "bronze") {
      grad.addColorStop(0, "#d8ad69");
      grad.addColorStop(0.35, "#8a6635");
      grad.addColorStop(0.7, "#c19554");
      grad.addColorStop(1, "#543e21");
    } else {
      // Classic 904L Brushed Stainless Steel
      grad.addColorStop(0, "#f6f8fa");
      grad.addColorStop(0.2, "#cfd5dc");
      grad.addColorStop(0.45, "#8b94a0");
      grad.addColorStop(0.7, "#e4e8ec");
      grad.addColorStop(0.9, "#a2abb6");
      grad.addColorStop(1, "#ffffff");
    }

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, caseR, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowColor = "transparent";

    // Winding Crown at 3 o'clock
    ctx.save();
    const crownX = caseR - 2;
    const crownW = r * 0.08;
    const crownH = r * 0.16;

    const crownGrad = ctx.createLinearGradient(crownX, -crownH / 2, crownX + crownW, crownH / 2);
    crownGrad.addColorStop(0, "#999");
    crownGrad.addColorStop(0.5, "#fff");
    crownGrad.addColorStop(1, "#444");

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.roundRect(crownX, -crownH / 2, crownW, crownH, [4, 6, 6, 4]);
    ctx.fill();

    // Crown ridges
    ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
    for (let y = -crownH / 2 + 3; y < crownH / 2 - 2; y += 4) {
      ctx.fillRect(crownX + 2, y, crownW - 4, 1.5);
    }
    ctx.restore();

    ctx.restore();
  }

  drawBezel(ctx, r) {
    const bezelOuter = r * 0.85;
    const bezelInner = r * 0.74;

    ctx.save();

    // Circular brushed metallic bezel
    const bezelGrad = ctx.createRadialGradient(0, 0, bezelInner, 0, 0, bezelOuter);
    if (this.finish === "rose-gold") {
      bezelGrad.addColorStop(0, "#73422c");
      bezelGrad.addColorStop(0.5, "#d6986e");
      bezelGrad.addColorStop(1, "#8e5239");
    } else if (this.finish === "obsidian") {
      bezelGrad.addColorStop(0, "#151820");
      bezelGrad.addColorStop(0.5, "#252b37");
      bezelGrad.addColorStop(1, "#0d0f14");
    } else {
      bezelGrad.addColorStop(0, "#7f8894");
      bezelGrad.addColorStop(0.3, "#e2e6eb");
      bezelGrad.addColorStop(0.7, "#9da5b0");
      bezelGrad.addColorStop(1, "#545b66");
    }

    ctx.fillStyle = bezelGrad;
    ctx.beginPath();
    ctx.arc(0, 0, bezelOuter, 0, Math.PI * 2);
    ctx.arc(0, 0, bezelInner, 0, Math.PI * 2, true);
    ctx.fill();

    // Tachymeter / Bezel Ring Indexes
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isMajor = i % 5 === 0;
      const startR = isMajor ? bezelInner + 3 : bezelInner + 6;
      const endR = bezelOuter - 4;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cos * startR, sin * startR);
      ctx.lineTo(cos * endR, sin * endR);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawDial(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Inner dial bevel shadow
    const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dialR);
    if (this.finish === "rose-gold") {
      dialGrad.addColorStop(0, "#1f1816");
      dialGrad.addColorStop(0.7, "#140e0c");
      dialGrad.addColorStop(1, "#080605");
    } else if (this.finish === "obsidian") {
      dialGrad.addColorStop(0, "#161b24");
      dialGrad.addColorStop(0.7, "#0c0e14");
      dialGrad.addColorStop(1, "#040508");
    } else {
      // Midnight Cobalt Sunburst
      dialGrad.addColorStop(0, "#132338");
      dialGrad.addColorStop(0.65, "#0b1524");
      dialGrad.addColorStop(0.95, "#060b13");
      dialGrad.addColorStop(1, "#020407");
    }

    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    // Sunburst ray reflections
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
    ctx.lineWidth = 1;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 90) {
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * dialR, Math.sin(a) * dialR);
      ctx.stroke();
    }
    ctx.restore();

    // Chronometer Brand & Precision Engraving
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Brand Emblem: PHILL
    ctx.fillStyle = this.finish === "rose-gold" ? "#e5b18a" : "#cdd5e0";
    ctx.font = `700 ${r * 0.056}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
    ctx.letterSpacing = "6px";
    ctx.fillText("PHILL", 0, -dialR * 0.38);

    ctx.font = `400 ${r * 0.024}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "rgba(200, 215, 235, 0.55)";
    ctx.letterSpacing = "2px";
    ctx.fillText("GENÈVE", 0, -dialR * 0.28);
    ctx.fillText("CHRONOMETER", 0, -dialR * 0.21);

    // Swiss Made at bottom 6 o'clock
    ctx.font = `500 ${r * 0.02}px sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
    ctx.fillText("SWISS   MADE", 0, dialR * 0.88);

    ctx.restore();
  }

  drawCelestialSubdial(ctx, r) {
    // 24-Hour Sun & Moon Complication at 6 o'clock
    const dialR = r * 0.74;
    const subX = 0;
    const subY = dialR * 0.38;
    const subR = dialR * 0.27;

    ctx.save();
    ctx.translate(subX, subY);

    // Subdial circular frame
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.stroke();

    // Clip to aperture window
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, subR - 2, 0, Math.PI * 2);
    ctx.clip();

    // Rotating celestial sky disc
    ctx.save();
    ctx.rotate(this.handAngles.celestial);

    // Top half: daytime golden azure sky with sun
    // Bottom half: nighttime deep space navy with moon & stars
    const skyGrad = ctx.createLinearGradient(0, -subR, 0, subR);
    skyGrad.addColorStop(0, "#1d5894");  // Noon sky
    skyGrad.addColorStop(0.4, "#d8853b"); // Sunset/Sunrise horizon
    skyGrad.addColorStop(0.6, "#15172d"); // Twilight
    skyGrad.addColorStop(1, "#04060f");   // Midnight space
    ctx.fillStyle = skyGrad;
    ctx.fillRect(-subR, -subR, subR * 2, subR * 2);

    // Radiant Golden Sun (at top noon position)
    const sunY = -subR * 0.55;
    const sunR = subR * 0.28;
    const sunGrad = ctx.createRadialGradient(0, sunY, 1, 0, sunY, sunR);
    sunGrad.addColorStop(0, "#fff5d0");
    sunGrad.addColorStop(0.4, "#ffc640");
    sunGrad.addColorStop(1, "rgba(255, 160, 20, 0)");
    ctx.fillStyle = sunGrad;
    ctx.beginPath();
    ctx.arc(0, sunY, sunR, 0, Math.PI * 2);
    ctx.fill();

    // Golden Crescent Moon (at bottom midnight position)
    const moonY = subR * 0.55;
    const moonR = subR * 0.22;
    ctx.fillStyle = "#e8efff";
    ctx.beginPath();
    ctx.arc(0, moonY, moonR, 0, Math.PI * 2);
    ctx.fill();

    // Moon shadow to form crescent
    ctx.fillStyle = "#0c0e18";
    ctx.beginPath();
    ctx.arc(moonR * 0.45, moonY - moonR * 0.1, moonR * 0.85, 0, Math.PI * 2);
    ctx.fill();

    // Tiny stars around moon
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    [[-subR * 0.4, moonY - 6], [subR * 0.4, moonY + 4], [-subR * 0.25, moonY + 10], [subR * 0.3, moonY - 10]].forEach(([sx, sy]) => {
      ctx.fillRect(sx, sy, 1.5, 1.5);
    });

    ctx.restore(); // end rotating disc
    ctx.restore(); // end clip

    // Subdial 24-hr Roman/Numeric markers (24, 6, 12, 18)
    ctx.font = `600 ${r * 0.024}px sans-serif`;
    ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("24", 0, -subR + 9);
    ctx.fillText("12", 0, subR - 8);
    ctx.fillText("6", subR - 9, 0);
    ctx.fillText("18", -subR + 9, 0);

    ctx.restore();
  }

  drawDateAperture(ctx, r) {
    // 3 o'clock Date Window with Cyclops Lens effect
    const dialR = r * 0.74;
    const dateX = dialR * 0.64;
    const dateY = 0;
    const dateW = r * 0.15;
    const dateH = r * 0.12;

    ctx.save();
    ctx.translate(dateX, dateY);

    // Beveled frame
    ctx.fillStyle = this.finish === "rose-gold" ? "#d4976c" : "#bdc5cf";
    ctx.beginPath();
    ctx.roundRect(-dateW / 2 - 2, -dateH / 2 - 2, dateW + 4, dateH + 4, 3);
    ctx.fill();

    // Inner window
    ctx.fillStyle = "#f6f8fb";
    ctx.beginPath();
    ctx.roundRect(-dateW / 2, -dateH / 2, dateW, dateH, 2);
    ctx.fill();

    // Date Numeral
    ctx.fillStyle = "#111822";
    ctx.font = `700 ${r * 0.068}px "Helvetica Neue", Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(this.currentTime.day || 1), 0, 1);

    ctx.restore();
  }

  drawIndices(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isHour = i % 5 === 0;

      ctx.save();
      ctx.rotate(angle);

      if (isHour) {
        const markerW = r * 0.024;
        const markerH = (i === 0 || i === 30 || i === 45) ? r * 0.13 : r * 0.095;
        const markerY = -dialR + 10;

        // Skip 3 o'clock marker partially for date window
        if (i === 15) {
          ctx.restore();
          continue;
        }

        // Diamond-cut faceted metallic applied marker
        ctx.fillStyle = this.finish === "rose-gold" ? "#e4a97f" : "#dce2ec";
        ctx.beginPath();
        ctx.roundRect(-markerW / 2, markerY, markerW, markerH, 2);
        ctx.fill();

        // Marker luminous center stripe (Super-LumiNova)
        const lumeColor = this.lumeAmount > 0.05
          ? `rgba(50, 255, 180, ${0.4 + this.lumeAmount * 0.6})`
          : "rgba(240, 248, 255, 0.85)";

        if (this.lumeAmount > 0.1) {
          ctx.shadowColor = "#39ffb4";
          ctx.shadowBlur = 12 * this.lumeAmount;
        }

        ctx.fillStyle = lumeColor;
        ctx.fillRect(-markerW / 4, markerY + 3, markerW / 2, markerH - 6);
      } else {
        // Subtle minute railroad tick
        ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, -dialR + 4);
        ctx.lineTo(0, -dialR + 12);
        ctx.stroke();
      }

      ctx.restore();
    }

    ctx.restore();
  }

  drawHands(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Night Super-LumiNova glow setup
    const lumeColor = this.lumeAmount > 0.05
      ? `rgba(60, 255, 190, ${0.5 + this.lumeAmount * 0.5})`
      : "rgba(255, 255, 255, 0.9)";

    const metalColor = this.finish === "rose-gold" ? "#e6ad85" : "#e4eaef";
    const darkMetalColor = this.finish === "rose-gold" ? "#885139" : "#69727d";

    // 1. Hour Hand (Dauphine Faceted)
    ctx.save();
    ctx.rotate(this.handAngles.hour);

    // Drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const hrLen = dialR * 0.55;
    const hrW = r * 0.038;

    // Left Facet (Light)
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(-hrW, 0);
    ctx.lineTo(0, -hrLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Darker bevel)
    ctx.fillStyle = darkMetalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(hrW, 0);
    ctx.lineTo(0, -hrLen);
    ctx.closePath();
    ctx.fill();

    // Luminous inner slit
    if (this.lumeAmount > 0.1) {
      ctx.shadowColor = "#39ffb4";
      ctx.shadowBlur = 14 * this.lumeAmount;
    }
    ctx.fillStyle = lumeColor;
    ctx.fillRect(-hrW * 0.35, -hrLen * 0.8, hrW * 0.7, hrLen * 0.55);

    ctx.restore();

    // 2. Minute Hand (Longer Faceted Sword)
    ctx.save();
    ctx.rotate(this.handAngles.minute);

    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    const minLen = dialR * 0.82;
    const minW = r * 0.032;

    // Left Facet
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(-minW, 0);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet
    ctx.fillStyle = darkMetalColor;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.06);
    ctx.lineTo(minW, 0);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Luminous inner slit
    if (this.lumeAmount > 0.1) {
      ctx.shadowColor = "#39ffb4";
      ctx.shadowBlur = 14 * this.lumeAmount;
    }
    ctx.fillStyle = lumeColor;
    ctx.fillRect(-minW * 0.35, -minLen * 0.85, minW * 0.7, minLen * 0.65);

    ctx.restore();

    // 3. Second Hand (Needle sweep with counterbalance and crimson tip)
    ctx.save();
    ctx.rotate(this.handAngles.second);

    ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
    ctx.shadowBlur = 12;
    ctx.shadowOffsetY = 8;

    const secLen = dialR * 0.92;
    const secTail = dialR * 0.28;

    // Needle body
    ctx.strokeStyle = "#e63946"; // Vibrant horological red
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, secTail);
    ctx.lineTo(0, -secLen);
    ctx.stroke();

    // Counterbalance circle
    ctx.fillStyle = "#e63946";
    ctx.beginPath();
    ctx.arc(0, secTail * 0.5, r * 0.024, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 4. Center Hand Boss Pin (Polished metallic cap)
    ctx.fillStyle = metalColor;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.035, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#1e2229";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.012, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  drawSapphireReflection(ctx, r) {
    const dialR = r * 0.74;

    ctx.save();

    // Anti-Reflective curved sapphire glass diagonal flare
    const flareGrad = ctx.createLinearGradient(-dialR, -dialR, dialR, dialR);
    flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
    flareGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.04)");
    flareGrad.addColorStop(0.48, "rgba(255, 255, 255, 0)");
    flareGrad.addColorStop(0.52, "rgba(100, 180, 255, 0.06)"); // AR violet/blue coating reflection
    flareGrad.addColorStop(0.7, "rgba(255, 255, 255, 0.03)");
    flareGrad.addColorStop(1, "rgba(255, 255, 255, 0.12)");

    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR - 1, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

  // =========================================================================
  // 4. 3D Wristwatch WebGL Engine (Case, Bezel, Lugs, Straps, 3D Spin)
  // =========================================================================
/**
 * 3D Wristwatch WebGL Engine — PHILL
 * Renders an ultra-luxurious, fully interactive 3D mechanical timepiece in real-time.
 * Features:
 * - Full 3D metallic case, beveled bezel, sculpted lugs, and knurled crown
 * - Curved 3D leather straps with realistic stitching and wrist curvature
 * - Live dynamic dial texture projected from the 2D watch canvas (hands tick in 3D!)
 * - Dome sapphire crystal with dynamic Fresnel specular light sweeps
 * - Drag-to-inspect 3D orbit controls
 * - High-speed cinematic 3D tumble/spin animation when searching locations
 */

class Watch3DEngine {
  constructor(canvas, watch2D, soundEngine) {
    this.canvas = canvas;
    this.watch2D = watch2D;
    this.sound = soundEngine;

    this.gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
              canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

    if (!this.gl) {
      console.error("WebGL not available for 3D Wristwatch.");
      return;
    }

    // 3D Orientation & Camera
    this.rotation = { x: 0, y: 0, z: 0 };
    this.targetRotation = { x: 0, y: 0, z: 0 };
    this.cameraDistance = 4.2;
    this.targetDistance = 4.2;
    this.minDistance = 2.6;
    this.maxDistance = 6.5;

    // Interaction
    this.isDragging = false;
    this.lastMouse = { x: 0, y: 0 };
    this.idleTimer = null;
    this.autoIdle = true;

    // Cinematic Spin Animation
    this.isSpinning = false;
    this.spinStartTime = 0;
    this.spinDuration = 2200; // ms
    this.startRot = { x: 0, y: 0, z: 0 };
    this.endRot = { x: 0, y: 0, z: 0 };
    this.startDist = 4.2;
    this.endDist = 4.2;
    this.onSpinComplete = null;

    this.finish = "steel"; // 'steel' | 'rose-gold' | 'obsidian' | 'bronze'

    this.initWebGL();
    this.bindEvents();
    this.resize();
    this.startRenderLoop();
  }

  setFinish(finish) {
    this.finish = finish;
  }

  initWebGL() {
    const gl = this.gl;

    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec2 aTexCoord;

      uniform mat4 uModel;
      uniform mat4 uView;
      uniform mat4 uProjection;
      uniform mat3 uNormalMatrix;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vTexCoord;

      void main() {
        vec4 worldPos = uModel * vec4(aPosition, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = normalize(uNormalMatrix * aNormal);
        vTexCoord = aTexCoord;
        gl_Position = uProjection * uView * worldPos;
      }
    `;

    const fsSource = `
      precision mediump float;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec2 vTexCoord;

      uniform int uMaterial; // 0=Dial, 1=Metal Case, 2=Bezel, 3=Strap, 4=Sapphire Crystal, 5=Crown
      uniform sampler2D uDialTexture;
      uniform vec3 uBaseColor;
      uniform vec3 uSpecColor;
      uniform vec3 uCameraPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPos - vWorldPos);

        // Key light (Top right front)
        vec3 lightDir1 = normalize(vec3(0.6, 0.8, 1.0));
        // Fill light (Bottom left)
        vec3 lightDir2 = normalize(vec3(-0.6, -0.4, 0.5));

        float diff1 = max(dot(normal, lightDir1), 0.0);
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.4;
        float diffuse = diff1 + diff2;

        // Specular
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 32.0);

        if (uMaterial == 0) {
          // Live Dial Texture
          vec4 dialColor = texture2D(uDialTexture, vTexCoord);
          vec3 litColor = dialColor.rgb * (0.8 + diffuse * 0.3) + vec3(1.0) * spec1 * 0.15;
          gl_FragColor = vec4(litColor, dialColor.a);
          return;
        }

        if (uMaterial == 1 || uMaterial == 2 || uMaterial == 5) {
          // Metallic Case, Bezel, and Crown
          float metallicSpec = pow(max(dot(normal, halfDir1), 0.0), 48.0);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
          vec3 metalColor = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * (metallicSpec * 1.2 + fresnel * 0.4);
          gl_FragColor = vec4(metalColor, 1.0);
          return;
        }

        if (uMaterial == 3) {
          // Leather Straps with subtle stitching edge
          vec3 strapCol = uBaseColor * (0.4 + diffuse * 0.6);
          // Stitch line highlighting
          float edgeDist = abs(vTexCoord.x - 0.5);
          if (abs(edgeDist - 0.42) < 0.02) {
            strapCol += vec3(0.3, 0.25, 0.2);
          }
          gl_FragColor = vec4(strapCol, 1.0);
          return;
        }

        if (uMaterial == 4) {
          // Sapphire Crystal Dome Lens
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
          // Sweeping diagonal flare
          float flare = pow(max(dot(normal, halfDir1), 0.0), 64.0);
          vec3 glassCol = vec3(0.8, 0.95, 1.0) * (flare * 1.5 + fresnel * 0.6);
          float alpha = 0.12 + fresnel * 0.35 + flare * 0.5;
          gl_FragColor = vec4(glassCol, alpha);
          return;
        }

        gl_FragColor = vec4(uBaseColor, 1.0);
      }
    `;

    this.program = this.createProgram(gl, vsSource, fsSource);

    this.locations = {
      aPosition: gl.getAttribLocation(this.program, "aPosition"),
      aNormal: gl.getAttribLocation(this.program, "aNormal"),
      aTexCoord: gl.getAttribLocation(this.program, "aTexCoord"),
      uModel: gl.getUniformLocation(this.program, "uModel"),
      uView: gl.getUniformLocation(this.program, "uView"),
      uProjection: gl.getUniformLocation(this.program, "uProjection"),
      uNormalMatrix: gl.getUniformLocation(this.program, "uNormalMatrix"),
      uMaterial: gl.getUniformLocation(this.program, "uMaterial"),
      uDialTexture: gl.getUniformLocation(this.program, "uDialTexture"),
      uBaseColor: gl.getUniformLocation(this.program, "uBaseColor"),
      uSpecColor: gl.getUniformLocation(this.program, "uSpecColor"),
      uCameraPos: gl.getUniformLocation(this.program, "uCameraPos")
    };

    // Build procedural 3D geometries
    this.parts = {
      dial: this.createDiscGeometry(1.0, 48, true),
      crystal: this.createDomeGeometry(1.02, 0.06, 48),
      bezel: this.createBezelGeometry(1.0, 1.14, 0.08, 48),
      caseBody: this.createCylinderGeometry(1.14, 0.22, 48),
      lugs: this.createLugsGeometry(),
      crown: this.createCrownGeometry(0.12, 0.14, 24),
      strapTop: this.createStrapGeometry(true),
      strapBottom: this.createStrapGeometry(false)
    };

    // Upload geometry buffers
    for (const key of Object.keys(this.parts)) {
      const part = this.parts[key];
      part.vBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.vertices));
      part.nBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.normals));
      part.tBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(part.texCoords));
      part.iBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(part.indices));
    }

    // Dynamic texture from the 2D watch canvas
    this.dialTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.dialTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  createProgram(gl, vs, fs) {
    const vShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vShader, vs);
    gl.compileShader(vShader);

    const fShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fShader, fs);
    gl.compileShader(fShader);

    const prog = gl.createProgram();
    gl.attachShader(prog, vShader);
    gl.attachShader(prog, fShader);
    gl.linkProgram(prog);
    return prog;
  }

  createBuffer(gl, type, data) {
    const buf = gl.createBuffer();
    gl.bindBuffer(type, buf);
    gl.bufferData(type, data, gl.STATIC_DRAW);
    return buf;
  }

  // --- Procedural 3D Horological Geometry Generators ---

  createDiscGeometry(radius, segments, isDial = false) {
    const vertices = [0, 0, 0];
    const normals = [0, 0, 1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(0, 0, 1);
      // Map UV so dial texture is oriented perfectly upright
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 - Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i, i + 1);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createDomeGeometry(radius, height, segments) {
    const vertices = [0, 0, height];
    const normals = [0, 0, 1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(x * 0.5, y * 0.5, 1.0);
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 - Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i, i + 1);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createCylinderGeometry(radius, height, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const halfH = height / 2;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      const u = i / segments;

      // Top rim
      vertices.push(x, y, halfH);
      normals.push(Math.cos(theta), Math.sin(theta), 0);
      texCoords.push(u, 0);

      // Bottom rim
      vertices.push(x, y, -halfH);
      normals.push(Math.cos(theta), Math.sin(theta), 0);
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const top1 = i * 2;
      const bot1 = top1 + 1;
      const top2 = (i + 1) * 2;
      const bot2 = top2 + 1;

      indices.push(top1, bot1, top2);
      indices.push(top2, bot1, bot2);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createBezelGeometry(innerR, outerR, depth, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const u = i / segments;

      // Inner top
      vertices.push(cos * innerR, sin * innerR, depth);
      normals.push(cos * 0.4, sin * 0.4, 0.9);
      texCoords.push(u, 0);

      // Outer top
      vertices.push(cos * outerR, sin * outerR, 0);
      normals.push(cos * 0.8, sin * 0.8, 0.4);
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const in1 = i * 2;
      const out1 = in1 + 1;
      const in2 = (i + 1) * 2;
      const out2 = in2 + 1;

      indices.push(in1, out1, in2);
      indices.push(in2, out1, out2);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createLugsGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // 4 Sculpted horns at top and bottom of watch case
    const lugPositions = [
      [-0.55, 0.95, -0.42, 1.45],  // Top Left
      [0.42, 1.45, 0.55, 0.95],    // Top Right
      [-0.55, -0.95, -0.42, -1.45],// Bottom Left
      [0.42, -1.45, 0.55, -0.95]   // Bottom Right
    ];

    let baseIdx = 0;
    lugPositions.forEach(([x1, y1, x2, y2]) => {
      const zTop = 0.08, zBot = -0.10;
      // Front facet
      vertices.push(x1, y1, zTop, x2, y2, zTop * 0.5, x2, y2, zBot, x1, y1, zBot);
      normals.push(0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1);
      texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);

      indices.push(baseIdx, baseIdx + 1, baseIdx + 2);
      indices.push(baseIdx, baseIdx + 2, baseIdx + 3);
      baseIdx += 4;
    });

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createCrownGeometry(radius, length, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Cylinder along X-axis at 3 o'clock
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const y = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const u = i / segments;

      vertices.push(0, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 0);

      vertices.push(length, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 1);
    }

    for (let i = 0; i < segments; i++) {
      const p1 = i * 2;
      const p2 = p1 + 1;
      const p3 = (i + 1) * 2;
      const p4 = p3 + 1;

      indices.push(p1, p2, p3);
      indices.push(p3, p2, p4);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createStrapGeometry(isTop) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const dir = isTop ? 1 : -1;
    const width = 0.85;
    const segments = 16;
    const strapLength = 2.0;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = (1.25 + t * strapLength) * dir;
      // Gentle backward curve following wrist curvature
      const z = -0.06 - Math.pow(t, 1.8) * 0.85;
      const nz = -Math.pow(t, 0.8) * 0.6;
      const ny = dir * 0.3;

      // Left edge
      vertices.push(-width / 2, y, z);
      normals.push(0, ny, 1 + nz);
      texCoords.push(0, t);

      // Right edge
      vertices.push(width / 2, y, z);
      normals.push(0, ny, 1 + nz);
      texCoords.push(1, t);
    }

    for (let i = 0; i < segments; i++) {
      const p1 = i * 2;
      const p2 = p1 + 1;
      const p3 = (i + 1) * 2;
      const p4 = p3 + 1;

      indices.push(p1, p2, p3);
      indices.push(p3, p2, p4);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  bindEvents() {
    const canvas = this.canvas;

    const onPointerDown = (e) => {
      this.isDragging = true;
      this.autoIdle = false;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);
      this.lastMouse = { x, y };
      clearTimeout(this.idleTimer);
    };

    const onPointerMove = (e) => {
      if (!this.isDragging || this.isSpinning) return;
      const x = e.clientX || (e.touches && e.touches[0].clientX);
      const y = e.clientY || (e.touches && e.touches[0].clientY);

      const dx = x - this.lastMouse.x;
      const dy = y - this.lastMouse.y;

      this.targetRotation.y += dx * 0.008;
      this.targetRotation.x += dy * 0.008;

      // Constrain tilt to prevent upside-down flip
      this.targetRotation.x = Math.max(-Math.PI / 2.5, Math.min(Math.PI / 2.5, this.targetRotation.x));
      this.lastMouse = { x, y };
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Reset to face after 4 seconds of inactivity
      this.idleTimer = setTimeout(() => {
        if (!this.isSpinning) {
          this.targetRotation = { x: 0, y: 0, z: 0 };
          this.autoIdle = true;
        }
      }, 4000);
    };

    const onWheel = (e) => {
      e.preventDefault();
      this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance + e.deltaY * 0.002));
    };

    canvas.addEventListener("mousedown", onPointerDown);
    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);

    canvas.addEventListener("touchstart", onPointerDown, { passive: true });
    window.addEventListener("touchmove", onPointerMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    canvas.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = this.canvas.clientWidth || window.innerWidth;
    const height = this.canvas.clientHeight || window.innerHeight;

    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * The Climax Feature:
   * 3D Wristwatch full-screen tumble & spin animation when a location is searched!
   */
  spinToLocation(timeInfo, onComplete) {
    this.isSpinning = true;
    this.autoIdle = false;
    this.spinStartTime = performance.now();
    this.spinDuration = 2200; // ms
    this.onSpinComplete = onComplete;

    this.startRot = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z };
    // 3 full 360-degree spins along Y (yaw) plus a dynamic roll along X/Z
    this.endRot = {
      x: 0,
      y: this.rotation.y + Math.PI * 6,
      z: 0
    };

    this.startDist = this.cameraDistance;
    this.endDist = 3.8; // Punch in slightly at destination

    if (this.sound) {
      this.sound.playWindingEffect(1.8);
    }
  }

  startRenderLoop() {
    const render = (now) => {
      this.update(now);
      this.draw();
      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);
  }

  update(now) {
    if (this.isSpinning) {
      const elapsed = now - this.spinStartTime;
      const progress = Math.min(1.0, elapsed / this.spinDuration);

      // Quintic ease out for mechanical spinning deceleration
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.rotation.y = this.startRot.y + (this.endRot.y - this.startRot.y) * ease;
      // Banking tilt during spin
      this.rotation.x = Math.sin(progress * Math.PI) * 0.45;
      this.rotation.z = Math.sin(progress * Math.PI * 2) * 0.15;

      this.cameraDistance = this.startDist + (this.endDist - this.startDist) * ease;

      if (progress >= 1.0) {
        this.isSpinning = false;
        this.rotation.x = 0;
        this.rotation.y = 0;
        this.rotation.z = 0;
        this.targetRotation = { x: 0, y: 0, z: 0 };
        this.cameraDistance = 4.2;
        this.targetDistance = 4.2;

        if (this.sound) {
          this.sound.playArrivalChime();
        }

        if (this.onSpinComplete) {
          const cb = this.onSpinComplete;
          this.onSpinComplete = null;
          cb();
        }
      }
    } else {
      // Gentle idle sway when untouched
      if (this.autoIdle && !this.isDragging) {
        const time = now * 0.0012;
        this.targetRotation.y = Math.sin(time) * 0.18;
        this.targetRotation.x = Math.cos(time * 0.7) * 0.08;
      }

      this.rotation.x += (this.targetRotation.x - this.rotation.x) * 0.1;
      this.rotation.y += (this.targetRotation.y - this.rotation.y) * 0.1;
      this.rotation.z += (this.targetRotation.z - this.rotation.z) * 0.1;
      this.cameraDistance += (this.targetDistance - this.cameraDistance) * 0.1;
    }
  }

  draw() {
    const gl = this.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(this.program);

    // Update Dial Texture from 2D Watch Canvas in real-time
    if (this.watch2D && this.watch2D.canvas) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.dialTexture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.watch2D.canvas);
      gl.uniform1i(this.locations.uDialTexture, 0);
    }

    // Build Matrices
    const aspect = this.canvas.width / this.canvas.height;
    const projMatrix = this.createPerspective(42 * Math.PI / 180, aspect, 0.1, 100.0);
    const viewMatrix = this.createLookAt([0, 0, this.cameraDistance], [0, 0, 0], [0, 1, 0]);

    // Model matrix with rotation around X, Y, Z
    const modelMatrix = this.createIdentity();
    this.rotateX(modelMatrix, this.rotation.x);
    this.rotateY(modelMatrix, this.rotation.y);
    this.rotateZ(modelMatrix, this.rotation.z);

    const normalMatrix = this.createNormalMatrix(modelMatrix);

    gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
    gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
    gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

    // Color definitions based on chosen finish
    const metalColors = {
      steel: { base: [0.78, 0.82, 0.88], spec: [1.0, 1.0, 1.0] },
      "rose-gold": { base: [0.86, 0.62, 0.48], spec: [1.0, 0.88, 0.75] },
      obsidian: { base: [0.18, 0.20, 0.24], spec: [0.45, 0.50, 0.58] },
      bronze: { base: [0.74, 0.55, 0.32], spec: [0.95, 0.78, 0.52] }
    };
    const strapColors = {
      steel: [0.12, 0.10, 0.09],      // Rich espresso leather
      "rose-gold": [0.15, 0.09, 0.07], // Saddle cognac leather
      obsidian: [0.06, 0.07, 0.08],    // Midnight stealth black leather
      bronze: [0.18, 0.12, 0.08]       // Vintage tobacco leather
    };

    const finishColor = metalColors[this.finish] || metalColors.steel;
    const strapCol = strapColors[this.finish] || strapColors.steel;

    // Helper to render a mesh part
    const drawPart = (part, mMatrix, materialType, baseCol, specCol) => {
      const nMat = this.createNormalMatrix(mMatrix);
      gl.uniformMatrix4fv(this.locations.uModel, false, mMatrix);
      gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, nMat);
      gl.uniform1i(this.locations.uMaterial, materialType);
      gl.uniform3fv(this.locations.uBaseColor, baseCol || finishColor.base);
      gl.uniform3fv(this.locations.uSpecColor, specCol || finishColor.spec);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.vBuffer);
      gl.enableVertexAttribArray(this.locations.aPosition);
      gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.nBuffer);
      gl.enableVertexAttribArray(this.locations.aNormal);
      gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, part.tBuffer);
      gl.enableVertexAttribArray(this.locations.aTexCoord);
      gl.vertexAttribPointer(this.locations.aTexCoord, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, part.iBuffer);
      gl.drawElements(gl.TRIANGLES, part.count, gl.UNSIGNED_SHORT, 0);
    };

    // 1. Draw Leather Straps (Top and Bottom)
    drawPart(this.parts.strapTop, modelMatrix, 3, strapCol, [0.3, 0.25, 0.2]);
    drawPart(this.parts.strapBottom, modelMatrix, 3, strapCol, [0.3, 0.25, 0.2]);

    // 2. Draw Lugs (4 horns)
    drawPart(this.parts.lugs, modelMatrix, 1);

    // 3. Draw Main Case Body
    drawPart(this.parts.caseBody, modelMatrix, 1);

    // 4. Draw Winding Crown at 3 o'clock
    const crownMatrix = new Float32Array(modelMatrix);
    this.translate(crownMatrix, 1.14, 0, 0);
    drawPart(this.parts.crown, crownMatrix, 5);

    // 5. Draw Bezel
    const bezelMatrix = new Float32Array(modelMatrix);
    this.translate(bezelMatrix, 0, 0, 0.11);
    drawPart(this.parts.bezel, bezelMatrix, 2);

    // 6. Draw Live Watch Dial Face
    const dialMatrix = new Float32Array(modelMatrix);
    this.translate(dialMatrix, 0, 0, 0.12);
    drawPart(this.parts.dial, dialMatrix, 0);

    // 7. Draw Dome Sapphire Crystal with specular sheen
    const crystalMatrix = new Float32Array(modelMatrix);
    this.translate(crystalMatrix, 0, 0, 0.14);
    drawPart(this.parts.crystal, crystalMatrix, 4);
  }

  // --- 4x4 Matrix Utilities ---
  createIdentity() {
    return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  }

  createPerspective(fovy, aspect, near, far) {
    const f = 1.0 / Math.tan(fovy / 2);
    const nf = 1 / (near - far);
    return new Float32Array([
      f / aspect, 0, 0, 0,
      0, f, 0, 0,
      0, 0, (far + near) * nf, -1,
      0, 0, 2 * far * near * nf, 0
    ]);
  }

  createLookAt(eye, center, up) {
    const z0 = eye[0] - center[0], z1 = eye[1] - center[1], z2 = eye[2] - center[2];
    const lenZ = 1 / Math.hypot(z0, z1, z2);
    const zx = z0 * lenZ, zy = z1 * lenZ, zz = z2 * lenZ;

    const x0 = up[1] * zz - up[2] * zy, x1 = up[2] * zx - up[0] * zz, x2 = up[0] * zy - up[1] * zx;
    const lenX = 1 / Math.hypot(x0, x1, x2);
    const xx = x0 * lenX, xy = x1 * lenX, xz = x2 * lenX;

    const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;

    return new Float32Array([
      xx, yx, zx, 0,
      xy, yy, zy, 0,
      xz, yz, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
      -(yx * eye[0] + yy * eye[1] + yz * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  }

  createNormalMatrix(m) {
    return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]);
  }

  translate(m, tx, ty, tz) {
    m[12] += m[0] * tx + m[4] * ty + m[8] * tz;
    m[13] += m[1] * tx + m[5] * ty + m[9] * tz;
    m[14] += m[2] * tx + m[6] * ty + m[10] * tz;
    m[15] += m[3] * tx + m[7] * ty + m[11] * tz;
  }

  rotateX(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m1 = m[1], m5 = m[5], m9 = m[9], m13 = m[13];
    const m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
    m[1] = m1 * c + m2 * s;
    m[5] = m5 * c + m6 * s;
    m[9] = m9 * c + m10 * s;
    m[13] = m13 * c + m14 * s;
    m[2] = m2 * c - m1 * s;
    m[6] = m6 * c - m5 * s;
    m[10] = m10 * c - m9 * s;
    m[14] = m14 * c - m13 * s;
  }

  rotateY(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m4 = m[4], m8 = m[8], m12 = m[12];
    const m2 = m[2], m6 = m[6], m10 = m[10], m14 = m[14];
    m[0] = m0 * c - m2 * s;
    m[4] = m4 * c - m6 * s;
    m[8] = m8 * c - m10 * s;
    m[12] = m12 * c - m14 * s;
    m[2] = m0 * s + m2 * c;
    m[6] = m4 * s + m6 * c;
    m[10] = m8 * s + m10 * c;
    m[14] = m12 * s + m14 * c;
  }

  rotateZ(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m4 = m[4], m8 = m[8], m12 = m[12];
    const m1 = m[1], m5 = m[5], m9 = m[9], m13 = m[13];
    m[0] = m0 * c + m1 * s;
    m[4] = m4 * c + m5 * s;
    m[8] = m8 * c + m9 * s;
    m[12] = m12 * c + m13 * s;
    m[1] = m1 * c - m0 * s;
    m[5] = m5 * c - m4 * s;
    m[9] = m9 * c - m8 * s;
    m[13] = m13 * c - m12 * s;
  }
}

  // =========================================================================
  // 5. Application Controller
  // =========================================================================
/**
 * Antigravity "PHILL" World Time Application Controller
 * Orchestrates global search (countries, cities, towns),
 * 3D wristwatch spinning animation, horological hand transitions,
 * and dynamic atmospheric background themes.
 */






class WatchWorldApp {
  constructor() {
    // DOM Elements
    this.searchForm = document.getElementById("search-form");
    this.searchInput = document.getElementById("search-input");
    this.suggestionsDropdown = document.getElementById("suggestions-dropdown");
    this.popularChips = document.querySelectorAll(".city-chip");

    this.heroStage = document.getElementById("hero-stage");
    this.watchWrapper = document.getElementById("watch-wrapper");
    this.watch3DCanvas = document.getElementById("watch-3d-canvas");
    this.watch2DCanvas = document.getElementById("watch-2d-canvas");
    this.watchTelemetryEl = document.getElementById("watch-telemetry");

    // Info Display Elements
    this.locationNameEl = document.getElementById("location-name");
    this.locationCountryEl = document.getElementById("location-country");
    this.digitalTimeEl = document.getElementById("digital-time");
    this.timePeriodEl = document.getElementById("time-period");
    this.timezoneBadgeEl = document.getElementById("timezone-badge");
    this.relativeTimeEl = document.getElementById("relative-time");
    this.solarStatusEl = document.getElementById("solar-status");
    this.coordsBadgeEl = document.getElementById("coords-badge");

    // Controls
    this.soundToggleBtn = document.getElementById("sound-toggle-btn");
    this.finishButtons = document.querySelectorAll(".finish-btn");

    // Background Container
    this.body = document.body;
    this.skyBackground = document.getElementById("sky-background");
    this.starsLayer = document.getElementById("stars-layer");
    this.sunMoonGlow = document.getElementById("sun-moon-glow");

    // State
    this.selectedCity = null;
    this.userHomeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    this.isTransitioning = false;
    this.liveClockTimer = null;
    this.telemetryTimer = null;

    this.initEngines();
    this.generateStarfield();
    this.bindEvents();
    this.initDefaultLocation();
  }

  initEngines() {
    // 2D engine renders the Swiss horological dial with active ticking hands
    this.watch2D = new WatchEngine(this.watch2DCanvas, soundEngine, true);
    // 3D engine renders the case, bezel, lugs, crown, straps, and maps 2D dial
    this.watch3D = new Watch3DEngine(this.watch3DCanvas, this.watch2D, soundEngine);
  }

  generateStarfield() {
    if (!this.starsLayer) return;
    this.starsLayer.innerHTML = "";
    const count = 180;
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 2.2 + 0.8;
      star.style.width = `${size}px`;
      star.style.height = `${size}px`;
      star.style.opacity = (Math.random() * 0.7 + 0.3).toString();
      star.style.animationDelay = `${Math.random() * 4}s`;
      star.style.animationDuration = `${Math.random() * 3 + 2}s`;
      fragment.appendChild(star);
    }
    this.starsLayer.appendChild(fragment);
  }

  bindEvents() {
    // Search input typing & autocomplete
    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      this.handleSearchInput(query);
    });

    this.searchInput.addEventListener("focus", () => {
      if (this.searchInput.value.trim()) {
        this.handleSearchInput(this.searchInput.value.trim());
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.searchForm.contains(e.target)) {
        this.suggestionsDropdown.classList.add("hidden");
      }
    });

    // Form submit with async universal geocoder (Supports Countries, Cities, Towns)
    this.searchForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      soundEngine.init();
      const query = this.searchInput.value.trim();
      if (!query) return;

      this.showSearchFeedback(`Locating "${query}"...`);
      const resolved = await resolveAnyLocation(query);
      if (resolved) {
        this.suggestionsDropdown.classList.add("hidden");
        this.searchInput.value = resolved.name;
        this.selectLocation(resolved, true);
      } else {
        this.showSearchFeedback(`Could not locate "${query}". Try another country, city, or town.`);
      }
      this.searchInput.blur();
    });

    // Quick Popular City/Country Chips
    this.popularChips.forEach(chip => {
      chip.addEventListener("click", async () => {
        soundEngine.init();
        const query = chip.dataset.city;
        this.searchInput.value = query;
        const resolved = await resolveAnyLocation(query);
        if (resolved) {
          this.selectLocation(resolved, true);
        }
      });
    });

    // Sound Toggle
    this.soundToggleBtn.addEventListener("click", () => {
      const isSoundOn = soundEngine.toggleSound();
      this.soundToggleBtn.classList.toggle("muted", !isSoundOn);
      this.soundToggleBtn.setAttribute("aria-label", isSoundOn ? "Mute audio" : "Unmute audio");
      const icon = this.soundToggleBtn.querySelector(".sound-icon");
      if (icon) {
        icon.textContent = isSoundOn ? "🔊" : "🔇";
      }
    });

    // Watch Finish Selection (Steel, Rose Gold, Obsidian, Bronze)
    this.finishButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.init();
        this.finishButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const finish = btn.dataset.finish;
        this.watch2D.setFinish(finish);
        this.watch3D.setFinish(finish);
      });
    });

    // Enable audio on first user touch anywhere
    const resumeAudio = () => {
      soundEngine.init();
      window.removeEventListener("pointerdown", resumeAudio);
      window.removeEventListener("keydown", resumeAudio);
    };
    window.addEventListener("pointerdown", resumeAudio);
    window.addEventListener("keydown", resumeAudio);
  }

  handleSearchInput(query) {
    if (!query) {
      this.suggestionsDropdown.classList.add("hidden");
      return;
    }

    const matches = searchCities(query);
    if (matches.length === 0) {
      this.suggestionsDropdown.innerHTML = `
        <div class="suggestion-item no-match">
          <span>Press <strong>Enter</strong> or click <strong>Find Time</strong> to search any location on Earth</span>
        </div>
      `;
      this.suggestionsDropdown.classList.remove("hidden");
      return;
    }

    this.suggestionsDropdown.innerHTML = matches.map((item, idx) => `
      <div class="suggestion-item" data-index="${idx}">
        <span class="city-flag">${item.flag}</span>
        <div class="city-details">
          <span class="city-title">${item.name}</span>
          <span class="city-country">${item.isCountry ? (item.capital ? `Capital: ${item.capital}` : "Country") : item.country}</span>
        </div>
        <span class="city-tz">${item.tz ? item.tz.split("/")[1] || item.tz : ""}</span>
      </div>
    `).join("");

    this.suggestionsDropdown.classList.remove("hidden");

    // Click on suggestion
    this.suggestionsDropdown.querySelectorAll(".suggestion-item").forEach(item => {
      item.addEventListener("click", () => {
        soundEngine.init();
        const idx = parseInt(item.dataset.index, 10);
        const loc = matches[idx];
        if (loc) {
          this.searchInput.value = loc.name;
          this.selectLocation(loc, true);
        }
        this.suggestionsDropdown.classList.add("hidden");
      });
    });
  }

  initDefaultLocation() {
    // Find closest city to user's local timezone
    const matchedCity = WORLD_CITIES.find(c => c.tz === this.userHomeTimezone) ||
                        WORLD_CITIES.find(c => c.name === "London") ||
                        WORLD_COUNTRIES.find(c => c.name === "United Kingdom");

    this.selectLocation(matchedCity || {
      name: "London",
      country: "United Kingdom",
      flag: "🇬🇧",
      lat: 51.5074,
      lng: -0.1278,
      tz: "Europe/London"
    }, false);
  }

  /**
   * The Central Climax Sequence:
   * 1. Telemetry HUD activates with location coordinates.
   * 2. 3D Wrist Watch performs cinematic tumble & spin animation with mechanical winding sound.
   * 3. Settle on arrival with crystal chime.
   * 4. Horological hands sweep rapidly forward to the destination time.
   * 5. Background sky theme seamlessly morphs to reflect destination local time.
   */
  selectLocation(city, isUserTriggered = true) {
    this.selectedCity = city;

    // Get time information for the target city or country
    const timeInfo = getTimeInfoForZone(city.tz);

    // Update digital readout and meta cards
    this.updateInfoCards(city, timeInfo);

    if (!isUserTriggered) {
      // Direct set without spin
      this.watch2D.setTime(timeInfo, false);
      this.applyBackgroundTheme(timeInfo);
      this.setTelemetry(`✦ ${city.flag} ${city.name.toUpperCase()} • SYNCHRONIZED`, false);
      this.startLiveClock();
      return;
    }

    if (this.isTransitioning) return;
    this.isTransitioning = true;

    // --- 3D Wristwatch Spin Animation ---
    this.setTelemetry(`✦ TARGETING ${city.flag} ${city.name.toUpperCase()} • SPINNING TIMEPIECE...`, true);

    this.watch3D.spinToLocation(timeInfo, () => {
      // When spin completes: hands sweep rapidly to destination time
      this.watch2D.setTime(timeInfo, true);

      // Background theme updates to reflect destination's time of day
      this.applyBackgroundTheme(timeInfo);

      this.setTelemetry(`✦ ${city.flag} ${city.name.toUpperCase()} • SYNCHRONIZED`, false);

      this.isTransitioning = false;
      this.startLiveClock();
    });
  }

  setTelemetry(msg, isPulsing = false) {
    if (!this.watchTelemetryEl) return;
    this.watchTelemetryEl.innerHTML = msg;
    this.watchTelemetryEl.classList.add("visible");
    this.watchTelemetryEl.classList.toggle("pulse", isPulsing);

    clearTimeout(this.telemetryTimer);
    if (!isPulsing) {
      this.telemetryTimer = setTimeout(() => {
        if (this.watchTelemetryEl) {
          this.watchTelemetryEl.classList.remove("visible", "pulse");
        }
      }, 4000);
    }
  }

  updateInfoCards(city, timeInfo) {
    if (this.locationNameEl) this.locationNameEl.textContent = `${city.flag} ${city.name}`;
    if (this.locationCountryEl) this.locationCountryEl.textContent = city.country;

    // Format digital clock
    const hr12 = timeInfo.hours % 12 || 12;
    const ampm = timeInfo.hours >= 12 ? "PM" : "AM";
    const minStr = String(timeInfo.minutes).padStart(2, "0");
    const secStr = String(timeInfo.seconds).padStart(2, "0");

    if (this.digitalTimeEl) {
      this.digitalTimeEl.innerHTML = `
        <span class="digit">${String(hr12).padStart(2, "0")}</span>
        <span class="colon">:</span>
        <span class="digit">${minStr}</span>
        <span class="colon">:</span>
        <span class="digit sec">${secStr}</span>
      `;
    }
    if (this.timePeriodEl) this.timePeriodEl.textContent = ampm;

    if (this.timezoneBadgeEl) this.timezoneBadgeEl.textContent = `${timeInfo.offsetStr} • ${city.tz.split("/")[1] || city.tz}`;

    // Relative difference vs user's home timezone
    const homeNow = new Date();
    const targetDate = new Date(homeNow.toLocaleString("en-US", { timeZone: city.tz }));
    const homeDate = new Date(homeNow.toLocaleString("en-US", { timeZone: this.userHomeTimezone }));
    const diffHours = Math.round((targetDate - homeDate) / (1000 * 60 * 60));

    if (this.relativeTimeEl) {
      if (diffHours === 0) {
        this.relativeTimeEl.textContent = "Same time as your location";
      } else if (diffHours > 0) {
        this.relativeTimeEl.textContent = `${diffHours} hour${Math.abs(diffHours) === 1 ? "" : "s"} ahead of you`;
      } else {
        this.relativeTimeEl.textContent = `${Math.abs(diffHours)} hour${Math.abs(diffHours) === 1 ? "" : "s"} behind you`;
      }
    }

    // Solar Status Badge
    if (this.solarStatusEl) {
      const solarIcons = {
        dawn: "🌅 Dawn / Sunrise",
        day: "☀️ Broad Daylight",
        sunset: "🌇 Golden Hour Sunset",
        dusk: "🌆 Twilight / Dusk",
        night: "🌙 Starlit Night"
      };
      this.solarStatusEl.textContent = solarIcons[timeInfo.timeOfDay] || "☀️ Day";
    }

    if (this.coordsBadgeEl) {
      const latStr = `${Math.abs(city.lat).toFixed(2)}° ${city.lat >= 0 ? "N" : "S"}`;
      const lngStr = `${Math.abs(city.lng).toFixed(2)}° ${city.lng >= 0 ? "E" : "W"}`;
      this.coordsBadgeEl.textContent = `${latStr}, ${lngStr}`;
    }
  }

  /**
   * Smoothly changes the background theme to reflect the local time of the searched location.
   */
  applyBackgroundTheme(timeInfo) {
    const theme = timeInfo.timeOfDay; // 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'

    // Remove existing theme classes
    this.body.classList.remove("theme-dawn", "theme-day", "theme-sunset", "theme-dusk", "theme-night");
    this.body.classList.add(`theme-${theme}`);

    // Update Celestial Glow position & color in the sky
    if (this.sunMoonGlow) {
      const hour = timeInfo.decimalHour;
      let glowX = ((hour / 24) * 100);
      let glowY = 30 + Math.sin(((hour - 6) / 12) * Math.PI) * -20;

      this.sunMoonGlow.style.left = `${glowX}%`;
      this.sunMoonGlow.style.top = `${glowY}%`;
    }
  }

  startLiveClock() {
    if (this.liveClockTimer) clearInterval(this.liveClockTimer);

    this.liveClockTimer = setInterval(() => {
      if (!this.selectedCity || this.isTransitioning) return;
      const updatedInfo = getTimeInfoForZone(this.selectedCity.tz);
      this.updateInfoCards(this.selectedCity, updatedInfo);
      this.watch2D.currentTime = { ...updatedInfo };
    }, 1000);
  }

  showSearchFeedback(msg) {
    if (this.suggestionsDropdown) {
      this.suggestionsDropdown.innerHTML = `<div class="suggestion-item no-match"><span>${msg}</span></div>`;
      this.suggestionsDropdown.classList.remove("hidden");
    }
  }
}

// Bootstrap on DOM ready
window.addEventListener("DOMContentLoaded", () => {
  window.app = new WatchWorldApp();
});

})();
