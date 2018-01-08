const yaml = require('js-yaml');

const parse = function(source) {
  return yaml.load(source);
};

const fs = require('fs');
const path = require('path');
const CONFIG_FILE_NAME = 'dis_config.yml';
const { promisify } = require('util');
const exists = promisify(fs.exists);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

exports.load = function() {
  const absolutePath = path.join(process.cwd(), CONFIG_FILE_NAME);
  return exists(absolutePath)
    .then((isExists) => {
      if (isExists) {
        return readFile(absolutePath);
      } else {
        throw new Error('"dis_config.yml" is not found in current working directory.');
      }
    })
    .then((content) => {
      return parse(content);
    });
};

exports.save = function(config) {
  const absolutePath = path.join(process.cwd(), CONFIG_FILE_NAME);
  return exists(absolutePath)
    .then((isExists) => {
      if (isExists) {
        const content = yaml.safeDump(config);
        return writeFile(absolutePath, content);
      } else {
        throw new Error('"dis_config.yml" is not found in current working directory.');
      }
    });
};
