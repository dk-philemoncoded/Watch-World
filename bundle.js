/**
 * PHILL - World Watch & Planetary Timepiece
 * Unified Production Bundle (Self-Contained, Zero External Dependencies)
 * 2D Swiss Luxury Dress Watch Engine, Animated Horizon & Human Activity Scenery, World Time Resolver, & Web Audio
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
  // 3. 2D Luxury Swiss Watch Engine (Dial, Hands, Small Seconds)
  // =========================================================================
/**
 * Luxury 2D Mechanical Wrist Watch Engine — PHILL
 * Faithfully re-creates the Swiss luxury dress watch (Rolex 1908 aesthetic):
 * - Double Bezel: Outer fine coin-edge fluted bezel & inner mirror-polished ring
 * - Pure porcelain white/ivory dial with delicate railroad minute track
 * - Applied faceted gold numerals (12, 3, 9) and faceted dagger hour markers
 * - Small seconds subdial at 6 o'clock with concentric circular snailing (azurage)
 * - Arched "SUPERLATIVE CHRONOMETER" inscription above the subdial
 * - Signature Observatory/Breguet-ring hour hand & double-edged sword minute hand
 * - Beautiful alligator-grain stitched leather strap and sculpted case lugs
 * - High-speed hand spin animation with mechanical deceleration to target time
 * - Monotonic dead-beat seconds ticking (crisp 75ms step, 925ms solid hold)
 */

class WatchEngine {
  constructor(canvas, soundEngine) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.sound = soundEngine;

