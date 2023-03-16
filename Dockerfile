FROM node:18.15-alpine

# Working Dir
WORKDIR /usr/src/app

# Copy package json files
COPY package*.json ./

# Install Prettier (For our package's build function)
RUN npm install prettier -g

# Install Files
RUN  npm install

# Copy Source Files
COPY  . .

# Build
RUN npm run build

# Expose the api port
EXPOSE 1337

CMD ["node", "build/server.js"]
