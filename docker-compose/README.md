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
- Download the code from github.  (git pull ...)
- Ensure docker is running on your workstation or server.  Docker version 19.0.3 is preferred, but anything over 18 should work.  (but has not been tested)
- Ensure docker-compose is installed
- Run commands to replace symlinks with actual files.  (only needed if you do not use the pre-built docker images)
  - cd barista && rm -fr barista-scan/src/{models,services,shared} && cp -r barista-api/src/{models,services,shared} barista-scan/src
- fdsfds
-


The
process for creating object is openshift is to process the templates using the Jenkins groovy workflows along with some manual steps to build the docker base images.  Before attempting this complex build, you should be familiar with Docker builds from the command line.

## Organization of the GitHub
This repository only hosts the files for building and deploying the production and non-production versions of Barista, an Optum developed open source governance tool.  The barista directory is actually a git submodule that references the [public repo](https://github.com/optum/barista) hosting the Barista code.

The folder cicd is where you will find all the YAML files for OpenShift (and eventually Kubernetes) and the Jenkinsfiles for the CICD work.

The branches are used as follows...
- master - not really used as the default branch.  (**protected**)
- develop - the default brance for integrtion testing of new code (**protected**)
- feature/* - branches made by developers to make changes to code
In order for the Jenkins deployments to work properly, there must be matching branches in both this and the submodule repository.  If those are in place, the right things happen.

Inside the submodule (Barista source code) there are directories for each of the functions, Web, API, and Scan.  Each of those has one or more Dockerfile used to build the images.  (Author should learn to use docker layered images....)

- Dockerfile-base - This image is used as a base image for all the others.  It inherits from node:10.16.0 and sets up npm and yarn, as well as install java, update the CACerts to include Optum specific certs.  This file is built manually and tagged with the date it was built.
- Dockerfile - This would be used in each of the program directories and will build the corresponding docker images for web, api, and scan functions.
- Dockerfile-scanbase - This is a file that is used as an additional base for building the scan image, as the mono and maven installs can take quite a bit of time and do not change often.  This image is built manually on the command line per instructions in the Dockerfile-scanbase file itself.

![Docker-Lineage](docs/images/Docker-Lineage.png)

## Secrets

Each environment (develop, feature, etc) needs to have a set of secrets object created that define specific items such as database server, github accounts etc.  These are unique to each environment and are not stored in GitHub for obvious reasons. The name of the secrets files are thus...
- barista-server-${ENVIRONMENT}  //database, etc, per environment
- maven-secrets-conf // Used to allow maven to access artifactory

## Configmaps
Configmaps are used in OKD and K8s to set up configuration files via templates.  These are specific to the implementation (aka customer) but are not necessarily sensitive.
- configmap barista-ldap-configs // defines the domain Servers
- configmap barista-web-${ENVIRONMENT} // has specific settins for the web server

## Jenkins
Deploying the application to OKD is managed completely by Jenkins.  There are several workflows built that leverage the JPAC pipeline services and the Openshift and git plugins.   These are organized thus...
- Jenkins instance is [here](https://jenkins-barista-development.ocp-ctc-core-nonprod.optum.com/)
- The Barista Utilities folder has workflows for deploying different application components that are more infrequent.
  -   The Barista Services and Barista-Redis jobs create
  Services and Redis instances for each of the environments.
  - The Postgres job can be run if a temporary PostgreSQL database is needed.  The standard environments have a dedicated postgres server.
  - Barista-prod-deploy job is used to manage production releases.  To use it, a release must be defined in GHE, which will show up under the tags tab.  Running the job for a relase will build all modules and destroy and re-create the entire productin environment.  There is about a 10 minute outage while Openshift starts the new pods.  Budget up to an hour to run and test the complete production release process.
  - Barista-ResetDB job will destroy the database of an environment and create the base tables.  This should not hardly ever be used, but there was a time....
- [Barista Core Items](https://jenkins-barista-development.ocp-ctc-core-nonprod.optum.com/job/Barista%20Core%20Items/) folder has the build jobs for the WEB, SCAN, and API servers for each of the enviroments.  The jobs are multibranch pipelines that discover branches with specific names.  There is no limit to the number of development environments other that resources in Openshift.

## Monitoring

### Log Monitoring
OKD has a nice feature where log files for the current and previously run pods are captured and viewable in [Kibana](https://kibana.ocp-ctc-core-nonprod.optum.com/app/kibana)

### APM Monitoring
An initial try to generate APM data is located in a shared [Elastic APM](https://elastic-apm-kibana-nonprod-elr.uhc.com/s/kibana_apace_readonly/app/apm#/services/Barista-Open-Source-Tracker_UHGWM110-020972/transactions?rangeFrom=now-24h&rangeTo=now&refreshPaused=true&refreshInterval=0&transactionType=request) instance.
