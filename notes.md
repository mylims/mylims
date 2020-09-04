# Start LDAP
docker run --rm --name openldap -p 1389:1389 -p 1636:1636 bitnami/openldap:latest