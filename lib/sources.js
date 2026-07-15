'use strict';

const { log, info, c } = require('./utils');
const { readConfig } = require('./config');

function sources(cwd) {
  const cfg = readConfig(cwd);
  if (!cfg || !Array.isArray(cfg.sources) || cfg.sources.length === 0) {
    info('nenhuma fonte vinculada. Use: conselho-academico link <caminho>');
    return;
  }
  log(c.bold('Fontes vinculadas:'));
  for (const s of cfg.sources) {
    log(`  ${c.green('•')} ${c.bold(s.name)} ${c.dim(`(${s.type})`)}`);
    log(`    ${c.dim(s.path)}`);
  }
}

module.exports = { sources };
