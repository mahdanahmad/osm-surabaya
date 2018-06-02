const _		= require('lodash');
const fs	= require('fs');
const csv	= require('fast-csv');

const file	= 'results/unique.json';
const out	= 'results/surabaya.csv';
const types	= ['restaurant','fast_food','cafe','bar','pub','nightclub', 'hotel','chalet','guest_house','hostel','motel'];

fs.readFile(file, 'utf8', (err, result) => {
	if (err) throw err;

	let data		= JSON.parse(result);
	let formatted	= _.chain(data).filter((o) => (_.includes(types, o.type))).map((o) => (_.assign({
		name: o.name,
		opening_hours: o.extratags.opening_hours || '',
		type: o.type
	}, _.omit(o.address, types)))).sortBy('type').value();

	csv
		.writeToPath(out, formatted, {headers: true})
		.on('finish', () => { console.log('done'); })
})
