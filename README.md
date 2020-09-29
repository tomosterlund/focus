# Focusapp - how to run it
## config files
In a config.json file in the root folder, AWS security credentials are needed.
An example of how to format this is found in config.example.json

In .env, Mongo DB connection string is needed. In react-views/.env, a link to S3 bucket resources is needed.
The former for connecting to database, the latter for showing resources updated by users to AWS S3.

## install dependencies

Run *npm i* in root- and then in react-views directories respectively.

## run application

Run *npm run dev* in root directory to run application