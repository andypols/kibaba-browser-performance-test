export default {
  // What browserName should this data be associated with in the Kibana Dashboard?
  browserName: "Andy's Browser",

  // What is the index elastic endpoint for the index used by Kibana?
  // If you change this, you also need update the permissions in the manifest.json
  elasticIndexUrl: 'http://localhost:9200',

  // How frequent should the data be sent to Kibana?
  sendEveryMs: 1000
}