/**
 * PHILL - World Watch & Planetary Timepiece
 * Unified Production Bundle (Self-Contained, Zero External Dependencies)
 * 2D Swiss Dial Engine, 3D Buckled Timepiece WebGL Engine, Animated Horizon & Human Activity Scenery, World Time Resolver, & Web Audio
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
  { name: "Nigeria", country: "Nigeria", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 9.0820, lng: 8.6753, code: "NG", capital: "Abuja" },
  { name: "United States", country: "United States", flag: "ðŸ‡ºðŸ‡¸", tz: "America/New_York", lat: 38.9072, lng: -77.0369, code: "US", capital: "Washington, D.C." },
  { name: "United Kingdom", country: "United Kingdom", flag: "ðŸ‡¬ðŸ‡§", tz: "Europe/London", lat: 51.5074, lng: -0.1278, code: "GB", capital: "London" },
  { name: "Japan", country: "Japan", flag: "ðŸ‡¯ðŸ‡µ", tz: "Asia/Tokyo", lat: 35.6762, lng: 139.6503, code: "JP", capital: "Tokyo" },
  { name: "France", country: "France", flag: "ðŸ‡«ðŸ‡·", tz: "Europe/Paris", lat: 48.8566, lng: 2.3522, code: "FR", capital: "Paris" },
  { name: "Germany", country: "Germany", flag: "ðŸ‡©ðŸ‡ª", tz: "Europe/Berlin", lat: 52.5200, lng: 13.4050, code: "DE", capital: "Berlin" },
  { name: "Italy", country: "Italy", flag: "ðŸ‡®ðŸ‡¹", tz: "Europe/Rome", lat: 41.9028, lng: 12.4964, code: "IT", capital: "Rome" },
  { name: "Spain", country: "Spain", flag: "ðŸ‡ªðŸ‡¸", tz: "Europe/Madrid", lat: 40.4168, lng: -3.7038, code: "ES", capital: "Madrid" },
  { name: "Canada", country: "Canada", flag: "ðŸ‡¨ðŸ‡¦", tz: "America/Toronto", lat: 45.4215, lng: -75.6972, code: "CA", capital: "Ottawa" },
  { name: "Australia", country: "Australia", flag: "ðŸ‡¦ðŸ‡º", tz: "Australia/Sydney", lat: -35.2809, lng: 149.1300, code: "AU", capital: "Canberra" },
  { name: "Brazil", country: "Brazil", flag: "ðŸ‡§ðŸ‡·", tz: "America/Sao_Paulo", lat: -15.7975, lng: -47.8919, code: "BR", capital: "BrasÃ­lia" },
  { name: "India", country: "India", flag: "ðŸ‡®ðŸ‡³", tz: "Asia/Kolkata", lat: 28.6139, lng: 77.2090, code: "IN", capital: "New Delhi" },
  { name: "China", country: "China", flag: "ðŸ‡¨ðŸ‡³", tz: "Asia/Shanghai", lat: 39.9042, lng: 116.4074, code: "CN", capital: "Beijing" },
  { name: "South Africa", country: "South Africa", flag: "ðŸ‡¿ðŸ‡¦", tz: "Africa/Johannesburg", lat: -25.7479, lng: 28.2293, code: "ZA", capital: "Pretoria" },
  { name: "Kenya", country: "Kenya", flag: "ðŸ‡°ðŸ‡ª", tz: "Africa/Nairobi", lat: -1.2921, lng: 36.8219, code: "KE", capital: "Nairobi" },
  { name: "Ghana", country: "Ghana", flag: "ðŸ‡¬ðŸ‡­", tz: "Africa/Accra", lat: 5.6037, lng: -0.1870, code: "GH", capital: "Accra" },
  { name: "Egypt", country: "Egypt", flag: "ðŸ‡ªðŸ‡¬", tz: "Africa/Cairo", lat: 30.0444, lng: 31.2357, code: "EG", capital: "Cairo" },
  { name: "Mexico", country: "Mexico", flag: "ðŸ‡²ðŸ‡½", tz: "America/Mexico_City", lat: 19.4326, lng: -99.1332, code: "MX", capital: "Mexico City" },
  { name: "Argentina", country: "Argentina", flag: "ðŸ‡¦ðŸ‡·", tz: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816, code: "AR", capital: "Buenos Aires" },
  { name: "Russia", country: "Russia", flag: "ðŸ‡·ðŸ‡º", tz: "Europe/Moscow", lat: 55.7558, lng: 37.6173, code: "RU", capital: "Moscow" },
  { name: "United Arab Emirates", country: "United Arab Emirates", flag: "ðŸ‡¦ðŸ‡ª", tz: "Asia/Dubai", lat: 24.4539, lng: 54.3773, code: "AE", capital: "Abu Dhabi" },
  { name: "Saudi Arabia", country: "Saudi Arabia", flag: "ðŸ‡¸ðŸ‡¦", tz: "Asia/Riyadh", lat: 24.7136, lng: 46.6753, code: "SA", capital: "Riyadh" },
  { name: "Turkey", country: "Turkey", flag: "ðŸ‡¹ðŸ‡·", tz: "Europe/Istanbul", lat: 39.9334, lng: 32.8597, code: "TR", capital: "Ankara" },
  { name: "South Korea", country: "South Korea", flag: "ðŸ‡°ðŸ‡·", tz: "Asia/Seoul", lat: 37.5665, lng: 126.9780, code: "KR", capital: "Seoul" },
  { name: "Indonesia", country: "Indonesia", flag: "ðŸ‡®ðŸ‡©", tz: "Asia/Jakarta", lat: -6.2088, lng: 106.8456, code: "ID", capital: "Jakarta" },
  { name: "Switzerland", country: "Switzerland", flag: "ðŸ‡¨ðŸ‡­", tz: "Europe/Zurich", lat: 46.9480, lng: 7.4474, code: "CH", capital: "Bern" },
  { name: "Sweden", country: "Sweden", flag: "ðŸ‡¸ðŸ‡ª", tz: "Europe/Stockholm", lat: 59.3293, lng: 18.0686, code: "SE", capital: "Stockholm" },
  { name: "Norway", country: "Norway", flag: "ðŸ‡³ðŸ‡´", tz: "Europe/Oslo", lat: 59.9139, lng: 10.7522, code: "NO", capital: "Oslo" },
  { name: "Denmark", country: "Denmark", flag: "ðŸ‡©ðŸ‡°", tz: "Europe/Copenhagen", lat: 55.6761, lng: 12.5683, code: "DK", capital: "Copenhagen" },
  { name: "Netherlands", country: "Netherlands", flag: "ðŸ‡³ðŸ‡±", tz: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041, code: "NL", capital: "Amsterdam" },
  { name: "New Zealand", country: "New Zealand", flag: "ðŸ‡³ðŸ‡¿", tz: "Pacific/Auckland", lat: -41.2865, lng: 174.7762, code: "NZ", capital: "Wellington" },
  { name: "Greece", country: "Greece", flag: "ðŸ‡¬ðŸ‡·", tz: "Europe/Athens", lat: 37.9838, lng: 23.7275, code: "GR", capital: "Athens" },
  { name: "Portugal", country: "Portugal", flag: "ðŸ‡µðŸ‡¹", tz: "Europe/Lisbon", lat: 38.7223, lng: -9.1393, code: "PT", capital: "Lisbon" },
  { name: "Poland", country: "Poland", flag: "ðŸ‡µðŸ‡±", tz: "Europe/Warsaw", lat: 52.2297, lng: 21.0122, code: "PL", capital: "Warsaw" },
  { name: "Ireland", country: "Ireland", flag: "ðŸ‡®ðŸ‡ª", tz: "Europe/Dublin", lat: 53.3498, lng: -6.2603, code: "IE", capital: "Dublin" },
  { name: "Philippines", country: "Philippines", flag: "ðŸ‡µðŸ‡­", tz: "Asia/Manila", lat: 14.5995, lng: 120.9842, code: "PH", capital: "Manila" },
  { name: "Thailand", country: "Thailand", flag: "ðŸ‡¹ðŸ‡­", tz: "Asia/Bangkok", lat: 13.7563, lng: 100.5018, code: "TH", capital: "Bangkok" },
  { name: "Vietnam", country: "Vietnam", flag: "ðŸ‡»ðŸ‡³", tz: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542, code: "VN", capital: "Hanoi" },
  { name: "Malaysia", country: "Malaysia", flag: "ðŸ‡²ðŸ‡¾", tz: "Asia/Kuala_Lumpur", lat: 3.1390, lng: 101.6869, code: "MY", capital: "Kuala Lumpur" },
  { name: "Singapore", country: "Singapore", flag: "ðŸ‡¸ðŸ‡¬", tz: "Asia/Singapore", lat: 1.3521, lng: 103.8198, code: "SG", capital: "Singapore" },
  { name: "Colombia", country: "Colombia", flag: "ðŸ‡¨ðŸ‡´", tz: "America/Bogota", lat: 4.7110, lng: -74.0721, code: "CO", capital: "Bogota" },
  { name: "Chile", country: "Chile", flag: "ðŸ‡¨ðŸ‡±", tz: "America/Santiago", lat: -33.4489, lng: -70.6693, code: "CL", capital: "Santiago" },
  { name: "Peru", country: "Peru", flag: "ðŸ‡µðŸ‡ª", tz: "America/Lima", lat: -12.0464, lng: -77.0428, code: "PE", capital: "Lima" },
  { name: "Israel", country: "Israel", flag: "ðŸ‡®ðŸ‡±", tz: "Asia/Jerusalem", lat: 31.7683, lng: 35.2137, code: "IL", capital: "Jerusalem" },
  { name: "Morocco", country: "Morocco", flag: "ðŸ‡²ðŸ‡¦", tz: "Africa/Casablanca", lat: 31.7917, lng: -7.0926, code: "MA", capital: "Rabat" },
  { name: "Ethiopia", country: "Ethiopia", flag: "ðŸ‡ªðŸ‡¹", tz: "Africa/Addis_Ababa", lat: 9.0300, lng: 38.7400, code: "ET", capital: "Addis Ababa" },
  { name: "Pakistan", country: "Pakistan", flag: "ðŸ‡µðŸ‡°", tz: "Asia/Karachi", lat: 33.6844, lng: 73.0479, code: "PK", capital: "Islamabad" },
  { name: "Bangladesh", country: "Bangladesh", flag: "ðŸ‡§ðŸ‡©", tz: "Asia/Dhaka", lat: 23.8103, lng: 90.4125, code: "BD", capital: "Dhaka" },
  { name: "Iran", country: "Iran", flag: "ðŸ‡®ðŸ‡·", tz: "Asia/Tehran", lat: 35.6892, lng: 51.3890, code: "IR", capital: "Tehran" },
  { name: "Qatar", country: "Qatar", flag: "ðŸ‡¶ðŸ‡¦", tz: "Asia/Qatar", lat: 25.2854, lng: 51.5310, code: "QA", capital: "Doha" },
  { name: "Iceland", country: "Iceland", flag: "ðŸ‡®ðŸ‡¸", tz: "Atlantic/Reykjavik", lat: 64.1466, lng: -21.9426, code: "IS", capital: "Reykjavik" },
  { name: "Ukraine", country: "Ukraine", flag: "ðŸ‡ºðŸ‡¦", tz: "Europe/Kyiv", lat: 50.4501, lng: 30.5234, code: "UA", capital: "Kyiv" },
  { name: "Austria", country: "Austria", flag: "ðŸ‡¦ðŸ‡¹", tz: "Europe/Vienna", lat: 48.2082, lng: 16.3738, code: "AT", capital: "Vienna" },
  { name: "Belgium", country: "Belgium", flag: "ðŸ‡§ðŸ‡ª", tz: "Europe/Brussels", lat: 50.8503, lng: 4.3517, code: "BE", capital: "Brussels" },
  { name: "Finland", country: "Finland", flag: "ðŸ‡«ðŸ‡®", tz: "Europe/Helsinki", lat: 60.1699, lng: 24.9384, code: "FI", capital: "Helsinki" },
  { name: "Czech Republic", country: "Czech Republic", flag: "ðŸ‡¨ðŸ‡¿", tz: "Europe/Prague", lat: 50.0755, lng: 14.4378, code: "CZ", capital: "Prague" },
  { name: "Romania", country: "Romania", flag: "ðŸ‡·ðŸ‡´", tz: "Europe/Bucharest", lat: 44.4268, lng: 26.1025, code: "RO", capital: "Bucharest" },
  { name: "Hungary", country: "Hungary", flag: "ðŸ‡­ðŸ‡º", tz: "Europe/Budapest", lat: 47.4979, lng: 19.0402, code: "HU", capital: "Budapest" },
  { name: "Fiji", country: "Fiji", flag: "ðŸ‡«ðŸ‡¯", tz: "Pacific/Fiji", lat: -18.1248, lng: 178.4501, code: "FJ", capital: "Suva" }
];

// 2. Global Cities Database
const WORLD_CITIES = [
  // Europe
  { name: "London", country: "United Kingdom", code: "GB", flag: "ðŸ‡¬ðŸ‡§", tz: "Europe/London", lat: 51.5074, lng: -0.1278 },
  { name: "Paris", country: "France", code: "FR", flag: "ðŸ‡«ðŸ‡·", tz: "Europe/Paris", lat: 48.8566, lng: 2.3522 },
  { name: "Berlin", country: "Germany", code: "DE", flag: "ðŸ‡©ðŸ‡ª", tz: "Europe/Berlin", lat: 52.5200, lng: 13.4050 },
  { name: "Rome", country: "Italy", code: "IT", flag: "ðŸ‡®ðŸ‡¹", tz: "Europe/Rome", lat: 41.9028, lng: 12.4964 },
  { name: "Madrid", country: "Spain", code: "ES", flag: "ðŸ‡ªðŸ‡¸", tz: "Europe/Madrid", lat: 40.4168, lng: -3.7038 },
  { name: "Amsterdam", country: "Netherlands", code: "NL", flag: "ðŸ‡³ðŸ‡±", tz: "Europe/Amsterdam", lat: 52.3676, lng: 4.9041 },
  { name: "Brussels", country: "Belgium", code: "BE", flag: "ðŸ‡§ðŸ‡ª", tz: "Europe/Brussels", lat: 50.8503, lng: 4.3517 },
  { name: "Vienna", country: "Austria", code: "AT", flag: "ðŸ‡¦ðŸ‡¹", tz: "Europe/Vienna", lat: 48.2082, lng: 16.3738 },
  { name: "Zurich", country: "Switzerland", code: "CH", flag: "ðŸ‡¨ðŸ‡­", tz: "Europe/Zurich", lat: 47.3769, lng: 8.5417 },
  { name: "Geneva", country: "Switzerland", code: "CH", flag: "ðŸ‡¨ðŸ‡­", tz: "Europe/Zurich", lat: 46.2044, lng: 6.1432 },
  { name: "Stockholm", country: "Sweden", code: "SE", flag: "ðŸ‡¸ðŸ‡ª", tz: "Europe/Stockholm", lat: 59.3293, lng: 18.0686 },
  { name: "Oslo", country: "Norway", code: "NO", flag: "ðŸ‡³ðŸ‡´", tz: "Europe/Oslo", lat: 59.9139, lng: 10.7522 },
  { name: "Copenhagen", country: "Denmark", code: "DK", flag: "ðŸ‡©ðŸ‡°", tz: "Europe/Copenhagen", lat: 55.6761, lng: 12.5683 },
  { name: "Helsinki", country: "Finland", code: "FI", flag: "ðŸ‡«ðŸ‡®", tz: "Europe/Helsinki", lat: 60.1699, lng: 24.9384 },
  { name: "Reykjavik", country: "Iceland", code: "IS", flag: "ðŸ‡®ðŸ‡¸", tz: "Atlantic/Reykjavik", lat: 64.1466, lng: -21.9426 },
  { name: "Dublin", country: "Ireland", code: "IE", flag: "ðŸ‡®ðŸ‡ª", tz: "Europe/Dublin", lat: 53.3498, lng: -6.2603 },
  { name: "Lisbon", country: "Portugal", code: "PT", flag: "ðŸ‡µðŸ‡¹", tz: "Europe/Lisbon", lat: 38.7223, lng: -9.1393 },
  { name: "Athens", country: "Greece", code: "GR", flag: "ðŸ‡¬ðŸ‡·", tz: "Europe/Athens", lat: 37.9838, lng: 23.7275 },
  { name: "Prague", country: "Czech Republic", code: "CZ", flag: "ðŸ‡¨ðŸ‡¿", tz: "Europe/Prague", lat: 50.0755, lng: 14.4378 },
  { name: "Warsaw", country: "Poland", code: "PL", flag: "ðŸ‡µðŸ‡±", tz: "Europe/Warsaw", lat: 52.2297, lng: 21.0122 },
  { name: "Budapest", country: "Hungary", code: "HU", flag: "ðŸ‡­ðŸ‡º", tz: "Europe/Budapest", lat: 47.4979, lng: 19.0402 },
  { name: "Bucharest", country: "Romania", code: "RO", flag: "ðŸ‡·ðŸ‡´", tz: "Europe/Bucharest", lat: 44.4268, lng: 26.1025 },
  { name: "Kyiv", country: "Ukraine", code: "UA", flag: "ðŸ‡ºðŸ‡¦", tz: "Europe/Kyiv", lat: 50.4501, lng: 30.5234 },
  { name: "Moscow", country: "Russia", code: "RU", flag: "ðŸ‡·ðŸ‡º", tz: "Europe/Moscow", lat: 55.7558, lng: 37.6173 },
  { name: "Istanbul", country: "Turkey", code: "TR", flag: "ðŸ‡¹ðŸ‡·", tz: "Europe/Istanbul", lat: 41.0082, lng: 28.9784 },

  // Nigeria & African Towns/Cities
  { name: "Lagos", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 6.5244, lng: 3.3792 },
  { name: "Abuja", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 9.0765, lng: 7.3986 },
  { name: "Ibadan", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 7.3775, lng: 3.9470 },
  { name: "Kano", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 12.0022, lng: 8.5920 },
  { name: "Port Harcourt", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 4.8156, lng: 7.0498 },
  { name: "Benin City", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 6.3350, lng: 5.6037 },
  { name: "Enugu", country: "Nigeria", code: "NG", flag: "ðŸ‡³ðŸ‡¬", tz: "Africa/Lagos", lat: 6.4584, lng: 7.5464 },
  { name: "Cairo", country: "Egypt", code: "EG", flag: "ðŸ‡ªðŸ‡¬", tz: "Africa/Cairo", lat: 30.0444, lng: 31.2357 },
  { name: "Johannesburg", country: "South Africa", code: "ZA", flag: "ðŸ‡¿ðŸ‡¦", tz: "Africa/Johannesburg", lat: -26.2041, lng: 28.0473 },
  { name: "Cape Town", country: "South Africa", code: "ZA", flag: "ðŸ‡¿ðŸ‡¦", tz: "Africa/Johannesburg", lat: -33.9249, lng: 18.4241 },
  { name: "Nairobi", country: "Kenya", code: "KE", flag: "ðŸ‡°ðŸ‡ª", tz: "Africa/Nairobi", lat: -1.2921, lng: 36.8219 },
  { name: "Mombasa", country: "Kenya", code: "KE", flag: "ðŸ‡°ðŸ‡ª", tz: "Africa/Nairobi", lat: -4.0435, lng: 39.6682 },
  { name: "Accra", country: "Ghana", code: "GH", flag: "ðŸ‡¬ðŸ‡­", tz: "Africa/Accra", lat: 5.6037, lng: -0.1870 },
  { name: "Kumasi", country: "Ghana", code: "GH", flag: "ðŸ‡¬ðŸ‡­", tz: "Africa/Accra", lat: 6.6885, lng: -1.6244 },
  { name: "Casablanca", country: "Morocco", code: "MA", flag: "ðŸ‡²ðŸ‡¦", tz: "Africa/Casablanca", lat: 33.5731, lng: -7.5898 },
  { name: "Marrakech", country: "Morocco", code: "MA", flag: "ðŸ‡²ðŸ‡¦", tz: "Africa/Casablanca", lat: 31.6295, lng: -7.9811 },
  { name: "Tunis", country: "Tunisia", code: "TN", flag: "ðŸ‡¹ðŸ‡³", tz: "Africa/Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Addis Ababa", country: "Ethiopia", code: "ET", flag: "ðŸ‡ªðŸ‡¹", tz: "Africa/Addis_Ababa", lat: 9.0300, lng: 38.7400 },
  { name: "Dakar", country: "Senegal", code: "SN", flag: "ðŸ‡¸ðŸ‡³", tz: "Africa/Dakar", lat: 14.7167, lng: -17.4677 },
  { name: "Dar es Salaam", country: "Tanzania", code: "TZ", flag: "ðŸ‡¹ðŸ‡¿", tz: "Africa/Dar_es_Salaam", lat: -6.7924, lng: 39.2083 },

  // North America
  { name: "New York", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/New_York", lat: 40.7128, lng: -74.0060 },
  { name: "Los Angeles", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Los_Angeles", lat: 34.0522, lng: -118.2437 },
  { name: "Chicago", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Chicago", lat: 41.8781, lng: -87.6298 },
  { name: "San Francisco", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Los_Angeles", lat: 37.7749, lng: -122.4194 },
  { name: "Miami", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/New_York", lat: 25.7617, lng: -80.1918 },
  { name: "Seattle", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Los_Angeles", lat: 47.6062, lng: -122.3321 },
  { name: "Boston", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/New_York", lat: 42.3601, lng: -71.0589 },
  { name: "Washington, D.C.", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/New_York", lat: 38.9072, lng: -77.0369 },
  { name: "Houston", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Chicago", lat: 29.7604, lng: -95.3698 },
  { name: "Dallas", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Chicago", lat: 32.7767, lng: -96.7970 },
  { name: "Austin", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Chicago", lat: 30.2672, lng: -97.7431 },
  { name: "Denver", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Denver", lat: 39.7392, lng: -104.9903 },
  { name: "Phoenix", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Phoenix", lat: 33.4484, lng: -112.0740 },
  { name: "Las Vegas", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Los_Angeles", lat: 36.1699, lng: -115.1398 },
  { name: "Honolulu", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "Pacific/Honolulu", lat: 21.3069, lng: -157.8583 },
  { name: "Anchorage", country: "United States", code: "US", flag: "ðŸ‡ºðŸ‡¸", tz: "America/Anchorage", lat: 61.2181, lng: -149.9003 },
  { name: "Toronto", country: "Canada", code: "CA", flag: "ðŸ‡¨ðŸ‡¦", tz: "America/Toronto", lat: 43.6532, lng: -79.3832 },
  { name: "Vancouver", country: "Canada", code: "CA", flag: "ðŸ‡¨ðŸ‡¦", tz: "America/Vancouver", lat: 49.2827, lng: -123.1207 },
  { name: "Montreal", country: "Canada", code: "CA", flag: "ðŸ‡¨ðŸ‡¦", tz: "America/Toronto", lat: 45.5017, lng: -73.5673 },
  { name: "Mexico City", country: "Mexico", code: "MX", flag: "ðŸ‡²ðŸ‡½", tz: "America/Mexico_City", lat: 19.4326, lng: -99.1332 },
  { name: "Cancun", country: "Mexico", code: "MX", flag: "ðŸ‡²ðŸ‡½", tz: "America/Cancun", lat: 21.1619, lng: -86.8515 },
  { name: "Havana", country: "Cuba", code: "CU", flag: "ðŸ‡¨ðŸ‡º", tz: "America/Havana", lat: 23.1136, lng: -82.3666 },
  { name: "Panama City", country: "Panama", code: "PA", flag: "ðŸ‡µðŸ‡¦", tz: "America/Panama", lat: 8.9824, lng: -79.5199 },

  // South America
  { name: "SÃ£o Paulo", country: "Brazil", code: "BR", flag: "ðŸ‡§ðŸ‡·", tz: "America/Sao_Paulo", lat: -23.5505, lng: -46.6333 },
  { name: "Rio de Janeiro", country: "Brazil", code: "BR", flag: "ðŸ‡§ðŸ‡·", tz: "America/Sao_Paulo", lat: -22.9068, lng: -43.1729 },
  { name: "Buenos Aires", country: "Argentina", code: "AR", flag: "ðŸ‡¦ðŸ‡·", tz: "America/Argentina/Buenos_Aires", lat: -34.6037, lng: -58.3816 },
  { name: "Santiago", country: "Chile", code: "CL", flag: "ðŸ‡¨ðŸ‡±", tz: "America/Santiago", lat: -33.4489, lng: -70.6693 },
  { name: "BogotÃ¡", country: "Colombia", code: "CO", flag: "ðŸ‡¨ðŸ‡´", tz: "America/Bogota", lat: 4.7110, lng: -74.0721 },
  { name: "Lima", country: "Peru", code: "PE", flag: "ðŸ‡µðŸ‡ª", tz: "America/Lima", lat: -12.0464, lng: -77.0428 },
  { name: "Caracas", country: "Venezuela", code: "VE", flag: "ðŸ‡»ðŸ‡ª", tz: "America/Caracas", lat: 10.4806, lng: -66.9036 },
  { name: "Montevideo", country: "Uruguay", code: "UY", flag: "ðŸ‡ºðŸ‡¾", tz: "America/Montevideo", lat: -34.9011, lng: -56.1645 },

  // Asia
  { name: "Tokyo", country: "Japan", code: "JP", flag: "ðŸ‡¯ðŸ‡µ", tz: "Asia/Tokyo", lat: 35.6762, lng: 139.6503 },
  { name: "Kyoto", country: "Japan", code: "JP", flag: "ðŸ‡¯ðŸ‡µ", tz: "Asia/Tokyo", lat: 35.0116, lng: 135.7681 },
  { name: "Osaka", country: "Japan", code: "JP", flag: "ðŸ‡¯ðŸ‡µ", tz: "Asia/Tokyo", lat: 34.6937, lng: 135.5023 },
  { name: "Seoul", country: "South Korea", code: "KR", flag: "ðŸ‡°ðŸ‡·", tz: "Asia/Seoul", lat: 37.5665, lng: 126.9780 },
  { name: "Beijing", country: "China", code: "CN", flag: "ðŸ‡¨ðŸ‡³", tz: "Asia/Shanghai", lat: 39.9042, lng: 116.4074 },
  { name: "Shanghai", country: "China", code: "CN", flag: "ðŸ‡¨ðŸ‡³", tz: "Asia/Shanghai", lat: 31.2304, lng: 121.4737 },
  { name: "Hong Kong", country: "Hong Kong", code: "HK", flag: "ðŸ‡­ðŸ‡°", tz: "Asia/Hong_Kong", lat: 22.3193, lng: 114.1694 },
  { name: "Taipei", country: "Taiwan", code: "TW", flag: "ðŸ‡¹ðŸ‡¼", tz: "Asia/Taipei", lat: 25.0330, lng: 121.5654 },
  { name: "Singapore", country: "Singapore", code: "SG", flag: "ðŸ‡¸ðŸ‡¬", tz: "Asia/Singapore", lat: 1.3521, lng: 103.8198 },
  { name: "Bangkok", country: "Thailand", code: "TH", flag: "ðŸ‡¹ðŸ‡­", tz: "Asia/Bangkok", lat: 13.7563, lng: 100.5018 },
  { name: "Kuala Lumpur", country: "Malaysia", code: "MY", flag: "ðŸ‡²ðŸ‡¾", tz: "Asia/Kuala_Lumpur", lat: 3.1390, lng: 101.6869 },
  { name: "Jakarta", country: "Indonesia", code: "ID", flag: "ðŸ‡®ðŸ‡©", tz: "Asia/Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Bali", country: "Indonesia", code: "ID", flag: "ðŸ‡®ðŸ‡©", tz: "Asia/Makassar", lat: -8.3405, lng: 115.0920 },
  { name: "Manila", country: "Philippines", code: "PH", flag: "ðŸ‡µðŸ‡­", tz: "Asia/Manila", lat: 14.5995, lng: 120.9842 },
  { name: "Hanoi", country: "Vietnam", code: "VN", flag: "ðŸ‡»ðŸ‡³", tz: "Asia/Ho_Chi_Minh", lat: 21.0285, lng: 105.8542 },
  { name: "New Delhi", country: "India", code: "IN", flag: "ðŸ‡®ðŸ‡³", tz: "Asia/Kolkata", lat: 28.6139, lng: 77.2090 },
  { name: "Mumbai", country: "India", code: "IN", flag: "ðŸ‡®ðŸ‡³", tz: "Asia/Kolkata", lat: 19.0760, lng: 72.8777 },
  { name: "Bengaluru", country: "India", code: "IN", flag: "ðŸ‡®ðŸ‡³", tz: "Asia/Kolkata", lat: 12.9716, lng: 77.5946 },
  { name: "Karachi", country: "Pakistan", code: "PK", flag: "ðŸ‡µðŸ‡°", tz: "Asia/Karachi", lat: 24.8607, lng: 67.0011 },
  { name: "Dhaka", country: "Bangladesh", code: "BD", flag: "ðŸ‡§ðŸ‡©", tz: "Asia/Dhaka", lat: 23.8103, lng: 90.4125 },
  { name: "Dubai", country: "United Arab Emirates", code: "AE", flag: "ðŸ‡¦ðŸ‡ª", tz: "Asia/Dubai", lat: 25.2048, lng: 55.2708 },
  { name: "Abu Dhabi", country: "United Arab Emirates", code: "AE", flag: "ðŸ‡¦ðŸ‡ª", tz: "Asia/Dubai", lat: 24.4539, lng: 54.3773 },
  { name: "Doha", country: "Qatar", code: "QA", flag: "ðŸ‡¶ðŸ‡¦", tz: "Asia/Qatar", lat: 25.2854, lng: 51.5310 },
  { name: "Riyadh", country: "Saudi Arabia", code: "SA", flag: "ðŸ‡¸ðŸ‡¦", tz: "Asia/Riyadh", lat: 24.7136, lng: 46.6753 },
  { name: "Tehran", country: "Iran", code: "IR", flag: "ðŸ‡®ðŸ‡·", tz: "Asia/Tehran", lat: 35.6892, lng: 51.3890 },
  { name: "Tel Aviv", country: "Israel", code: "IL", flag: "ðŸ‡®ðŸ‡±", tz: "Asia/Jerusalem", lat: 32.0853, lng: 34.7818 },
  { name: "Jerusalem", country: "Israel", code: "IL", flag: "ðŸ‡®ðŸ‡±", tz: "Asia/Jerusalem", lat: 31.7683, lng: 35.2137 },
  { name: "Beirut", country: "Lebanon", code: "LB", flag: "ðŸ‡±ðŸ‡§", tz: "Asia/Beirut", lat: 33.8938, lng: 35.5018 },

  // Oceania & Pacific
  { name: "Sydney", country: "Australia", code: "AU", flag: "ðŸ‡¦ðŸ‡º", tz: "Australia/Sydney", lat: -33.8688, lng: 151.2093 },
  { name: "Melbourne", country: "Australia", code: "AU", flag: "ðŸ‡¦ðŸ‡º", tz: "Australia/Melbourne", lat: -37.8136, lng: 144.9631 },
  { name: "Brisbane", country: "Australia", code: "AU", flag: "ðŸ‡¦ðŸ‡º", tz: "Australia/Brisbane", lat: -27.4698, lng: 153.0251 },
  { name: "Perth", country: "Australia", code: "AU", flag: "ðŸ‡¦ðŸ‡º", tz: "Australia/Perth", lat: -31.9505, lng: 115.8605 },
  { name: "Auckland", country: "New Zealand", code: "NZ", flag: "ðŸ‡³ðŸ‡¿", tz: "Pacific/Auckland", lat: -36.8485, lng: 174.7633 },
  { name: "Fiji (Suva)", country: "Fiji", code: "FJ", flag: "ðŸ‡«ðŸ‡¯", tz: "Pacific/Fiji", lat: -18.1248, lng: 178.4501 },
  { name: "Tahiti (Papeete)", country: "French Polynesia", code: "PF", flag: "ðŸ‡µðŸ‡«", tz: "Pacific/Tahiti", lat: -17.5516, lng: -149.5584 }
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
        let flag = "ðŸ“";
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
  // 2. Sound Engine
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
  // 3. 2D Swiss Watch Dial Engine (PHILL)
  // =========================================================================
/**
 * Luxury 2D Mechanical Wrist Watch Engine â€” PHILL
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

    // 8. Brand Emblem (Crown, "PHILL", "GENÃˆVE")
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

    // C. Subtitle: "GENÃˆVE"
    ctx.font = `500 ${r * 0.022}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = "#333945";
    ctx.letterSpacing = "3px";
    ctx.fillText("GENÃˆVE", 0, -dialR * 0.22);

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
  // 4. 3D Buckled Wristwatch WebGL Engine (PHILL)
  // =========================================================================
/**
 * 3D Wristwatch WebGL Engine â€” PHILL
 * Renders an ultra-luxurious, fully buckled 3D mechanical timepiece in real-time.
 * 
 * Features:
 * - Fully Buckled 3D Leather Strap: Continuous closed anatomical loop with thickness,
 *   edge stitching, adjustment pinholes, and strap tail
 * - 3D Clasp & Buckle Assembly: 3D polished buckle frame, crossbar, articulated prong pin,
 *   fixed keeper, and floating keeper loop
 * - Rolex 1908 Case Architecture: Outer coin-edge fluted bezel (72 facets), inner mirror-polished ring,
 *   sculpted case lugs, knurled crown at 3 o'clock, and brushed exhibition caseback
 * - Live Dial Projection: Active 2D Swiss dial texture projected onto the 3D dial face
 *   (hands spin, settle, and tick dead-beat in real-time 3D!)
 * - Dome Sapphire Crystal: Dynamic specular sheen and Fresnel lighting
 * - Interactive 3D Orbit Controls: Drag to inspect full 360Â° (front, sides, back buckle), scroll to zoom
 * - Cinematic Spin & Settling Animation on location search
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

    // 3D Orientation & Camera (Initial elegant beauty angle showing face + 3D volume + buckle)
    this.rotation = { x: -0.16, y: 0.32, z: 0 };
    this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
    this.cameraDistance = 4.1;
    this.targetDistance = 4.1;
    this.minDistance = 2.4;
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
    this.startDist = 4.1;
    this.endDist = 4.1;
    this.onSpinComplete = null;

    // Precious metal finish: 'gold' (default) | 'rose-gold' | 'white-gold' | 'platinum'
    this.finish = "gold";

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

      uniform int uMaterial; // 0=Dial, 1=Case/Lugs, 2=Bezel, 3=Strap, 4=Crystal, 5=Crown, 6=Buckle/Clasp, 7=CaseBack
      uniform sampler2D uDialTexture;
      uniform vec3 uBaseColor;
      uniform vec3 uSpecColor;
      uniform vec3 uCameraPos;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(uCameraPos - vWorldPos);

        // Key Light (Top-right front)
        vec3 lightDir1 = normalize(vec3(0.55, 0.75, 0.95));
        // Fill Light (Bottom-left front)
        vec3 lightDir2 = normalize(vec3(-0.60, -0.40, 0.50));
        // Back/Rim Light (Illuminates buckle & caseback from behind)
        vec3 lightDir3 = normalize(vec3(0.0, 0.2, -1.0));

        float diff1 = max(dot(normal, lightDir1), 0.0);
        float diff2 = max(dot(normal, lightDir2), 0.0) * 0.45;
        float diff3 = max(dot(normal, lightDir3), 0.0) * 0.55;
        float diffuse = diff1 + diff2 + diff3;

        // Specular
        vec3 halfDir1 = normalize(lightDir1 + viewDir);
        vec3 halfDir3 = normalize(lightDir3 + viewDir);
        float spec1 = pow(max(dot(normal, halfDir1), 0.0), 36.0);
        float spec3 = pow(max(dot(normal, halfDir3), 0.0), 32.0);

        // 0. Live Dial Face Texture
        if (uMaterial == 0) {
          vec4 dialColor = texture2D(uDialTexture, vTexCoord);
          vec3 litDial = dialColor.rgb * (0.82 + diffuse * 0.28) + vec3(1.0) * spec1 * 0.12;
          gl_FragColor = vec4(litDial, dialColor.a);
          return;
        }

        // 1. Metal Case Body & Lugs (Polished luxury metal)
        if (uMaterial == 1) {
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.2);
          float specTotal = spec1 * 1.1 + spec3 * 0.8;
          vec3 metalCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * (specTotal + fresnel * 0.35);
          gl_FragColor = vec4(metalCol, 1.0);
          return;
        }

        // 2. Bezel (Fluted coin-edge with bright specular glints)
        if (uMaterial == 2) {
          float flutedSpec = pow(max(dot(normal, halfDir1), 0.0), 48.0) * 1.5;
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.0);
          vec3 bezelCol = uBaseColor * (0.38 + diffuse * 0.62) + uSpecColor * (flutedSpec + fresnel * 0.4);
          gl_FragColor = vec4(bezelCol, 1.0);
          return;
        }

        // 3. Leather Straps & Keepers (Alligator grain, edge stitching, warm texture)
        if (uMaterial == 3) {
          vec3 strapCol = uBaseColor * (0.38 + diffuse * 0.62);
          // Tone-on-tone edge stitch line highlighting
          float edgeDist = abs(vTexCoord.x - 0.5);
          if (abs(edgeDist - 0.40) < 0.02) {
            strapCol += uBaseColor * 0.45;
          }
          // Subtle leather sheen
          float leatherSheen = pow(max(dot(normal, halfDir1), 0.0), 12.0) * 0.15;
          gl_FragColor = vec4(strapCol + uSpecColor * leatherSheen, 1.0);
          return;
        }

        // 4. Sapphire Crystal Dome Lens
        if (uMaterial == 4) {
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 3.0);
          float flare = pow(max(dot(normal, halfDir1), 0.0), 64.0);
          vec3 glassCol = vec3(0.85, 0.95, 1.0) * (flare * 1.4 + fresnel * 0.55);
          float alpha = 0.08 + fresnel * 0.28 + flare * 0.45;
          gl_FragColor = vec4(glassCol, alpha);
          return;
        }

        // 5. Crown (Knurled grip facets)
        if (uMaterial == 5) {
          float crownSpec = pow(max(dot(normal, halfDir1), 0.0), 28.0) * 1.2;
          vec3 crownCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * crownSpec;
          gl_FragColor = vec4(crownCol, 1.0);
          return;
        }

        // 6. Buckle & Clasp Assembly (Mirror-polished gold/steel)
        if (uMaterial == 6) {
          float buckleSpec = (spec1 * 1.2 + spec3 * 1.4);
          float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
          vec3 buckleCol = uBaseColor * (0.40 + diffuse * 0.60) + uSpecColor * (buckleSpec + fresnel * 0.45);
          gl_FragColor = vec4(buckleCol, 1.0);
          return;
        }

        // 7. Case Back (Brushed metal with circular radial sheen)
        if (uMaterial == 7) {
          float radialSheen = pow(max(dot(normal, halfDir3), 0.0), 24.0) * 0.8;
          vec3 backCol = uBaseColor * (0.35 + diffuse * 0.65) + uSpecColor * radialSheen;
          gl_FragColor = vec4(backCol, 1.0);
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
      bezel: this.createFlutedBezelGeometry(1.0, 1.15, 0.08, 72),
      caseBody: this.createCylinderGeometry(1.15, 0.22, 48),
      caseBack: this.createCaseBackGeometry(1.10, 0.04, 48),
      lugs: this.createLugsGeometry(),
      crown: this.createCrownGeometry(0.12, 0.15, 24),
      // Buckled Straps
      strapTop: this.createTopBuckledStrap(),
      strapBottom: this.createBottomBuckledStrap(),
      strapTail: this.createStrapTail(),
      // 3D Buckle & Clasp Assembly
      buckleFrame: this.createBuckleFrameGeometry(),
      buckleBar: this.createCylinderAlongX(0.024, 0.74, 16),
      buckleProng: this.createBuckleProngGeometry(),
      keepers: this.createKeepersGeometry()
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

  // =========================================================================
  // 3D Procedural Horological Geometry Generators
  // =========================================================================

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

  createCaseBackGeometry(radius, depth, segments) {
    const vertices = [0, 0, -depth];
    const normals = [0, 0, -1];
    const texCoords = [0.5, 0.5];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = Math.cos(theta) * radius;
      const y = Math.sin(theta) * radius;
      vertices.push(x, y, 0);
      normals.push(0, 0, -1);
      texCoords.push(0.5 + Math.cos(theta) * 0.5, 0.5 + Math.sin(theta) * 0.5);

      if (i > 0) {
        indices.push(0, i + 1, i);
      }
    }
    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  createFlutedBezelGeometry(innerR, outerR, depth, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const cos = Math.cos(theta);
      const sin = Math.sin(theta);
      const u = i / segments;

      // Outer coin-edge flute facet angle
      const fluteRipple = Math.sin(theta * 36) * 0.03;
      const rOuter = outerR + fluteRipple;

      // Inner top
      vertices.push(cos * innerR, sin * innerR, depth);
      normals.push(cos * 0.4, sin * 0.4, 0.9);
      texCoords.push(u, 0);

      // Outer fluted top
      vertices.push(cos * rOuter, sin * rOuter, 0);
      normals.push(cos * 0.8 + Math.cos(theta * 36) * 0.2, sin * 0.8 + Math.sin(theta * 36) * 0.2, 0.4);
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

    // Cylinder along X-axis at 3 o'clock with knurled notches
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const notch = Math.sin(theta * 12) * 0.015;
      const r = radius + notch;

      const y = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
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

  createCylinderAlongX(radius, length, segments) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const halfL = length / 2;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const y = Math.cos(theta) * radius;
      const z = Math.sin(theta) * radius;
      const u = i / segments;

      vertices.push(-halfL, y, z);
      normals.push(0, Math.cos(theta), Math.sin(theta));
      texCoords.push(u, 0);

      vertices.push(halfL, y, z);
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

  // =========================================================================
  // Fully Buckled Strap Architecture (Closed Anatomical Wrist Loop)
  // =========================================================================

  /**
   * Helper: Builds a 3D volumetric strap ribbon along a 2D spline in Y-Z plane.
   * Generates outer leather surface, inner lining, and beveled side edges.
   */
  buildVolumetricStrap(pathPoints, startWidth, endWidth, thickness = 0.055) {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    const numPoints = pathPoints.length;
    const halfThick = thickness / 2;

    for (let i = 0; i < numPoints; i++) {
      const t = i / (numPoints - 1);
      const curr = pathPoints[i];

      // Tangent vector
      let ty, tz;
      if (i === 0) {
        ty = pathPoints[1].y - curr.y;
        tz = pathPoints[1].z - curr.z;
      } else if (i === numPoints - 1) {
        ty = curr.y - pathPoints[i - 1].y;
        tz = curr.z - pathPoints[i - 1].z;
      } else {
        ty = pathPoints[i + 1].y - pathPoints[i - 1].y;
        tz = pathPoints[i + 1].z - pathPoints[i - 1].z;
      }
      const tLen = Math.hypot(ty, tz) || 1;
      ty /= tLen;
      tz /= tLen;

      // Normal pointing outward from wrist loop (T x (1,0,0) = (0, -tz, ty))
      const ny = -tz;
      const nz = ty;

      const w = startWidth + (endWidth - startWidth) * t;
      const halfW = w / 2;

      // 4 Vertices per cross-section:
      // 0: Outer-Left, 1: Outer-Right, 2: Inner-Right, 3: Inner-Left
      const outY = curr.y + ny * halfThick;
      const outZ = curr.z + nz * halfThick;
      const inY = curr.y - ny * halfThick;
      const inZ = curr.z - nz * halfThick;

      // 0. Outer Left
      vertices.push(-halfW, outY, outZ);
      normals.push(0, ny, nz);
      texCoords.push(0, t);

      // 1. Outer Right
      vertices.push(halfW, outY, outZ);
      normals.push(0, ny, nz);
      texCoords.push(1, t);

      // 2. Inner Right
      vertices.push(halfW, inY, inZ);
      normals.push(0, -ny, -nz);
      texCoords.push(1, t);

      // 3. Inner Left
      vertices.push(-halfW, inY, inZ);
      normals.push(0, -ny, -nz);
      texCoords.push(0, t);
    }

    for (let i = 0; i < numPoints - 1; i++) {
      const b1 = i * 4;
      const b2 = (i + 1) * 4;

      // Top/Outer Face (0, 1)
      indices.push(b1 + 0, b1 + 1, b2 + 1);
      indices.push(b1 + 0, b2 + 1, b2 + 0);

      // Bottom/Inner Face (2, 3)
      indices.push(b1 + 2, b1 + 3, b2 + 3);
      indices.push(b1 + 2, b2 + 3, b2 + 2);

      // Right Edge (1, 2)
      indices.push(b1 + 1, b1 + 2, b2 + 2);
      indices.push(b1 + 1, b2 + 2, b2 + 1);

      // Left Edge (3, 0)
      indices.push(b1 + 3, b1 + 0, b2 + 0);
      indices.push(b1 + 3, b2 + 0, b2 + 3);
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 1. Top Strap: Curves from Top Lugs (Y=+1.18, Z=-0.05) to Buckle Crossbar (Y=+0.12, Z=-1.36)
  createTopBuckledStrap() {
    const points = [];
    const segments = 24;

    // Cubic BÃ©zier control points
    const p0 = { y: 1.18, z: -0.05 };
    const p1 = { y: 1.82, z: -0.16 };
    const p2 = { y: 1.88, z: -1.34 };
    const p3 = { y: 0.12, z: -1.36 };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const it = 1 - t;

      const y = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
      const z = it * it * it * p0.z + 3 * it * it * t * p1.z + 3 * it * t * t * p2.z + t * t * t * p3.z;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.88, 0.78, 0.055);
  }

  // 2. Bottom Strap: Curves from Bottom Lugs (Y=-1.18, Z=-0.05) to Buckle Entrance (Y=-0.08, Z=-1.32)
  createBottomBuckledStrap() {
    const points = [];
    const segments = 24;

    // Cubic BÃ©zier control points
    const p0 = { y: -1.18, z: -0.05 };
    const p1 = { y: -1.82, z: -0.16 };
    const p2 = { y: -1.88, z: -1.32 };
    const p3 = { y: -0.08, z: -1.32 };

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const it = 1 - t;

      const y = it * it * it * p0.y + 3 * it * it * t * p1.y + 3 * it * t * t * p2.y + t * t * t * p3.y;
      const z = it * it * it * p0.z + 3 * it * it * t * p1.z + 3 * it * t * t * p2.z + t * t * t * p3.z;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.88, 0.76, 0.055);
  }

  // 3. Strap Tail: Passes through buckle and slips through keepers (Y=-0.08 to Y=+0.52)
  createStrapTail() {
    const points = [];
    const segments = 12;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const y = -0.08 + t * 0.60;
      const z = -1.32 - Math.pow(t, 2) * 0.04;
      points.push({ y, z });
    }

    return this.buildVolumetricStrap(points, 0.76, 0.70, 0.048);
  }

  // 4. 3D Buckle Frame (Beveled rectangular ring around the clasp)
  createBuckleFrameGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Outer & inner dimensions
    const xOuter = 0.44, xInner = 0.37;
    const yMin = 0.00, yMax = 0.26;
    const yInMin = 0.05, yInMax = 0.22;
    const zMin = -1.41, zMax = -1.33;

    // Build 4 rectangular bars forming the buckle ring
    const addBox = (minX, maxX, minY, maxY, minZ, maxZ) => {
      const bIdx = vertices.length / 3;
      // Front face (+Z)
      vertices.push(
        minX, minY, maxZ, maxX, minY, maxZ, maxX, maxY, maxZ, minX, maxY, maxZ,
        // Back face (-Z)
        minX, minY, minZ, minX, maxY, minZ, maxX, maxY, minZ, maxX, minY, minZ,
        // Top face (+Y)
        minX, maxY, minZ, minX, maxY, maxZ, maxX, maxY, maxZ, maxX, maxY, minZ,
        // Bottom face (-Y)
        minX, minY, minZ, maxX, minY, minZ, maxX, minY, maxZ, minX, minY, maxZ,
        // Right face (+X)
        maxX, minY, minZ, maxX, maxY, minZ, maxX, maxY, maxZ, maxX, minY, maxZ,
        // Left face (-X)
        minX, minY, minZ, minX, minY, maxZ, minX, maxY, maxZ, minX, maxY, minZ
      );

      normals.push(
        0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
        0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
        0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
        0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
        1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
        -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
      );

      for (let f = 0; f < 6; f++) {
        texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
        const fIdx = bIdx + f * 4;
        indices.push(fIdx, fIdx + 1, fIdx + 2, fIdx, fIdx + 2, fIdx + 3);
      }
    };

    // Left Bar
    addBox(-xOuter, -xInner, yMin, yMax, zMin, zMax);
    // Right Bar
    addBox(xInner, xOuter, yMin, yMax, zMin, zMax);
    // Top Bar (with subtle center prong notch)
    addBox(-xInner, xInner, yInMax, yMax, zMin, zMax);
    // Bottom Bar
    addBox(-xInner, xInner, yMin, yInMin, zMin, zMax);

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 5. 3D Buckle Prong / Tongue Pin
  createBuckleProngGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Slender needle pin anchored at crossbar (y=0.02, z=-1.36) resting on top notch (y=0.26, z=-1.33)
    const pinR = 0.016;
    const segments = 10;
    const steps = 6;

    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const y = 0.02 + t * 0.24;
      // Arch slightly over the strap
      const z = -1.36 + Math.sin(t * Math.PI) * 0.06;

      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        const px = Math.cos(theta) * pinR;
        const pz = z + Math.sin(theta) * pinR;

        vertices.push(px, y, pz);
        normals.push(Math.cos(theta), 0.2, Math.sin(theta));
        texCoords.push(i / segments, t);
      }
    }

    for (let s = 0; s < steps; s++) {
      for (let i = 0; i < segments; i++) {
        const curr = s * (segments + 1) + i;
        const next = curr + (segments + 1);

        indices.push(curr, curr + 1, next + 1);
        indices.push(curr, next + 1, next);
      }
    }

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // 6. Leather Keepers (Loops holding the strap tail)
  createKeepersGeometry() {
    const vertices = [];
    const normals = [];
    const texCoords = [];
    const indices = [];

    // Two loops: Loop 1 at Y = -0.02, Loop 2 at Y = +0.32
    const keeperYPositions = [-0.02, 0.32];
    const loopW = 0.82, loopH = 0.12, thick = 0.025;
    const lenY = 0.06;

    let baseIdx = 0;
    keeperYPositions.forEach(kY => {
      const minX = -loopW / 2, maxX = loopW / 2;
      const minZ = -1.40, maxZ = -1.27;

      // Outer Box minus inner hollow
      // For clean rendering, build a solid loop collar
      const addLoopBox = (x1, x2, y1, y2, z1, z2) => {
        const b = baseIdx;
        vertices.push(
          x1, y1, z2, x2, y1, z2, x2, y2, z2, x1, y2, z2,
          x1, y1, z1, x1, y2, z1, x2, y2, z1, x2, y1, z1,
          x1, y2, z1, x1, y2, z2, x2, y2, z2, x2, y2, z1,
          x1, y1, z1, x2, y1, z1, x2, y1, z2, x1, y1, z2,
          x2, y1, z1, x2, y2, z1, x2, y2, z2, x2, y1, z2,
          x1, y1, z1, x1, y1, z2, x1, y2, z2, x1, y2, z1
        );
        normals.push(
          0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
          0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1,
          0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
          0, -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0,
          1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
          -1, 0, 0, -1, 0, 0, -1, 0, 0, -1, 0, 0
        );
        for (let f = 0; f < 6; f++) {
          texCoords.push(0, 0, 1, 0, 1, 1, 0, 1);
          const fIdx = b + f * 4;
          indices.push(fIdx, fIdx + 1, fIdx + 2, fIdx, fIdx + 2, fIdx + 3);
        }
        baseIdx += 24;
      };

      // Top outer band
      addLoopBox(minX, maxX, kY - lenY / 2, kY + lenY / 2, maxZ - thick, maxZ);
      // Bottom inner band
      addLoopBox(minX, maxX, kY - lenY / 2, kY + lenY / 2, minZ, minZ + thick);
      // Left side
      addLoopBox(minX, minX + thick, kY - lenY / 2, kY + lenY / 2, minZ, maxZ);
      // Right side
      addLoopBox(maxX - thick, maxX, kY - lenY / 2, kY + lenY / 2, minZ, maxZ);
    });

    return { vertices, normals, texCoords, indices, count: indices.length };
  }

  // =========================================================================
  // Interaction & Camera Controls
  // =========================================================================

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

      // Unconstrained yaw allows inspecting the buckled back completely in 360 degrees!
      this.targetRotation.y += dx * 0.009;
      this.targetRotation.x += dy * 0.009;

      // Constrain tilt to prevent disorientation
      this.targetRotation.x = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.targetRotation.x));
      this.lastMouse = { x, y };
    };

    const onPointerUp = () => {
      if (!this.isDragging) return;
      this.isDragging = false;

      // Return smoothly to beauty angle after 5 seconds of inactivity
      this.idleTimer = setTimeout(() => {
        if (!this.isSpinning) {
          this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
          this.autoIdle = true;
        }
      }, 5000);
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

    if (this.canvas.width !== Math.round(width * dpr) || this.canvas.height !== Math.round(height * dpr)) {
      this.canvas.width = Math.round(width * dpr);
      this.canvas.height = Math.round(height * dpr);
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  /**
   * 3D Wristwatch full-screen tumble & spin animation when a location is searched!
   */
  spinToLocation(timeInfo, onComplete) {
    this.isSpinning = true;
    this.autoIdle = false;
    this.spinStartTime = performance.now();
    this.spinDuration = 2200; // ms
    this.onSpinComplete = onComplete;

    this.startRot = { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z };
    // 3 full 360-degree spins along Y (yaw) plus dynamic roll along X/Z
    this.endRot = {
      x: -0.16,
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
      this.rotation.x = this.startRot.x + (this.endRot.x - this.startRot.x) * ease + Math.sin(progress * Math.PI) * 0.35;
      this.rotation.z = Math.sin(progress * Math.PI * 2) * 0.12;

      this.cameraDistance = this.startDist + (this.endDist - this.startDist) * ease;

      if (progress >= 1.0) {
        this.isSpinning = false;
        this.rotation.x = -0.16;
        this.rotation.y = 0.32;
        this.rotation.z = 0;
        this.targetRotation = { x: -0.16, y: 0.32, z: 0 };
        this.cameraDistance = 4.1;
        this.targetDistance = 4.1;

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
      // Gentle idle wrist sway when untouched
      if (this.autoIdle && !this.isDragging) {
        const time = now * 0.0012;
        this.targetRotation.y = 0.32 + Math.sin(time) * 0.15;
        this.targetRotation.x = -0.16 + Math.cos(time * 0.8) * 0.06;
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

    gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
    gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
    gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

    // Color definitions based on chosen finish
    const metalColors = {
      gold: { base: [0.94, 0.76, 0.38], spec: [1.0, 0.96, 0.75] },
      "rose-gold": { base: [0.90, 0.62, 0.48], spec: [1.0, 0.88, 0.78] },
      "white-gold": { base: [0.86, 0.88, 0.92], spec: [1.0, 1.0, 1.0] },
      platinum: { base: [0.90, 0.92, 0.96], spec: [1.0, 1.0, 1.0] }
    };
    const strapColors = {
      gold: [0.20, 0.11, 0.07],       // Rich chestnut alligator leather
      "rose-gold": [0.24, 0.13, 0.08], // Warm cognac alligator leather
      "white-gold": [0.07, 0.07, 0.08],// Midnight black alligator leather
      platinum: [0.09, 0.10, 0.13]     // Slate-navy alligator leather
    };

    const finishColor = metalColors[this.finish] || metalColors.gold;
    const strapCol = strapColors[this.finish] || strapColors.gold;

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

    // 1. Draw Buckled Leather Straps (Top arch, Bottom arch, and Buckled Tail)
    drawPart(this.parts.strapTop, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.strapBottom, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.strapTail, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);
    drawPart(this.parts.keepers, modelMatrix, 3, strapCol, [0.35, 0.28, 0.22]);

    // 2. Draw Buckle Clasp Assembly at the back (Frame, Crossbar, and Tongue Pin)
    drawPart(this.parts.buckleFrame, modelMatrix, 6);
    const barMatrix = new Float32Array(modelMatrix);
    this.translate(barMatrix, 0, 0.02, -1.36);
    drawPart(this.parts.buckleBar, barMatrix, 6);
    drawPart(this.parts.buckleProng, modelMatrix, 6);

    // 3. Draw Lugs (4 sculpted horns)
    drawPart(this.parts.lugs, modelMatrix, 1);

    // 4. Draw Main Case Body
    drawPart(this.parts.caseBody, modelMatrix, 1);

    // 5. Draw Brushed Case Back
    const backMatrix = new Float32Array(modelMatrix);
    this.translate(backMatrix, 0, 0, -0.11);
    drawPart(this.parts.caseBack, backMatrix, 7);

    // 6. Draw Winding Crown at 3 o'clock
    const crownMatrix = new Float32Array(modelMatrix);
    this.translate(crownMatrix, 1.15, 0, 0);
    drawPart(this.parts.crown, crownMatrix, 5);

    // 7. Draw Fluted Coin-Edge Bezel
    const bezelMatrix = new Float32Array(modelMatrix);
    this.translate(bezelMatrix, 0, 0, 0.11);
    drawPart(this.parts.bezel, bezelMatrix, 2);

    // 8. Draw Live Watch Dial Face
    const dialMatrix = new Float32Array(modelMatrix);
    this.translate(dialMatrix, 0, 0, 0.12);
    drawPart(this.parts.dial, dialMatrix, 0);

    // 9. Draw Dome Sapphire Crystal with specular sheen
    const crystalMatrix = new Float32Array(modelMatrix);
    this.translate(crystalMatrix, 0, 0, 0.14);
    drawPart(this.parts.crystal, crystalMatrix, 4);
  }

  // =========================================================================
  // 4x4 Matrix Utilities
  // =========================================================================

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
    const lenY = 1 / Math.hypot(yx, yy, yz);

    return new Float32Array([
      xx, yx * lenY, zx, 0,
      xy, yy * lenY, zy, 0,
      xz, yz * lenY, zz, 0,
      -(xx * eye[0] + xy * eye[1] + xz * eye[2]),
      -(yx * lenY * eye[0] + yy * lenY * eye[1] + yz * lenY * eye[2]),
      -(zx * eye[0] + zy * eye[1] + zz * eye[2]),
      1
    ]);
  }

  rotateX(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m1 = m[4], m2 = m[5], m3 = m[6], m4 = m[7];
    const m5 = m[8], m6 = m[9], m7 = m[10], m8 = m[11];
    m[4] = m1 * c + m5 * s;
    m[5] = m2 * c + m6 * s;
    m[6] = m3 * c + m7 * s;
    m[7] = m4 * c + m8 * s;
    m[8] = m5 * c - m1 * s;
    m[9] = m6 * c - m2 * s;
    m[10] = m7 * c - m3 * s;
    m[11] = m8 * c - m4 * s;
  }

  rotateY(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
    const m8 = m[8], m9 = m[9], m10 = m[10], m11 = m[11];
    m[0] = m0 * c - m8 * s;
    m[1] = m1 * c - m9 * s;
    m[2] = m2 * c - m10 * s;
    m[3] = m3 * c - m11 * s;
    m[8] = m0 * s + m8 * c;
    m[9] = m1 * s + m9 * c;
    m[10] = m2 * s + m10 * c;
    m[11] = m3 * s + m11 * c;
  }

  rotateZ(m, rad) {
    const s = Math.sin(rad), c = Math.cos(rad);
    const m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3];
    const m4 = m[4], m5 = m[5], m6 = m[6], m7 = m[7];
    m[0] = m0 * c + m4 * s;
    m[1] = m1 * c + m5 * s;
    m[2] = m2 * c + m6 * s;
    m[3] = m3 * c + m7 * s;
    m[4] = m4 * c - m0 * s;
    m[5] = m5 * c - m1 * s;
    m[6] = m6 * c - m2 * s;
    m[7] = m7 * c - m3 * s;
  }

  translate(m, x, y, z) {
    m[12] = m[0] * x + m[4] * y + m[8] * z + m[12];
    m[13] = m[1] * x + m[5] * y + m[9] * z + m[13];
    m[14] = m[2] * x + m[6] * y + m[10] * z + m[14];
    m[15] = m[3] * x + m[7] * y + m[11] * z + m[15];
  }

  createNormalMatrix(m) {
    // 3x3 normal matrix from top-left 3x3 of 4x4 matrix
    const a00 = m[0], a01 = m[1], a02 = m[2];
    const a10 = m[4], a11 = m[5], a12 = m[6];
    const a20 = m[8], a21 = m[9], a22 = m[10];

    const b01 = a22 * a11 - a12 * a21;
    const b11 = -a22 * a10 + a12 * a20;
    const b21 = a21 * a10 - a11 * a20;

    const det = a00 * b01 + a01 * b11 + a02 * b21;
    if (!det) return new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1]);

    const invDet = 1.0 / det;
    return new Float32Array([
      b01 * invDet,
      (-a22 * a01 + a02 * a21) * invDet,
      (a12 * a01 - a02 * a11) * invDet,
      b11 * invDet,
      (a22 * a00 - a02 * a20) * invDet,
      (-a12 * a00 + a02 * a10) * invDet,
      b21 * invDet,
      (-a21 * a00 + a01 * a20) * invDet,
      (a11 * a00 - a01 * a10) * invDet
    ]);
  }
}

  // =========================================================================
  // 5. Horizon & Vector Character Scenery Engine
  // =========================================================================
