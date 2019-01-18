# couchdb-blazegraph-sync

Keep a CouchDB database and a BlazeGraph namespace in sync.
> /!\ DO NOT USE FOR LOADING A FULL DATABASE (load by directly sending a dump to BlazeGraph instead)

## Summary

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Install](#install)
- [Add config](#add-config)
- [Set last seq](#set-last-seq)
- [Start](#start)
- [Add to systemd](#add-to-systemd)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Install
```sh
git clone https://github.com/maxlath/couchdb-blazegraph-sync
cd couchdb-blazegraph-sync
npm install --production
```

## Add config
```sh
cp ./configs/example.js ./configs/my_db.js
```
Then customize `./configs/my_db` to your needs

## Set last seq
The sync will restart from the last known seq, which is persisted in a file per database: `./data/my_db.last_seq`

**This tool isn't designed to load a full database**, rather to keep up with the changes, so first make sure you to import a dump directly

```sh
# Use your serializer to generate a dump of your CouchDB database, this is out of the scope of this tool
curl http://my-blazegraph:8080/bigdata/namespace/kb/dataloader -H 'Content-Type: application/x-turtle' -d@./my_db.ttl
# Set the current last seq
curl "http://username:password@localhost:5984/my_db" | jq '.update_seq' > ./data/my_db.last_seq
```

## Start
```sh
npm start
```

## Add to systemd
```sh
# From the project root, assumes that you need sudo rights
npm run add-to-systemd
# Start the process
sudo systemctl start couchdb-blazegraph-sync
# Start following the logs
journalctl -fan 100 -u couchdb-blazegraph-sync
```

## License
[AGPL-3.0](https://www.gnu.org/licenses/agpl-3.0.en.html)
