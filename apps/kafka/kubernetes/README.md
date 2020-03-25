https://github.com/d1egoaz/minikube-kafka-cluster

https://argus-sec.com/external-communication-with-apache-kafka-deployed-in-kubernetes-cluster/

- `minikube start`
- `kubectl apply -f 0-namespace.yaml`
- `kubectl apply -f 1-zookeeper.yaml`
- `kubectl apply -f 2-kafka.yaml`
- `kubectl apply -f 3-kafka-manager.yaml`

- `kubectl -n kafka-ca1 get all`
- `kubectl -n kafka-ca1 describe pods/kafka-manager-6d7c4679-m9q8j`
- `minikube service -n kafka-ca1 kafka-manager --url` // Get URL to kafka-manager (CMAK)
