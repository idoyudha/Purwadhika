FROM node:12

# Make app directory in docker
WORKDIR /usr/src/app 

# Copy dependancies app in docker
COPY package*.json ./

# Dependacies installation
RUN npm install 

# Copy app file
COPY . .

# Define port 
EXPOSE 2025

# Run application
CMD [ "node", "index.js" ]

# Build docker
# docker build --tag idoyudha/ikea:beta .