/**
 * 2D Vector Animated Horizon & Living Human Activity Scenery â€” PHILL
 * Depicts a vibrant, authentic sky & living horizon that unmistakably reflects the
 * exact time of day (Dawn, Broad Daylight, Golden Hour Sunset, Twilight Dusk, Midnight).
 * Populates the promenade with animated 2D vector humans engaging in rich, authentic activities
 * with anatomically correct forward walk cycles (no moonwalking or backward limbs):
 *
 * - Joggers & Runners with high knee lift & rhythmic arm pump
 * - Dog Walkers with trotting 4-legged puppies & wagging tails
 * - Cyclists with spinning wheels & pedal-articulating knees
 * - Skateboarders pushing with rear foot & cruising
 * - Parents pushing modern baby strollers
 * - Commuters with steaming takeaway coffee cups
 * - Smartphone text walkers with glowing screens
 * - Tourists/Photographers pausing to take photos with camera flashes
 * - Park bench figures: book readers, acoustic guitarists, laptop workers, coffee drinkers
 * - Stargazers observing the moon through standing brass telescopes
 * - Flying birds, drifting clouds, glowing sun with lens rays, crescent moon, and shooting stars
 */
class HorizonScenery {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    // Time frame state: 'dawn' | 'day' | 'sunset' | 'dusk' | 'night'
    this.timeOfDay = "day";
    this.targetTimeOfDay = "day";
    this.decimalHour = 12.0;

