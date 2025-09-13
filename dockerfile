FROM node:18-alpine

# WORKDIR sets the current working directory inside the container for all following instructions (RUN, CMD, COPY, etc.).
# fter you set WORKDIR, all subsequent RUN commands (and also CMD, ENTRYPOINT, COPY, ADD) are executed relative to that directory.
# If you set multiple WORKDIRs, each one overrides the previous one
WORKDIR /app

COPY  package.json package-lock.json ./

RUN     npm install ./

#  copy all the files to the current workdir of the container from this directory
COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm" , "run" , "dev"]


# after writing teh dockerIFle run  command docker build -t <imageName > . the final dot represents the curren fils is the context from which teh docker
# filemust be refrenced 