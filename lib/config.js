'use strict';

/**
 * Leitura e escrita do conselho.config.json na raiz da instalação (a pasta
 * onde o usuário rodou `conselho-academico install`).
 */

const path = require('path');
const { readJson, writeJson, exists } = require('./utils');

const CONFIG_NAME = 'conselho.config.json';
const SKILLS_DIR = path.join('.claude', 'skills');
const MATERIAIS_DIR = 'materiais';

function configPath(cwd) {
  return path.join(cwd, CONFIG_NAME);
}

function defaultConfig() {
  return {
    version: 1,
    createdAt: new Date().toISOString(),
    materiaisDir: MATERIAIS_DIR,
    sources: [],
  };
}

function readConfig(cwd) {
  return readJson(configPath(cwd), null);
}

function writeConfig(cwd, cfg) {
  writeJson(configPath(cwd), cfg);
}

function hasConfig(cwd) {
  return exists(configPath(cwd));
}

module.exports = {
  CONFIG_NAME,
  SKILLS_DIR,
  MATERIAIS_DIR,
  configPath,
  defaultConfig,
  readConfig,
  writeConfig,
  hasConfig,
};
