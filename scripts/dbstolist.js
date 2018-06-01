require('dotenv').config();

const _				= require('lodash');
const fs			= require('fs');
const async			= require('async');
const MongoDB		= require('mongodb');

const DB_COLL		= 'data';

const MongoClient	= MongoDB.MongoClient;
const ObjectID		= MongoDB.ObjectID;

const auth			= (process.env.DB_USERNAME !== '' || process.env.DB_PASSWORD !== '') ? process.env.DB_USERNAME + ':' + process.env.DB_PASSWORD + '@' : '';
const db_url		= 'mongodb://' + auth + process.env.DB_HOST + ':' + process.env.DB_PORT;

const amenities		= ['restaurant','fast_food','cafe','bar','pub','nightclub'];
const tourism		= ['hotel','chalet','guest_house','hostel','motel'];

const file_dest		= 'results/filtered.json';

MongoClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
	if (err) throw err;
	let db	= client.db(process.env.DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			db.collection(DB_COLL).find({ '$or': [
				{ 'properties.amenity': { '$in': amenities } },
				{ 'properties.tourism': { '$in': tourism } },
			] }).toArray((err, result) => {
				if (err) { flowCallback(err); } else {
					fs.writeFile(file_dest, JSON.stringify(result.map((o) => ({ id: o.properties.osm_id, lon: o.geometry.coordinates[0], lat: o.geometry.coordinates[1], type: (o.properties.amenity || o.properties.tourism) }))), 'utf8', (err) => flowCallback(err));
				}
			})
		},
	], (err) => {
		if (err) throw err;
		client.close();
	});
});
