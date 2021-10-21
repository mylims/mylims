until mongo --host mongo --eval "print(\"waited for connection\")"; do
  sleep 1
done

// you can add more MongoDB waits here

echo "Adding user to MongoDB..."
mongo --host mongo --eval "rs.initiate({ _id: \"rs0\", members: [{ _id: 0, host: \"127.0.0.1:27017\" }] })"
echo "User added."
