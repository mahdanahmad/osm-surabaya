const _				= require('lodash');
const shp			= require('shapefile');
const async			= require('async');
const MongoDB		= require('mongodb');

const root			= 'data/';
const type			= 'points';
const shp_file		= root + type + '.shp';
const dbf_file		= root + type + '.dbf';

const DB_HOST		= 'localhost';
const DB_PORT		= '27017';
const DB_DATABASE	= 'osm-surabaya';
const DB_USERNAME	= '';
const DB_PASSWORD	= '';

const DB_COLL		= 'data';

const MongoClient	= MongoDB.MongoClient;
const ObjectID		= MongoDB.ObjectID;

const auth			= (DB_USERNAME !== '' || DB_PASSWORD !== '') ? DB_USERNAME + ':' + DB_PASSWORD + '@' : '';
const db_url		= 'mongodb://' + auth + DB_HOST + ':' + DB_PORT;

MongoClient.connect(db_url, { useNewUrlParser: true }, (err, client) => {
	if (err) throw err;
	let db	= client.db(DB_DATABASE);

	async.waterfall([
		(flowCallback) => {
			db.dropDatabase((err, result) => flowCallback(err));
		},
		(flowCallback) => {
			shp.read(shp_file, dbf_file).then((result) => flowCallback(null, result.features));
		},
		(data, flowCallback) => {
			db.collection(DB_COLL).insertMany(data, (err, result) => flowCallback(err))
		}
	], (err) => {
		if (err) throw err;
		client.close();
	});
});