    // Viewport dimensions
    this.w = 0;
    this.h = 0;
    this.groundY = 0;

    // Entities
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

    // Ground line placed across lower area (frames beautifully beneath hero watch)
    this.groundY = Math.round(this.h * 0.83);

    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  bindEvents() {
    window.addEventListener("resize", () => {
      this.resize();
      this.initWorld();
    });
  }

  setTime(timeOfDay, decimalHour = 12.0) {
    this.decimalHour = decimalHour;
    if (this.timeOfDay !== timeOfDay) {
      this.timeOfDay = timeOfDay;
      this.targetTimeOfDay = timeOfDay;
      this.spawnCharacters();
    }
  }

  initWorld() {
    const w = this.w;
    const groundY = this.groundY;

    // Twinkling stars for dusk and night sky
    this.stars = [];
    for (let i = 0; i < 75; i++) {
      this.stars.push({
        x: Math.random() * w,
        y: Math.random() * (groundY * 0.72),
        radius: 0.5 + Math.random() * 1.5,
        twinkleSpeed: 1.2 + Math.random() * 2.8,
        twinkleOffset: Math.random() * Math.PI * 2
      });
    }

    // 1. Streetlamps along the promenade
    this.streetlamps = [
      { x: w * 0.10, y: groundY, height: 115 },
      { x: w * 0.35, y: groundY, height: 115 },
      { x: w * 0.65, y: groundY, height: 115 },
      { x: w * 0.90, y: groundY, height: 115 }
    ];

    // 2. Park Benches
    this.benches = [
      { x: w * 0.22, y: groundY, width: 48, height: 22 },
      { x: w * 0.52, y: groundY, width: 48, height: 22 },
      { x: w * 0.78, y: groundY, width: 48, height: 22 }
    ];

    // 3. Park Trees (Silhouettes & Foliage)
    this.trees = [
      { x: w * 0.04, y: groundY, radius: 52, trunkH: 60, type: "deciduous" },
      { x: w * 0.18, y: groundY, radius: 42, trunkH: 50, type: "pine" },
      { x: w * 0.44, y: groundY, radius: 46, trunkH: 55, type: "elm" },
      { x: w * 0.72, y: groundY, radius: 48, trunkH: 52, type: "deciduous" },
      { x: w * 0.96, y: groundY, radius: 58, trunkH: 64, type: "elm" }
    ];

    // 4. Distant City Skyline Towers
    this.skylineBuildings = [];
    const count = Math.ceil(w / 42);
    for (let i = 0; i < count; i++) {
      const bW = 28 + (i % 4) * 12;
      const bH = 55 + ((i * 37) % 95);
      const isTower = (i % 6 === 2);
      this.skylineBuildings.push({
        x: i * 40,
        y: groundY,
        width: bW,
        height: isTower ? bH + 48 : bH,
        hasSpire: isTower,
        windows: (i % 2 === 0)
      });
    }

    // 5. Drifting Clouds
    this.clouds = [
      { x: w * 0.12, y: this.h * 0.20, scale: 1.0, speed: 7 },
      { x: w * 0.48, y: this.h * 0.14, scale: 1.3, speed: 5 },
      { x: w * 0.82, y: this.h * 0.24, scale: 0.85, speed: 8 }
    ];

    // 6. Flying Birds
    this.birds = [
      { x: w * 0.18, y: this.h * 0.28, speed: 42, wingPhase: 0, scale: 0.9 },
      { x: w * 0.22, y: this.h * 0.26, speed: 42, wingPhase: 0.4, scale: 0.85 },
      { x: w * 0.26, y: this.h * 0.30, speed: 42, wingPhase: 0.8, scale: 0.8 },
      { x: w * 0.62, y: this.h * 0.22, speed: 48, wingPhase: 1.2, scale: 1.0 },
      { x: w * 0.66, y: this.h * 0.25, speed: 48, wingPhase: 1.6, scale: 0.9 }
    ];

    this.spawnCharacters();
  }

