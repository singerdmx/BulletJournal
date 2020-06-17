ARG ELK_VERSION

# https://www.docker.elastic.co/
FROM docker.elastic.co/logstash/logstash:7.6.0

# Add your logstash plugins setup here
# Example: RUN logstash-plugin install logstash-filter-json
COPY ./postgresql-42.2.12.jar /usr/share/logstash/logstash-core/lib/jars/postgresql.jar