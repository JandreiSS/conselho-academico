'use strict';

const path = require('path');
const { exists, ok, error, warn, info, c } = require('./utils');
const { readConfig, writeConfig, hasConfig, defaultConfig } = require('./config');

/** Deduz o tipo da fonte a partir do caminho. */
function detectType(absPath) {
  try {
    const fs = require('fs');
    if (fs.statSync(absPath).isDirectory()) return 'projeto';
  } catch {
    /* caminho pode não existir ainda; segue pela extensão */
  }
  const ext = path.extname(absPath).toLowerCase();
  if (ext === '.pdf') return 'pdf';
  if (ext === '.tex') return 'latex';
  if (ext === '.md' || ext === '.txt' || ext === '') return 'texto';
  return 'texto';
}

function link(cwd, positionals, flags) {
  const target = positionals[0];
  if (!target) {
    error('informe o caminho da fonte: conselho-academico link <caminho>');
    process.exitCode = 1;
    return;
  }

  const absPath = path.resolve(cwd, target);
  if (!exists(absPath)) {
    warn(`o caminho não existe (ainda): ${c.dim(absPath)}`);
  }

  const type = flags.type || detectType(absPath);
  const name = flags.name || path.basename(absPath).replace(/\.[^.]+$/, '');

  let cfg = readConfig(cwd);
  if (!cfg) {
    if (!hasConfig(cwd)) {
      warn('conselho.config.json não encontrado — rode `conselho-academico install` primeiro.');
    }
    cfg = defaultConfig();
  }
  if (!Array.isArray(cfg.sources)) cfg.sources = [];

  const existing = cfg.sources.find((s) => s.path === absPath || s.name === name);
  if (existing) {
    existing.path = absPath;
    existing.type = type;
    existing.name = name;
    info(`fonte atualizada: ${c.bold(name)}`);
  } else {
    cfg.sources.push({ name, type, path: absPath });
    ok(`fonte vinculada: ${c.bold(name)} ${c.dim(`(${type})`)}`);
  }

  writeConfig(cwd, cfg);
  info(`${c.dim(absPath)}`);
}

module.exports = { link, detectType };