  spawnCharacters() {
    const w = this.w;
    const groundY = this.groundY;
    const time = this.timeOfDay;

    this.characters = [];

    if (time === "dawn") {
      // ðŸŒ… DAWN: Morning Jogger, Dog Walker, Commuter with Coffee, Sunrise Cyclist, Stretcher, Early Walker
      this.characters.push(
        { type: "jogger", x: w * 0.12, y: groundY, vx: 75, scale: 0.92, facing: 1 },
        { type: "dog_walker", x: w * 0.38, y: groundY, vx: 34, scale: 0.90, facing: 1 },
        { type: "cyclist", x: w * 0.85, y: groundY, vx: -82, scale: 0.88, facing: -1 },
        { type: "walker_coffee", x: w * 0.28, y: groundY, vx: 32, scale: 0.90, facing: 1 },
        { type: "bench_coffee", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.68, y: groundY, vx: -72, scale: 0.88, facing: -1 },
        { type: "stretcher", x: w * 0.60, y: groundY, scale: 0.90, facing: 1 }
      );
    } else if (time === "day") {
      // â˜€ï¸ BROAD DAYLIGHT: Bustling park promenade with readers, skaters, strollers, cyclists, tourists
      this.characters.push(
        { type: "bench_reader", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "bench_laptop", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "skateboarder", x: w * 0.18, y: groundY, vx: 74, scale: 0.90, facing: 1 },
        { type: "stroller_parent", x: w * 0.32, y: groundY, vx: 34, scale: 0.90, facing: 1 },
        { type: "couple", x: w * 0.46, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "cyclist", x: w * 0.88, y: groundY, vx: -80, scale: 0.88, facing: -1 },
        { type: "dog_walker", x: w * 0.64, y: groundY, vx: -34, scale: 0.88, facing: -1 },
        { type: "photographer", x: w * 0.74, y: groundY, vx: 24, scale: 0.90, facing: 1 },
        { type: "walker_phone", x: w * 0.05, y: groundY, vx: 30, scale: 0.90, facing: 1 }
      );
    } else if (time === "sunset") {
      // ðŸŒ‡ SUNSET / GOLDEN HOUR: Romantic couple, Sunset watcher, Evening jogger, Dog walker, Cyclist, Railing photographer
      this.characters.push(
        { type: "couple", x: w * 0.28, y: groundY, vx: 26, scale: 0.92, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "bench_guitarist", x: this.benches[0].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.74, y: groundY, vx: 72, scale: 0.90, facing: 1 },
        { type: "dog_walker", x: w * 0.12, y: groundY, vx: 32, scale: 0.88, facing: 1 },
        { type: "cyclist", x: w * 0.90, y: groundY, vx: -78, scale: 0.88, facing: -1 },
        { type: "photographer", x: w * 0.50, y: groundY, vx: 0, scale: 0.90, facing: 1 }
      );
    } else if (time === "dusk") {
      // ðŸŒ† DUSK: Acoustic guitarist on bench, evening stroll in coats, phone texter under streetlamp, couple
      this.characters.push(
        { type: "bench_guitarist", x: this.benches[0].x, y: groundY, scale: 0.92, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "walker_coat", x: w * 0.40, y: groundY, vx: 32, scale: 0.90, facing: 1 },
        { type: "dog_walker", x: w * 0.76, y: groundY, vx: -32, scale: 0.88, facing: -1 },
        { type: "walker_phone", x: w * 0.60, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "couple", x: w * 0.18, y: groundY, vx: 26, scale: 0.90, facing: 1 },
        { type: "jogger", x: w * 0.88, y: groundY, vx: -70, scale: 0.88, facing: -1 }
      );
    } else {
      // ðŸŒ™ NIGHT: Stargazer at telescope, solitary nocturnal walker, late night runner, bench thinker
      this.characters.push(
        { type: "stargazer", x: w * 0.26, y: groundY, scale: 0.92, facing: 1 },
        { type: "walker_coat", x: w * 0.54, y: groundY, vx: 28, scale: 0.90, facing: 1 },
        { type: "bench_watcher", x: this.benches[1].x, y: groundY, scale: 0.90, facing: 1 },
        { type: "jogger_night", x: w * 0.86, y: groundY, vx: -68, scale: 0.88, facing: -1 },
        { type: "walker_phone", x: w * 0.70, y: groundY, vx: -26, scale: 0.88, facing: -1 }
      );
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

    // Clouds
    this.clouds.forEach(c => {
      c.x += c.speed * dt;
      if (c.x > w + 140) c.x = -140;
    });

    // Birds
    this.birds.forEach(b => {
      b.x += b.speed * dt;
      b.wingPhase += dt * 9;
      if (b.x > w + 60) b.x = -60;
    });

    // Shooting Stars (Night)
    if (this.timeOfDay === "night" && Math.random() < 0.005 && this.shootingStars.length === 0) {
      this.shootingStars.push({
        x: Math.random() * w * 0.8,
        y: Math.random() * this.h * 0.35,
        vx: 260 + Math.random() * 140,
        vy: 120 + Math.random() * 60,
        life: 0.8,
        maxLife: 0.8
      });
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const star = this.shootingStars[i];
      star.x += star.vx * dt;
      star.y += star.vy * dt;
      star.life -= dt;
      if (star.life <= 0) this.shootingStars.splice(i, 1);
    }

    // Characters movement & boundary wrap
    this.characters.forEach(char => {
      if (char.vx) {
        let isPaused = false;
        if (char.type === "photographer") {
          const cycle = (timeSec * 0.25) % 1.0;
          if (cycle > 0.55 && cycle < 0.85) isPaused = true;
        }
        if (!isPaused) {
          char.x += char.vx * dt;
        }
        // Direction must always match vx sign so character faces where they walk!
        char.facing = char.vx >= 0 ? 1 : -1;

        if (char.vx > 0 && char.x > w + 90) {
          char.x = -90;
        } else if (char.vx < 0 && char.x < -90) {
          char.x = w + 90;
        }
      }
    });
  }

  // --- Rendering Architecture ---

  draw(timeSec) {
    const ctx = this.ctx;
    const w = this.w;
    const h = this.h;

    ctx.clearRect(0, 0, w, h);

    const colors = this.getThemeColors();

    // 1. Vivid Full-Canvas Sky Gradient (unmistakably conveys time of day!)
    this.drawSky(ctx, colors);

    // 1b. Celestial Twinkling Stars (Night & Dusk)
    if (this.timeOfDay === "night" || this.timeOfDay === "dusk") {
      this.drawStars(ctx, timeSec);
    }

    // 2. Celestial Orb: Brilliant Sun / Luminous Crescent Moon
    this.drawCelestialBody(ctx, colors);

    // 3. Clouds & Sunbeams
    this.drawClouds(ctx, colors);

    // 4. Flying Birds
    this.drawBirds(ctx, colors);

    // 5. Shooting Stars (Night)
    if (this.shootingStars.length > 0) {
      this.drawShootingStars(ctx);
    }

    // 6. Distant City Skyline & Rolling Hills
    this.drawSkyline(ctx, colors);

    // 7. Ground Line, Promenade Path & Railing
    this.drawGround(ctx, colors);

    // 8. Park Trees
    this.drawTrees(ctx, colors, timeSec);

    // 9. Park Benches
    this.drawBenches(ctx, colors);

    // 10. Streetlamps & Glowing Volumetric Light Cones
    this.drawStreetlamps(ctx, colors);

    // 11. Animated 2D Vector Characters (Real Human Activities)
    this.drawCharacters(ctx, colors, timeSec);
  }

  getThemeColors() {
    const t = this.timeOfDay;
    switch (t) {
      case "dawn":
        return {
          skyTop: "#1c1936",
          skyMid: "#6a345e",
          skyBottom: "#ff9253",
          skyHorizon: "#ffd68a",
          sunColor: "#ffbe88",
          sunGlow: "rgba(255, 170, 100, 0.6)",
          sunGlowMid: "rgba(255, 170, 100, 0.15)",
          isSun: true,
          sunYRatio: 0.68,
          hillsBack: "#462947",
          hillsFront: "#331c34",
          skyline: "#422340",
          ground: "#352238",
          pavement: "#462e4a",
          railing: "rgba(255, 200, 160, 0.50)",
          tree: "#27162b",
          silhouette: "#140816",
          benchColor: "#2a182c",
          lampPostColor: "#1c0f1f",
          charAccent: "#ffbe88",
          shadowColor: "rgba(20, 8, 20, 0.55)",
          lampLight: "rgba(255, 215, 140, 0)",
          lampLightMid: "rgba(255, 215, 140, 0)",
          lampGlow: 0,
          isDaylight: false
        };
      case "day":
        return {
          skyTop: "#1976d2",
          skyMid: "#42a5f5",
          skyBottom: "#90caf9",
          skyHorizon: "#e3f2fd",
          sunColor: "#fff8e1",
          sunGlow: "rgba(255, 245, 180, 0.75)",
          sunGlowMid: "rgba(255, 245, 180, 0.20)",
          isSun: true,
          sunYRatio: 0.24,
          hillsBack: "#5c9470",
          hillsFront: "#3f7a55",
          skyline: "#547596",
          ground: "#475569",
          pavement: "#64748b",
          railing: "rgba(255, 255, 255, 0.65)",
          tree: "#265437",
          silhouette: "#1e293b",
          benchColor: "#334155",
          lampPostColor: "#1e293b",
          charAccent: "#38bdf8",
          shadowColor: "rgba(15, 23, 42, 0.35)",
          lampLight: "rgba(255, 220, 140, 0)",
          lampLightMid: "rgba(255, 220, 140, 0)",
          lampGlow: 0,
          isDaylight: true
        };
      case "sunset":
        return {
          skyTop: "#180a2b",
          skyMid: "#641544",
          skyBottom: "#cb3728",
          skyHorizon: "#ff982b",
          sunColor: "#ff6324",
          sunGlow: "rgba(255, 100, 40, 0.75)",
          sunGlowMid: "rgba(255, 100, 40, 0.22)",
          isSun: true,
          sunYRatio: 0.72,
          hillsBack: "#421832",
          hillsFront: "#2b0d20",
          skyline: "#3e122e",
          ground: "#351e2c",
          pavement: "#48283c",
          railing: "rgba(255, 175, 110, 0.65)",
          tree: "#231120",
          silhouette: "#100410",
          benchColor: "#281423",
          lampPostColor: "#1d0e1b",
          charAccent: "#fb923c",
          shadowColor: "rgba(10, 2, 10, 0.65)",
          lampLight: "rgba(255, 195, 90, 0.45)",
          lampLightMid: "rgba(255, 195, 90, 0.15)",
          lampGlow: 0.5,
          isDaylight: false
        };
      case "dusk":
        return {
          skyTop: "#090918",
          skyMid: "#1e1840",
          skyBottom: "#451f5c",
          skyHorizon: "#782d6b",
          sunColor: "#f3e8ff",
          sunGlow: "rgba(190, 120, 255, 0.45)",
          sunGlowMid: "rgba(190, 120, 255, 0.12)",
          isSun: false, // Crescent moon
          sunYRatio: 0.32,
          hillsBack: "#211433",
          hillsFront: "#150b23",
          skyline: "#201131",
          ground: "#231f38",
          pavement: "#322d4f",
          railing: "rgba(200, 160, 255, 0.50)",
          tree: "#161124",
          silhouette: "#0a0614",
          benchColor: "#19152b",
          lampPostColor: "#120d20",
          charAccent: "#c084fc",
          shadowColor: "rgba(6, 4, 12, 0.70)",
          lampLight: "rgba(255, 215, 120, 0.80)",
          lampLightMid: "rgba(255, 215, 120, 0.22)",
          lampGlow: 0.85,
          isDaylight: false
        };
      case "night":
      default:
        return {
          skyTop: "#020409",
          skyMid: "#060c18",
          skyBottom: "#0b152a",
          skyHorizon: "#0e1b36",
          sunColor: "#f0f5ff",
          sunGlow: "rgba(180, 220, 255, 0.40)",
          sunGlowMid: "rgba(180, 220, 255, 0.12)",
          isSun: false, // Glowing crescent moon
          sunYRatio: 0.28,
          hillsBack: "#121a28",
          hillsFront: "#0a101b",
          skyline: "#111824",
          ground: "#161d2e",
          pavement: "#20293d",
          railing: "rgba(255, 255, 255, 0.30)",
          tree: "#0e131d",
          silhouette: "#05070d",
          benchColor: "#111726",
          lampPostColor: "#0a0f1a",
          charAccent: "#38bdf8",
          shadowColor: "rgba(2, 4, 8, 0.75)",
          lampLight: "rgba(255, 225, 140, 0.90)",
          lampLightMid: "rgba(255, 225, 140, 0.26)",
          lampGlow: 1.0,
          isDaylight: false
        };
    }
  }

  getOrbX(w, colors) {
    if (this.decimalHour !== undefined && !isNaN(this.decimalHour)) {
      if (colors.isSun) {
        // Daytime: 5:00 to 19:45
        const progress = Math.max(0, Math.min(1, (this.decimalHour - 5) / 14.75));
        return w * (0.15 + 0.70 * progress);
      } else {
        // Nighttime: 19:46 to 5:00
        const nightHour = this.decimalHour >= 19.75 ? this.decimalHour - 19.75 : this.decimalHour + 4.25;
        const progress = Math.max(0, Math.min(1, nightHour / 9.25));
        return w * (0.15 + 0.70 * progress);
      }
    }
    return w * 0.75;
  }

  // --- 1. Full-Canvas Sky Gradient ---

  drawSky(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();
    const skyGrad = ctx.createLinearGradient(0, 0, 0, groundY);
    skyGrad.addColorStop(0.0, colors.skyTop);
    skyGrad.addColorStop(0.35, colors.skyMid);
    skyGrad.addColorStop(0.75, colors.skyBottom);
    skyGrad.addColorStop(1.0, colors.skyHorizon);

    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, groundY);

    // Radiant Sunbeams / Horizon Haze in Daylight
    if (colors.isDaylight) {
      const sunX = this.getOrbX(w, colors);
      const sunY = this.h * colors.sunYRatio;
      const rayGrad = ctx.createRadialGradient(sunX, sunY, 20, sunX, sunY, w * 0.6);
      rayGrad.addColorStop(0, "rgba(255, 255, 220, 0.35)");
      rayGrad.addColorStop(0.5, "rgba(255, 255, 255, 0.10)");
      rayGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = rayGrad;
      ctx.fillRect(0, 0, w, groundY);
    }
    ctx.restore();
  }

