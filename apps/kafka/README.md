## Kafka

https://wurstmeister.github.io/kafka-docker/
https://medium.com/big-data-engineering/hello-kafka-world-the-complete-guide-to-kafka-with-docker-and-python-f788e2588cfc

https://github.com/obsidiandynamics/kafdrop

https://github.com/bitnami/bitnami-docker-kafka
https://rmoff.net/2018/08/02/kafka-listeners-explained/

- set docker host ip (docker0) in `docker-compose.yml` (e.g. 172.17.0.1, check with
  `ip add | grep docker0`)
- Start kafka: `sudo docker-compose up` or `sudo docker-compose up --scale kafka=2`
- Check running processes: `sudo docker-compose ps`
- Stop kafka evironment: `sudo docker-compose stop`
- Access Kafdrop: http://localhost:9000/
- Clean up docker: `sudo docker system prune`
  - E.g. if Kafdrop can't start
- Stop all containers: `sudo docker stop $(sudo docker ps -a -q)`
- Remove all containers and volumes: `sudo docker rm -v $(sudo docker ps -a -q)`
