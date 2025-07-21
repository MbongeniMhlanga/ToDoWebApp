#Uses the official Node.js version 22 image as the base image.
##This image includes Node.js and npm preinstalled, which are needed to run my app.
FROM node:22

#Setting the working directory inside the container to /app.
WORKDIR /app

# copying the package.json file from the files to the container 
COPY package*.json ./

# Installing all Node.js dependencies specified in package.json and creates a node_modules folder inside the container
RUN npm install

##  Copying the rest of the app's source code into the container
COPY . .

## Tells Docker that this container will listen on port 2001,my port i declared in the backend.
EXPOSE 2001

##It tells Docker to use the Node.js runtime to execute the server file
CMD ["node", "server.js"]