    // Finish palette: 'gold' (18ct Yellow Gold, default) | 'rose-gold' | 'white-gold' | 'platinum'
    this.finish = "gold";

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
      decimalHour: 10.17,
      offsetMinutes: 0
    };

    // Current hand angles (in radians)
    this.handAngles = {
      hour: 0,
      minute: 0,
      second: 0
    };

    // Transition Animation State (rapid hand spin with gradual deceleration)
    this.isTransitioning = false;
    this.transitionStart = 0;
    this.transitionDuration = 2200; // ms: fast spin that smoothly slows down
    this.startAngles = { hour: 0, minute: 0, second: 0 };
    this.targetAngles = { hour: 0, minute: 0, second: 0 };
    this.onTransitionComplete = null;

    this.lastTickSecond = -1;

    this.resize();
    this.initAngles();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = this.canvas.getBoundingClientRect();
    const size = Math.min(rect.width || 680, rect.height || 680);

    if (this.canvas.width !== Math.round(size * dpr) || this.canvas.height !== Math.round(size * dpr)) {
      this.canvas.width = Math.round(size * dpr);
      this.canvas.height = Math.round(size * dpr);
    }
    this.size = this.canvas.width;
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

    this.handAngles = {
      hour: hrAngle,
      minute: minAngle,
      second: secAngle
    };
  }

  /**
   * Sets the watch to a new location's time.
   * If animate is true, triggers high-speed hand spinning that smoothly decelerates to the new time!
   */
  setTime(timeInfo, animate = true, onComplete = null) {
    this.currentTime = { ...timeInfo };

    const targetHr = (((timeInfo.hours % 12) + timeInfo.minutes / 60 + timeInfo.seconds / 3600) / 12) * Math.PI * 2;
    const targetMin = ((timeInfo.minutes + timeInfo.seconds / 60) / 60) * Math.PI * 2;
    const targetSec = (timeInfo.seconds / 60) * Math.PI * 2;

    if (!animate) {
      this.handAngles.hour = targetHr;
      this.handAngles.minute = targetMin;
      this.handAngles.second = targetSec;
      this.isTransitioning = false;
      if (onComplete) onComplete();
      return;
    }

    // Begin rapid hand spinning animation with smooth mechanical deceleration
    this.isTransitioning = true;
    this.transitionStart = performance.now();
    this.transitionDuration = 2200; // ms
    this.onTransitionComplete = onComplete;

    if (this.sound) {
      this.sound.playWindingEffect(1.9);
    }

    this.startAngles = { ...this.handAngles };

    // Calculate forward deltas:
    // Minute hand spins 5 to 6 fast revolutions + forward delta
    let minDelta = targetMin - (this.startAngles.minute % (Math.PI * 2));
    if (minDelta <= 0) minDelta += Math.PI * 2;
    minDelta += Math.PI * 10; // 5 full extra revolutions

    // Hour hand spins forward proportionally + 1 full revolution
    let hrDelta = targetHr - (this.startAngles.hour % (Math.PI * 2));
    if (hrDelta <= 0) hrDelta += Math.PI * 2;
    hrDelta += Math.PI * 2; // 1 full extra revolution

    // Small second hand spins fast in its subdial (12 full revolutions)
    let secDelta = targetSec - (this.startAngles.second % (Math.PI * 2));
    if (secDelta <= 0) secDelta += Math.PI * 2;
    secDelta += Math.PI * 24; // 12 extra revolutions

    this.targetAngles = {
      hour: this.startAngles.hour + hrDelta,
      minute: this.startAngles.minute + minDelta,
      second: this.startAngles.second + secDelta
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

      // Fast initial spin, followed by smooth mechanical gear deceleration (quintic ease-out)
      const t = progress;
      const ease = 1 - Math.pow(1 - t, 4);

      this.handAngles.hour = this.startAngles.hour + (this.targetAngles.hour - this.startAngles.hour) * ease;
      this.handAngles.minute = this.startAngles.minute + (this.targetAngles.minute - this.startAngles.minute) * ease;
      this.handAngles.second = this.startAngles.second + (this.targetAngles.second - this.startAngles.second) * ease;

      if (progress >= 1.0) {
        this.isTransitioning = false;
        // Normalize angles to 0..2PI
        this.handAngles.hour = this.targetAngles.hour % (Math.PI * 2);
        this.handAngles.minute = this.targetAngles.minute % (Math.PI * 2);
        this.handAngles.second = this.targetAngles.second % (Math.PI * 2);

        if (this.sound) {
          this.sound.playArrivalChime();
        }

        if (this.onTransitionComplete) {
          const cb = this.onTransitionComplete;
          this.onTransitionComplete = null;
          cb();
        }
      }
    } else {
      // Normal continuous clock operation
      // Synchronize with target timezone offset
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60000;
      const targetOffsetMinutes = (this.currentTime.offsetMinutes !== undefined) ? this.currentTime.offsetMinutes : 0;
      const targetTimeMs = utcMs + targetOffsetMinutes * 60000;
      const localDate = new Date(targetTimeMs);

      const sec = localDate.getSeconds();
      const ms = localDate.getMilliseconds();
      const min = localDate.getMinutes();
      const hr = localDate.getHours();

      // Dead-Beat Seconds Escapement Tick:
      // First 75ms: crisp mechanical jump forward
      // 75ms to 999ms: solidly rests on the tick mark. Strictly monotonic, zero reverse.
      const stepDuration = 75; // ms
      const snapProgress = Math.min(1.0, ms / stepDuration);
      const snapEase = 1 - Math.pow(1 - snapProgress, 3);

      const prevSec = (sec + 59) % 60;
      const visualSecond = prevSec + snapEase;

      // Escapement ticking sound (1 crisp tick on every step)
      if (sec !== this.lastTickSecond) {
        this.lastTickSecond = sec;
        if (this.sound) {
          this.sound.playTick(sec % 2 === 0);
        }
      }

      this.handAngles.second = (visualSecond / 60) * Math.PI * 2;
      this.handAngles.minute = ((min + sec / 60) / 60) * Math.PI * 2;
      this.handAngles.hour = (((hr % 12) + min / 60 + sec / 3600) / 12) * Math.PI * 2;
    }
  }

  // --- Rendering Architecture ---

  draw() {
    const ctx = this.ctx;
    const r = this.radius;

    ctx.clearRect(0, 0, this.size, this.size);

    ctx.save();
    ctx.translate(r, r);

    // 1. Alligator-Grain Leather Straps (Top & Bottom)
    this.drawStraps(ctx, r);

    // 2. Sculpted Metallic Lugs (4 horns)
    this.drawLugs(ctx, r);

    // 3. Main Case Body & Fluted Winding Crown
    this.drawCase(ctx, r);

    // 4. Double Bezel: Outer Coin-Edge Fluted Bezel & Inner Polished Mirror Ring
    this.drawBezel(ctx, r);

    // 5. Intense White / Ivory Lacquer Dial
    this.drawDial(ctx, r);

    // 6. Railroad Minute Track (Chemin-de-fer)
    this.drawRailroadTrack(ctx, r);

    // 7. Applied Faceted Gold Numerals (12, 3, 9) and Dagger Markers
    this.drawHourMarkers(ctx, r);

    // 8. Brand Emblem (Crown, "PHILL", "GENÈVE")
    this.drawBrand(ctx, r);

    // 9. Small Seconds Subdial at 6 o'clock (Azurage, Track, "SUPERLATIVE CHRONOMETER")
    this.drawSmallSecondsSubdial(ctx, r);

    // 10. Horological Hands: Breguet-ring Hour Hand & Sword Minute Hand
    this.drawHands(ctx, r);

    // 11. Sapphire Crystal Fresnel Light Sheen
    this.drawCrystal(ctx, r);

    ctx.restore();
  }

  // --- Theme Color Definitions ---

  getPalette() {
    switch (this.finish) {
      case "rose-gold":
        return {
          strapBase: "#2b1812",
          strapMid: "#42261d",
          strapEdge: "#1e100c",
          stitch: "rgba(225, 175, 140, 0.45)",
          metalLight: "#fae2d2",
          metalBright: "#f5c3a4",
          metalMid: "#d6936d",
          metalDark: "#854728",
          metalShadow: "#4a2412",
          dialBgCenter: "#fdfbf9",
          dialBgEdge: "#f3ede6",
          goldMarkerLight: "#fde2d2",
          goldMarkerMid: "#dca07d",
          goldMarkerDark: "#945330"
        };
      case "white-gold":
      case "steel":
        return {
          strapBase: "#0e1014",
          strapMid: "#1a1d24",
          strapEdge: "#07080a",
          stitch: "rgba(210, 220, 235, 0.4)",
          metalLight: "#ffffff",
          metalBright: "#eef2f7",
          metalMid: "#c6d0dc",
          metalDark: "#788596",
          metalShadow: "#373e48",
          dialBgCenter: "#ffffff",
          dialBgEdge: "#f0f2f5",
          goldMarkerLight: "#ffffff",
          goldMarkerMid: "#cbd5e1",
          goldMarkerDark: "#64748b"
        };
      case "platinum":
        return {
          strapBase: "#0a0c10",
          strapMid: "#161b24",
          strapEdge: "#050608",
          stitch: "rgba(180, 210, 240, 0.45)",
          metalLight: "#f4f8ff",
          metalBright: "#dbe5f2",
          metalMid: "#b2c4dc",
          metalDark: "#667a94",
          metalShadow: "#2e3b4a",
          dialBgCenter: "#fbfdff",
          dialBgEdge: "#e8eff7",
          goldMarkerLight: "#f0f6ff",
          goldMarkerMid: "#b8cce6",
          goldMarkerDark: "#526c8a"
        };
      case "gold":
      default:
        // 18ct Yellow Gold (Exact Rolex 1908 Reference)
        return {
          strapBase: "#1f140e",
          strapMid: "#332117",
          strapEdge: "#150d09",
          stitch: "rgba(205, 165, 120, 0.5)",
          metalLight: "#fff4d0",
          metalBright: "#fae19c",
          metalMid: "#d4af37",
          metalDark: "#856218",
          metalShadow: "#473308",
          dialBgCenter: "#fdfdfb",
          dialBgEdge: "#f5f3ec",
          goldMarkerLight: "#fff0cb",
          goldMarkerMid: "#dcba52",
          goldMarkerDark: "#8a6619"
        };
    }
  }

  // --- 1. Straps (Brown Alligator Leather) ---

  drawStraps(ctx, r) {
    const pal = this.getPalette();
    const strapW = r * 0.52;
    const strapH = r * 1.05;

    ctx.save();

    [-1, 1].forEach((dir) => {
      ctx.save();
      ctx.scale(1, dir);

      // Strap background gradient
      const strapGrad = ctx.createLinearGradient(-strapW / 2, r * 0.65, strapW / 2, r * 0.65);
      strapGrad.addColorStop(0, pal.strapEdge);
      strapGrad.addColorStop(0.15, pal.strapBase);
      strapGrad.addColorStop(0.5, pal.strapMid);
      strapGrad.addColorStop(0.85, pal.strapBase);
      strapGrad.addColorStop(1, pal.strapEdge);

      ctx.fillStyle = strapGrad;
      ctx.beginPath();
      // Curved lug entry
      ctx.moveTo(-strapW / 2, r * 0.65);
      ctx.quadraticCurveTo(0, r * 0.68, strapW / 2, r * 0.65);
      ctx.lineTo(strapW / 2, r * 0.65 + strapH);
      ctx.lineTo(-strapW / 2, r * 0.65 + strapH);
      ctx.closePath();
      ctx.fill();

      // Alligator Scale Pattern (Horizontal segmental plates)
      ctx.save();
      ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
      ctx.lineWidth = 2.5;

      const scaleHeights = [r * 0.16, r * 0.22, r * 0.26, r * 0.24, r * 0.20];
      let currentY = r * 0.72;

      for (let s = 0; s < scaleHeights.length; s++) {
        const sh = scaleHeights[s];
        ctx.beginPath();
        ctx.moveTo(-strapW / 2 + 6, currentY);
        ctx.quadraticCurveTo(0, currentY + 3, strapW / 2 - 6, currentY);
        ctx.stroke();

        // Subtle vertical segment subdivisions
        const divX = ((s % 2 === 0) ? -strapW * 0.12 : strapW * 0.12);
        ctx.beginPath();
        ctx.moveTo(divX, currentY);
        ctx.lineTo(divX + (s % 2 === 0 ? 5 : -5), currentY + sh);
        ctx.stroke();

        currentY += sh;
      }
      ctx.restore();

      // Tone-on-tone Saddle Stitching
      ctx.strokeStyle = pal.stitch;
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 6]);

      // Left Stitch
      ctx.beginPath();
      ctx.moveTo(-strapW / 2 + 7, r * 0.68);
      ctx.lineTo(-strapW / 2 + 7, r * 0.65 + strapH);
      ctx.stroke();

      // Right Stitch
      ctx.beginPath();
      ctx.moveTo(strapW / 2 - 7, r * 0.68);
      ctx.lineTo(strapW / 2 - 7, r * 0.65 + strapH);
      ctx.stroke();

      ctx.setLineDash([]);

      // Drop shadow from case onto strap
      const shadowGrad = ctx.createLinearGradient(0, r * 0.62, 0, r * 0.76);
      shadowGrad.addColorStop(0, "rgba(0, 0, 0, 0.7)");
      shadowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = shadowGrad;
      ctx.fillRect(-strapW / 2, r * 0.62, strapW, r * 0.14);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 2. Lugs (4 Sculpted Metallic Horns) ---

  drawLugs(ctx, r) {
    const pal = this.getPalette();
    const lugW = r * 0.11;
    const caseR = r * 0.85;

    ctx.save();

    // Drop shadow under lugs
    ctx.shadowColor = "rgba(0, 0, 0, 0.55)";
    ctx.shadowBlur = 18;
    ctx.shadowOffsetY = 8;

    [
      { x: -caseR * 0.55, y: -caseR * 0.82, signX: -1, signY: -1 },
      { x: caseR * 0.55, y: -caseR * 0.82, signX: 1, signY: -1 },
      { x: -caseR * 0.55, y: caseR * 0.82, signX: -1, signY: 1 },
      { x: caseR * 0.55, y: caseR * 0.82, signX: 1, signY: 1 }
    ].forEach((lug) => {
      ctx.save();
      ctx.translate(lug.x, lug.y);

      const lugGrad = ctx.createLinearGradient(-lugW, -lugW, lugW, lugW);
      lugGrad.addColorStop(0, pal.metalLight);
      lugGrad.addColorStop(0.3, pal.metalBright);
      lugGrad.addColorStop(0.7, pal.metalMid);
      lugGrad.addColorStop(1, pal.metalDark);

      ctx.fillStyle = lugGrad;
      ctx.beginPath();
      ctx.moveTo(lug.signX * -lugW * 0.2, lug.signY * -lugW * 0.5);
      ctx.quadraticCurveTo(lug.signX * lugW * 0.9, lug.signY * lugW * 0.2, lug.signX * lugW * 0.6, lug.signY * lugW * 1.5);
      ctx.quadraticCurveTo(lug.signX * lugW * 0.1, lug.signY * lugW * 1.3, lug.signX * -lugW * 0.5, lug.signY * 0);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 3. Case Body & Crown ---

  drawCase(ctx, r) {
    const pal = this.getPalette();
    const caseR = r * 0.84;

    ctx.save();

    // Outer Case Drop Shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
    ctx.shadowBlur = 32;
    ctx.shadowOffsetY = 14;

    // Polished gold case body
    const caseGrad = ctx.createLinearGradient(-caseR, -caseR, caseR, caseR);
    caseGrad.addColorStop(0.0, pal.metalLight);
    caseGrad.addColorStop(0.18, pal.metalBright);
    caseGrad.addColorStop(0.45, pal.metalMid);
    caseGrad.addColorStop(0.72, pal.metalDark);
    caseGrad.addColorStop(0.88, pal.metalBright);
    caseGrad.addColorStop(1.0, pal.metalShadow);

    ctx.fillStyle = caseGrad;
    ctx.beginPath();
    ctx.arc(0, 0, caseR, 0, Math.PI * 2);
    ctx.fill();

    ctx.shadowColor = "transparent";

    // Winding Crown at 3 o'clock
    ctx.save();
    const crownX = caseR - 2;
    const crownW = r * 0.065;
    const crownH = r * 0.13;

    // Crown metallic body
    const crownGrad = ctx.createLinearGradient(crownX, -crownH / 2, crownX + crownW, crownH / 2);
    crownGrad.addColorStop(0, pal.metalLight);
    crownGrad.addColorStop(0.5, pal.metalMid);
    crownGrad.addColorStop(1, pal.metalDark);

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    ctx.rect(crownX, -crownH / 2, crownW, crownH);
    ctx.fill();

    // Fluted crown ridges
    ctx.strokeStyle = "rgba(0, 0, 0, 0.4)";
    ctx.lineWidth = 1.2;
    for (let y = -crownH / 2 + 3; y <= crownH / 2 - 3; y += 3) {
      ctx.beginPath();
      ctx.moveTo(crownX, y);
      ctx.lineTo(crownX + crownW, y);
      ctx.stroke();
    }

    // Crown rounded polished dome cap
    ctx.fillStyle = pal.metalLight;
    ctx.beginPath();
    ctx.arc(crownX + crownW, 0, crownH * 0.35, -Math.PI / 2, Math.PI / 2);
    ctx.fill();

    ctx.restore();
    ctx.restore();
  }

  // --- 4. Double Bezel: Outer Coin-Edge Fluting & Inner Polished Ring ---

  drawBezel(ctx, r) {
    const pal = this.getPalette();
    const flutedOuter = r * 0.835;
    const flutedInner = r * 0.765;
    const polishedInner = r * 0.735;

    ctx.save();

    // A. Outer Fluted Bezel (Coin-edge fluting)
    // 120 radial flutes with alternating light/shadow facets
    const fluteCount = 120;
    for (let i = 0; i < fluteCount; i++) {
      const angle = (i / fluteCount) * Math.PI * 2;
      const nextAngle = ((i + 1) / fluteCount) * Math.PI * 2;
      const isLight = i % 2 === 0;

      ctx.fillStyle = isLight ? pal.metalLight : pal.metalDark;
      ctx.beginPath();
      ctx.moveTo(Math.cos(angle) * flutedInner, Math.sin(angle) * flutedInner);
      ctx.lineTo(Math.cos(angle) * flutedOuter, Math.sin(angle) * flutedOuter);
      ctx.lineTo(Math.cos(nextAngle) * flutedOuter, Math.sin(nextAngle) * flutedOuter);
      ctx.lineTo(Math.cos(nextAngle) * flutedInner, Math.sin(nextAngle) * flutedInner);
      ctx.closePath();
      ctx.fill();
    }

    // Fluted edge highlight rings
    ctx.strokeStyle = pal.metalBright;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 0, flutedOuter, 0, Math.PI * 2);
    ctx.stroke();

    // B. Inner Polished Domed Bezel (smooth mirror ring)
    const innerGrad = ctx.createLinearGradient(-polishedInner, -polishedInner, polishedInner, polishedInner);
    innerGrad.addColorStop(0.0, pal.metalLight);
    innerGrad.addColorStop(0.25, pal.metalBright);
    innerGrad.addColorStop(0.65, pal.metalMid);
    innerGrad.addColorStop(0.85, pal.metalDark);
    innerGrad.addColorStop(1.0, pal.metalBright);

    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(0, 0, flutedInner, 0, Math.PI * 2);
    ctx.arc(0, 0, polishedInner, 0, Math.PI * 2, true);
    ctx.fill();

    // Inner rim shadow
    ctx.strokeStyle = "rgba(0, 0, 0, 0.35)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(0, 0, polishedInner, 0, Math.PI * 2);
    ctx.stroke();

    ctx.restore();
  }

  // --- 5. Dial Face (Pure Porcelain White / Ivory Lacquer) ---

  drawDial(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // Multi-layer lacquer white dial with soft warmth
    const dialGrad = ctx.createRadialGradient(0, -dialR * 0.2, dialR * 0.1, 0, 0, dialR);
    dialGrad.addColorStop(0.0, pal.dialBgCenter);
    dialGrad.addColorStop(0.75, pal.dialBgCenter);
    dialGrad.addColorStop(0.95, pal.dialBgEdge);
    dialGrad.addColorStop(1.0, "#e8e5dc");

    ctx.fillStyle = dialGrad;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    // Perimeter dial bevel shadow
    const edgeShadow = ctx.createRadialGradient(0, 0, dialR - 6, 0, 0, dialR);
    edgeShadow.addColorStop(0.0, "rgba(0, 0, 0, 0)");
    edgeShadow.addColorStop(1.0, "rgba(0, 0, 0, 0.22)");
    ctx.fillStyle = edgeShadow;
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // --- 6. Railroad Minute Track (Chemin-de-fer) ---

  drawRailroadTrack(ctx, r) {
    const dialR = r * 0.735;
    const trackOuter = dialR * 0.94;
    const trackInner = dialR * 0.885;

    ctx.save();

    // Outer & Inner concentric hairline tracks
    ctx.strokeStyle = "rgba(20, 20, 20, 0.85)";
    ctx.lineWidth = 1.0;

    ctx.beginPath();
    ctx.arc(0, 0, trackOuter, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, 0, trackInner, 0, Math.PI * 2);
    ctx.stroke();

    // 60 Radial Minute Ticks
    for (let i = 0; i < 60; i++) {
      const angle = (i / 60) * Math.PI * 2;
      const isFive = i % 5 === 0;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      ctx.beginPath();
      ctx.moveTo(cos * trackInner, sin * trackInner);
      ctx.lineTo(cos * trackOuter, sin * trackOuter);

      if (isFive) {
        ctx.strokeStyle = "rgba(10, 10, 10, 0.95)";
        ctx.lineWidth = 2.0;
        ctx.stroke();

        // Small black dot outside track at each hour
        const dotR = trackOuter + 4.5;
        ctx.fillStyle = "rgba(20, 20, 20, 0.9)";
        ctx.beginPath();
        ctx.arc(cos * dotR, sin * dotR, 1.2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "rgba(40, 40, 40, 0.65)";
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  // --- 7. Applied Faceted Gold Numerals (12, 3, 9) & Dagger Markers ---

  drawHourMarkers(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // A. Applied Faceted Gold Arabic Numerals: "12", "3", "9"
    const numerals = [
      { text: "12", x: 0, y: -dialR * 0.72 },
      { text: "3", x: dialR * 0.72, y: 0 },
      { text: "9", x: -dialR * 0.72, y: 0 }
    ];

    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    numerals.forEach((num) => {
      ctx.save();
      ctx.translate(num.x, num.y);

      // 3D Drop shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetY = 1.5;

      ctx.font = `600 ${r * 0.088}px "Cinzel", "Playfair Display", "Times New Roman", serif`;

      // Gradient fill for applied gold relief
      const numGrad = ctx.createLinearGradient(0, -r * 0.04, 0, r * 0.04);
      numGrad.addColorStop(0.0, pal.goldMarkerLight);
      numGrad.addColorStop(0.5, pal.goldMarkerMid);
      numGrad.addColorStop(1.0, pal.goldMarkerDark);

      ctx.fillStyle = numGrad;
      ctx.fillText(num.text, 0, 0);

      // Fine highlight outline
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 0.5;
      ctx.strokeText(num.text, 0, 0);

      ctx.restore();
    });

    // B. Applied Faceted Gold Dagger Markers at hours 1, 2, 4, 5, 7, 8, 10, 11
    // (Hour 6 is omitted for small seconds subdial; 3, 9, 12 have Arabic numerals)
    const daggerHours = [1, 2, 4, 5, 7, 8, 10, 11];
    const markerInnerR = dialR * 0.62;
    const markerOuterR = dialR * 0.865;
    const markerWidth = r * 0.024;

    daggerHours.forEach((hour) => {
      const angle = (hour / 12) * Math.PI * 2;

      ctx.save();
      ctx.rotate(angle);

      // Drop shadow on dial
      ctx.shadowColor = "rgba(0, 0, 0, 0.26)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 1.5;

      // Facet 1: Left / Light side
      ctx.fillStyle = pal.goldMarkerLight;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(-markerWidth / 2, -markerOuterR);
      ctx.lineTo(0, -markerOuterR);
      ctx.closePath();
      ctx.fill();

      // Facet 2: Right / Dark side
      ctx.fillStyle = pal.goldMarkerDark;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(0, -markerOuterR);
      ctx.lineTo(markerWidth / 2, -markerOuterR);
      ctx.closePath();
      ctx.fill();

      // Center ridge specular shine
      ctx.shadowColor = "transparent";
      ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(0, -markerInnerR);
      ctx.lineTo(0, -markerOuterR);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 8. Brand Emblem & Lettering ---

  drawBrand(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // A. Five-Point Coronet / Crown Emblem
    const crownY = -dialR * 0.44;
    ctx.save();
    ctx.translate(0, crownY);

    const cW = r * 0.045;
    const cH = r * 0.038;

    // Crown Gradient
    const crownGrad = ctx.createLinearGradient(-cW, -cH, cW, cH);
    crownGrad.addColorStop(0, pal.goldMarkerLight);
    crownGrad.addColorStop(0.5, pal.goldMarkerMid);
    crownGrad.addColorStop(1, pal.goldMarkerDark);

    ctx.fillStyle = crownGrad;
    ctx.beginPath();
    // 5 peaks with valleys
    ctx.moveTo(-cW, -cH * 0.35);
    ctx.lineTo(-cW * 0.55, cH * 0.1);
    ctx.lineTo(-cW * 0.45, -cH * 0.7);
    ctx.lineTo(-cW * 0.15, cH * 0.15);
    ctx.lineTo(0, -cH); // Tallest center peak
    ctx.lineTo(cW * 0.15, cH * 0.15);
    ctx.lineTo(cW * 0.45, -cH * 0.7);
    ctx.lineTo(cW * 0.55, cH * 0.1);
    ctx.lineTo(cW, -cH * 0.35);
    ctx.lineTo(cW * 0.6, cH * 0.5);
    ctx.lineTo(-cW * 0.6, cH * 0.5);
    ctx.closePath();
    ctx.fill();

    // Small circular pearls on the 5 tips
    const tips = [
      [-cW, -cH * 0.35],
      [-cW * 0.45, -cH * 0.7],
      [0, -cH],
      [cW * 0.45, -cH * 0.7],
      [cW, -cH * 0.35]
    ];
    tips.forEach(([tx, ty]) => {
      ctx.beginPath();
      ctx.arc(tx, ty, r * 0.0055, 0, Math.PI * 2);
      ctx.fill();
    });

    // Crown base band
    ctx.fillRect(-cW * 0.6, cH * 0.6, cW * 1.2, r * 0.006);

    ctx.restore();

    // B. Brand Title: "PHILL"
    ctx.font = `700 ${r * 0.052}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
    ctx.fillStyle = "#11141a";
    ctx.letterSpacing = "5px";
    ctx.fillText("PHILL", 0, -dialR * 0.31);

    // C. Subtitle: "GENÈVE"
    ctx.font = `500 ${r * 0.022}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#333945";
    ctx.letterSpacing = "3px";
    ctx.fillText("GENÈVE", 0, -dialR * 0.22);

    ctx.restore();
  }

  // --- 9. Small Seconds Subdial (at 6 o'clock) ---

  drawSmallSecondsSubdial(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;
    const subX = 0;
    const subY = dialR * 0.46;
    const subR = dialR * 0.275;

    ctx.save();
    ctx.translate(subX, subY);

    // A. Recessed subdial aperture shadow
    ctx.save();
    const subInnerShadow = ctx.createRadialGradient(0, 0, subR - 5, 0, 0, subR);
    subInnerShadow.addColorStop(0, "rgba(0, 0, 0, 0)");
    subInnerShadow.addColorStop(1, "rgba(0, 0, 0, 0.25)");

    ctx.fillStyle = pal.dialBgCenter;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = subInnerShadow;
    ctx.fill();
    ctx.restore();

    // B. Concentric Circular Snailing (Azurage)
    ctx.save();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.045)";
    ctx.lineWidth = 1;
    for (let rad = subR * 0.2; rad < subR * 0.95; rad += 3.5) {
      ctx.beginPath();
      ctx.arc(0, 0, rad, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // C. Subdial Outer Perimeter Hairline
    ctx.strokeStyle = "rgba(40, 40, 40, 0.6)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.arc(0, 0, subR, 0, Math.PI * 2);
    ctx.stroke();

    // D. Subdial Seconds Railroad Track & Numbers: 60, 20, 40
    const trackR = subR * 0.86;
    const trackIn = subR * 0.78;

    ctx.strokeStyle = "rgba(30, 30, 30, 0.75)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(0, 0, trackR, 0, Math.PI * 2);
    ctx.stroke();

    for (let s = 0; s < 60; s++) {
      const angle = (s / 60) * Math.PI * 2;
      const isFive = s % 5 === 0;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      const r1 = isFive ? trackIn - 1 : trackIn + 2;
      ctx.beginPath();
      ctx.moveTo(cos * r1, sin * r1);
      ctx.lineTo(cos * trackR, sin * trackR);
      ctx.lineWidth = isFive ? 1.4 : 0.6;
      ctx.stroke();
    }

    // Numbers: 60 (at top), 20 (bottom-right), 40 (bottom-left)
    ctx.font = `600 ${r * 0.024}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#1a1e24";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const numDist = subR * 0.62;
    // 60 at top
    ctx.fillText("60", 0, -numDist);
    // 20 at 120 degrees (4 o'clock)
    ctx.fillText("20", Math.cos(Math.PI / 6) * numDist, Math.sin(Math.PI / 6) * numDist + 2);
    // 40 at 240 degrees (8 o'clock)
    ctx.fillText("40", -Math.cos(Math.PI / 6) * numDist, Math.sin(Math.PI / 6) * numDist + 2);

    // E. Small Seconds Hand (Centered in Subdial)
    ctx.save();
    ctx.rotate(this.handAngles.second);

    // Hand drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.35)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetY = 1.5;

    const secLen = subR * 0.84;
    const secTail = subR * 0.22;

    // Small seconds needle hand in gold
    ctx.strokeStyle = pal.goldMarkerLight;
    ctx.lineWidth = 1.4;
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(0, secTail);
    ctx.lineTo(0, -secLen);
    ctx.stroke();

    // Small center hub
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.012, 0, Math.PI * 2);
    ctx.fill();

    // Central jewel / pin
    ctx.fillStyle = "#222";
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.004, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // end subdial hand

    ctx.restore(); // end subdial translate

    // F. Inscription: "SUPERLATIVE CHRONOMETER" Arched Above Subdial
    ctx.save();
    ctx.font = `600 ${r * 0.018}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#333944";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";

    const archRadius = subR + 8;
    const archCenterY = subY;
    const archText = "SUPERLATIVE CHRONOMETER";
    const startAngle = -Math.PI * 0.78;
    const endAngle = -Math.PI * 0.22;
    const angleStep = (endAngle - startAngle) / (archText.length - 1);

    for (let c = 0; c < archText.length; c++) {
      const char = archText[c];
      const charAngle = startAngle + c * angleStep;

      ctx.save();
      ctx.translate(Math.cos(charAngle) * archRadius, archCenterY + Math.sin(charAngle) * archRadius);
      ctx.rotate(charAngle + Math.PI / 2);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    }
    ctx.restore();

    // G. "SWISS MADE" at 6 o'clock bottom of dial
    ctx.save();
    ctx.font = `600 ${r * 0.019}px sans-serif`;
    ctx.fillStyle = "rgba(40, 40, 40, 0.75)";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SWISS   MADE", 0, dialR * 0.94);
    ctx.restore();
  }

  // --- 10. Horological Hands: Breguet Observatory Hour & Sword Minute Hand ---

  drawHands(ctx, r) {
    const pal = this.getPalette();
    const dialR = r * 0.735;

    ctx.save();

    // A. Hour Hand (Signature Breguet Observatory Open-Ring Hand)
    ctx.save();
    ctx.rotate(this.handAngles.hour);

    // Hand drop shadow onto porcelain dial
    ctx.shadowColor = "rgba(0, 0, 0, 0.38)";
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 4;

    const hrLen = dialR * 0.58;
    const stemW = r * 0.024;
    const eyeCenterY = -hrLen * 0.72;
    const eyeRadiusOut = r * 0.038;
    const eyeRadiusIn = r * 0.020; // Open ring showing dial below!

    // Left Facet (Light Gold)
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(-stemW / 2, 0);
    ctx.lineTo(-stemW * 0.35, eyeCenterY + eyeRadiusOut * 0.8);
    // Outer arc of ring (left side)
    ctx.arc(0, eyeCenterY, eyeRadiusOut, Math.PI * 0.65, Math.PI * 1.5, false);
    // Sharp needle tip
    ctx.lineTo(0, -hrLen);
    ctx.lineTo(0, eyeCenterY - eyeRadiusOut);
    // Inner hole cutout
    ctx.arc(0, eyeCenterY, eyeRadiusIn, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Darker Gold)
    ctx.fillStyle = pal.goldMarkerDark;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(stemW / 2, 0);
    ctx.lineTo(stemW * 0.35, eyeCenterY + eyeRadiusOut * 0.8);
    // Outer arc of ring (right side)
    ctx.arc(0, eyeCenterY, eyeRadiusOut, Math.PI * 0.35, -Math.PI / 2, true);
    // Sharp needle tip
    ctx.lineTo(0, -hrLen);
    ctx.lineTo(0, eyeCenterY - eyeRadiusOut);
    // Inner hole cutout
    ctx.arc(0, eyeCenterY, eyeRadiusIn, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fill();

    // Center ridge highlight
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.02);
    ctx.lineTo(0, eyeCenterY + eyeRadiusOut * 0.9);
    ctx.moveTo(0, eyeCenterY - eyeRadiusOut * 0.9);
    ctx.lineTo(0, -hrLen);
    ctx.stroke();

    ctx.restore(); // end hour hand

    // B. Minute Hand (Sleek Double-Edged Sword Hand)
    ctx.save();
    ctx.rotate(this.handAngles.minute);

    // Hand drop shadow
    ctx.shadowColor = "rgba(0, 0, 0, 0.42)";
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 6;

    const minLen = dialR * 0.89; // Extends right to the railroad track
    const minW = r * 0.026;

    // Left Facet (Light Gold)
    ctx.fillStyle = pal.goldMarkerLight;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.035);
    ctx.lineTo(-minW / 2, 0);
    ctx.lineTo(-minW * 0.25, -minLen * 0.75);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Right Facet (Dark Gold)
    ctx.fillStyle = pal.goldMarkerDark;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.035);
    ctx.lineTo(minW / 2, 0);
    ctx.lineTo(minW * 0.25, -minLen * 0.75);
    ctx.lineTo(0, -minLen);
    ctx.closePath();
    ctx.fill();

    // Central Ridge Specular Sheen
    ctx.shadowColor = "transparent";
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, r * 0.03);
    ctx.lineTo(0, -minLen);
    ctx.stroke();

    ctx.restore(); // end minute hand

    // C. Central Arbor (Polished Domed Gold Cap)
    ctx.save();
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 6;
    ctx.shadowOffsetY = 3;

    const capR = r * 0.032;
    const capGrad = ctx.createRadialGradient(-capR * 0.3, -capR * 0.3, 1, 0, 0, capR);
    capGrad.addColorStop(0, pal.metalLight);
    capGrad.addColorStop(0.5, pal.metalBright);
    capGrad.addColorStop(0.85, pal.metalMid);
    capGrad.addColorStop(1, pal.metalDark);

    ctx.fillStyle = capGrad;
    ctx.beginPath();
    ctx.arc(0, 0, capR, 0, Math.PI * 2);
    ctx.fill();

    // Center jewel / pin dot
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.arc(0, 0, capR * 0.28, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    ctx.restore();
  }

  // --- 11. Sapphire Crystal Reflection ---

  drawCrystal(ctx, r) {
    const dialR = r * 0.735;

    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, dialR, 0, Math.PI * 2);
    ctx.clip();

    // Diagonal soft specular light sweep across top-left
    const flare = ctx.createLinearGradient(-dialR, -dialR, dialR * 0.5, dialR * 0.5);
    flare.addColorStop(0.0, "rgba(255, 255, 255, 0.14)");
    flare.addColorStop(0.35, "rgba(255, 255, 255, 0.05)");
    flare.addColorStop(0.6, "rgba(255, 255, 255, 0)");
    flare.addColorStop(1.0, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = flare;
    ctx.fillRect(-dialR, -dialR, dialR * 2, dialR * 2);

    // Subtle anti-reflective blue/violet glint at bottom edge
    const arGlint = ctx.createRadialGradient(0, dialR * 0.8, dialR * 0.1, 0, dialR * 0.8, dialR * 0.4);
    arGlint.addColorStop(0.0, "rgba(100, 160, 255, 0.05)");
    arGlint.addColorStop(1.0, "rgba(100, 160, 255, 0)");
    ctx.fillStyle = arGlint;
    ctx.fillRect(-dialR, dialR * 0.5, dialR * 2, dialR * 0.5);

    ctx.restore();
  }
}

  // =========================================================================
  // 4. Animated Horizon & 2D Vector Human Activity Scenery
  // =========================================================================
/**
 * 2D Vector Animated Horizon & Human Activity Scenery — PHILL
 * Depicts the sky, horizon, and animated 2D vector characters engaging in
 * real human activities corresponding to the searched location's local time:
 *
 * 🌅 DAWN (05:00 - 08:59):
 *    - Morning joggers with dynamic stride and high knee lifts
 *    - Dog walkers with trotting puppy and wagging tail
 *    - Morning commuters with steaming coffee cups
 *    - Cyclists pedaling through the sunrise mist
 *    - Sunrise horizon with morning birds gliding across the sky
 *
 * ☀️ BROAD DAYLIGHT (09:00 - 16:59):
 *    - People strolling, conversing, and walking briskly
 *    - Park bench readers reading books / turning pages
 *    - Skateboarders / commuters coasting by
 *    - Flocks of birds and soft drifting cumulus clouds
 *    - High daylight sun over a lush park promenade & city skyline
 *
 * 🌇 SUNSET / GOLDEN HOUR (17:00 - 19:29):
 *    - Couples walking arm in arm bathed in golden sunset light
 *    - Evening runners finishing workouts
 *    - Sunset watchers leaning on the promenade railing
 *    - Warm golden orb resting on the horizon
 *    - Streetlamps beginning to glow as twilight approaches
 *
 * 🌆 DUSK / TWILIGHT (19:30 - 21:59):
 *    - Cozy evening pedestrians in coats heading to cafes/diners
 *    - Street musician / acoustic guitarist strumming on a park bench
 *    - Illuminated Victorian streetlamps casting warm pools of light on pavement
 *    - Distant city apartments with glowing warm golden windows
 *
 * 🌙 MIDNIGHT / NIGHT (22:00 - 04:59):
 *    - Stargazer looking through a standing brass telescope at the moon
 *    - Solitary nocturnal walker strolling under the glowing streetlamps
 *    - Night runner with glowing reflective armband
 *    - Luminous crescent moon, starlit sky, and occasional shooting stars
 */

class HorizonScenery {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Timeframe state: 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'
    this.timeOfDay = "day";
    this.targetTimeOfDay = "day";
    this.decimalHour = 12.0;

    // Transition blend (0 = current, 1 = target)
    this.transitionProgress = 1.0;

    // Viewport dimensions
    this.w = 0;
    this.h = 0;
    this.groundY = 0;

    // Scenery entities
    this.clouds = [];
    this.birds = [];
    this.shootingStars = [];
    this.characters = [];
    this.streetlamps = [];
    this.benches = [];
    this.trees = [];
    this.skylineBuildings = [];

    this.lastTime = performance.now();

    this.resize();
    this.initWorld();
    this.bindEvents();
    this.startLoop();
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = window.innerWidth || document.documentElement.clientWidth || 1200;
    const height = window.innerHeight || document.documentElement.clientHeight || 800;

    this.w = width;
    this.h = height;

    this.canvas.width = Math.round(width * dpr);
    this.canvas.height = Math.round(height * dpr);

    // Keep ground line placed along the lower section of the screen
    // so it frames beneath the center watch
    this.groundY = Math.round(this.h * 0.84);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initWorld();
    });
  }

  /**
   * Sets the scenery to match the destination's local time.
   */
  setTime(timeOfDay, decimalHour = 12.0) {
    if (this.timeOfDay !== timeOfDay) {
      this.targetTimeOfDay = timeOfDay;
      this.decimalHour = decimalHour;
      this.transitionProgress = 0.0;
    } else {
      this.decimalHour = decimalHour;
    }
  }

  initWorld() {
    const w = this.w;
    const groundY = this.groundY;

    // 1. Streetlamps positioned along the promenade
    this.streetlamps = [
      { x: w * 0.12, y: groundY, height: 110 },
      { x: w * 0.38, y: groundY, height: 110 },
      { x: w * 0.64, y: groundY, height: 110 },
      { x: w * 0.88, y: groundY, height: 110 }
    ];

    // 2. Park Benches positioned between lamps
    this.benches = [
      { x: w * 0.25, y: groundY, width: 44, height: 20 },
      { x: w * 0.76, y: groundY, width: 44, height: 20 }
    ];

    // 3. Park Trees (Silhouettes)
    this.trees = [
      { x: w * 0.05, y: groundY, radius: 55, trunkH: 60, type: "deciduous" },
      { x: w * 0.30, y: groundY, radius: 45, trunkH: 50, type: "pine" },
      { x: w * 0.70, y: groundY, radius: 48, trunkH: 55, type: "deciduous" },
      { x: w * 0.95, y: groundY, radius: 60, trunkH: 65, type: "elm" }
    ];

    // 4. Distant City Skyline Towers
    this.skylineBuildings = [];
    const count = Math.ceil(w / 45);
    for (let i = 0; i < count; i++) {
      const bW = 28 + (i % 4) * 12;
      const bH = 50 + ((i * 37) % 90);
      const isTower = (i % 7 === 2);
      this.skylineBuildings.push({
        x: i * 42,
        y: groundY,
        width: bW,
        height: isTower ? bH + 45 : bH,
        hasSpire: isTower,
        windows: (i % 2 === 0)
      });
    }

    // 5. Drifting Clouds
    this.clouds = [
      { x: w * 0.15, y: this.h * 0.22, scale: 0.9, speed: 6 },
      { x: w * 0.55, y: this.h * 0.16, scale: 1.2, speed: 4.5 },
      { x: w * 0.85, y: this.h * 0.28, scale: 0.75, speed: 7 }
    ];

    // 6. Flying Birds
    this.birds = [
      { x: w * 0.2, y: this.h * 0.32, speed: 38, wingPhase: 0, scale: 0.9 },
      { x: w * 0.24, y: this.h * 0.30, speed: 38, wingPhase: 0.4, scale: 0.85 },
      { x: w * 0.28, y: this.h * 0.34, speed: 38, wingPhase: 0.8, scale: 0.8 },
      { x: w * 0.65, y: this.h * 0.25, speed: 44, wingPhase: 1.2, scale: 1.0 },
      { x: w * 0.70, y: this.h * 0.28, speed: 44, wingPhase: 1.6, scale: 0.9 }
    ];

    // 7. Dynamic Human Characters Spawned for Time of Day
    this.spawnCharacters();
  }

  spawnCharacters() {
    const w = this.w;
    const groundY = this.groundY;
    const time = this.targetTimeOfDay;

    this.characters = [];

    if (time === "dawn") {
      // 🌅 DAWN: Morning Jogger, Dog Walker, Cyclist, Steaming Coffee Commuter
      this.characters.push({
        type: "jogger",
        x: w * 0.18,
        y: groundY,
        vx: 85, // fast jogging pace
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.55,
        y: groundY,
        vx: 38,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "cyclist",
        x: w * 0.82,
        y: groundY,
        vx: -95, // cycling from right to left
        scale: 0.88,
        facing: -1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.35,
        y: groundY,
        vx: 32,
        hasCoffee: true,
        scale: 0.9,
        facing: 1
      });
    } else if (time === "day") {
      // ☀️ DAY: Strollers, Bench Reader, Cyclist, Friends chatting
      this.characters.push({
        type: "bench_reader",
        x: this.benches[0].x + 22,
        y: groundY,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.15,
        y: groundY,
        vx: 42,
        hasBag: true,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "couple",
        x: w * 0.45,
        y: groundY,
        vx: 35,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "cyclist",
        x: w * 0.88,
        y: groundY,
        vx: -80,
        scale: 0.88,
        facing: -1
      });
    } else if (time === "sunset") {
      // 🌇 SUNSET: Romantic Couple strolling, Sunset watcher on railing, Evening Runner
      this.characters.push({
        type: "couple",
        x: w * 0.32,
        y: groundY,
        vx: 28, // gentle sunset stroll
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "bench_watcher",
        x: this.benches[1].x + 22,
        y: groundY,
        scale: 0.9,
        facing: -1
      });
      this.characters.push({
        type: "jogger",
        x: w * 0.75,
        y: groundY,
        vx: 80,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.12,
        y: groundY,
        vx: 34,
        scale: 0.88,
        facing: 1
      });
    } else if (time === "dusk") {
      // 🌆 DUSK: Acoustic Guitarist on Bench, Evening Pedestrians under Streetlamps
      this.characters.push({
        type: "bench_guitarist",
        x: this.benches[0].x + 22,
        y: groundY,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.48,
        y: groundY,
        vx: 36,
        hasCoat: true,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "dog_walker",
        x: w * 0.80,
        y: groundY,
        vx: -35,
        scale: 0.88,
        facing: -1
      });
    } else {
      // 🌙 NIGHT: Stargazer with Telescope, Solitary Night Walker under Streetlamp, Late Runner
      this.characters.push({
        type: "stargazer",
        x: w * 0.28,
        y: groundY,
        scale: 0.92,
        facing: 1
      });
      this.characters.push({
        type: "walker",
        x: w * 0.58,
        y: groundY,
        vx: 30, // slow reflective night walk
        hasCoat: true,
        scale: 0.9,
        facing: 1
      });
      this.characters.push({
        type: "jogger",
        x: w * 0.85,
        y: groundY,
        vx: -75,
        hasReflector: true,
        scale: 0.88,
        facing: -1
      });
    }
  }

  startLoop() {
    const loop = (now) => {
      const dt = Math.min((now - this.lastTime) / 1000, 0.1);
      this.lastTime = now;

      this.update(dt, now * 0.001);
      this.draw(now * 0.001);

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  update(dt, timeSec) {
    const w = this.w;

    // Smooth transition to target timeframe
    if (this.transitionProgress < 1.0) {
      this.transitionProgress = Math.min(1.0, this.transitionProgress + dt * 1.5);
      if (this.transitionProgress >= 1.0) {
        this.timeOfDay = this.targetTimeOfDay;
        this.spawnCharacters();
      }
    }

    // Update Drifting Clouds
    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > w + 120) {
        c.x = -120;
      }
    });

    // Update Birds
    this.birds.forEach(b => {
      b.x += b.speed * dt;
      b.wingPhase += dt * 9;
      if (b.x > w + 60) {
        b.x = -60;
      }
    });

    // Periodically spawn shooting star during night
    if (this.timeOfDay === "night" && Math.random() < 0.004 && this.shootingStars.length === 0) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * this.h * 0.35,
        vx: 240 + Math.random() * 120,
        vy: 110 + Math.random() * 60,
        life: 0.8,
        maxLife: 0.8
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      star.life -= dt;
      if (star.life <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }

    // Update Animated Characters
    this.characters.forEach(char => {
      if (char.vx) {
        char.x += char.vx * dt;
        // Wrap around screen boundaries
        if (char.vx > 0 && char.x > w + 80) {
          char.x = -80;
        } else if (char.vx < 0 && char.x < -80) {
          char.x = w + 80;
        }
      }
    });
  }

  // --- Rendering ---

  draw(timeSec) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;
    const groundY = this.groundY;

    ctx.clearRect(0, 0, w, h);

    const colors = this.getThemeColors();

    // 1. Celestial Orb in Sky (Sun / Moon on Horizon)
    this.drawCelestialBody(ctx, colors);

    // 2. Drifting Soft Clouds
    this.drawClouds(ctx, colors);

    // 3. Flocks of Flying Birds
    this.drawBirds(ctx, colors, timeSec);

    // 4. Shooting Stars (Night)
    if (this.shootingStars.length > 0) {
      this.drawShootingStars(ctx);
    }

    // 5. Distant City Skyline & Rolling Hills
    this.drawSkyline(ctx, colors);

    // 6. Promenade Ground Line & Waterfront Railing
    this.drawGround(ctx, colors);

    // 7. Park Trees
    this.drawTrees(ctx, colors, timeSec);

    // 8. Park Benches
    this.drawBenches(ctx, colors);

    // 9. Streetlamps & Light Beams
    this.drawStreetlamps(ctx, colors, timeSec);

    // 10. Animated 2D Vector Characters (Human Activities)
    this.drawCharacters(ctx, colors, timeSec);
  }

  getThemeColors() {
    const t = this.timeOfDay;
    switch (t) {
      case "dawn":
        return {
          skyGlow: "rgba(255, 175, 120, 0.4)",
          sunColor: "#ffbe88",
          sunGlow: "rgba(255, 160, 100, 0.5)",
          sunGlowMid: "rgba(255, 160, 100, 0.15)",
          isSun: true,
          sunYRatio: 0.68,
          skyline: "#37243c",
          hills: "#28192e",
          ground: "#1b1122",
          pavement: "#25172d",
          tree: "#221326",
          silhouette: "#26152a",
          rimLight: "rgba(255, 195, 150, 0.65)",
          lampLight: "rgba(255, 215, 140, 0)",
          lampLightMid: "rgba(255, 215, 140, 0)",
          lampGlow: 0
        };
      case "day":
        return {
          skyGlow: "rgba(255, 255, 255, 0.3)",
          sunColor: "#fff7dc",
          sunGlow: "rgba(255, 235, 160, 0.45)",
          sunGlowMid: "rgba(255, 235, 160, 0.12)",
          isSun: true,
          sunYRatio: 0.28,
          skyline: "#2b405d",
          hills: "#1d3049",
          ground: "#111f32",
          pavement: "#17273e",
          tree: "#152438",
          silhouette: "#182333",
          rimLight: "rgba(255, 255, 255, 0.45)",
          lampLight: "rgba(255, 220, 140, 0)",
          lampLightMid: "rgba(255, 220, 140, 0)",
          lampGlow: 0
        };
      case "sunset":
        return {
          skyGlow: "rgba(255, 110, 40, 0.5)",
          sunColor: "#ff7638",
          sunGlow: "rgba(255, 90, 40, 0.65)",
          sunGlowMid: "rgba(255, 90, 40, 0.18)",
          isSun: true,
          sunYRatio: 0.72,
          skyline: "#381830",
          hills: "#280f24",
          ground: "#190817",
          pavement: "#240d22",
          tree: "#20091d",
          silhouette: "#20091c",
          rimLight: "rgba(255, 160, 70, 0.75)",
          lampLight: "rgba(255, 195, 90, 0.35)",
          lampLightMid: "rgba(255, 195, 90, 0.12)",
          lampGlow: 0.4
        };
      case "dusk":
        return {
          skyGlow: "rgba(160, 90, 220, 0.35)",
          sunColor: "#eedeff",
          sunGlow: "rgba(180, 110, 240, 0.4)",
          sunGlowMid: "rgba(180, 110, 240, 0.12)",
          isSun: false, // Crescent moon
          sunYRatio: 0.35,
          skyline: "#221334",
          hills: "#170c24",
          ground: "#0d0615",
          pavement: "#150b21",
          tree: "#11071a",
          silhouette: "#12081d",
          rimLight: "rgba(200, 150, 255, 0.45)",
          lampLight: "rgba(255, 215, 120, 0.75)",
          lampLightMid: "rgba(255, 215, 120, 0.18)",
          lampGlow: 0.85
        };
      case "night":
      default:
        return {
          skyGlow: "rgba(60, 100, 180, 0.25)",
          sunColor: "#f0f5ff",
          sunGlow: "rgba(180, 215, 255, 0.35)",
          sunGlowMid: "rgba(180, 215, 255, 0.12)",
          isSun: false, // Glowing crescent moon
          sunYRatio: 0.30,
          skyline: "#121926",
          hills: "#0b1019",
          ground: "#05070d",
          pavement: "#0a0e16",
          tree: "#070a10",
          silhouette: "#090d16",
          rimLight: "rgba(180, 210, 255, 0.35)",
          lampLight: "rgba(255, 225, 140, 0.85)",
          lampLightMid: "rgba(255, 225, 140, 0.22)",
          lampGlow: 1.0
        };
    }
  }

  // --- 1. Celestial Orb (Sun or Crescent Moon) ---

  drawCelestialBody(ctx, colors) {
    const w = this.w;
    const orbX = w * 0.78;
    const orbY = this.h * colors.sunYRatio;

    ctx.save();

    if (colors.isSun) {
      // Radiant Sun Orb
      const sunR = 36;
      const glowGrad = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, sunR * 3);
      glowGrad.addColorStop(0, colors.sunGlow);
      glowGrad.addColorStop(0.5, colors.sunGlowMid);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Solid Sun Disc
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Luminous Crescent Moon
      const moonR = 26;
      const moonGlow = ctx.createRadialGradient(orbX, orbY, 1, orbX, orbY, moonR * 3);
      moonGlow.addColorStop(0, colors.sunGlow);
      moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR * 3, 0, Math.PI * 2);
      ctx.fill();

      // Crescent Moon Shape
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Subtractive mask for crescent
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(orbX + moonR * 0.55, orbY - moonR * 0.2, moonR * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore();
  }

  // --- 2. Drifting Clouds ---

  drawClouds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.fillStyle = (this.timeOfDay === "sunset" || this.timeOfDay === "dawn")
      ? "rgba(255, 200, 180, 0.12)"
      : "rgba(255, 255, 255, 0.16)";

    this.clouds.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);

      ctx.beginPath();
      ctx.arc(0, 0, 30, 0, Math.PI * 2);
      ctx.arc(28, -8, 24, 0, Math.PI * 2);
      ctx.arc(52, 0, 26, 0, Math.PI * 2);
      ctx.arc(26, 12, 22, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 3. Flying Birds ---

  drawBirds(ctx, colors, timeSec) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 1.8;
    ctx.lineCap = "round";

    this.birds.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);

      // Flapping wing motion
      const wing = Math.sin(b.wingPhase) * 6;

      ctx.beginPath();
      ctx.moveTo(-10, wing);
      ctx.quadraticCurveTo(-5, -wing, 0, 0);
      ctx.quadraticCurveTo(5, -wing, 10, wing);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 4. Shooting Stars (Night) ---

  drawShootingStars(ctx) {
    ctx.save();
    this.shootingStars.forEach(s => {
      const alpha = Math.max(0, s.life / s.maxLife);
      const tailX = s.x - (s.vx * 0.08);
      const tailY = s.y - (s.vy * 0.08);

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      grad.addColorStop(0, "rgba(255, 255, 255, 0)");
      grad.addColorStop(1, `rgba(255, 255, 255, ${alpha})`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // --- 5. Distant City Skyline & Rolling Hills ---

  drawSkyline(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // A. Distant architectural skyline
    ctx.fillStyle = colors.skyline;
    this.skylineBuildings.forEach(b => {
      ctx.fillRect(b.x, groundY - b.height, b.width, b.height);

      if (b.hasSpire) {
        ctx.beginPath();
        ctx.moveTo(b.x, groundY - b.height);
        ctx.lineTo(b.x + b.width / 2, groundY - b.height - 24);
        ctx.lineTo(b.x + b.width, groundY - b.height);
        ctx.fill();
      }

      // Cozy illuminated square windows (Dusk & Night)
      if (b.windows && (this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
        ctx.fillStyle = "rgba(255, 220, 130, 0.4)";
        for (let wy = groundY - b.height + 12; wy < groundY - 14; wy += 14) {
          ctx.fillRect(b.x + 6, wy, 4, 4);
          if (b.width > 34) {
            ctx.fillRect(b.x + 18, wy, 4, 4);
          }
        }
        ctx.fillStyle = colors.skyline;
      }
    });

    // B. Mid-ground rolling hill silhouetted line
    ctx.fillStyle = colors.hills;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.25, groundY - 32, w * 0.55, groundY - 18);
    ctx.quadraticCurveTo(w * 0.82, groundY - 42, w, groundY - 20);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- 6. Promenade Ground Line & Railing ---

  drawGround(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // Pavement base
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, w, this.h - groundY);

    // Stone promenade edge strip
    ctx.fillStyle = colors.pavement;
    ctx.fillRect(0, groundY, w, 8);

    // Promenade Balustrade / Railing line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 14);
    ctx.lineTo(w, groundY - 14);
    ctx.stroke();

    // Small railing baluster uprights
    for (let x = 8; x < w; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, groundY - 14);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 7. Park Trees ---

  drawTrees(ctx, colors, timeSec) {
    ctx.save();
    ctx.fillStyle = colors.tree;

    this.trees.forEach((t, idx) => {
      // Subtle gentle breeze sway
      const sway = Math.sin(timeSec * 1.2 + idx) * 2.5;

      ctx.save();
      ctx.translate(t.x, t.y);

      // Trunk
      ctx.fillRect(-3, -t.trunkH, 6, t.trunkH);

      // Canopy
      ctx.beginPath();
      ctx.arc(sway, -t.trunkH - t.radius * 0.7, t.radius, 0, Math.PI * 2);
      ctx.arc(sway - t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
      ctx.arc(sway + t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 8. Park Benches ---

  drawBenches(ctx, colors) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;

    this.benches.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Bench seat
      ctx.fillRect(-b.width / 2, -b.height, b.width, 3);
      // Bench backrest
      ctx.fillRect(-b.width / 2, -b.height - 12, b.width, 3);
      ctx.fillRect(-b.width / 2, -b.height - 6, b.width, 3);
      // Backrest supports
      ctx.fillRect(-b.width / 2 + 3, -b.height - 12, 3, 12);
      ctx.fillRect(b.width / 2 - 6, -b.height - 12, 3, 12);
      // Legs
      ctx.fillRect(-b.width / 2 + 4, -b.height, 3, b.height);
      ctx.fillRect(b.width / 2 - 7, -b.height, 3, b.height);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 9. Streetlamps & Volumetric Light Cones ---

  drawStreetlamps(ctx, colors, timeSec) {
    ctx.save();

    this.streetlamps.forEach(lamp => {
      ctx.save();
      ctx.translate(lamp.x, lamp.y);

      const lampH = lamp.height;

      // Volumetric Light Cone on Ground (Dusk & Night)
      if (colors.lampGlow > 0.05) {
        ctx.save();
        const beamGrad = ctx.createRadialGradient(0, -lampH + 10, 5, 0, 0, 110);
        beamGrad.addColorStop(0, colors.lampLight);
        beamGrad.addColorStop(0.6, colors.lampLightMid);
        beamGrad.addColorStop(1, "rgba(255, 230, 140, 0)");

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -lampH + 8);
        ctx.lineTo(-90, 0);
        ctx.lineTo(90, 0);
        ctx.lineTo(12, -lampH + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Victorian Cast-Iron Lamp Post Silhouette
      ctx.fillStyle = colors.silhouette;

      // Base
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-4, -14);
      ctx.lineTo(4, -14);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();

      // Slender Post
      ctx.fillRect(-2, -lampH + 16, 4, lampH - 30);

      // Ornate bracket & lantern housing
      ctx.beginPath();
      ctx.arc(0, -lampH + 16, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern frame
      ctx.strokeRect(-7, -lampH, 14, 16);

      // Glowing Lantern Glass
      if (colors.lampGlow > 0.05) {
        ctx.fillStyle = `rgba(255, 235, 160, ${0.4 + colors.lampGlow * 0.6})`;
        ctx.fillRect(-6, -lampH + 1, 12, 14);

        // Filament glare dot
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -lampH + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Top cap & finial
      ctx.fillStyle = colors.silhouette;
      ctx.beginPath();
      ctx.moveTo(-9, -lampH);
      ctx.lineTo(0, -lampH - 8);
      ctx.lineTo(9, -lampH);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 10. Animated 2D Vector Characters (Human Activities) ---

  drawCharacters(ctx, colors, timeSec) {
    this.characters.forEach(char => {
      ctx.save();
      ctx.translate(char.x, char.y);
      ctx.scale(char.scale * char.facing, char.scale);

      switch (char.type) {
        case "jogger":
          this.renderJogger(ctx, colors, timeSec, char);
          break;
        case "dog_walker":
          this.renderDogWalker(ctx, colors, timeSec, char);
          break;
        case "cyclist":
          this.renderCyclist(ctx, colors, timeSec, char);
          break;
        case "walker":
          this.renderWalker(ctx, colors, timeSec, char);
          break;
        case "couple":
          this.renderCouple(ctx, colors, timeSec, char);
          break;
        case "bench_reader":
          this.renderBenchReader(ctx, colors, timeSec, char);
          break;
        case "bench_guitarist":
          this.renderBenchGuitarist(ctx, colors, timeSec, char);
          break;
        case "bench_watcher":
          this.renderBenchWatcher(ctx, colors, timeSec, char);
          break;
        case "stargazer":
          this.renderStargazer(ctx, colors, timeSec, char);
          break;
        default:
          this.renderWalker(ctx, colors, timeSec, char);
          break;
      }

      ctx.restore();
    });
  }

  // --- Character Archetype Renderers ---

  // A. Jogger / Runner
  renderJogger(ctx, colors, timeSec, char) {
    const pace = timeSec * 11;
    const bounce = Math.abs(Math.sin(pace)) * 4.5;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";

    // Head with visor/hair
    ctx.beginPath();
    ctx.arc(6, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning forward 14 degrees)
    ctx.save();
    ctx.translate(0, baseY);
    ctx.rotate(14 * Math.PI / 180);
    ctx.fillRect(-4, -52, 9, 24);
    ctx.restore();

    // Legs (High knee lift jog cycle)
    const leg1Angle = Math.sin(pace) * 0.85;
    const leg2Angle = Math.sin(pace + Math.PI) * 0.85;

    // Leg 1
    ctx.beginPath();
    ctx.moveTo(-2, baseY - 28);
    const knee1X = -2 + Math.sin(leg1Angle) * 16;
    const knee1Y = baseY - 28 + Math.cos(leg1Angle) * 16;
    ctx.lineTo(knee1X, knee1Y);
    ctx.lineTo(knee1X + Math.sin(leg1Angle + 0.6) * 16, knee1Y + Math.cos(leg1Angle + 0.6) * 14);
    ctx.stroke();

    // Leg 2
    ctx.beginPath();
    ctx.moveTo(3, baseY - 28);
    const knee2X = 3 + Math.sin(leg2Angle) * 16;
    const knee2Y = baseY - 28 + Math.cos(leg2Angle) * 16;
    ctx.lineTo(knee2X, knee2Y);
    ctx.lineTo(knee2X + Math.sin(leg2Angle + 0.6) * 16, knee2Y + Math.cos(leg2Angle + 0.6) * 14);
    ctx.stroke();

    // Arms (Bent 90 degrees, pumping)
    const arm1Angle = -Math.sin(pace) * 0.9;
    const arm2Angle = -Math.sin(pace + Math.PI) * 0.9;

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const elbow1X = 2 + Math.sin(arm1Angle) * 12;
    const elbow1Y = baseY - 48 + Math.cos(arm1Angle) * 12;
    ctx.lineTo(elbow1X, elbow1Y);
    ctx.lineTo(elbow1X + 8, elbow1Y - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const elbow2X = 2 + Math.sin(arm2Angle) * 12;
    const elbow2Y = baseY - 48 + Math.cos(arm2Angle) * 12;
    ctx.lineTo(elbow2X, elbow2Y);
    ctx.lineTo(elbow2X + 8, elbow2Y - 4);
    ctx.stroke();

    // Glowing Reflector Armband (Night runner)
    if (char.hasReflector) {
      ctx.fillStyle = "#39ffb4";
      ctx.fillRect(elbow1X - 2, elbow1Y - 4, 4, 3);
    }
  }

  // B. Dog Walker & Playful Trotting Dog
  renderDogWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 5;
    const bounce = Math.abs(Math.sin(pace)) * 2;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Human Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso / Jacket
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Legs (Smooth walking cycle)
    const leg1 = Math.sin(pace) * 0.55;
    const leg2 = Math.sin(pace + Math.PI) * 0.55;

    ctx.beginPath();
    ctx.moveTo(-3, baseY - 26);
    ctx.lineTo(-3 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-3 + Math.sin(leg1) * 14 + Math.sin(leg1 + 0.3) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(3, baseY - 26);
    ctx.lineTo(3 + Math.sin(leg2) * 14, baseY - 12);
    ctx.lineTo(3 + Math.sin(leg2) * 14 + Math.sin(leg2 + 0.3) * 14, 0);
    ctx.stroke();

    // Left Arm swinging naturally
    ctx.beginPath();
    ctx.moveTo(-4, baseY - 46);
    ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
    ctx.stroke();

    // Right Arm holding leash (extended forward)
    const handX = 14;
    const handY = baseY - 32;
    ctx.beginPath();
    ctx.moveTo(4, baseY - 46);
    ctx.lineTo(10, baseY - 38);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Dog trotting ahead
    const dogX = 36;
    const dogPace = timeSec * 10;
    const dogBounce = Math.abs(Math.sin(dogPace)) * 1.8;
    const dogY = -dogBounce;

    // Leash (Curved flexible line from hand to dog's collar)
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(dogX - 10, handY + 12, dogX, dogY - 14);
    ctx.stroke();
    ctx.restore();

    // Dog Body
    ctx.save();
    ctx.translate(dogX, dogY);

    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    // Torso
    ctx.ellipse(0, -12, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Dog Head & Snout
    ctx.beginPath();
    ctx.arc(10, -17, 5, 0, Math.PI * 2);
    ctx.lineTo(17, -15);
    ctx.lineTo(14, -12);
    ctx.fill();

    // Perky Ear
    ctx.beginPath();
    ctx.moveTo(8, -21);
    ctx.lineTo(12, -23);
    ctx.lineTo(11, -17);
    ctx.fill();

    // 4 Trotting Legs
    ctx.lineWidth = 2.0;
    const dLeg1 = Math.sin(dogPace) * 0.6;
    const dLeg2 = Math.sin(dogPace + Math.PI) * 0.6;

    // Front legs
    ctx.beginPath();
    ctx.moveTo(7, -8);
    ctx.lineTo(7 + Math.sin(dLeg1) * 8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(9, -8);
    ctx.lineTo(9 + Math.sin(dLeg2) * 8, 0);
    ctx.stroke();

    // Back legs
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(-7 + Math.sin(dLeg2) * 8, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-5 + Math.sin(dLeg1) * 8, 0);
    ctx.stroke();

    // Wagging Tail
    const tailWag = Math.sin(timeSec * 16) * 4;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-16, -20 + tailWag, -14, -24 + tailWag);
    ctx.stroke();

    ctx.restore();
  }

  // C. Cyclist
  renderCyclist(ctx, colors, timeSec, char) {
    const wheelAngle = timeSec * 14;
    const pedalAngle = timeSec * 6;

    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    // Bicycle Wheels (Front & Rear)
    const rearX = -26;
    const frontX = 26;
    const wheelR = 15;
    const axleY = -wheelR;

    ctx.lineWidth = 1.8;
    // Rear Wheel
    ctx.beginPath();
    ctx.arc(rearX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Front Wheel
    ctx.beginPath();
    ctx.arc(frontX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Wheel Spokes (Turning)
    [-rearX, frontX].forEach(wx => {
      ctx.save();
      ctx.translate(wx, axleY);
      ctx.rotate(wheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-wheelR, 0);
      ctx.lineTo(wheelR, 0);
      ctx.moveTo(0, -wheelR);
      ctx.lineTo(0, wheelR);
      ctx.stroke();
      ctx.restore();
    });

    // Bicycle Diamond Frame
    ctx.lineWidth = 2.2;
    const bottomBracketX = 0;
    const bottomBracketY = axleY + 3;
    const seatPostX = -8;
    const seatPostY = -34;
    const headTubeX = 18;
    const headTubeY = -36;

    ctx.beginPath();
    // Rear triangle
    ctx.moveTo(rearX, axleY);
    ctx.lineTo(seatPostX, seatPostY);
    ctx.lineTo(bottomBracketX, bottomBracketY);
    ctx.closePath();
    ctx.stroke();

    // Main diamond
    ctx.beginPath();
    ctx.moveTo(bottomBracketX, bottomBracketY);
    ctx.lineTo(headTubeX, headTubeY);
    ctx.lineTo(seatPostX, seatPostY);
    ctx.stroke();

    // Fork to front wheel
    ctx.beginPath();
    ctx.moveTo(headTubeX, headTubeY);
    ctx.lineTo(frontX, axleY);
    ctx.stroke();

    // Handlebars
    ctx.beginPath();
    ctx.moveTo(headTubeX, headTubeY);
    ctx.lineTo(headTubeX + 4, headTubeY - 6);
    ctx.lineTo(headTubeX + 8, headTubeY - 4);
    ctx.stroke();

    // Saddle
    ctx.fillRect(seatPostX - 5, seatPostY - 2, 12, 3);

    // Cyclist Body
    // Head with helmet
    ctx.beginPath();
    ctx.arc(8, -58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    // Helmet visor
    ctx.fillRect(11, -61, 5, 3);

    // Torso (leaning forward)
    ctx.save();
    ctx.translate(seatPostX + 4, seatPostY - 4);
    ctx.rotate(35 * Math.PI / 180);
    ctx.fillRect(-3, -24, 7, 24);
    ctx.restore();

    // Arms to handlebars
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(4, -50);
    ctx.lineTo(12, -42);
    ctx.lineTo(headTubeX + 6, headTubeY - 5);
    ctx.stroke();

    // Legs (Rotating around pedals)
    const pedalR = 6;
    const pX = bottomBracketX + Math.cos(pedalAngle) * pedalR;
    const pY = bottomBracketY + Math.sin(pedalAngle) * pedalR;

    ctx.beginPath();
    ctx.moveTo(seatPostX + 2, seatPostY);
    // Knee articulates with pedal rotation
    const kneeX = 2 + Math.cos(pedalAngle) * 5;
    const kneeY = -22 + Math.sin(pedalAngle) * 3;
    ctx.lineTo(kneeX, kneeY);
    ctx.lineTo(pX, pY);
    ctx.stroke();

    ctx.restore();
  }

  // D. Stroller / Pedestrian (with Coffee or Bag)
  renderWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.5;
    const bounce = Math.abs(Math.sin(pace)) * 2;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, baseY - 50, 10, char.hasCoat ? 28 : 24);

    // Legs
    const leg1 = Math.sin(pace) * 0.52;
    const leg2 = Math.sin(pace + Math.PI) * 0.52;

    ctx.beginPath();
    ctx.moveTo(-3, baseY - 26);
    ctx.lineTo(-3 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-3 + Math.sin(leg1) * 14 + Math.sin(leg1 + 0.3) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(3, baseY - 26);
    ctx.lineTo(3 + Math.sin(leg2) * 14, baseY - 12);
    ctx.lineTo(3 + Math.sin(leg2) * 14 + Math.sin(leg2 + 0.3) * 14, 0);
    ctx.stroke();

    // Arms
    if (char.hasCoffee) {
      // Steaming coffee cup in hand!
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(9, baseY - 36);
      ctx.lineTo(12, baseY - 34);
      ctx.stroke();

      // Coffee Cup
      ctx.fillRect(11, baseY - 36, 5, 7);

      // Steam wisps rising
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      const steamY = baseY - 38 - ((timeSec * 16) % 18);
      ctx.beginPath();
      ctx.moveTo(13, baseY - 38);
      ctx.quadraticCurveTo(15, steamY + 4, 13, steamY);
      ctx.stroke();
      ctx.restore();
    } else {
      // Normal swing or holding bag
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(4 + Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();

      if (char.hasBag) {
        ctx.fillRect(6 + Math.sin(pace) * 10, baseY - 26, 7, 10);
      }
    }
  }

  // E. Romantic Couple Strolling Together
  renderCouple(ctx, colors, timeSec, char) {
    const pace = timeSec * 4;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = -bounce;

    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Person 1 (Taller)
    ctx.beginPath();
    ctx.arc(-8, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-12, baseY - 52, 9, 26);

    // Person 2 (Slightly shorter)
    ctx.beginPath();
    ctx.arc(8, baseY - 54, 6.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(4, baseY - 48, 8, 24);

    // Joined Hands in the middle
    ctx.beginPath();
    ctx.moveTo(-6, baseY - 46);
    ctx.lineTo(0, baseY - 32);
    ctx.lineTo(6, baseY - 42);
    ctx.stroke();

    // Outer walking legs
    const leg1 = Math.sin(pace) * 0.48;
    const leg2 = Math.sin(pace + Math.PI) * 0.48;

    ctx.beginPath();
    ctx.moveTo(-10, baseY - 26);
    ctx.lineTo(-10 + Math.sin(leg1) * 14, baseY - 12);
    ctx.lineTo(-10 + Math.sin(leg1) * 14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(8, baseY - 24);
    ctx.lineTo(8 + Math.sin(leg2) * 14, baseY - 11);
    ctx.lineTo(8 + Math.sin(leg2) * 14, 0);
    ctx.stroke();
  }

  // F. Bench Reader (Day)
  renderBenchReader(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Seated Figure
    // Head looking down at book
    ctx.beginPath();
    ctx.arc(2, -32, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning slightly forward)
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(-4, -12);
    ctx.lineTo(6, -12);
    ctx.lineTo(6, -24);
    ctx.closePath();
    ctx.fill();

    // Bent legs at bench height
    ctx.beginPath();
    ctx.moveTo(6, -12);
    ctx.lineTo(14, -12);
    ctx.lineTo(14, 0);
    ctx.stroke();

    // Arms holding open book
    ctx.beginPath();
    ctx.moveTo(2, -22);
    ctx.lineTo(10, -18);
    ctx.stroke();

    // Open Book
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(8, -20);
    ctx.lineTo(14, -22);
    ctx.lineTo(16, -16);
    ctx.lineTo(10, -15);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // G. Bench Guitarist (Dusk)
  renderBenchGuitarist(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;

    // Seated Musician
    // Head tilted listening to music
    ctx.beginPath();
    ctx.arc(-2, -33, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-6, -26, 10, 16);

    // Legs
    ctx.beginPath();
    ctx.moveTo(2, -12);
    ctx.lineTo(12, -12);
    ctx.lineTo(12, 0);
    ctx.stroke();

    // Acoustic Guitar Body in lap
    ctx.fillStyle = "#d28242";
    ctx.beginPath();
    ctx.ellipse(4, -16, 9, 6, 25 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Guitar Neck
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(4, -16);
    ctx.lineTo(-10, -26);
    ctx.stroke();

    // Strumming arm
    const strum = Math.sin(timeSec * 7) * 2;
    ctx.beginPath();
    ctx.moveTo(2, -24);
    ctx.lineTo(6, -16 + strum);
    ctx.stroke();

    ctx.restore();
  }

  // H. Bench Sunset Watcher (Sunset)
  renderBenchWatcher(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;

    // Head looking out at sunset
    ctx.beginPath();
    ctx.arc(-4, -32, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso relaxed against backrest
    ctx.fillRect(-7, -26, 9, 16);

    // Legs crossed relaxed
    ctx.beginPath();
    ctx.moveTo(0, -12);
    ctx.lineTo(12, -12);
    ctx.lineTo(10, 0);
    ctx.stroke();

    // Arm resting along bench back
    ctx.beginPath();
    ctx.moveTo(-5, -24);
    ctx.lineTo(-12, -22);
    ctx.stroke();

    ctx.restore();
  }

  // I. Stargazer with Telescope (Night)
  renderStargazer(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    // Brass Telescope on Tripod
    const tripodX = 14;
    const tripodTopY = -34;

    ctx.lineWidth = 1.8;
    // Tripod Legs
    ctx.beginPath();
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX - 12, 0);
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX, 0);
    ctx.moveTo(tripodX, tripodTopY);
    ctx.lineTo(tripodX + 12, 0);
    ctx.stroke();

    // Telescope Tube angled at 40 degrees toward moon
    ctx.save();
    ctx.translate(tripodX, tripodTopY);
    ctx.rotate(-42 * Math.PI / 180);
    ctx.fillStyle = "#c59b27"; // polished brass sheen
    ctx.fillRect(-10, -3, 28, 6);
    ctx.restore();

    // Stargazer Figure standing, bent slightly looking into eyepiece
    ctx.fillStyle = colors.silhouette;
    // Head at eyepiece
    ctx.beginPath();
    ctx.arc(6, -37, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.save();
    ctx.translate(2, -34);
    ctx.rotate(18 * Math.PI / 180);
    ctx.fillRect(-4, 0, 8, 20);
    ctx.restore();

    // Legs
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(-4, 0);
    ctx.moveTo(4, -14);
    ctx.lineTo(6, 0);
    ctx.stroke();

    // Hands steadying the mount
    ctx.beginPath();
    ctx.moveTo(6, -30);
    ctx.lineTo(12, -34);
    ctx.stroke();

    ctx.restore();
  }
}

  // =========================================================================
  // 5. Application Controller
  // =========================================================================
/**
 * Antigravity "PHILL" World Time Application Controller
 * Orchestrates global search (countries, cities, towns),
 * high-speed horological hand spinning & mechanical deceleration,
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
    this.watchCanvas = document.getElementById("watch-canvas");
    this.horizonCanvas = document.getElementById("horizon-canvas");
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
    // 2D Swiss luxury dress watch engine
    this.watch = new WatchEngine(this.watchCanvas, soundEngine);
    // Animated Horizon & 2D Vector Human Activity Scenery
    this.scenery = new HorizonScenery(this.horizonCanvas);
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

    // Watch Finish Selection (Yellow Gold, Rose Gold, White Gold, Platinum)
    this.finishButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        soundEngine.init();
        this.finishButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const finish = btn.dataset.finish;
        this.watch.setFinish(finish);
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
   * 1. Telemetry HUD activates with destination name.
   * 2. The watch hands spin rapidly forward with mechanical gear whirl.
   * 3. Hands gradually decelerate and smoothly lock onto the destination time with crystal chime.
   * 4. Background sky atmosphere seamlessly morphs to match the local solar time.
   */
  selectLocation(city, isUserTriggered = true) {
    this.selectedCity = city;

    // Get time information for the target city or country
    const timeInfo = getTimeInfoForZone(city.tz);

    // Update digital readout and meta cards
    this.updateInfoCards(city, timeInfo);

    if (!isUserTriggered) {
      // Direct set without fast spin animation
      this.watch.setTime(timeInfo, false);
      this.applyBackgroundTheme(timeInfo);
      this.setTelemetry(`✦ ${city.flag} ${city.name.toUpperCase()} • SYNCHRONIZED`, false);
      this.startLiveClock();
      return;
    }

    this.isTransitioning = true;

    // --- Fast Hand Spin & Deceleration Animation ---
    this.setTelemetry(`✦ TARGETING ${city.flag} ${city.name.toUpperCase()} • SPINNING HANDS...`, true);

    // Background theme starts morphing as the hands spin
    this.applyBackgroundTheme(timeInfo);

    this.watch.setTime(timeInfo, true, () => {
      // When hands finish spinning and lock onto time
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

    // Update Animated Horizon & 2D Vector Human Activity Scenery
    if (this.scenery) {
      this.scenery.setTime(theme, timeInfo.decimalHour);
    }
  }

  startLiveClock() {
    if (this.liveClockTimer) clearInterval(this.liveClockTimer);

    this.liveClockTimer = setInterval(() => {
      if (!this.selectedCity || this.isTransitioning) return;
      const updatedInfo = getTimeInfoForZone(this.selectedCity.tz);
      this.updateInfoCards(this.selectedCity, updatedInfo);
      this.watch.currentTime = { ...updatedInfo };
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
