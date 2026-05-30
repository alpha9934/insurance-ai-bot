# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies (using legacy-peer-deps for your Next.js 15/Tailwind setup)
RUN npm install --legacy-peer-deps

# Copy the rest of the frontend code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose the UI port
EXPOSE 3000

# Start the Next.js production server
CMD ["npm", "run", "start"]