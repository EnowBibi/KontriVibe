// API Configuration with Dev/Prod Toggle

type Environment = "development" | "production";

// Toggle this to switch between dev and prod
const CURRENT_ENV: Environment =
  process.env.NODE_ENV === "production" ? "production" : "development";

const API_URLS = {
  development: "http://localhost:3001",
  production: "https://api.kontrivibe.com",
};

const API_CONFIG = {
  BASE_URL: API_URLS[CURRENT_ENV],
  ENVIRONMENT: CURRENT_ENV,
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

export default API_CONFIG;
