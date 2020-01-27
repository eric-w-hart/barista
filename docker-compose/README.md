# Builing and Running Barista using docker

While you are free to buid and run Barista on your own, we find it easiest to use docker images to manage the process.  Using docker-compose, one can get a demo version of Barista up and running in a short time with very few changes.
This set of files are used to build the application with docker and to run the 5 major components.
- Postgres Database - stores the state of the application.
- Redis Server - a queue and ephemeral store for inter-server communication.
- barista-web - A web server (nginx) that presents the application to the user's browser and also performs as a reverse proxy for the browser to transact with the API server.
- barista-api - The main processing to manage the state of the application and service the users.
- barista-scan - The engine that takes care of scanning, building, and evaluating the software under test.


# Barista Source, Build, and Deploy files

This set of files are used to build the application with docker and to deploy the components via docker-compose.  There are a few steps necessary to build the image.
- Download the code from github.
   `git clone https://github.com/optum/Barista.git`
- Ensure [docker](https://docs.docker.com/install/) is running on your workstation or server.  Docker version 19.0.3 or greater is preferred, but anything over 18 should work.  (but has not been tested)
  - Be aware that RHEL and CentOs and others may ship earlier versions of docker and not be viable
- Ensure [docker-compose](https://docs.docker.com/compose/install/) is installed
- Run commands to replace symlinks with actual files.  (only needed if you do not use the pre-built docker images)

    `cd barista;
    rm -fr barista-scan/src/{models,services,shared}  ;
    cp -r barista-api/src/{models,services,shared} barista-scan/src;`
- check the settings in the file barista-compose.env .  Make modifications as necessary.  (Things like SMTP server, usernames and passwords for internal Git servers, personal access token for public github server if private repos are in play)
- Start the program using docker-compose, wait 6 minutes, then seed with basic data if you wish..

      - docker-compose -d  up ;
      - sleep 360 ;
      - docker-compose exec barista-api yarn db:reset:seed;
- You can watch logs using "docker logs" command
- log into the barista service at http://your_servername/signin (default username is Admin, password is $barista@admin, all case sensitive)
- Add a project and initiate a scan.  There should be some projects already defined under "Organization"
