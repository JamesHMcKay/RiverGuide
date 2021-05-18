[![Build Status](https://travis-ci.com/JamesHMcKay/RiverGuide.svg?token=wyLJyy2MD7L7enqAG4LC&branch=master)](https://travis-ci.com/JamesHMcKay/RiverGuide)
[![CircleCI](https://circleci.com/gh/JamesHMcKay/RiverGuide.svg?style=svg&circle-token=e899ab26f2c1a9e84f967b1a278f2c1c6a5f8a24)](https://circleci.com/gh/JamesHMcKay/RiverGuide)

# RiverGuide

https://www.riverguide.co.nz/

The purpose of the RiverGuide is to provide the largest collection of guides for freshwater recreation in New Zealand, while also providing a single place to access flow, rainfall and other environmental data.  The RiverGuide is an evolving guide book for all of New Zealand's water related activities.

By allowing users to log trips we can find out just how valuable and popular freshwater recreation in New Zealand is. These insights help us to ensure our rivers are protected for future generations to enjoy.

## Live data

This application provides up to date and detailed information on New Zealand rivers.  This includes river flow, weather and descriptions.  Registered users can log their trips with automatically computed river flow information.

The RiverGuide front-end uses flow information from the RiverService (https://github.com/JamesHMcKay/RiverService), running at https://www.openriverdata.com.


## Contributing to the development of the RiverGuide

The RiverGuide is developed and maintained by volunteers and supported by White Water New Zealand.  If you are interested in contributing to the development of this application then please get in touch at riverguide@whitewater.nz.  We have a list of planned feature developments and improvements, and are welcome to new suggestions for ways to improve the RiverGuide.

## Reporting issues

Please report issues or bugs using the issues tab or send us a message.

## Deployment and certifcate updates

sudo docker-compose down
sudo certbot --standalone -d riverguide.co.nz -d www.riverguide.co.nz certonly
sudo docker-compose up -d
