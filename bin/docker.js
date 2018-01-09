const format = require('util').format;
const spawn = require('child_process').spawn;
const path = require('path');

const build = function(tag, workingPath, file) {
  var dockerfilePath = path.join(workingPath, file || './Dockerfile')
  var args = [workingPath, '-f', dockerfilePath, '-t', tag];
  return exec('build', args);
};

const exec = function(command, args) {
  return new Promise(function (resolve, reject) {
    const cmd = 'docker';
    const fullArgs = [command].concat(args || []);
    const pid = spawn(cmd, fullArgs);
    let hasError = false;
    const errorMsgs = [];
    pid.stdout.on('data', function (data) {
      console.log(data.toString());
    });
    pid.stderr.on('data', function (data) {
      const msg = data.toString();
      console.log(msg);
      errorMsgs.push(msg);
      hasError = true;
    });
    pid.on('close', function (code) {
      if (code !== 0 || hasError) {
        const error = new Error(format("docker command '%s', failed with\n %s", command, errorMsgs.join('\n')));
        error.command = command;
        error.args = args;
        error.output = errorMsgs;
        error.code = code;
        reject(error);
      } else {
        resolve();
      }
    });
  })
};

exports.buildImage = function(config = {}) {
  let { file, workDir } = config;
  if (!file) {
    file = 'Dockerfile';
  }
  if (!workDir) {
    workDir = path.dirname(file);
  }
  return build(config.imageName + ':' + config.version, path.resolve(workDir), config.file);
};

exports.pushImage = function (image) {
  return exec('push', image);
};
