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
EXPOSE 3000

# Run application
CMD [ "npm", "start" ]