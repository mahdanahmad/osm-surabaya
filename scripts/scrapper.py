import json, requests

from time import sleep

base	= 'https://nominatim.openstreetmap.org/reverse'
params	= { 'format': 'jsonv2', 'extratags': 1, 'namedetails': 1, 'osm_id': '', 'lon': '', 'lat': '' }

file	= 'results/filtered.json'
out		= 'results/raw.json'

# results	= {}
results	= []

def getData(osm_id, lon, lat):
	params['osm_id']	= osm_id
	params['lon']		= lon
	params['lat']		= lat

	try:
		r = requests.get(base, params=params)
		sleep(1.5)

		return r.json()
	except Exception as e:
		return []


def run():
	with open(file) as af: data = json.load(af)

	total	= len(data)
	for idx, row in enumerate(data):
		# if row['type'] not in results.keys(): results[row['type']] = []
		print '{}/{}'.format(idx + 1, total)
		results.append(getData(row['id'], row['lon'], row['lat']))

	print "done"
	with open(out, 'w') as af: json.dump(results, af)

if __name__ == "__main__":
	run()
