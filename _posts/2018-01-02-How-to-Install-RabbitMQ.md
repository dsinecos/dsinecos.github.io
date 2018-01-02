---
layout: post
title:  "How to install RabbitMQ on Ubuntu 16.04?"
categories: howto
---

### 1. Updating our system's default application toolset
   
   - `sudo apt-get update`
   
   - `sudo apt-get -y upgrade`

### 2. Install Erlang
   
   1. The following commands are used to add Erland apt repository on to your system
      
      - `wget https://packages.erlang-solutions.com/erlang-solutions_1.0_all.deb`
      
      - `sudo dpkg -i erlang-solutions_1.0_all.deb`

   2. Install erlang package on your system using the following command. This will install all of its dependencies as well
      
      - `sudo apt-get update`
      
      - `sudo apt-get install erlang`

### 3. Install RabbitMQ Server

   1. To add the APT repository to your `/etc/apt/sources.list.d`:

      - `echo 'deb http://www.rabbitmq.com/debian/ testing main' | sudo tee /etc/apt/sources.list.d/rabbitmq.list`

   2. To avoid warnings about unsigned packages, add our [public key](https://www.rabbitmq.com/rabbitmq-release-signing-key.asc) to your trusted key list using apt-key(8)
      
      - `wget -O- https://www.rabbitmq.com/rabbitmq-release-signing-key.asc | sudo apt-key add -`

   3. Run the following command to update the package list:

      - `sudo apt-get update`

   4. Install rabbitmq-server package:

      - `sudo apt-get install rabbitmq-server`

### 4. Start, Stop, Restart and check Status of RabbitMQ server

   1. To start the service:

      - `service rabbitmq-server start`

   2. To stop the service:

      - `service rabbitmq-server stop`

   3. To restart the service:

      - `service rabbitmq-server restart`

   4. To check the status of the service:

      - `service rabbitmq-server status`

### 5. Enabling the management console

   1. `sudo rabbitmq-plugins enable rabbitmq_management`

   2. RabbitMQ dashboard starts on port 15672. Access your server on the port to get dashboard `http://localhost:15672/`

### 6. Create Admin/User in RabbitMQ

   1. By default rabbitmq creates a user named “guest” with password “guest”. 

   2. `sudo rabbitmqctl add_user admin password` Change password with your own password

   3. `sudo rabbitmqctl set_user_tags admin administrator`

   4. `sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*" `