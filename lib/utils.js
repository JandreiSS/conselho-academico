'use strict';

/**
 * Utilitários compartilhados do CLI do Conselho Acadêmico.
 * Sem dependências externas — apenas a biblioteca padrão do Node (>=18).
 */

const fs = require('fs');
const path = require('path');

// Cores ANSI simples (desligadas se a saída não for um TTY).
const useColor = process.stdout.isTTY && !process.env.NO_COLOR;
const paint = (code, s) => (useColor ? `\x1b[${code}m${s}\x1b[0m` : s);

const c = {
  bold: (s) => paint('1', s),
  dim: (s) => paint('2', s),
  green: (s) => paint('32', s),
  yellow: (s) => paint('33', s),
  blue: (s) => paint('36', s),
  red: (s) => paint('31', s),
};

function log(msg = '') {
  process.stdout.write(msg + '\n');
}

function info(msg) {
  log(`${c.blue('›')} ${msg}`);
}

function ok(msg) {
  log(`${c.green('✓')} ${msg}`);
}

function warn(msg) {
  log(`${c.yellow('!')} ${msg}`);
}

function error(msg) {
  process.stderr.write(`${c.red('✗')} ${msg}\n`);
}

/** Garante que um diretório exista (recursivo). */
function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

/** Copia um diretório recursivamente. Cria o destino se necessário. */
function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(from, to);
    } else if (entry.isFile()) {
      fs.copyFileSync(from, to);
    }
  }
}

/** Remove um caminho (arquivo ou diretório) se existir. */
function removePath(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

function exists(p) {
  return fs.existsSync(p);
}

function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeJson(file, data) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n');
}

/** Raiz do pacote (onde estão agents/, templates/…). */
function packageRoot() {
  return path.resolve(__dirname, '..');
}

/**
 * Insere ou atualiza um bloco gerenciado dentro de um arquivo de texto,
 * delimitado por marcadores. Preserva o conteúdo do usuário fora do bloco.
 */
function upsertManagedBlock(file, startMarker, endMarker, block) {
  const managed = `${startMarker}\n${block}\n${endMarker}`;
  let content = exists(file) ? fs.readFileSync(file, 'utf8') : '';
  const start = content.indexOf(startMarker);
  const end = content.indexOf(endMarker);
  if (start !== -1 && end !== -1 && end > start) {
    content =
      content.slice(0, start) + managed + content.slice(end + endMarker.length);
  } else {
    content = content.trimEnd();
    content = (content ? content + '\n\n' : '') + managed + '\n';
  }
  fs.writeFileSync(file, content);
}

/** Converte um texto em slug seguro para nome de pasta. */
function slugify(text) {
  return String(text)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'material';
}

/** Parser mínimo de flags: --nome valor | --nome=valor | --flag. */
function parseFlags(args) {
  const flags = {};
  const positionals = [];
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a.startsWith('--')) {
      const eq = a.indexOf('=');
      if (eq !== -1) {
        flags[a.slice(2, eq)] = a.slice(eq + 1);
      } else {
        const next = args[i + 1];
        if (next && !next.startsWith('--')) {
          flags[a.slice(2)] = next;
          i++;
        } else {
          flags[a.slice(2)] = true;
        }
      }
    } else {
      positionals.push(a);
    }
  }
  return { flags, positionals };
}

module.exports = {
  c,
  log,
  info,
  ok,
  warn,
  error,
  ensureDir,
  copyDir,
  removePath,
  exists,
  readJson,
  writeJson,
  packageRoot,
  upsertManagedBlock,
  slugify,
  parseFlags,
};
