export default {
  // What browserName should this data be associated with in the Kibana Dashboard?
  browserName: "generic-browser",

  // What is the elastic endpoint for the index used by Kibana?
  // If you change this, you need to ensure this hostname appears in the manifest.json permissions
  elasticIndexUrl: 'http://localhost:9200',
}