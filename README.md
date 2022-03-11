[![Build Status](https://travis-ci.com/JamesHMcKay/RiverGuide.svg?token=wyLJyy2MD7L7enqAG4LC&branch=master)](https://travis-ci.com/JamesHMcKay/RiverGuide)
[![CircleCI](https://circleci.com/gh/JamesHMcKay/RiverGuide.svg?style=svg&circle-token=e899ab26f2c1a9e84f967b1a278f2c1c6a5f8a24)](https://circleci.com/gh/JamesHMcKay/RiverGuide)

# RiverGuide

https://www.riverguide.co.nz/

The purpose of the RiverGuide is to provide the largest collection of guides for freshwater recreation in New Zealand, while also providing a single place to access flow, rainfall and other environmental data.  The RiverGuide is an evolving guide book for all of New Zealand's water related activities.

By allowing users to log trips we can find out just how valuable and popular freshwater recreation in New Zealand is. These insights help us to ensure our rivers are protected for future generations to enjoy.

## Live data

This application provides up to date and detailed information on New Zealand rivers.  This includes river flow, weather and descriptions.  Registered users can log their trips with automatically computed river flow information.

### Environmental data

The RiverGuide front-end uses flow and rainfall information from the RiverService (https://github.com/JamesHMcKay/RiverService), running at https://data.riverguide.co.nz/.

### User data and content

The RiverGuide uses a content management system located at https://api.riverguide.co.nz/. This manages all user content, metadata for the RiverService, guides and any other content.


## Contributing to the development of the RiverGuide

The RiverGuide is developed and maintained by volunteers and supported by White Water New Zealand.  If you are interested in contributing to the development of this application then please get in touch at riverguide@whitewater.nz.  We have a list of planned feature developments and improvements, and are welcome to new suggestions for ways to improve the RiverGuide.


## Reporting issues

Please report issues or bugs using the issues tab or send us a message.


## Local development enviornment

To run the RiverGuide in a local development environment download this repository and run the following commands

```shell
npm install
npm start
```

This will start a local server with the RiverGuide running at localhost:8000.

If you want to use alternative services for either the api.riverguide or data.riverguide services then change the relevant lines in the .env file in the root of this repository.

## Production environment

Docker is used for the production environment. We have a continuous integration process set up using GitLab from a mirror of this repository: https://gitlab.com/JamesHMcKay/RiverGuide. When a commit is made to master, the CI process on GitLab builds a docker a container and pushes to the Docker hub.

To ensure only intentional releases are made the last step of the process is manual. From the LightSail instance (AWS hosted cloud service) we simply run the docker-compose step to pull the latest version of the RiverGuide container and combine it with an Nginx server.

```bash
sudo docker-compose up -d
```

### Certifcate updates

Certificate updates are manually once every 90 days. In order to update the certificate the server must be temporarily shut down. The following commannds are used.

```bash
sudo docker-compose down
sudo certbot --standalone -d riverguide.co.nz -d www.riverguide.co.nz certonly
sudo docker-compose up -d
```
