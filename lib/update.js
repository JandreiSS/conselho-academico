'use strict';

const path = require('path');
const { exists, ok, info, warn, c } = require('./utils');
const { SKILLS_DIR } = require('./config');
const { install } = require('./install');

/**
 * Atualiza as skills recopiando a versão do pacote atualmente em execução.
 * Na prática reusa o install (que é idempotente e preserva materiais/config).
 */
function update(cwd) {
  if (!exists(path.join(cwd, SKILLS_DIR))) {
    warn('nada instalado aqui — rodando install do zero.');
  } else {
    info('atualizando skills do Conselho Acadêmico...');
  }
  install(cwd);
  ok(c.bold('atualizado.'));
}

module.exports = { update };
