/**
 * PHILL - World Watch & Planetary Timepiece
 * Unified Production Bundle (Self-Contained, Zero External Dependencies)
 * Supports both HTTP servers and direct file:// execution.
 */

(function() {
  "use strict";

  // =========================================================================
  // 1. Comprehensive Global Countries & Cities Database + Universal Geocoder
  // =========================================================================
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

  function searchCities(query) {
    if (!query || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    const results = [];
    const seen = new Set();

    // 1. Countries
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

    // 2. Cities & Towns
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

  async function resolveAnyLocation(query) {
    if (!query || !query.trim()) return null;
    const q = query.trim();

    // 1. Check local search first
    const localMatches = searchCities(q);
    if (localMatches.length > 0) {
      const first = localMatches[0];
      if (first.name.toLowerCase() === q.toLowerCase() || first.country.toLowerCase() === q.toLowerCase()) {
        return first;
      }
    }

    // 2. Geocode via OpenStreetMap Nominatim for any town or place
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

          let flag = "📍";
          if (code && code.length === 2) {
            flag = String.fromCodePoint(...[...code].map(c => 127397 + c.charCodeAt(0)));
          }

          const { city: nearestCity } = findNearestCity(lat, lng);
          const tz = nearestCity.tz;

          return { name, country, flag, tz, lat, lng, isGeocoded: true };
        }
      }
    } catch (err) {}

    if (localMatches.length > 0) {
      return localMatches[0];
    }
    return null;
  }

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
  // 2. Web Audio API Mechanical Watch Synthesizer
  // =========================================================================
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

    playTick(high = false) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;
      if (now - this.lastTickTime < 0.05) return;
      this.lastTickTime = now;

      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

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
      } catch (e) {}
    }

    playWindingEffect(duration = 1.2) {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;

      try {
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
      } catch (e) {}
    }

    playArrivalChime() {
      if (!this.enabled || !this.ctx) return;
      const now = this.ctx.currentTime;

      try {
        const freqs = [1046.5, 1318.5, 2093.0];
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
      } catch (e) {}
    }
  }

  const soundEngine = new WatchSoundEngine();

  // =========================================================================
  // 3. Earth Procedural Cartography
  // =========================================================================
  const CONTINENT_POLYGONS = [
    [[-168, 65], [-160, 71], [-140, 70], [-130, 70], [-120, 76], [-95, 78], [-80, 74], [-70, 62], [-64, 47], [-60, 47], [-65, 43], [-70, 42], [-75, 35], [-80, 25], [-81, 25], [-85, 30], [-97, 26], [-97, 20], [-90, 16], [-83, 9], [-77, 8], [-82, 9], [-87, 13], [-105, 20], [-110, 30], [-117, 32], [-124, 40], [-125, 49], [-135, 57], [-145, 60], [-165, 60], [-168, 65]],
    [[-45, 60], [-35, 65], [-20, 70], [-20, 78], [-30, 83], [-50, 83], [-60, 82], [-55, 75], [-50, 68], [-45, 60]],
    [[-77, 8], [-72, 11], [-60, 10], [-50, 0], [-35, -5], [-35, -10], [-38, -13], [-42, -22], [-48, -28], [-53, -33], [-58, -38], [-65, -43], [-66, -55], [-74, -53], [-74, -45], [-72, -35], [-71, -25], [-76, -14], [-81, -5], [-80, 2], [-77, 8]],
    [[-9, 36], [-9, 43], [0, 44], [-2, 48], [-5, 48], [2, 51], [8, 54], [10, 58], [5, 62], [15, 68], [28, 71], [35, 68], [30, 60], [25, 55], [20, 45], [26, 40], [23, 38], [15, 40], [14, 45], [10, 44], [3, 42], [-3, 36], [-9, 36]],
    [[-5, 50], [1, 51], [0, 53], [-2, 57], [-5, 58], [-6, 55], [-5, 50]],
    [[-10, 51], [-6, 52], [-6, 55], [-10, 54], [-10, 51]],
    [[5, 58], [12, 57], [18, 59], [22, 65], [28, 70], [20, 69], [12, 63], [5, 58]],
    [[-5, 36], [10, 37], [25, 32], [32, 31], [34, 27], [43, 13], [51, 12], [45, 5], [40, -3], [40, -10], [35, -20], [32, -27], [28, -33], [19, -34], [18, -30], [12, -18], [12, -5], [9, 4], [3, 6], [-10, 5], [-15, 12], [-17, 15], [-17, 21], [-13, 28], [-5, 36]],
    [[44, -12], [50, -13], [50, -20], [47, -25], [44, -25], [43, -16], [44, -12]],
    [[30, 70], [60, 70], [80, 73], [105, 77], [140, 73], [170, 69], [180, 65], [170, 60], [160, 56], [150, 59], [143, 50], [132, 43], [129, 35], [122, 30], [118, 22], [108, 16], [105, 10], [100, 4], [104, 1], [98, 8], [90, 22], [80, 13], [77, 8], [73, 16], [68, 24], [62, 25], [57, 26], [50, 27], [45, 13], [35, 15], [35, 30], [28, 41], [30, 46], [38, 47], [40, 55], [32, 60], [30, 70]],
    [[68, 24], [72, 21], [73, 16], [76, 9], [80, 13], [82, 17], [88, 22], [90, 22], [80, 26], [70, 26], [68, 24]],
    [[130, 32], [132, 34], [136, 35], [141, 38], [141, 43], [145, 44], [142, 45], [139, 41], [135, 35], [130, 32]],
    [[96, 5], [105, -6], [115, -8], [125, -8], [130, -3], [125, 1], [115, 0], [104, 2], [96, 5]],
    [[120, 15], [125, 13], [126, 7], [122, 7], [120, 15]],
    [[114, -22], [122, -18], [130, -12], [136, -12], [142, -11], [145, -15], [153, -28], [150, -36], [147, -38], [138, -35], [135, -34], [125, -33], [115, -34], [113, -26], [114, -22]],
    [[167, -46], [174, -41], [178, -38], [174, -36], [172, -41], [168, -44], [167, -46]],
    [[-180, -78], [-120, -74], [-70, -65], [-50, -65], [-20, -70], [20, -69], [60, -67], [100, -66], [140, -66], [170, -71], [180, -78], [180, -90], [-180, -90], [-180, -78]]
  ];

  function createEarthTextures(width = 2048, height = 1024) {
    const dayCanvas = document.createElement("canvas");
    dayCanvas.width = width;
    dayCanvas.height = height;
    const dayCtx = dayCanvas.getContext("2d");

    function toX(lng) { return ((lng + 180) / 360) * width; }
    function toY(lat) { return ((90 - lat) / 180) * height; }

    const oceanGrad = dayCtx.createLinearGradient(0, 0, 0, height);
    oceanGrad.addColorStop(0, "#102c4c");
    oceanGrad.addColorStop(0.2, "#0b203a");
    oceanGrad.addColorStop(0.5, "#071b33");
    oceanGrad.addColorStop(0.8, "#092442");
    oceanGrad.addColorStop(1, "#173b5c");
    dayCtx.fillStyle = oceanGrad;
    dayCtx.fillRect(0, 0, width, height);

    dayCtx.strokeStyle = "rgba(45, 110, 180, 0.08)";
    dayCtx.lineWidth = 1;
    for (let lat = -80; lat <= 80; lat += 20) {
      const y = toY(lat);
      dayCtx.beginPath();
      dayCtx.moveTo(0, y);
      dayCtx.lineTo(width, y);
      dayCtx.stroke();
    }
    for (let lng = -180; lng <= 180; lng += 30) {
      const x = toX(lng);
      dayCtx.beginPath();
      dayCtx.moveTo(x, 0);
      dayCtx.lineTo(x, height);
      dayCtx.stroke();
    }

    dayCtx.shadowColor = "#1a668c";
    dayCtx.shadowBlur = 18;
    dayCtx.fillStyle = "#12425d";
    dayCtx.beginPath();
    CONTINENT_POLYGONS.forEach(poly => {
      for (let i = 0; i < poly.length; i++) {
        const [lng, lat] = poly[i];
        const x = toX(lng);
        const y = toY(lat);
        if (i === 0) dayCtx.moveTo(x, y);
        else dayCtx.lineTo(x, y);
      }
      dayCtx.closePath();
    });
    dayCtx.fill();
    dayCtx.shadowBlur = 0;

    CONTINENT_POLYGONS.forEach(poly => {
      let avgLat = 0;
      poly.forEach(pt => { avgLat += pt[1]; });
      avgLat /= poly.length;

      let landGrad;
      if (Math.abs(avgLat) > 62) {
        landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
        landGrad.addColorStop(0, "#eef5f8");
        landGrad.addColorStop(1, "#c8dce4");
      } else if (avgLat >= 12 && avgLat <= 32) {
        landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
        landGrad.addColorStop(0, "#8a9456");
        landGrad.addColorStop(0.5, "#a88e4f");
        landGrad.addColorStop(1, "#5b753c");
      } else {
        landGrad = dayCtx.createLinearGradient(0, 0, 0, height);
        landGrad.addColorStop(0, "#2c5438");
        landGrad.addColorStop(0.5, "#3b6c45");
        landGrad.addColorStop(1, "#27482f");
      }

      dayCtx.fillStyle = landGrad;
      dayCtx.strokeStyle = "#4d8058";
      dayCtx.lineWidth = 1.5;

      dayCtx.beginPath();
      for (let i = 0; i < poly.length; i++) {
        const [lng, lat] = poly[i];
        const x = toX(lng);
        const y = toY(lat);
        if (i === 0) dayCtx.moveTo(x, y);
        else dayCtx.lineTo(x, y);
      }
      dayCtx.closePath();
      dayCtx.fill();
      dayCtx.stroke();
    });

    const nightCanvas = document.createElement("canvas");
    nightCanvas.width = width;
    nightCanvas.height = height;
    const nightCtx = nightCanvas.getContext("2d");
    nightCtx.fillStyle = "#020409";
    nightCtx.fillRect(0, 0, width, height);

    const majorCities = [
      [-74, 40.7, 16], [-118, 34, 14], [-87, 41.8, 12], [-0.1, 51.5, 18], [2.3, 48.8, 16],
      [13.4, 52.5, 14], [139.7, 35.7, 22], [126.9, 37.5, 16], [121.5, 31.2, 18], [116.4, 39.9, 17],
      [77.2, 28.6, 18], [72.8, 19.1, 16], [55.3, 25.2, 15], [31.2, 30.0, 14], [-46.6, -23.5, 16],
      [-58.4, -34.6, 14], [151.2, -33.8, 14], [100.5, 13.7, 13], [103.8, 1.3, 14], [106.8, -6.2, 14],
      [37.6, 55.7, 16], [28.9, 41.0, 14], [-99.1, 19.4, 15]
    ];

    majorCities.forEach(([lng, lat, radius]) => {
      const x = toX(lng);
      const y = toY(lat);
      const grad = nightCtx.createRadialGradient(x, y, 1, x, y, radius * 2.5);
      grad.addColorStop(0, "rgba(255, 240, 180, 0.95)");
      grad.addColorStop(0.2, "rgba(255, 195, 90, 0.7)");
      grad.addColorStop(0.6, "rgba(230, 140, 40, 0.25)");
      grad.addColorStop(1, "rgba(200, 100, 20, 0)");
      nightCtx.fillStyle = grad;
      nightCtx.beginPath();
      nightCtx.arc(x, y, radius * 2.5, 0, Math.PI * 2);
      nightCtx.fill();
    });

    nightCtx.fillStyle = "rgba(255, 210, 120, 0.4)";
    for (let i = 0; i < 350; i++) {
      const r = Math.random();
      let lng, lat;
      if (r < 0.3) { lng = Math.random() * 30 - 5; lat = Math.random() * 20 + 40; }
      else if (r < 0.6) { lng = Math.random() * 35 + 105; lat = Math.random() * 25 + 20; }
      else if (r < 0.85) { lng = Math.random() * 35 - 100; lat = Math.random() * 20 + 28; }
      else { lng = Math.random() * 20 + 70; lat = Math.random() * 18 + 12; }
      nightCtx.beginPath();
      nightCtx.arc(toX(lng), toY(lat), Math.random() * 2 + 0.8, 0, Math.PI * 2);
      nightCtx.fill();
    }

    return { dayCanvas, nightCanvas };
  }

  // =========================================================================
  // 4. WebGL 3D Interactive Earth Engine
  // =========================================================================
  class GlobeEngine {
    constructor(canvas) {
      this.canvas = canvas;
      this.gl = canvas.getContext("webgl", { antialias: true, alpha: true }) ||
                canvas.getContext("experimental-webgl", { antialias: true, alpha: true });

      if (!this.gl) {
        console.error("WebGL not supported.");
        return;
      }

      this.targetRotation = { x: 0.35, y: -0.8 };
      this.currentRotation = { x: 0.35, y: -0.8 };
      this.cameraDistance = 3.2; // Full globe framing with atmosphere
      this.targetDistance = 3.2;
      this.minDistance = 1.35;
      this.maxDistance = 4.5;

      this.activePin = null;
      this.radarPulse = 0;

      this.isDragging = false;
      this.lastMouse = { x: 0, y: 0 };
      this.idleSpin = true;

      this.isAnimating = false;
      this.animStartTime = 0;
      this.animDuration = 2600;
      this.startRot = { x: 0, y: 0 };
      this.endRot = { x: 0, y: 0 };
      this.startDist = 3.2;
      this.endDist = 1.35;
      this.onArrivalCallback = null;
      this.onLocationSelected = null;

      this.initWebGL();
      this.bindEvents();
      this.resize();
      this.render();
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

        uniform sampler2D uDayTexture;
        uniform sampler2D uNightTexture;
        uniform vec3 uSunDirection;
        uniform vec3 uCameraPos;

        uniform vec3 uPinWorldPos;
        uniform float uPinActive;
        uniform float uPulseTime;

        void main() {
          vec3 normal = normalize(vNormal);
          vec3 sunDir = normalize(uSunDirection);
          vec3 viewDir = normalize(uCameraPos - vWorldPos);

          float nDotL = dot(normal, sunDir);
          float dayFactor = smoothstep(-0.15, 0.25, nDotL);

          vec4 dayColor = texture2D(uDayTexture, vTexCoord);
          vec4 nightColor = texture2D(uNightTexture, vTexCoord);

          vec4 surfaceColor = mix(nightColor * 1.5, dayColor, dayFactor);

          vec3 halfDir = normalize(sunDir + viewDir);
          float specFactor = pow(max(dot(normal, halfDir), 0.0), 32.0);
          if (dayColor.b > dayColor.g * 1.15 && dayFactor > 0.1) {
            surfaceColor.rgb += vec3(0.9, 0.95, 1.0) * specFactor * 0.7 * dayFactor;
          }

          float fresnel = 1.0 - max(dot(viewDir, normal), 0.0);
          fresnel = pow(fresnel, 3.2);
          vec3 atmosphereColor = vec3(0.25, 0.65, 1.0) * fresnel * 1.4;

          vec3 finalColor = surfaceColor.rgb + atmosphereColor;

          if (uPinActive > 0.5) {
            float distToPin = length(vWorldPos - uPinWorldPos);
            if (distToPin < 0.045) {
              float coreGlow = 1.0 - distToPin / 0.045;
              finalColor += vec3(1.0, 0.35, 0.2) * coreGlow * 2.5;
            }

            float wave1 = fract(uPulseTime * 1.2);
            float ringDist1 = wave1 * 0.22;
            if (abs(distToPin - ringDist1) < 0.015) {
              float ringAlpha = (1.0 - wave1) * 1.2;
              finalColor += vec3(0.2, 0.85, 1.0) * ringAlpha;
            }

            float wave2 = fract(uPulseTime * 1.2 + 0.5);
            float ringDist2 = wave2 * 0.22;
            if (abs(distToPin - ringDist2) < 0.015) {
              float ringAlpha2 = (1.0 - wave2) * 0.8;
              finalColor += vec3(0.3, 0.7, 1.0) * ringAlpha2;
            }
          }

          gl_FragColor = vec4(finalColor, 1.0);
        }
      `;

      this.program = this.createShaderProgram(gl, vsSource, fsSource);

      this.locations = {
        aPosition: gl.getAttribLocation(this.program, "aPosition"),
        aNormal: gl.getAttribLocation(this.program, "aNormal"),
        aTexCoord: gl.getAttribLocation(this.program, "aTexCoord"),
        uModel: gl.getUniformLocation(this.program, "uModel"),
        uView: gl.getUniformLocation(this.program, "uView"),
        uProjection: gl.getUniformLocation(this.program, "uProjection"),
        uNormalMatrix: gl.getUniformLocation(this.program, "uNormalMatrix"),
        uDayTexture: gl.getUniformLocation(this.program, "uDayTexture"),
        uNightTexture: gl.getUniformLocation(this.program, "uNightTexture"),
        uSunDirection: gl.getUniformLocation(this.program, "uSunDirection"),
        uCameraPos: gl.getUniformLocation(this.program, "uCameraPos"),
        uPinWorldPos: gl.getUniformLocation(this.program, "uPinWorldPos"),
        uPinActive: gl.getUniformLocation(this.program, "uPinActive"),
        uPulseTime: gl.getUniformLocation(this.program, "uPulseTime")
      };

      const { vertices, normals, texCoords, indices } = this.createSphere(1.0, 54, 54);

      this.buffers = {
        vertex: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vertices)),
        normal: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(normals)),
        texCoord: this.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(texCoords)),
        index: this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices)),
        indexCount: indices.length
      };

      const { dayCanvas, nightCanvas } = createEarthTextures(2048, 1024);
      this.dayTexture = this.createTexture(gl, dayCanvas);
      this.nightTexture = this.createTexture(gl, nightCanvas);

      gl.enable(gl.DEPTH_TEST);
      gl.enable(gl.CULL_FACE);
      gl.cullFace(gl.BACK);
    }

    createShaderProgram(gl, vsSource, fsSource) {
      const vs = gl.createShader(gl.VERTEX_SHADER);
      gl.shaderSource(vs, vsSource);
      gl.compileShader(vs);

      const fs = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(fs, fsSource);
      gl.compileShader(fs);

      const prog = gl.createProgram();
      gl.attachShader(prog, vs);
      gl.attachShader(prog, fs);
      gl.linkProgram(prog);
      return prog;
    }

    createBuffer(gl, type, data) {
      const buf = gl.createBuffer();
      gl.bindBuffer(type, buf);
      gl.bufferData(type, data, gl.STATIC_DRAW);
      return buf;
    }

    createTexture(gl, source) {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return tex;
    }

    createSphere(radius, latSegments, lngSegments) {
      const vertices = [];
      const normals = [];
      const texCoords = [];
      const indices = [];

      for (let i = 0; i <= latSegments; i++) {
        const v = i / latSegments;
        const lat = 90 - v * 180;
        const latRad = lat * (Math.PI / 180);
        const cosLat = Math.cos(latRad);
        const sinLat = Math.sin(latRad);

        for (let j = 0; j <= lngSegments; j++) {
          const u = j / lngSegments;
          const lng = -180 + u * 360;
          const lngRad = lng * (Math.PI / 180);
          const cosLng = Math.cos(lngRad);
          const sinLng = Math.sin(lngRad);

          const nx = cosLat * sinLng;
          const ny = sinLat;
          const nz = cosLat * cosLng;

          vertices.push(radius * nx, radius * ny, radius * nz);
          normals.push(nx, ny, nz);
          texCoords.push(u, v);
        }
      }

      for (let i = 0; i < latSegments; i++) {
        for (let j = 0; j < lngSegments; j++) {
          const first = i * (lngSegments + 1) + j;
          const second = first + lngSegments + 1;
          indices.push(first, second, first + 1);
          indices.push(second, second + 1, first + 1);
        }
      }

      return { vertices, normals, texCoords, indices };
    }

    bindEvents() {
      const canvas = this.canvas;

      const onPointerDown = (e) => {
        this.isDragging = true;
        this.idleSpin = false;
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        this.lastMouse = { x, y };
        this.dragDistance = 0;
      };

      const onPointerMove = (e) => {
        if (!this.isDragging) return;
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);

        const dx = x - this.lastMouse.x;
        const dy = y - this.lastMouse.y;
        this.dragDistance += Math.abs(dx) + Math.abs(dy);

        const factor = (this.cameraDistance / 3.2) * 0.0055;
        this.targetRotation.y += dx * factor;
        this.targetRotation.x += dy * factor;
        this.targetRotation.x = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.targetRotation.x));
        this.lastMouse = { x, y };
      };

      const onPointerUp = (e) => {
        if (!this.isDragging) return;
        this.isDragging = false;

        if (this.dragDistance < 6) {
          const rect = canvas.getBoundingClientRect();
          const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX);
          const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY);
          this.handleClickLocation(clientX - rect.left, clientY - rect.top, rect.width, rect.height);
        } else {
          setTimeout(() => {
            if (!this.isDragging && !this.isAnimating) {
              this.idleSpin = true;
            }
          }, 3000);
        }
      };

      const onWheel = (e) => {
        e.preventDefault();
        this.idleSpin = false;
        const delta = e.deltaY * 0.0018;
        this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance + delta));
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

    handleClickLocation(x, y, width, height) {
      const ndcX = (x / width) * 2 - 1;
      const ndcY = -(y / height) * 2 + 1;

      const aspect = width / height;
      const fov = 45 * Math.PI / 180;
      const tanFov = Math.tan(fov / 2);

      const rayDirCam = [ndcX * aspect * tanFov, ndcY * tanFov, -1];
      const len = Math.hypot(...rayDirCam);
      const rdx = rayDirCam[0] / len;
      const rdy = rayDirCam[1] / len;
      const rdz = rayDirCam[2] / len;

      const ox = 0, oy = 0, oz = this.cameraDistance;

      const b = 2 * (ox * rdx + oy * rdy + oz * rdz);
      const c = (ox * ox + oy * oy + oz * oz) - 1.0;
      const discriminant = b * b - 4 * c;

      if (discriminant >= 0) {
        const t = (-b - Math.sqrt(discriminant)) / 2;
        const hitX = ox + t * rdx;
        const hitY = oy + t * rdy;
        const hitZ = oz + t * rdz;

        const cosX = Math.cos(-this.currentRotation.x);
        const sinX = Math.sin(-this.currentRotation.x);
        const y1 = hitY * cosX - hitZ * sinX;
        const z1 = hitY * sinX + hitZ * cosX;
        const x1 = hitX;

        const cosY = Math.cos(-this.currentRotation.y);
        const sinY = Math.sin(-this.currentRotation.y);
        const xSphere = x1 * cosY + z1 * sinY;
        const ySphere = y1;
        const zSphere = -x1 * sinY + z1 * cosY;

        const lat = Math.asin(Math.max(-1, Math.min(1, ySphere))) * 180 / Math.PI;
        const lng = Math.atan2(xSphere, zSphere) * 180 / Math.PI;

        if (this.onLocationSelected) {
          this.onLocationSelected(lat, lng);
        }
      }
    }

    flyTo(lat, lng, options = {}) {
      const {
        duration = 2600,
        zoomIn = true,
        onArrival = null
      } = options;

      this.idleSpin = false;
      this.isAnimating = true;
      this.animStartTime = performance.now();
      this.animDuration = duration;
      this.onArrivalCallback = onArrival;

      const targetPitch = lat * (Math.PI / 180);
      let targetYaw = -lng * (Math.PI / 180);

      const diff = (targetYaw - this.currentRotation.y) % (Math.PI * 2);
      let shortestDiff = diff;
      if (diff > Math.PI) shortestDiff -= Math.PI * 2;
      if (diff < -Math.PI) shortestDiff += Math.PI * 2;

      this.startRot = { x: this.currentRotation.x, y: this.currentRotation.y };
      const extraSpin = -Math.PI * 4; // Two complete dramatic planetary revolutions
      this.endRot = { x: targetPitch, y: this.currentRotation.y + shortestDiff + extraSpin };

      this.startDist = this.cameraDistance;
      this.endDist = zoomIn ? 1.35 : 3.0; // Deep close-up zoom

      this.setPin(lat, lng);
    }

    setPin(lat, lng) {
      const latRad = lat * (Math.PI / 180);
      const lngRad = lng * (Math.PI / 180);

      const x = Math.cos(latRad) * Math.sin(lngRad);
      const y = Math.sin(latRad);
      const z = Math.cos(latRad) * Math.cos(lngRad);

      this.activePin = { lat, lng, x, y, z };
    }

    render() {
      const now = performance.now();
      this.radarPulse = (now / 1000) % 100;

      if (this.isAnimating) {
        const elapsed = now - this.animStartTime;
        const progress = Math.min(1.0, elapsed / this.animDuration);
        const t = progress;
        const rotEase = t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;

        this.currentRotation.x = this.startRot.x + (this.endRot.x - this.startRot.x) * rotEase;
        this.currentRotation.y = this.startRot.y + (this.endRot.y - this.startRot.y) * rotEase;

        // Two-phase distance: maintains orbit view while rotating, then dives in deep!
        let zoomEase = 0;
        if (progress < 0.35) {
          zoomEase = 0;
        } else {
          const zoomP = (progress - 0.35) / 0.65;
          zoomEase = zoomP < 0.5 ? 4 * zoomP * zoomP * zoomP : 1 - Math.pow(-2 * zoomP + 2, 3) / 2;
        }
        this.cameraDistance = this.startDist + (this.endDist - this.startDist) * zoomEase;

        if (progress >= 1.0) {
          this.isAnimating = false;
          this.targetRotation.x = this.endRot.x;
          this.targetRotation.y = this.endRot.y;
          this.targetDistance = this.endDist;
          if (this.onArrivalCallback) {
            const cb = this.onArrivalCallback;
            this.onArrivalCallback = null;
            cb();
          }
        }
      } else {
        if (this.idleSpin && !this.isDragging) {
          this.targetRotation.y += 0.0018;
        }
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.12;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.12;
        this.cameraDistance += (this.targetDistance - this.cameraDistance) * 0.1;
      }

      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(this.program);

      const aspect = this.canvas.width / this.canvas.height;
      const projMatrix = this.createPerspective(45 * Math.PI / 180, aspect, 0.1, 100.0);
      const viewMatrix = this.createLookAt([0, 0, this.cameraDistance], [0, 0, 0], [0, 1, 0]);

      const modelMatrix = this.createIdentity();
      this.rotateX(modelMatrix, this.currentRotation.x);
      this.rotateY(modelMatrix, this.currentRotation.y);
      const normalMatrix = this.createNormalMatrix(modelMatrix);

      gl.uniformMatrix4fv(this.locations.uProjection, false, projMatrix);
      gl.uniformMatrix4fv(this.locations.uView, false, viewMatrix);
      gl.uniformMatrix4fv(this.locations.uModel, false, modelMatrix);
      gl.uniformMatrix3fv(this.locations.uNormalMatrix, false, normalMatrix);

      gl.uniform3f(this.locations.uSunDirection, 0.85, 0.35, 0.7);
      gl.uniform3f(this.locations.uCameraPos, 0, 0, this.cameraDistance);

      if (this.activePin) {
        const px = this.activePin.x;
        const py = this.activePin.y;
        const pz = this.activePin.z;
        const wp = this.multiplyVec4(modelMatrix, [px, py, pz, 1.0]);
        gl.uniform3f(this.locations.uPinWorldPos, wp[0], wp[1], wp[2]);
        gl.uniform1f(this.locations.uPinActive, 1.0);
      } else {
        gl.uniform1f(this.locations.uPinActive, 0.0);
      }
      gl.uniform1f(this.locations.uPulseTime, this.radarPulse);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.dayTexture);
      gl.uniform1i(this.locations.uDayTexture, 0);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.nightTexture);
      gl.uniform1i(this.locations.uNightTexture, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.vertex);
      gl.enableVertexAttribArray(this.locations.aPosition);
      gl.vertexAttribPointer(this.locations.aPosition, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.normal);
      gl.enableVertexAttribArray(this.locations.aNormal);
      gl.vertexAttribPointer(this.locations.aNormal, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers.texCoord);
      gl.enableVertexAttribArray(this.locations.aTexCoord);
      gl.vertexAttribPointer(this.locations.aTexCoord, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffers.index);
      gl.drawElements(gl.TRIANGLES, this.buffers.indexCount, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(() => this.render());
    }

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

    createNormalMatrix(m) {
      return new Float32Array([m[0], m[1], m[2], m[4], m[5], m[6], m[8], m[9], m[10]]);
    }

    multiplyVec4(m, v) {
      return [
        m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12] * v[3],
        m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13] * v[3],
        m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14] * v[3],
        m[3] * v[0] + m[7] * v[1] + m[11] * v[2] + m[15] * v[3]
      ];
    }
  }

  // =========================================================================
  // 5. Luxury Mechanical Analog Wrist Watch Engine: PHILL
  // =========================================================================
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
    constructor(canvas, sound) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.sound = sound;
      this.finish = "steel";

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

      this.handAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };
      this.isTransitioning = false;
      this.transitionStart = 0;
      this.transitionDuration = 1800;
      this.startAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };
      this.targetAngles = { hour: 0, minute: 0, second: 0, celestial: 0 };

      this.lastTickSecond = -1;
      this.lumeAmount = 0;

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
      this.handAngles = {
        hour: (((hours % 12) + minutes / 60 + seconds / 3600) / 12) * Math.PI * 2,
        minute: ((minutes + seconds / 60) / 60) * Math.PI * 2,
        second: (seconds / 60) * Math.PI * 2,
        celestial: ((hours + minutes / 60) / 24) * Math.PI * 2
      };
    }

    setTime(timeInfo, animate = true) {
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

      this.isTransitioning = true;
      this.transitionStart = performance.now();
      this.transitionDuration = 1600;

      if (this.sound) {
        this.sound.playWindingEffect(1.4);
      }

      this.startAngles = { ...this.handAngles };

      let minDelta = targetMin - (this.startAngles.minute % (Math.PI * 2));
      if (minDelta < 0) minDelta += Math.PI * 2;
      minDelta += Math.PI * 4;

      let hrDelta = targetHr - (this.startAngles.hour % (Math.PI * 2));
      if (hrDelta < 0) hrDelta += Math.PI * 2;
      hrDelta += (minDelta / 12);

      let secDelta = targetSec - (this.startAngles.second % (Math.PI * 2));
      if (secDelta < 0) secDelta += Math.PI * 2;
      secDelta += Math.PI * 12;

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
        const t = progress;
        const ease = 1 - Math.pow(1 - t, 4);

        this.handAngles.hour = this.startAngles.hour + (this.targetAngles.hour - this.startAngles.hour) * ease;
        this.handAngles.minute = this.startAngles.minute + (this.targetAngles.minute - this.startAngles.minute) * ease;
        this.handAngles.second = this.startAngles.second + (this.targetAngles.second - this.startAngles.second) * ease;
        this.handAngles.celestial = this.startAngles.celestial + (this.targetAngles.celestial - this.startAngles.celestial) * ease;

        if (progress >= 1.0) {
          this.isTransitioning = false;
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
        // Continuous monotonic timestamp + timezone offset
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
        // Snappy mechanical step in the first 75ms of each second, then stays stationary!
        const stepDuration = 75;
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

      const targetLume = (this.currentTime.timeOfDay === "night" || this.currentTime.timeOfDay === "dusk") ? 1.0 : 0.0;
      this.lumeAmount += (targetLume - this.lumeAmount) * 0.05;
    }

    draw() {
      const ctx = this.ctx;
      const r = this.radius;

      ctx.clearRect(0, 0, this.size, this.size);
      ctx.save();
      ctx.translate(r, r);

      this.drawStraps(ctx, r);
      this.drawCase(ctx, r);
      this.drawBezel(ctx, r);
      this.drawDial(ctx, r);
      this.drawCelestialSubdial(ctx, r);
      this.drawDateAperture(ctx, r);
      this.drawIndices(ctx, r);
      this.drawHands(ctx, r);
      this.drawSapphireReflection(ctx, r);

      ctx.restore();
    }

    drawStraps(ctx, r) {
      const strapW = r * 0.58;
      const strapH = r * 1.05;

      [-1, 1].forEach(dir => {
        ctx.save();
        ctx.scale(1, dir);

        const grad = ctx.createLinearGradient(-strapW / 2, r * 0.72, strapW / 2, r * 0.72);
        if (this.finish === "rose-gold") {
          grad.addColorStop(0, "#1c1410"); grad.addColorStop(0.5, "#30221a"); grad.addColorStop(1, "#1c1410");
        } else if (this.finish === "obsidian") {
          grad.addColorStop(0, "#08090b"); grad.addColorStop(0.5, "#15171c"); grad.addColorStop(1, "#08090b");
        } else {
          grad.addColorStop(0, "#181412"); grad.addColorStop(0.2, "#2e241f"); grad.addColorStop(0.5, "#3e312a"); grad.addColorStop(0.8, "#2e241f"); grad.addColorStop(1, "#181412");
        }

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(-strapW / 2, r * 0.7, strapW, strapH, [0, 0, 16, 16]);
        ctx.fill();

        ctx.strokeStyle = "rgba(220, 190, 150, 0.4)";
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 6]);

        ctx.beginPath();
        ctx.moveTo(-strapW / 2 + 8, r * 0.72);
        ctx.lineTo(-strapW / 2 + 8, r * 0.7 + strapH);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(strapW / 2 - 8, r * 0.72);
        ctx.lineTo(strapW / 2 - 8, r * 0.7 + strapH);
        ctx.stroke();

        ctx.setLineDash([]);
        ctx.restore();
      });
    }

    drawCase(ctx, r) {
      const caseR = r * 0.88;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.65)";
      ctx.shadowBlur = 32;
      ctx.shadowOffsetY = 16;

      const grad = ctx.createLinearGradient(-caseR, -caseR, caseR, caseR);
      if (this.finish === "rose-gold") {
        grad.addColorStop(0, "#f3c7a5"); grad.addColorStop(0.25, "#d9976b"); grad.addColorStop(0.5, "#7b4831"); grad.addColorStop(0.75, "#e5ad85"); grad.addColorStop(1, "#9e6145");
      } else if (this.finish === "obsidian") {
        grad.addColorStop(0, "#3e424c"); grad.addColorStop(0.3, "#1a1d24"); grad.addColorStop(0.6, "#282d38"); grad.addColorStop(1, "#121318");
      } else if (this.finish === "bronze") {
        grad.addColorStop(0, "#d8ad69"); grad.addColorStop(0.35, "#8a6635"); grad.addColorStop(0.7, "#c19554"); grad.addColorStop(1, "#543e21");
      } else {
        grad.addColorStop(0, "#f6f8fa"); grad.addColorStop(0.2, "#cfd5dc"); grad.addColorStop(0.45, "#8b94a0"); grad.addColorStop(0.7, "#e4e8ec"); grad.addColorStop(0.9, "#a2abb6"); grad.addColorStop(1, "#ffffff");
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, caseR, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowColor = "transparent";

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

      ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
      for (let y = -crownH / 2 + 3; y < crownH / 2 - 2; y += 4) {
        ctx.fillRect(crownX + 2, y, crownW - 4, 1.5);
      }
      ctx.restore();
    }

    drawBezel(ctx, r) {
      const bezelOuter = r * 0.85;
      const bezelInner = r * 0.74;

      ctx.save();
      const bezelGrad = ctx.createRadialGradient(0, 0, bezelInner, 0, 0, bezelOuter);
      if (this.finish === "rose-gold") {
        bezelGrad.addColorStop(0, "#73422c"); bezelGrad.addColorStop(0.5, "#d6986e"); bezelGrad.addColorStop(1, "#8e5239");
      } else if (this.finish === "obsidian") {
        bezelGrad.addColorStop(0, "#151820"); bezelGrad.addColorStop(0.5, "#252b37"); bezelGrad.addColorStop(1, "#0d0f14");
      } else {
        bezelGrad.addColorStop(0, "#7f8894"); bezelGrad.addColorStop(0.3, "#e2e6eb"); bezelGrad.addColorStop(0.7, "#9da5b0"); bezelGrad.addColorStop(1, "#545b66");
      }

      ctx.fillStyle = bezelGrad;
      ctx.beginPath();
      ctx.arc(0, 0, bezelOuter, 0, Math.PI * 2);
      ctx.arc(0, 0, bezelInner, 0, Math.PI * 2, true);
      ctx.fill();

      ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
      ctx.lineWidth = 1.5;
      for (let i = 0; i < 60; i++) {
        const angle = (i / 60) * Math.PI * 2;
        const isMajor = i % 5 === 0;
        const startR = isMajor ? bezelInner + 3 : bezelInner + 6;
        const endR = bezelOuter - 4;
        ctx.beginPath();
        ctx.moveTo(Math.cos(angle) * startR, Math.sin(angle) * startR);
        ctx.lineTo(Math.cos(angle) * endR, Math.sin(angle) * endR);
        ctx.stroke();
      }
      ctx.restore();
    }

    drawDial(ctx, r) {
      const dialR = r * 0.74;
      ctx.save();

      const dialGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, dialR);
      if (this.finish === "rose-gold") {
        dialGrad.addColorStop(0, "#1f1816"); dialGrad.addColorStop(0.7, "#140e0c"); dialGrad.addColorStop(1, "#080605");
      } else if (this.finish === "obsidian") {
        dialGrad.addColorStop(0, "#161b24"); dialGrad.addColorStop(0.7, "#0c0e14"); dialGrad.addColorStop(1, "#040508");
      } else {
        dialGrad.addColorStop(0, "#132338"); dialGrad.addColorStop(0.65, "#0b1524"); dialGrad.addColorStop(0.95, "#060b13"); dialGrad.addColorStop(1, "#020407");
      }

      ctx.fillStyle = dialGrad;
      ctx.beginPath();
      ctx.arc(0, 0, dialR, 0, Math.PI * 2);
      ctx.fill();

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

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Brand: PHILL
      ctx.fillStyle = this.finish === "rose-gold" ? "#e5b18a" : "#cdd5e0";
      ctx.font = `700 ${r * 0.058}px "Cinzel", "Playfair Display", "Times New Roman", serif`;
      ctx.letterSpacing = "6px";
      ctx.fillText("PHILL", 0, -dialR * 0.38);

      ctx.font = `400 ${r * 0.024}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = "rgba(200, 215, 235, 0.55)";
      ctx.letterSpacing = "2px";
      ctx.fillText("GENÈVE", 0, -dialR * 0.28);
      ctx.fillText("CHRONOMETER", 0, -dialR * 0.21);

      ctx.font = `500 ${r * 0.02}px sans-serif`;
      ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
      ctx.fillText("SWISS   MADE", 0, dialR * 0.88);

      ctx.restore();
    }

    drawCelestialSubdial(ctx, r) {
      const dialR = r * 0.74;
      const subY = dialR * 0.38;
      const subR = dialR * 0.27;

      ctx.save();
      ctx.translate(0, subY);

      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, subR, 0, Math.PI * 2);
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, subR - 2, 0, Math.PI * 2);
      ctx.clip();

      ctx.save();
      ctx.rotate(this.handAngles.celestial);

      const skyGrad = ctx.createLinearGradient(0, -subR, 0, subR);
      skyGrad.addColorStop(0, "#1d5894");
      skyGrad.addColorStop(0.4, "#d8853b");
      skyGrad.addColorStop(0.6, "#15172d");
      skyGrad.addColorStop(1, "#04060f");
      ctx.fillStyle = skyGrad;
      ctx.fillRect(-subR, -subR, subR * 2, subR * 2);

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

      const moonY = subR * 0.55;
      const moonR = subR * 0.22;
      ctx.fillStyle = "#e8efff";
      ctx.beginPath();
      ctx.arc(0, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#0c0e18";
      ctx.beginPath();
      ctx.arc(moonR * 0.45, moonY - moonR * 0.1, moonR * 0.85, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      [[-subR * 0.4, moonY - 6], [subR * 0.4, moonY + 4], [-subR * 0.25, moonY + 10], [subR * 0.3, moonY - 10]].forEach(([sx, sy]) => {
        ctx.fillRect(sx, sy, 1.5, 1.5);
      });

      ctx.restore();
      ctx.restore();

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
      const dialR = r * 0.74;
      const dateX = dialR * 0.64;
      const dateW = r * 0.15;
      const dateH = r * 0.12;

      ctx.save();
      ctx.translate(dateX, 0);

      ctx.fillStyle = this.finish === "rose-gold" ? "#d4976c" : "#bdc5cf";
      ctx.beginPath();
      ctx.roundRect(-dateW / 2 - 2, -dateH / 2 - 2, dateW + 4, dateH + 4, 3);
      ctx.fill();

      ctx.fillStyle = "#f6f8fb";
      ctx.beginPath();
      ctx.roundRect(-dateW / 2, -dateH / 2, dateW, dateH, 2);
      ctx.fill();

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

          if (i === 15) {
            ctx.restore();
            continue;
          }

          ctx.fillStyle = this.finish === "rose-gold" ? "#e4a97f" : "#dce2ec";
          ctx.beginPath();
          ctx.roundRect(-markerW / 2, markerY, markerW, markerH, 2);
          ctx.fill();

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

      const lumeColor = this.lumeAmount > 0.05
        ? `rgba(60, 255, 190, ${0.5 + this.lumeAmount * 0.5})`
        : "rgba(255, 255, 255, 0.9)";

      const metalColor = this.finish === "rose-gold" ? "#e6ad85" : "#e4eaef";
      const darkMetalColor = this.finish === "rose-gold" ? "#885139" : "#69727d";

      // Hour Hand
      ctx.save();
      ctx.rotate(this.handAngles.hour);
      ctx.shadowColor = "rgba(0, 0, 0, 0.45)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetY = 4;

      const hrLen = dialR * 0.55;
      const hrW = r * 0.038;

      ctx.fillStyle = metalColor;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.06);
      ctx.lineTo(-hrW, 0);
      ctx.lineTo(0, -hrLen);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = darkMetalColor;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.06);
      ctx.lineTo(hrW, 0);
      ctx.lineTo(0, -hrLen);
      ctx.closePath();
      ctx.fill();

      if (this.lumeAmount > 0.1) {
        ctx.shadowColor = "#39ffb4";
        ctx.shadowBlur = 14 * this.lumeAmount;
      }
      ctx.fillStyle = lumeColor;
      ctx.fillRect(-hrW * 0.35, -hrLen * 0.8, hrW * 0.7, hrLen * 0.55);
      ctx.restore();

      // Minute Hand
      ctx.save();
      ctx.rotate(this.handAngles.minute);
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 6;

      const minLen = dialR * 0.82;
      const minW = r * 0.032;

      ctx.fillStyle = metalColor;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.06);
      ctx.lineTo(-minW, 0);
      ctx.lineTo(0, -minLen);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = darkMetalColor;
      ctx.beginPath();
      ctx.moveTo(0, r * 0.06);
      ctx.lineTo(minW, 0);
      ctx.lineTo(0, -minLen);
      ctx.closePath();
      ctx.fill();

      if (this.lumeAmount > 0.1) {
        ctx.shadowColor = "#39ffb4";
        ctx.shadowBlur = 14 * this.lumeAmount;
      }
      ctx.fillStyle = lumeColor;
      ctx.fillRect(-minW * 0.35, -minLen * 0.85, minW * 0.7, minLen * 0.65);
      ctx.restore();

      // Second Hand (Normal step motion)
      ctx.save();
      ctx.rotate(this.handAngles.second);
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)";
      ctx.shadowBlur = 12;
      ctx.shadowOffsetY = 8;

      const secLen = dialR * 0.92;
      const secTail = dialR * 0.28;

      ctx.strokeStyle = "#e63946";
      ctx.lineWidth = 1.8;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(0, secTail);
      ctx.lineTo(0, -secLen);
      ctx.stroke();

      ctx.fillStyle = "#e63946";
      ctx.beginPath();
      ctx.arc(0, secTail * 0.5, r * 0.024, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Center Pin
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
      const flareGrad = ctx.createLinearGradient(-dialR, -dialR, dialR, dialR);
      flareGrad.addColorStop(0, "rgba(255, 255, 255, 0.16)");
      flareGrad.addColorStop(0.3, "rgba(255, 255, 255, 0.04)");
      flareGrad.addColorStop(0.48, "rgba(255, 255, 255, 0)");
      flareGrad.addColorStop(0.52, "rgba(100, 180, 255, 0.06)");
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
  // 6. Application Orchestration
  // =========================================================================
  class WatchWorldApp {
    constructor() {
      this.searchForm = document.getElementById("search-form");
      this.searchInput = document.getElementById("search-input");
      this.suggestionsDropdown = document.getElementById("suggestions-dropdown");
      this.popularChips = document.querySelectorAll(".city-chip");

      this.heroStage = document.getElementById("hero-stage");
      this.watchWrapper = document.getElementById("watch-wrapper");
      this.globeWrapper = document.getElementById("globe-wrapper");
      this.watchCanvas = document.getElementById("watch-canvas");
      this.globeCanvas = document.getElementById("globe-canvas");
      this.globeTelemetryEl = document.getElementById("globe-telemetry");

      this.locationNameEl = document.getElementById("location-name");
      this.locationCountryEl = document.getElementById("location-country");
      this.digitalTimeEl = document.getElementById("digital-time");
      this.timePeriodEl = document.getElementById("time-period");
      this.timezoneBadgeEl = document.getElementById("timezone-badge");
      this.relativeTimeEl = document.getElementById("relative-time");
      this.solarStatusEl = document.getElementById("solar-status");
      this.coordsBadgeEl = document.getElementById("coords-badge");

      this.soundToggleBtn = document.getElementById("sound-toggle-btn");
      this.finishButtons = document.querySelectorAll(".finish-btn");
      this.viewModeButtons = document.querySelectorAll(".view-mode-btn");

      this.body = document.body;
      this.skyBackground = document.getElementById("sky-background");
      this.starsLayer = document.getElementById("stars-layer");
      this.sunMoonGlow = document.getElementById("sun-moon-glow");

      this.selectedCity = null;
      this.userHomeTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      this.currentViewMode = "cinema";
      this.isTransitioning = false;
      this.liveClockTimer = null;

      this.initEngines();
      this.generateStarfield();
      this.bindEvents();
      this.initDefaultLocation();
    }

    initEngines() {
      this.watch = new WatchEngine(this.watchCanvas, soundEngine);
      this.globe = new GlobeEngine(this.globeCanvas);

      this.globe.onLocationSelected = (lat, lng) => {
        soundEngine.init();
        const { city } = findNearestCity(lat, lng);
        if (city) {
          this.searchInput.value = city.name;
          this.selectLocation(city, true);
        }
      };
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

      // Submit search form (Universal Geocoder for Countries, Cities, Towns)
      this.searchForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        soundEngine.init();
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showSearchFeedback(`Locating "${query}" on globe...`);
        const resolved = await resolveAnyLocation(query);
        if (resolved) {
          this.suggestionsDropdown.classList.add("hidden");
          this.searchInput.value = resolved.name;
          this.selectLocation(resolved, true);
        } else {
          this.showSearchFeedback(`Could not locate "${query}". Try another country or town.`);
        }
        this.searchInput.blur();
      });

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

      this.soundToggleBtn.addEventListener("click", () => {
        const isSoundOn = soundEngine.toggleSound();
        this.soundToggleBtn.classList.toggle("muted", !isSoundOn);
        this.soundToggleBtn.setAttribute("aria-label", isSoundOn ? "Mute audio" : "Unmute audio");
        const icon = this.soundToggleBtn.querySelector(".sound-icon");
        if (icon) {
          icon.textContent = isSoundOn ? "🔊" : "🔇";
        }
      });

      this.finishButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          soundEngine.init();
          this.finishButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          const finish = btn.dataset.finish;
          this.watch.setFinish(finish);
        });
      });

      this.viewModeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
          this.viewModeButtons.forEach(b => b.classList.remove("active"));
          btn.classList.add("active");
          this.setViewMode(btn.dataset.mode);
        });
      });

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
            <span>Press <strong>Enter</strong> or click <strong>Find Time</strong> to search anywhere on Earth</span>
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
      const matchedCity = WORLD_CITIES.find(c => c.tz === this.userHomeTimezone) ||
                          WORLD_CITIES.find(c => c.name === "Tokyo");
      this.selectLocation(matchedCity, false);
    }

    setViewMode(mode) {
      this.currentViewMode = mode;
      this.heroStage.classList.toggle("split-view", mode === "split");
      this.heroStage.classList.toggle("cinema-view", mode === "cinema");

      if (mode === "split") {
        this.watchWrapper.style.transform = "";
        this.watchWrapper.style.opacity = "1";
        this.globeWrapper.style.transform = "";
        this.globeWrapper.style.opacity = "1";
      }
    }

    selectLocation(city, isUserTriggered = true) {
      this.selectedCity = city;
      const timeInfo = getTimeInfoForZone(city.tz);
      this.updateInfoCards(city, timeInfo);

      if (!isUserTriggered || this.currentViewMode === "split") {
        this.watch.setTime(timeInfo, true);
        this.globe.setPin(city.lat, city.lng);
        this.globe.flyTo(city.lat, city.lng, { duration: 1500, zoomIn: false });
        this.applyBackgroundTheme(timeInfo);
        this.startLiveClock();
        return;
      }

      if (this.isTransitioning) return;
      this.isTransitioning = true;

      // STEP 1: Wrist watch zooms in into view
      this.heroStage.classList.add("state-watch-zooming");
      soundEngine.playWindingEffect(1.6);

      setTimeout(() => {
        // STEP 2: Globe Emerges in FULL SCREEN & Spins to Destination
        this.heroStage.classList.remove("state-watch-zooming");
        this.heroStage.classList.add("state-globe-flying");

        if (this.globeTelemetryEl) {
          const latStr = `${Math.abs(city.lat).toFixed(1)}°${city.lat >= 0 ? "N" : "S"}`;
          const lngStr = `${Math.abs(city.lng).toFixed(1)}°${city.lng >= 0 ? "E" : "W"}`;
          this.globeTelemetryEl.innerHTML = `✦ TARGETING <strong>${city.flag} ${city.name.toUpperCase()}</strong> (${latStr}, ${lngStr}) • ROTATING GLOBE...`;
        }

        // Resize globe to fill the entire UI
        this.globe.resize();

        // 3D Globe spins around and dives in onto the exact location
        this.globe.flyTo(city.lat, city.lng, {
          duration: 2600,
          zoomIn: true,
          onArrival: () => {
            // STEP 3: Place is fully zoomed in -> Transition watch face back to tell the time!
            if (this.globeTelemetryEl) {
              this.globeTelemetryEl.innerHTML = `✦ <strong>${city.flag} ${city.name.toUpperCase()}</strong> REACHED • TRANSITIONING TIME...`;
            }

            this.heroStage.classList.remove("state-globe-flying");
            this.heroStage.classList.add("state-watch-reveal");

            this.watch.setTime(timeInfo, true);
            this.applyBackgroundTheme(timeInfo);

            setTimeout(() => {
              this.heroStage.classList.remove("state-watch-reveal");
              this.globe.resize();
              this.isTransitioning = false;
              this.startLiveClock();
            }, 1400);
          }
        });
      }, 450);
    }

    updateInfoCards(city, timeInfo) {
      if (this.locationNameEl) this.locationNameEl.textContent = `${city.flag} ${city.name}`;
      if (this.locationCountryEl) this.locationCountryEl.textContent = city.country;

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

    applyBackgroundTheme(timeInfo) {
      const theme = timeInfo.timeOfDay;
      this.body.classList.remove("theme-dawn", "theme-day", "theme-sunset", "theme-dusk", "theme-night");
      this.body.classList.add(`theme-${theme}`);

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

  window.addEventListener("DOMContentLoaded", () => {
    window.app = new WatchWorldApp();
  });
})();
