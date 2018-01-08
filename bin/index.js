#! /usr/bin/env node

const yargs = require('yargs');
const configManager = require('./config-manager');
const { buildImage, pushImage } = require('./docker');

yargs.usage('$0 command')
  .command('version', 'modify docker image version with option major|minor|patch', (yargs) => {}, (argv) => {
    let [_, level, name] = argv._;
    if (!level) {
      level = 'patch';
    }
    if (!name) {
      name = 'default';
    }
    if (['major', 'minor', 'patch'].indexOf(level) === -1) {
      throw new Error('version level must be one of major, minor, path.');
    }

    const semver = require('semver');
    configManager.load()
      .then((config) => {
        const imageConfig = config[name];
        if (!imageConfig) throw new Error(`Docker image with name '${name}' is not found. Please check your command or config file.`);

        const imageVersion = imageConfig.version;
        if (!imageVersion) throw new Error(`Docker image whic name '${name}'\'s version field is wrong. Please check your config file.`);
        const newVersion = semver.inc(imageVersion, level);
        imageConfig.version = newVersion;

        configManager.save(config);
        console.log(`Update version success! New version is ${newVersion}.`);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .command('build', 'build docker image from config file', (yargs) => {}, (argv) => {
    let [_, name] = argv._;
    if (!name) {
      name = 'default';
    }

    configManager.load()
      .then((config) => {
        const imageConfig = config[name];
        if (!imageConfig) throw new Error(`Docker image with name '${name}' is not found. Please check your command or config file.`);

        return buildImage(imageConfig);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .command('push', 'push docker image to docker hub', (yargs) => {}, (argv) => {
    let [_, name] = argv._;
    if (!name) {
      name = 'default';
    }

    configManager.load()
      .then((config) => {
        const imageConfig = config[name];
        if (!imageConfig) throw new Error(`Docker image with name '${name}' is not found. Please check your command or config file.`);

        return pushImage(imageConfig.imageName + ':' + imageConfig.version);
      })
      .catch((error) => {
        console.log(error);
      });
  })
  .demand(1, 'must provide a valid command')
  .help('h')
  .alias('h', 'help')
  .argv;
