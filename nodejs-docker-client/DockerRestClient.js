const request = require('request');
var jsonPath = require('jsonpath');

function DockerRestClient(){

	this.getContainers = function(callback){

    request(process.env.DOCKERD_API_REST_BASE_URL+'/containers/json', { json: true }, (err, httpRes, body) => {
      if (err) {
				return callback(err,null);
			}

      var containers = [];

      for(key in body){
        var port = jsonPath.query(body[key],"$.Ports[0].PublicPort");
        containers.push({
          "name":body[key].Names[0].replace("/",""),
          "image":body[key].Image,
          "port":port
        });
      }
      callback(null,containers);
    });

	}

}


module.exports = DockerRestClient;
