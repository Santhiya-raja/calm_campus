// client/src/api/config.js

// This uses the Vercel environment variable in production, 
// and falls back to your Render URL so it works everywhere!
export const NODE_API_URL = import.meta.env.VITE_API_URL || "https://calm-campus-server.onrender.com/api";

export const AI_SERVICE_URL = "https://calm-campus-ai.onrender.com";