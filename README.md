# What is this?

panic button and community report aplication.

# Contents

* backend - `./backend`
* web-app - `to do list`
* mobile-app - `to do list`

# How to use this?

* Make sure you have docker already installed.
* Open your terminal, use bash if you use windows.
* Run this command

  ```
  docker compose build
  docker compose up -d

  docker ps (to see active container)
  docker exec -it <container-name> sh (use shell inside container)
  ```
* Open your browser with URL `http://localhost:5000/v1/basic/healthcheck` for testing.
* If you see response json then you good to dev.
* Edit / add files under each folder that you need.
