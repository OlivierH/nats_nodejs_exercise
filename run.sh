docker rm -f $(docker ps -a -q)

gnome-terminal --  docker run --name nats -p 4222:4222 -ti nats:latest