  // --- 1b. Celestial Twinkling Stars (Night & Dusk) ---

  drawStars(ctx, timeSec) {
    if (!this.stars || this.stars.length === 0) return;
    const baseAlpha = this.timeOfDay === "night" ? 0.95 : 0.40;
    ctx.save();
    this.stars.forEach(st => {
      const alpha = baseAlpha * (0.3 + 0.7 * Math.sin(timeSec * st.twinkleSpeed + st.twinkleOffset));
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha.toFixed(3)})`;
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  // --- 2. Celestial Body (Sun or Crescent Moon) ---

  drawCelestialBody(ctx, colors) {
    const w = this.w;
    const orbX = this.getOrbX(w, colors);
    const orbY = this.h * colors.sunYRatio;

    ctx.save();

    if (colors.isSun) {
      const sunR = colors.isDaylight ? 38 : 46;

      // Outer Corona Glow
      const glowGrad = ctx.createRadialGradient(orbX, orbY, sunR * 0.5, orbX, orbY, sunR * 3.5);
      glowGrad.addColorStop(0, colors.sunGlow);
      glowGrad.addColorStop(0.5, colors.sunGlowMid);
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR * 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Solid Sun Disc
      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, sunR, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Crescent Moon
      const moonR = 26;

      const moonGlow = ctx.createRadialGradient(orbX, orbY, 5, orbX, orbY, moonR * 3.2);
      moonGlow.addColorStop(0, colors.sunGlow);
      moonGlow.addColorStop(0.5, colors.sunGlowMid);
      moonGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR * 3.2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = colors.sunColor;
      ctx.beginPath();
      ctx.arc(orbX, orbY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Mask out to create crescent
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(orbX + moonR * 0.55, orbY - moonR * 0.15, moonR * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = "source-over";
    }

    ctx.restore();
  }

  // --- 3. Clouds ---

  drawClouds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.fillStyle = colors.isDaylight
      ? "rgba(255, 255, 255, 0.45)"
      : (this.timeOfDay === "sunset" ? "rgba(255, 180, 140, 0.35)" : "rgba(255, 210, 190, 0.25)");

    this.clouds.forEach(c => {
      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.scale(c.scale, c.scale);

      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.arc(26, -10, 24, 0, Math.PI * 2);
      ctx.arc(54, 0, 28, 0, Math.PI * 2);
      ctx.arc(26, 12, 22, 0, Math.PI * 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 4. Birds ---

  drawBirds(ctx, colors) {
    if (this.timeOfDay === "night") return;

    ctx.save();
    ctx.strokeStyle = colors.isDaylight ? "#334155" : colors.silhouette;
    ctx.lineWidth = 2.0;
    ctx.lineCap = "round";

    this.birds.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.scale(b.scale, b.scale);

      const wing = Math.sin(b.wingPhase) * 6.5;

      ctx.beginPath();
      ctx.moveTo(-10, wing);
      ctx.quadraticCurveTo(-5, -wing, 0, 0);
      ctx.quadraticCurveTo(5, -wing, 10, wing);
      ctx.stroke();

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 5. Shooting Stars (Night) ---

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
      ctx.lineWidth = 2.0;
      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.stroke();
    });
    ctx.restore();
  }

  // --- 6. Skyline & Rolling Hills ---

  drawSkyline(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // A. Architectural city towers
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

      // Windows (Dusk & Night)
      if (b.windows && (this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
        ctx.fillStyle = "rgba(255, 220, 130, 0.45)";
        for (let wy = groundY - b.height + 12; wy < groundY - 14; wy += 14) {
          ctx.fillRect(b.x + 6, wy, 4, 4);
          if (b.width > 34) ctx.fillRect(b.x + 18, wy, 4, 4);
        }
        ctx.fillStyle = colors.skyline;
      }
    });

    // B. Distant rolling hill layer
    ctx.fillStyle = colors.hillsBack;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.3, groundY - 45, w * 0.6, groundY - 25);
    ctx.quadraticCurveTo(w * 0.85, groundY - 55, w, groundY - 25);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    // C. Near rolling hill layer
    ctx.fillStyle = colors.hillsFront;
    ctx.beginPath();
    ctx.moveTo(0, groundY);
    ctx.quadraticCurveTo(w * 0.22, groundY - 30, w * 0.5, groundY - 16);
    ctx.quadraticCurveTo(w * 0.78, groundY - 35, w, groundY - 18);
    ctx.lineTo(w, groundY);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // --- 7. Ground Line, Promenade Path & Railing ---

  drawGround(ctx, colors) {
    const w = this.w;
    const groundY = this.groundY;

    ctx.save();

    // Promenade Pavement
    ctx.fillStyle = colors.ground;
    ctx.fillRect(0, groundY, w, this.h - groundY);

    // Stone curbing strip
    ctx.fillStyle = colors.pavement;
    ctx.fillRect(0, groundY, w, 10);

    // Stone balustrade railing
    ctx.strokeStyle = colors.railing;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, groundY - 16);
    ctx.lineTo(w, groundY - 16);
    ctx.stroke();

    for (let x = 6; x < w; x += 18) {
      ctx.beginPath();
      ctx.moveTo(x, groundY - 16);
      ctx.lineTo(x, groundY);
      ctx.stroke();
    }

    ctx.restore();
  }

  // --- 8. Trees ---

  drawTrees(ctx, colors, timeSec) {
    ctx.save();
    ctx.fillStyle = colors.tree;

    this.trees.forEach((t, idx) => {
      const sway = Math.sin(timeSec * 1.2 + idx) * 2.5;

      ctx.save();
      ctx.translate(t.x, t.y);

      // Trunk
      ctx.fillStyle = colors.isDaylight ? "#332418" : colors.tree;
      ctx.fillRect(-3, -t.trunkH, 6, t.trunkH);

      // Foliage
      ctx.fillStyle = colors.tree;
      if (t.type === "pine") {
        // Conical Evergreen Pine
        const topY = -t.trunkH - t.radius * 1.35;
        // Tier 1 (top)
        ctx.beginPath();
        ctx.moveTo(sway * 0.7, topY);
        ctx.lineTo(-t.radius * 0.45, topY + t.radius * 0.55);
        ctx.lineTo(t.radius * 0.45, topY + t.radius * 0.55);
        ctx.closePath();
        ctx.fill();

        // Tier 2 (mid)
        ctx.beginPath();
        ctx.moveTo(sway * 0.5, topY + t.radius * 0.35);
        ctx.lineTo(-t.radius * 0.7, topY + t.radius * 0.95);
        ctx.lineTo(t.radius * 0.7, topY + t.radius * 0.95);
        ctx.closePath();
        ctx.fill();

        // Tier 3 (base)
        ctx.beginPath();
        ctx.moveTo(sway * 0.3, topY + t.radius * 0.75);
        ctx.lineTo(-t.radius * 0.95, -t.trunkH);
        ctx.lineTo(t.radius * 0.95, -t.trunkH);
        ctx.closePath();
        ctx.fill();
      } else {
        // Deciduous / Elm rounded canopy
        ctx.beginPath();
        ctx.arc(sway, -t.trunkH - t.radius * 0.7, t.radius, 0, Math.PI * 2);
        ctx.arc(sway - t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
        ctx.arc(sway + t.radius * 0.4, -t.trunkH - t.radius * 0.4, t.radius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 9. Benches ---

  drawBenches(ctx, colors) {
    ctx.save();
    ctx.fillStyle = colors.benchColor || (colors.isDaylight ? "#475569" : "#1a162b");

    this.benches.forEach(b => {
      ctx.save();
      ctx.translate(b.x, b.y);

      // Bench seat
      ctx.fillRect(-b.width / 2, -b.height, b.width, 3);
      // Backrest
      ctx.fillRect(-b.width / 2, -b.height - 12, b.width, 3);
      ctx.fillRect(-b.width / 2, -b.height - 6, b.width, 3);
      // Supports
      ctx.fillRect(-b.width / 2 + 4, -b.height - 12, 3, 12);
      ctx.fillRect(b.width / 2 - 7, -b.height - 12, 3, 12);
      // Legs
      ctx.fillRect(-b.width / 2 + 4, -b.height, 3, b.height);
      ctx.fillRect(b.width / 2 - 7, -b.height, 3, b.height);

      ctx.restore();
    });

    ctx.restore();
  }

  // --- 10. Streetlamps & Volumetric Light Cones ---

  drawStreetlamps(ctx, colors) {
    ctx.save();

    this.streetlamps.forEach(lamp => {
      ctx.save();
      ctx.translate(lamp.x, lamp.y);

      const lampH = lamp.height;

      // Volumetric Light Cone on Ground (Sunset, Dusk, Night)
      if (colors.lampGlow > 0.05) {
        ctx.save();
        const beamGrad = ctx.createRadialGradient(0, -lampH + 10, 5, 0, 0, 115);
        beamGrad.addColorStop(0, colors.lampLight);
        beamGrad.addColorStop(0.6, colors.lampLightMid);
        beamGrad.addColorStop(1, "rgba(255, 230, 140, 0)");

        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(-12, -lampH + 8);
        ctx.lineTo(-95, 0);
        ctx.lineTo(95, 0);
        ctx.lineTo(12, -lampH + 8);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // Lamp Post
      ctx.fillStyle = colors.lampPostColor || (colors.isDaylight ? "#1e293b" : "#120e1e");

      // Base
      ctx.beginPath();
      ctx.moveTo(-8, 0);
      ctx.lineTo(-4, -14);
      ctx.lineTo(4, -14);
      ctx.lineTo(8, 0);
      ctx.closePath();
      ctx.fill();

      // Post
      ctx.fillRect(-2, -lampH + 16, 4, lampH - 30);

      // Bracket
      ctx.beginPath();
      ctx.arc(0, -lampH + 16, 5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern frame
      ctx.strokeRect(-7, -lampH, 14, 16);

      // Lantern Glass
      if (colors.lampGlow > 0.05) {
        ctx.fillStyle = `rgba(255, 235, 160, ${0.4 + colors.lampGlow * 0.6})`;
        ctx.fillRect(-6, -lampH + 1, 12, 14);

        // Core glare
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(0, -lampH + 8, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Finial
      ctx.fillStyle = colors.lampPostColor || (colors.isDaylight ? "#1e293b" : "#120e1e");
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

  // --- 11. Animated 2D Vector Characters (Real Human Activities) ---

  drawCharacters(ctx, colors, timeSec) {
    this.characters.forEach(char => {
      ctx.save();
      // Translate to character ground position
      ctx.translate(char.x, char.y);

      // Soft contact drop shadows scaled to entity geometry
      ctx.save();
      ctx.fillStyle = colors.shadowColor;
      ctx.beginPath();
      if (char.type === "cyclist") {
        const f = char.facing || 1;
        ctx.ellipse(-26 * f * char.scale, 0, 8 * char.scale, 2.5 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(26 * f * char.scale, 0, 8 * char.scale, 2.5 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "dog_walker") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 11 * char.scale, 3.2 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(36 * f * char.scale, 0, 8 * char.scale, 2.4 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "couple") {
        const f = char.facing || 1;
        ctx.ellipse(-8 * f * char.scale, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(8 * f * char.scale, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "stroller_parent") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 11 * char.scale, 3.2 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(32 * f * char.scale, 0, 14 * char.scale, 2.8 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type.startsWith("bench_")) {
        const f = char.facing || 1;
        ctx.ellipse(10 * f * char.scale, 0, 8 * char.scale, 2.8 * char.scale, 0, 0, Math.PI * 2);
      } else if (char.type === "stargazer") {
        const f = char.facing || 1;
        ctx.ellipse(0, 0, 9 * char.scale, 3.0 * char.scale, 0, 0, Math.PI * 2);
        ctx.ellipse(14 * f * char.scale, 0, 12 * char.scale, 2.6 * char.scale, 0, 0, Math.PI * 2);
      } else {
        ctx.ellipse(0, 0, 12 * char.scale, 3.5 * char.scale, 0, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();

      // Scale and apply facing direction (+1 = right, -1 = left)
      const facing = char.facing || 1;
      ctx.scale(char.scale * facing, char.scale);

      switch (char.type) {
        case "jogger":
        case "jogger_night":
          this.renderJogger(ctx, colors, timeSec, char);
          break;
        case "dog_walker":
          this.renderDogWalker(ctx, colors, timeSec, char);
          break;
        case "cyclist":
          this.renderCyclist(ctx, colors, timeSec, char);
          break;
        case "skateboarder":
          this.renderSkateboarder(ctx, colors, timeSec, char);
          break;
        case "stroller_parent":
          this.renderStrollerParent(ctx, colors, timeSec, char);
          break;
        case "walker_coffee":
          this.renderWalker(ctx, colors, timeSec, char, { hasCoffee: true });
          break;
        case "walker_phone":
          this.renderWalker(ctx, colors, timeSec, char, { hasPhone: true });
          break;
        case "walker_coat":
          this.renderWalker(ctx, colors, timeSec, char, { hasCoat: true });
          break;
        case "photographer":
          this.renderPhotographer(ctx, colors, timeSec, char);
          break;
        case "couple":
          this.renderCouple(ctx, colors, timeSec, char);
          break;
        case "bench_reader":
          this.renderBenchReader(ctx, colors, timeSec, char);
          break;
        case "bench_laptop":
          this.renderBenchLaptop(ctx, colors, timeSec, char);
          break;
        case "bench_coffee":
          this.renderBenchCoffee(ctx, colors, timeSec, char);
          break;
        case "bench_guitarist":
          this.renderBenchGuitarist(ctx, colors, timeSec, char);
          break;
        case "bench_watcher":
          this.renderBenchWatcher(ctx, colors, timeSec, char);
          break;
        case "stretcher":
          this.renderStretcher(ctx, colors, timeSec, char);
          break;
        case "stargazer":
          this.renderStargazer(ctx, colors, timeSec, char);
          break;
        default:
          this.renderWalker(ctx, colors, timeSec, char, {});
          break;
      }

      ctx.restore();
    });
  }

  // =========================================================================
  // ANATOMICALLY SOUND FORWARD INVERSE KINEMATICS (Zero Backward Leg Bending)
  // =========================================================================

  /**
   * Calculates human walking leg angles where knees strictly bend backward.
   * Swing phase (cos > 0) lifts the foot by flexing the knee backward.
   * Stance phase (cos <= 0) keeps the leg solid and straight on the pavement.
   * phase: 0..2PI
   */
  calcWalkLeg(phase) {
    const swing = Math.sin(phase) * 0.42; // Thigh swing (-back, +front)
    // Knee flexes backward ONLY during forward swing recovery (when cos > 0)
    const kneeFlex = Math.max(0, Math.cos(phase)) * 0.72;
    return {
      thighAngle: swing,
      calfAngle: swing - kneeFlex // Minus sign guarantees backward bend!
    };
  }

  drawArticulatedLeg(ctx, hipX, hipY, thighAngle, calfAngle, thighLen = 13, calfLen = 13) {
    const kX = hipX + Math.sin(thighAngle) * thighLen;
    const kY = hipY + Math.cos(thighAngle) * thighLen;
    const aX = kX + Math.sin(calfAngle) * calfLen;
    const aY = kY + Math.cos(calfAngle) * calfLen;

    ctx.beginPath();
    ctx.moveTo(hipX, hipY);
    ctx.lineTo(kX, kY);
    ctx.lineTo(aX, aY);
    // Foot shoe pointing forward (+X)
    ctx.lineTo(aX + 5, aY);
    ctx.stroke();
  }

  drawSeatedLegs(ctx, hipX = -1, seatY = -22) {
    // Far leg (slightly deeper X, drawn first)
    ctx.beginPath();
    ctx.moveTo(hipX + 3, seatY);
    ctx.lineTo(hipX + 13, seatY);
    ctx.lineTo(hipX + 13, 0);
    ctx.lineTo(hipX + 17, 0);
    ctx.stroke();

    // Near leg (resting on seat, calf dropping to ground)
    ctx.beginPath();
    ctx.moveTo(hipX - 2, seatY);
    ctx.lineTo(hipX + 9, seatY);
    ctx.lineTo(hipX + 9, 0);
    ctx.lineTo(hipX + 13, 0);
    ctx.stroke();
  }

  // --- Character Archetypes ---

  // A. Jogger (Athletic forward lean, high knees, rhythmic arms)
  renderJogger(ctx, colors, timeSec, char) {
    const pace = timeSec * 11;
    const bounce = Math.abs(Math.sin(pace)) * 3.5;
    const baseY = -bounce;

    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 3.2;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(6, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso (leaning forward 14 degrees)
    ctx.save();
    ctx.translate(0, baseY);
    ctx.rotate(14 * Math.PI / 180);
    ctx.fillRect(-4, -50, 9, 24);
    ctx.restore();

    // Legs (Running gait: high knee lift on forward swing, straight push on stance)
    const leg1 = Math.sin(pace) * 0.85;
    const leg2 = Math.sin(pace + Math.PI) * 0.85;
    const kneeFlex1 = Math.max(0, Math.cos(pace)) * 1.30;
    const kneeFlex2 = Math.max(0, Math.cos(pace + Math.PI)) * 1.30;

    this.drawArticulatedLeg(ctx, -2, baseY - 26, leg1, leg1 - kneeFlex1, 14, 13);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, leg2, leg2 - kneeFlex2, 14, 13);

    // Pumping Arms
    const arm1 = -Math.sin(pace) * 0.85;
    const arm2 = -Math.sin(pace + Math.PI) * 0.85;

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const e1X = 2 + Math.sin(arm1) * 12;
    const e1Y = baseY - 48 + Math.cos(arm1) * 12;
    ctx.lineTo(e1X, e1Y);
    ctx.lineTo(e1X + 8, e1Y - 4);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(2, baseY - 48);
    const e2X = 2 + Math.sin(arm2) * 12;
    const e2Y = baseY - 48 + Math.cos(arm2) * 12;
    ctx.lineTo(e2X, e2Y);
    ctx.lineTo(e2X + 8, e2Y - 4);
    ctx.stroke();

    if (char.type === "jogger_night") {
      // Glowing green night armband
      ctx.fillStyle = "#34d399";
      ctx.fillRect(e1X - 2, e1Y - 4, 4, 3);
    }
  }

  // B. Dog Walker & Playful Trotting Dog
  renderDogWalker(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.8;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso / Jacket
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Anatomical Walking Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle);

    // Left Arm swinging back
    ctx.beginPath();
    ctx.moveTo(-4, baseY - 46);
    ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
    ctx.stroke();

    // Right Arm holding leash
    const handX = 14;
    const handY = baseY - 32;
    ctx.beginPath();
    ctx.moveTo(4, baseY - 46);
    ctx.lineTo(10, baseY - 38);
    ctx.lineTo(handX, handY);
    ctx.stroke();

    // Dog trotting in front
    const dogX = 36;
    const dogPace = timeSec * 10;
    const dogBounce = Math.abs(Math.sin(dogPace)) * 1.8;
    const dogY = -dogBounce;

    // Leash
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1.0;
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(dogX - 10, handY + 12, dogX, dogY - 14);
    ctx.stroke();
    ctx.restore();

    // Dog Body
    ctx.save();
    ctx.translate(dogX, dogY);
    ctx.fillStyle = colors.isDaylight ? "#78350f" : colors.silhouette;
    ctx.beginPath();
    ctx.ellipse(0, -12, 11, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head & Snout
    ctx.beginPath();
    ctx.arc(10, -17, 5, 0, Math.PI * 2);
    ctx.lineTo(17, -15);
    ctx.lineTo(14, -12);
    ctx.fill();

    // Ear
    ctx.beginPath();
    ctx.moveTo(8, -21);
    ctx.lineTo(12, -23);
    ctx.lineTo(11, -17);
    ctx.fill();

    // 4 Trotting Legs with canine hock & stifle articulation
    ctx.strokeStyle = colors.isDaylight ? "#78350f" : colors.silhouette;
    ctx.lineWidth = 2.0;
    const d1 = Math.sin(dogPace) * 0.55;
    const d2 = Math.sin(dogPace + Math.PI) * 0.55;

    // Forelegs
    const fKnee1 = Math.sin(d1) * 3;
    const fPaw1 = Math.sin(d1) * 6;
    ctx.beginPath();
    ctx.moveTo(7, -8);
    ctx.lineTo(7 + fKnee1, -4);
    ctx.lineTo(7 + fPaw1, dogBounce);
    ctx.stroke();

    const fKnee2 = Math.sin(d2) * 3;
    const fPaw2 = Math.sin(d2) * 6;
    ctx.beginPath();
    ctx.moveTo(9, -8);
    ctx.lineTo(9 + fKnee2, -4);
    ctx.lineTo(9 + fPaw2, dogBounce);
    ctx.stroke();

    // Hindlegs with natural hock flexion
    const hHock1 = -Math.sin(d2) * 3;
    const hPaw1 = Math.sin(d2) * 6;
    ctx.beginPath();
    ctx.moveTo(-7, -8);
    ctx.lineTo(-9 + hHock1, -4);
    ctx.lineTo(-7 + hPaw1, dogBounce);
    ctx.stroke();

    const hHock2 = -Math.sin(d1) * 3;
    const hPaw2 = Math.sin(d1) * 6;
    ctx.beginPath();
    ctx.moveTo(-5, -8);
    ctx.lineTo(-7 + hHock2, -4);
    ctx.lineTo(-5 + hPaw2, dogBounce);
    ctx.stroke();

    // Wagging tail
    const wag = Math.sin(timeSec * 16) * 4;
    ctx.beginPath();
    ctx.moveTo(-10, -14);
    ctx.quadraticCurveTo(-16, -20 + wag, -14, -24 + wag);
    ctx.stroke();

    ctx.restore();
  }

  // C. Cyclist
  renderCyclist(ctx, colors, timeSec, char) {
    const wheelAngle = timeSec * 14;
    const pedalAngle = timeSec * 6;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;

    const rearX = -26;
    const frontX = 26;
    const wheelR = 15;
    const axleY = -wheelR;

    // Wheels
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(rearX, axleY, wheelR, 0, Math.PI * 2);
    ctx.arc(frontX, axleY, wheelR, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating Spokes (8 radial wire spokes per wheel)
    [rearX, frontX].forEach(wx => {
      ctx.save();
      ctx.translate(wx, axleY);
      ctx.rotate(wheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-wheelR, 0); ctx.lineTo(wheelR, 0);
      ctx.moveTo(0, -wheelR); ctx.lineTo(0, wheelR);
      const diag = wheelR * 0.707;
      ctx.moveTo(-diag, -diag); ctx.lineTo(diag, diag);
      ctx.moveTo(-diag, diag); ctx.lineTo(diag, -diag);
      ctx.stroke();
      ctx.restore();
    });

    // Frame
    ctx.lineWidth = 2.2;
    const bbX = 0, bbY = axleY + 3;
    const spX = -8, spY = -34;
    const htX = 18, htY = -36;

    ctx.beginPath();
    ctx.moveTo(rearX, axleY); ctx.lineTo(spX, spY); ctx.lineTo(bbX, bbY); ctx.closePath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(htX, htY); ctx.lineTo(spX, spY);
    ctx.moveTo(htX, htY); ctx.lineTo(frontX, axleY);
    ctx.moveTo(htX, htY); ctx.lineTo(htX + 6, htY - 6);
    ctx.stroke();

    // Saddle
    ctx.fillRect(spX - 5, spY - 2, 12, 3);

    // Far Leg (180 deg out of phase with near leg)
    const pedalR = 6;
    const p2X = bbX + Math.cos(pedalAngle + Math.PI) * pedalR;
    const p2Y = bbY + Math.sin(pedalAngle + Math.PI) * pedalR;
    const knee2X = -1 + Math.cos(pedalAngle + Math.PI) * 5;
    const knee2Y = -22 + Math.sin(pedalAngle + Math.PI) * 3;

    ctx.save();
    ctx.strokeStyle = colors.isDaylight ? "#334155" : colors.silhouette;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(p2X, p2Y); // crank
    ctx.moveTo(spX + 1, spY);
    ctx.lineTo(knee2X, knee2Y);
    ctx.lineTo(p2X, p2Y);
    ctx.lineTo(p2X + 4, p2Y);
    ctx.stroke();
    ctx.restore();

    // Cyclist Body & Head
    ctx.beginPath();
    ctx.arc(8, -58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(11, -61, 5, 3); // visor

    ctx.save();
    ctx.translate(spX + 4, spY - 4);
    ctx.rotate(35 * Math.PI / 180);
    ctx.fillRect(-3, -24, 7, 24);
    ctx.restore();

    // Arms
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(4, -50);
    ctx.lineTo(htX + 5, htY - 5);
    ctx.stroke();

    // Near Leg (Pedaling)
    const p1X = bbX + Math.cos(pedalAngle) * pedalR;
    const p1Y = bbY + Math.sin(pedalAngle) * pedalR;
    const knee1X = 2 + Math.cos(pedalAngle) * 5;
    const knee1Y = -22 + Math.sin(pedalAngle) * 3;

    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.moveTo(bbX, bbY); ctx.lineTo(p1X, p1Y); // crank
    ctx.moveTo(spX + 3, spY);
    ctx.lineTo(knee1X, knee1Y);
    ctx.lineTo(p1X, p1Y);
    ctx.lineTo(p1X + 4, p1Y);
    ctx.stroke();

    ctx.restore();
  }

  // D. Skateboarder (Pushes with back foot, then cruises)
  renderSkateboarder(ctx, colors, timeSec, char) {
    const cycle = (timeSec * 2.5) % 3; // 0..3 cycle: 0..1 push, 1..3 cruise
    const isPushing = cycle < 1.0;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;

    // Skateboard Deck & Wheels
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-16, -6);
    ctx.lineTo(-12, -4);
    ctx.lineTo(12, -4);
    ctx.lineTo(16, -6);
    ctx.stroke();

    // Wheels
    ctx.beginPath();
    ctx.arc(-10, -2, 2.5, 0, Math.PI * 2);
    ctx.arc(10, -2, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Skater Body
    ctx.lineWidth = 3.0;
    // Head with beanie
    ctx.beginPath();
    ctx.arc(0, -56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, -50, 10, 24);

    // Front Leg (Planted on board)
    ctx.beginPath();
    ctx.moveTo(3, -26);
    ctx.lineTo(6, -14);
    ctx.lineTo(6, -4);
    ctx.stroke();

    // Rear Leg (Pushing or Riding)
    if (isPushing) {
      const pushPhase = cycle / 1.0;
      const footX = -6 - Math.sin(pushPhase * Math.PI) * 12;
      const footY = -4 + Math.sin(pushPhase * Math.PI) * 4;

      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.lineTo(footX + 4, -14);
      ctx.lineTo(footX, footY);
      ctx.stroke();
    } else {
      // Cruising on back of board
      ctx.beginPath();
      ctx.moveTo(-3, -26);
      ctx.lineTo(-6, -14);
      ctx.lineTo(-8, -4);
      ctx.stroke();
    }

    // Arms balancing
    ctx.beginPath();
    ctx.moveTo(-4, -46);
    ctx.lineTo(-14, -36);
    ctx.moveTo(4, -46);
    ctx.lineTo(14, -38);
    ctx.stroke();

    ctx.restore();
  }

  // E. Parent Pushing Modern Baby Stroller
  renderStrollerParent(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.6;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Parent Head
    ctx.beginPath();
    ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Parent Torso
    ctx.fillRect(-5, baseY - 50, 10, 24);

    // Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle);

    // Arms extending to stroller handle
    const handleX = 22;
    const handleY = -34;
    ctx.beginPath();
    ctx.moveTo(3, baseY - 46);
    ctx.lineTo(12, -38);
    ctx.lineTo(handleX, handleY);
    ctx.stroke();

    // Stroller / Pram
    const sX = 32;
    ctx.lineWidth = 2.0;

    // Chassis & Bassinet
    ctx.beginPath();
    ctx.moveTo(handleX, handleY);
    ctx.lineTo(sX - 10, -5);
    ctx.moveTo(handleX + 2, handleY);
    ctx.lineTo(sX + 12, -5);
    ctx.stroke();

    // Bassinet body
    ctx.beginPath();
    ctx.moveTo(sX - 12, -18);
    ctx.lineTo(sX + 16, -18);
    ctx.lineTo(sX + 12, -8);
    ctx.lineTo(sX - 10, -8);
    ctx.closePath();
    ctx.fill();

    // Baby bonnet peeking out
    ctx.beginPath();
    ctx.arc(sX - 2, -21, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Canopy
    ctx.beginPath();
    ctx.arc(sX - 2, -18, 10, Math.PI, Math.PI * 1.7, false);
    ctx.stroke();

    // Wheels with rotating spokes
    const pramWheelAngle = timeSec * 12;
    [sX - 10, sX + 12].forEach(wx => {
      ctx.beginPath();
      ctx.arc(wx, -5, 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.translate(wx, -5);
      ctx.rotate(pramWheelAngle);
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
      ctx.moveTo(0, -5); ctx.lineTo(0, 5);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }

  // F. Walker with Coffee, Phone, or Coat
  renderWalker(ctx, colors, timeSec, char, opts) {
    const pace = timeSec * 4.6;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    // Head (tilted forward if looking at phone)
    ctx.beginPath();
    if (opts.hasPhone) {
      ctx.arc(2, baseY - 54, 6.5, 0, Math.PI * 2);
    } else {
      ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
    }
    ctx.fill();

    // Torso / Overcoat
    if (opts.hasCoat) {
      // Warm knee-length winter/evening coat with subtle hem flare
      const flare = Math.sin(pace) * 2;
      ctx.beginPath();
      ctx.moveTo(-5, baseY - 50);
      ctx.lineTo(5, baseY - 50);
      ctx.lineTo(7 + flare, baseY - 22);
      ctx.lineTo(-7 + flare, baseY - 22);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.fillRect(-5, baseY - 50, 10, 24);
    }

    // Anatomical Walking Legs
    const l1 = this.calcWalkLeg(pace);
    const l2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle, 13, 13);
    this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle, 13, 13);

    if (opts.hasCoat) {
      // Hands tucked in coat pockets
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-7, baseY - 36);
      ctx.lineTo(-3, baseY - 32);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(7, baseY - 36);
      ctx.lineTo(3, baseY - 32);
      ctx.stroke();
    } else if (opts.hasCoffee) {
      // Steaming coffee cup
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(9, baseY - 36);
      ctx.lineTo(12, baseY - 34);
      ctx.stroke();

      ctx.fillRect(11, baseY - 36, 5, 7);

      // Steam
      ctx.save();
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      const sY = baseY - 38 - ((timeSec * 16) % 18);
      ctx.beginPath();
      ctx.moveTo(13, baseY - 38);
      ctx.quadraticCurveTo(15, sY + 4, 13, sY);
      ctx.stroke();
      ctx.restore();
    } else if (opts.hasPhone) {
      // Looking down at smartphone
      ctx.beginPath();
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(8, baseY - 36);
      ctx.lineTo(10, baseY - 38);
      ctx.stroke();

      // Phone
      ctx.fillRect(9, baseY - 41, 3, 6);

      // Screen glow at dusk/night
      if (this.timeOfDay === "dusk" || this.timeOfDay === "night") {
        ctx.fillStyle = "#38bdf8";
        ctx.beginPath();
        ctx.arc(10, baseY - 39, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();
    } else {
      // Standard natural arm swing
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46);
      ctx.lineTo(-4 - Math.sin(pace) * 10, baseY - 28);
      ctx.moveTo(4, baseY - 46);
      ctx.lineTo(4 + Math.sin(pace) * 10, baseY - 28);
      ctx.stroke();
    }

    ctx.restore();
  }

  // G. Photographer / Tourist
  renderPhotographer(ctx, colors, timeSec, char) {
    const hasVx = char.vx && Math.abs(char.vx) > 0.1;
    const walkPauseCycle = (timeSec * 0.25) % 1.0;
    const isWalkPaused = hasVx && (walkPauseCycle > 0.55 && walkPauseCycle < 0.85);
    const isStationary = !hasVx || isWalkPaused;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 3.0;
    ctx.lineCap = "round";

    if (isStationary) {
      // Standing stationary taking pictures of scenery
      const cycle = hasVx ? ((walkPauseCycle - 0.55) / 0.30) : ((timeSec * 0.35) % 1.0);
      const isShooting = hasVx ? (cycle > 0.15 && cycle < 0.85) : (cycle > 0.35 && cycle < 0.80);
      const isFlashing = hasVx ? (cycle > 0.50 && cycle < 0.60) : (cycle > 0.60 && cycle < 0.65);

      // Head
      ctx.beginPath();
      ctx.arc(0, -56, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.fillRect(-5, -50, 10, 24);

      // Standing Legs planted firmly on the ground
      ctx.beginPath();
      ctx.moveTo(-3, -26); ctx.lineTo(-5, 0); ctx.lineTo(-1, 0);
      ctx.moveTo(3, -26); ctx.lineTo(5, 0); ctx.lineTo(9, 0);
      ctx.stroke();

      if (isShooting) {
        // Arms raised holding camera up to eye
        ctx.beginPath();
        ctx.moveTo(-4, -46); ctx.lineTo(4, -54);
        ctx.moveTo(4, -46); ctx.lineTo(4, -54);
        ctx.stroke();

        // Camera
        ctx.fillRect(4, -57, 7, 5);

        // Flash
        if (isFlashing) {
          ctx.fillStyle = "#ffffff";
          ctx.beginPath();
          ctx.arc(14, -55, 14, 0, Math.PI * 2);
          ctx.fill();

          // Flash rays
          ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(14, -72); ctx.lineTo(14, -38);
          ctx.moveTo(-3, -55); ctx.lineTo(31, -55);
          ctx.stroke();
        }
      } else {
        // Holding camera at chest level, looking at scenery or reviewing photo
        ctx.beginPath();
        ctx.moveTo(-4, -46); ctx.lineTo(2, -38);
        ctx.moveTo(4, -46); ctx.lineTo(4, -38);
        ctx.stroke();

        ctx.fillRect(2, -41, 6, 5);

        // LCD preview glow
        if (cycle > 0.80 && (this.timeOfDay === "sunset" || this.timeOfDay === "dusk" || this.timeOfDay === "night")) {
          ctx.fillStyle = "#38bdf8";
          ctx.beginPath();
          ctx.arc(4, -39, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    } else {
      // Walking with camera hanging on chest
      const pace = timeSec * 4.2;
      const bounce = Math.abs(Math.sin(pace)) * 1.8;
      const baseY = bounce;
      const l1 = this.calcWalkLeg(pace);
      const l2 = this.calcWalkLeg(pace + Math.PI);

      // Head
      ctx.beginPath();
      ctx.arc(0, baseY - 56, 6.5, 0, Math.PI * 2);
      ctx.fill();

      // Torso
      ctx.fillRect(-5, baseY - 50, 10, 24);

      // Walking Legs
      this.drawArticulatedLeg(ctx, -3, baseY - 26, l1.thighAngle, l1.calfAngle, 13, 13);
      this.drawArticulatedLeg(ctx, 3, baseY - 26, l2.thighAngle, l2.calfAngle, 13, 13);

      // Arms swinging
      ctx.beginPath();
      ctx.moveTo(-4, baseY - 46); ctx.lineTo(-4 - Math.sin(pace) * 8, baseY - 28);
      ctx.moveTo(4, baseY - 46); ctx.lineTo(4 + Math.sin(pace) * 8, baseY - 28);
      ctx.stroke();

      // Camera on chest
      ctx.fillRect(1, baseY - 42, 6, 5);
    }

    ctx.restore();
  }

  // H. Couple Strolling
  renderCouple(ctx, colors, timeSec, char) {
    const pace = timeSec * 4.2;
    const bounce = Math.abs(Math.sin(pace)) * 1.8;
    const baseY = bounce;

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Person 1 (Taller)
    ctx.beginPath();
    ctx.arc(-8, baseY - 58, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(-13, baseY - 52, 10, 26);

    // Person 1 Two Walking Legs
    const p1L1 = this.calcWalkLeg(pace);
    const p1L2 = this.calcWalkLeg(pace + Math.PI);
    this.drawArticulatedLeg(ctx, -12, baseY - 26, p1L1.thighAngle, p1L1.calfAngle, 13, 13);
    this.drawArticulatedLeg(ctx, -5, baseY - 26, p1L2.thighAngle, p1L2.calfAngle, 13, 13);

    // Person 1 outer swinging arm
    ctx.beginPath();
    ctx.moveTo(-13, baseY - 46);
    ctx.lineTo(-13 - Math.sin(pace) * 8, baseY - 28);
    ctx.stroke();

    // Person 2 (Slightly shorter)
    ctx.beginPath();
    ctx.arc(8, baseY - 54, 6.0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(4, baseY - 48, 9, 24);

    // Person 2 Two Walking Legs
    const p2L1 = this.calcWalkLeg(pace + 0.35);
    const p2L2 = this.calcWalkLeg(pace + 0.35 + Math.PI);
    this.drawArticulatedLeg(ctx, 4, baseY - 24, p2L1.thighAngle, p2L1.calfAngle, 12, 12);
    this.drawArticulatedLeg(ctx, 11, baseY - 24, p2L2.thighAngle, p2L2.calfAngle, 12, 12);

    // Person 2 outer swinging arm
    ctx.beginPath();
    ctx.moveTo(12, baseY - 42);
    ctx.lineTo(12 + Math.sin(pace + 0.35) * 8, baseY - 26);
    ctx.stroke();

    // Joined Hands in the center
    ctx.beginPath();
    ctx.moveTo(-5, baseY - 46);
    ctx.lineTo(0, baseY - 31);
    ctx.lineTo(5, baseY - 42);
    ctx.stroke();

    ctx.restore();
  }

  // I. Bench Reader (Day)
  renderBenchReader(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilted down reading
    ctx.beginPath();
    ctx.arc(2, -48, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso sitting on bench
    ctx.fillRect(-4, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -1, -22);

    // Arms holding book above lap
    ctx.beginPath();
    ctx.moveTo(2, -38); ctx.lineTo(9, -27);
    ctx.stroke();

    // Open Book
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(6, -30); ctx.lineTo(13, -32); ctx.lineTo(15, -25); ctx.lineTo(8, -24);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // J. Bench Laptop Worker (Day)
  renderBenchLaptop(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head looking at laptop screen
    ctx.beginPath();
    ctx.arc(2, -48, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-4, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -1, -22);

    // Laptop on lap
    ctx.strokeStyle = "#cbd5e1";
    ctx.lineWidth = 2.0;
    ctx.beginPath();
    ctx.moveTo(6, -24); ctx.lineTo(16, -24); // base
    ctx.lineTo(13, -34); // open screen
    ctx.stroke();

    // Hands typing on keyboard
    ctx.strokeStyle = colors.isDaylight ? "#0f172a" : colors.silhouette;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(1, -37); ctx.lineTo(8, -26);
    ctx.stroke();

    ctx.restore();
  }

  // K. Bench Coffee Drinker
  renderBenchCoffee(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head
    ctx.beginPath();
    ctx.arc(-2, -49, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso
    ctx.fillRect(-5, -43, 9, 21);

    // Seated legs
    this.drawSeatedLegs(ctx, -2, -22);

    // Arm holding warm coffee cup
    ctx.beginPath();
    ctx.moveTo(2, -38); ctx.lineTo(8, -32); ctx.lineTo(11, -34);
    ctx.stroke();

    // Coffee cup
    ctx.fillRect(10, -36, 5, 7);

    // Rising steam
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 1;
    const sY = -38 - ((timeSec * 14) % 16);
    ctx.beginPath();
    ctx.moveTo(12, -38);
    ctx.quadraticCurveTo(14, sY + 4, 12, sY);
    ctx.stroke();
    ctx.restore();

    ctx.restore();
  }

  // L. Bench Guitarist (Sunset & Dusk)
  renderBenchGuitarist(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilted forward towards the fretboard
    ctx.beginPath();
    ctx.arc(0, -49, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso sitting on bench seat (-22)
    ctx.fillRect(-5, -43, 9, 21);

    // Anatomical Seated Legs resting on bench (-22) and reaching ground (0)
    this.drawSeatedLegs(ctx, -1, -22);

    // Acoustic Guitar body resting on lap facing right (+X)
    ctx.fillStyle = "#d97706";
    ctx.beginPath();
    ctx.ellipse(1, -26, 9, 6, -18 * Math.PI / 180, 0, Math.PI * 2);
    ctx.fill();

    // Soundhole
    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    ctx.arc(1, -26, 2, 0, Math.PI * 2);
    ctx.fill();

    // Guitar neck & headstock pointing FORWARD and UP (+X, +Y upward)
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(4, -28); ctx.lineTo(16, -38);
    ctx.stroke();

    // Headstock
    ctx.fillRect(15, -41, 4, 3);

    // Fretting left arm/hand reaching forward along neck
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(1, -38); ctx.lineTo(9, -36); ctx.lineTo(13, -37);
    ctx.stroke();

    // Strumming right hand over guitar strings
    const strum = Math.sin(timeSec * 7) * 2;
    ctx.beginPath();
    ctx.moveTo(-3, -38); ctx.lineTo(-1, -31); ctx.lineTo(2, -26 + strum);
    ctx.stroke();

    ctx.restore();
  }

  // M. Bench Sunset Watcher
  renderBenchWatcher(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head looking towards horizon
    ctx.beginPath();
    ctx.arc(-2, -49, 6.2, 0, Math.PI * 2);
    ctx.fill();

    // Torso relaxed against backrest
    ctx.fillRect(-6, -43, 9, 21);

    // Seated Legs
    this.drawSeatedLegs(ctx, -2, -22);

    // Arm resting along backrest
    ctx.beginPath();
    ctx.moveTo(-4, -39); ctx.lineTo(-15, -34); ctx.lineTo(-15, -28);
    ctx.stroke();

    // Other arm resting on lap
    ctx.beginPath();
    ctx.moveTo(2, -39); ctx.lineTo(6, -25);
    ctx.stroke();

    ctx.restore();
  }

  // N. Stargazer with Telescope (Night)
  renderStargazer(ctx, colors, timeSec, char) {
    ctx.save();
    ctx.fillStyle = colors.silhouette;
    ctx.strokeStyle = colors.silhouette;

    const tripodX = 14;
    const tripodTopY = -34;

    // Tripod
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX - 12, 0);
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX, 0);
    ctx.moveTo(tripodX, tripodTopY); ctx.lineTo(tripodX + 12, 0);
    ctx.stroke();

    // Telescope
    ctx.save();
    ctx.translate(tripodX, tripodTopY);
    ctx.rotate(-42 * Math.PI / 180);
    ctx.fillStyle = "#c59b27";
    ctx.fillRect(-10, -3, 28, 6);
    ctx.restore();

    // Stargazer Figure
    ctx.fillStyle = colors.silhouette;
    ctx.beginPath();
    ctx.arc(6, -37, 6.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(2, -34);
    ctx.rotate(18 * Math.PI / 180);
    ctx.fillRect(-4, 0, 8, 20);
    ctx.restore();

    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(-4, 0);
    ctx.moveTo(4, -14); ctx.lineTo(6, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(6, -30); ctx.lineTo(12, -34);
    ctx.stroke();

    ctx.restore();
  }

  // O. Morning Stretcher / Yoga on Lawn
  renderStretcher(ctx, colors, timeSec, char) {
    const yogaCycle = Math.sin(timeSec * 1.5);

    ctx.save();
    ctx.fillStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.strokeStyle = colors.isDaylight ? "#1e293b" : colors.silhouette;
    ctx.lineWidth = 2.8;
    ctx.lineCap = "round";

    // Head tilting up towards morning sky
    ctx.beginPath();
    ctx.arc(0, -52 - yogaCycle * 2.5, 6.0, 0, Math.PI * 2);
    ctx.fill();

    // Torso stretching upward from anchored hips (-22)
    const torsoTop = -46 - yogaCycle * 2;
    ctx.fillRect(-4, torsoTop, 8, -22 - torsoTop);

    // Legs in wide warrior/triangle stretch stance with feet planted
    ctx.beginPath();
    ctx.moveTo(-3, -22); ctx.lineTo(-8, -11); ctx.lineTo(-13, 0); ctx.lineTo(-18, 0);
    ctx.moveTo(3, -22); ctx.lineTo(8, -11); ctx.lineTo(13, 0); ctx.lineTo(18, 0);
    ctx.stroke();

    // Arms reaching gracefully up to greet the morning sun
    ctx.beginPath();
    ctx.moveTo(-3, torsoTop + 2); ctx.lineTo(-11, -58 - yogaCycle * 3.5);
    ctx.moveTo(3, torsoTop + 2); ctx.lineTo(11, -58 - yogaCycle * 3.5);
    ctx.stroke();

    ctx.restore();
  }
}

  // =========================================================================
  // 6. Application Controller
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
    this.watch3DCanvas = document.getElementById("watch-3d-canvas");
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
    // 2D Swiss luxury dress watch engine (renders live dial texture)
    this.watch = new WatchEngine(this.watchCanvas, soundEngine);
    // 3D Buckled Wristwatch WebGL engine
    this.watch3D = new Watch3DEngine(this.watch3DCanvas, this.watch, soundEngine);
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
        icon.textContent = isSoundOn ? "ðŸ”Š" : "ðŸ”‡";
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
        if (this.watch3D) {
          this.watch3D.setFinish(finish);
        }
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
      flag: "ðŸ‡¬ðŸ‡§",
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
      if (this.watch3D) {
        this.watch3D.setFinish(this.watch.finish);
      }
      this.applyBackgroundTheme(timeInfo);
      this.setTelemetry(`âœ¦ ${city.flag} ${city.name.toUpperCase()} â€¢ SYNCHRONIZED`, false);
      this.startLiveClock();
      return;
    }

    this.isTransitioning = true;

    // --- Fast Hand Spin & Deceleration Animation ---
    this.setTelemetry(`âœ¦ TARGETING ${city.flag} ${city.name.toUpperCase()} â€¢ SPINNING HANDS...`, true);

    // Background theme starts morphing as the hands spin
    this.applyBackgroundTheme(timeInfo);

    if (this.watch3D) {
      this.watch3D.spinToLocation(timeInfo);
    }

    this.watch.setTime(timeInfo, true, () => {
      // When hands finish spinning and lock onto time
      this.setTelemetry(`âœ¦ ${city.flag} ${city.name.toUpperCase()} â€¢ SYNCHRONIZED`, false);
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

    if (this.timezoneBadgeEl) this.timezoneBadgeEl.textContent = `${timeInfo.offsetStr} â€¢ ${city.tz.split("/")[1] || city.tz}`;

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
        dawn: "ðŸŒ… Dawn / Sunrise",
        day: "â˜€ï¸ Broad Daylight",
        sunset: "ðŸŒ‡ Golden Hour Sunset",
        dusk: "ðŸŒ† Twilight / Dusk",
        night: "ðŸŒ™ Starlit Night"
      };
      this.solarStatusEl.textContent = solarIcons[timeInfo.timeOfDay] || "â˜€ï¸ Day";
    }

    if (this.coordsBadgeEl) {
      const latStr = `${Math.abs(city.lat).toFixed(2)}Â° ${city.lat >= 0 ? "N" : "S"}`;
      const lngStr = `${Math.abs(city.lng).toFixed(2)}Â° ${city.lng >= 0 ? "E" : "W"}`;
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
      if (this.currentTheme !== updatedInfo.timeOfDay) {
        this.currentTheme = updatedInfo.timeOfDay;
        this.applyBackgroundTheme(updatedInfo);
      }
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