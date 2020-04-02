const DockerRestClient = require('./docker/DockerRestClient.js');
var dockerRestClient = new DockerRestClient();

dockerRestClient.getContainers(function(errContainers, containers) {
  containers.forEach(function(container) {
    logger.info(container.name + " container was found");
    applicationRepository.findByName(container.name, function(errFindByName, rows) {

      if (errFindByName) {
        logger.info("Error:" + errFindByName);
        return;
      }

      if (rows.length == 0) {
        logger.info(container.name + " app was not found. App will be register as docker application in db");
        applicationRepository.save({
          name: container.name,
          type: "D",
          deleted: "N"
        }, function(errSave, result) {
          if (errSave) {
            logger.info("An error occurred when registering the application:" + container.name)
            logger.info(errSave)
          } else {
            logger.info(container.name + "was registered successfully.")
          }
        });
      } else {
        logger.info(container.name + " is already registered");
      }
    });
  });
});
