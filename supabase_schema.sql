-- ============================================================
-- JEOS Sistemas — Schema Supabase
-- Execute este script no SQL Editor do Supabase (Query → Run)
-- ============================================================

-- ============================================================
-- TABELAS PÚBLICAS (site / conteúdo)
-- ============================================================

CREATE TABLE site_content (
  id         SERIAL PRIMARY KEY,
  campo      TEXT NOT NULL UNIQUE,
  valor      TEXT NOT NULL DEFAULT ''
);

CREATE TABLE solucoes (
  id          TEXT PRIMARY KEY,
  icone       TEXT NOT NULL DEFAULT 'Package',
  title       TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  image       TEXT NOT NULL DEFAULT '',
  url         TEXT NOT NULL DEFAULT '',
  features    JSONB NOT NULL DEFAULT '[]',
  ordem       INT  NOT NULL DEFAULT 0
);

CREATE TABLE stats (
  id        TEXT PRIMARY KEY,
  valor     TEXT NOT NULL,
  descricao TEXT NOT NULL,
  icone     TEXT NOT NULL DEFAULT 'Award',
  ativo     BOOLEAN NOT NULL DEFAULT TRUE,
  ordem     INT     NOT NULL DEFAULT 0
);

CREATE TABLE clientes (
  id     SERIAL PRIMARY KEY,
  name   TEXT NOT NULL,
  estado TEXT,
  logo   TEXT NOT NULL DEFAULT '',
  ordem  INT  NOT NULL DEFAULT 0
);

CREATE TABLE depoimentos (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT '',
  city        TEXT NOT NULL DEFAULT '',
  testimonial TEXT NOT NULL DEFAULT '',
  photo       TEXT NOT NULL DEFAULT '',
  ordem       INT  NOT NULL DEFAULT 0
);

CREATE TABLE certidoes (
  id           SERIAL PRIMARY KEY,
  titulo       TEXT NOT NULL,
  validade     TEXT NOT NULL DEFAULT '',
  tipo         TEXT NOT NULL DEFAULT '',
  arquivo      TEXT NOT NULL DEFAULT '',
  data_emissao TEXT NOT NULL DEFAULT '',
  ordem        INT  NOT NULL DEFAULT 0
);

CREATE TABLE blog_posts (
  id        TEXT PRIMARY KEY,
  titulo    TEXT NOT NULL,
  resumo    TEXT NOT NULL DEFAULT '',
  conteudo  TEXT NOT NULL DEFAULT '',
  imagem    TEXT NOT NULL DEFAULT '',
  autor     TEXT NOT NULL DEFAULT 'Equipe JEOS',
  data      TEXT NOT NULL DEFAULT '',
  categoria TEXT NOT NULL DEFAULT '',
  criado_em TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABELAS DE CLIENTES (entidades, secretarias, usuários)
-- ============================================================

CREATE TABLE entidades (
  id          TEXT PRIMARY KEY,
  nome        TEXT NOT NULL,
  tipo        TEXT NOT NULL DEFAULT '',
  cidade      TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  cnpj        TEXT NOT NULL DEFAULT '',
  telefone    TEXT NOT NULL DEFAULT '',
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE secretarias (
  id          TEXT PRIMARY KEY,
  entidade_id TEXT NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  nome        TEXT NOT NULL,
  cnpj        TEXT NOT NULL DEFAULT '',
  responsavel TEXT NOT NULL DEFAULT '',
  cargo       TEXT NOT NULL DEFAULT '',
  telefone    TEXT NOT NULL DEFAULT '',
  foto        TEXT NOT NULL DEFAULT '',
  ativo       BOOLEAN NOT NULL DEFAULT TRUE,
  criado_em   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE client_users (
  id            TEXT PRIMARY KEY,
  nome          TEXT NOT NULL,
  login         TEXT NOT NULL UNIQUE,
  senha         TEXT NOT NULL,
  entidade_id   TEXT NOT NULL REFERENCES entidades(id) ON DELETE CASCADE,
  secretaria_id TEXT NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  cargo         TEXT NOT NULL DEFAULT '',
  telefone      TEXT NOT NULL DEFAULT '',
  foto          TEXT NOT NULL DEFAULT '',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sistemas_contratados (
  id            SERIAL PRIMARY KEY,
  secretaria_id TEXT NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  nome          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'Ativo',
  data_inicio   TEXT NOT NULL DEFAULT ''
);

CREATE TABLE contratos (
  id                        TEXT PRIMARY KEY,
  secretaria_id             TEXT NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  numero                    TEXT NOT NULL DEFAULT '',
  objeto                    TEXT NOT NULL DEFAULT '',
  numero_licitacao          TEXT NOT NULL DEFAULT '',
  data_inicial              TEXT NOT NULL DEFAULT '',
  data_encerramento         TEXT NOT NULL DEFAULT '',
  valor_mensal              TEXT NOT NULL DEFAULT '',
  quantidade_meses          TEXT NOT NULL DEFAULT '',
  arquivo                   TEXT NOT NULL DEFAULT '',
  artigo                    TEXT,
  data_encerramento_original TEXT,
  valor_mensal_original     TEXT,
  criado_em                 TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE aditivos (
  id                TEXT PRIMARY KEY,
  contrato_id       TEXT NOT NULL REFERENCES contratos(id) ON DELETE CASCADE,
  numero            TEXT NOT NULL DEFAULT '',
  objeto            TEXT NOT NULL DEFAULT '',
  tipos             JSONB NOT NULL DEFAULT '[]',
  data_inicial      TEXT NOT NULL DEFAULT '',
  data_encerramento TEXT NOT NULL DEFAULT '',
  novo_valor_mensal TEXT NOT NULL DEFAULT '',
  arquivo           TEXT NOT NULL DEFAULT '',
  criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE notas_fiscais (
  id              SERIAL PRIMARY KEY,
  secretaria_id   TEXT NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  numero          TEXT NOT NULL DEFAULT '',
  data            TEXT NOT NULL DEFAULT '',
  data_vencimento TEXT NOT NULL DEFAULT '',
  referencia      TEXT NOT NULL DEFAULT '',
  valor           TEXT NOT NULL DEFAULT '',
  status          TEXT NOT NULL DEFAULT 'Pendente',
  arquivo         TEXT NOT NULL DEFAULT '',
  comprovante     TEXT NOT NULL DEFAULT '',
  data_pagamento  TEXT NOT NULL DEFAULT '',
  criado_em       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE relatorios (
  id            SERIAL PRIMARY KEY,
  secretaria_id TEXT NOT NULL REFERENCES secretarias(id) ON DELETE CASCADE,
  titulo        TEXT NOT NULL,
  data          TEXT NOT NULL DEFAULT '',
  tipo          TEXT NOT NULL DEFAULT '',
  arquivo       TEXT NOT NULL DEFAULT '',
  referencia    TEXT NOT NULL DEFAULT '',
  criado_em     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ÍNDICES
-- ============================================================

CREATE INDEX idx_secretarias_entidade    ON secretarias(entidade_id);
CREATE INDEX idx_client_users_entidade   ON client_users(entidade_id);
CREATE INDEX idx_client_users_secretaria ON client_users(secretaria_id);
CREATE INDEX idx_contratos_secretaria    ON contratos(secretaria_id);
CREATE INDEX idx_aditivos_contrato       ON aditivos(contrato_id);
CREATE INDEX idx_nfs_secretaria          ON notas_fiscais(secretaria_id);
CREATE INDEX idx_relatorios_secretaria   ON relatorios(secretaria_id);
CREATE INDEX idx_sistemas_secretaria     ON sistemas_contratados(secretaria_id);
CREATE INDEX idx_blog_posts_criado       ON blog_posts(criado_em DESC);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Desativa acesso público — apenas service_role acessa
-- ============================================================

ALTER TABLE site_content         ENABLE ROW LEVEL SECURITY;
ALTER TABLE solucoes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE depoimentos           ENABLE ROW LEVEL SECURITY;
ALTER TABLE certidoes             ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts            ENABLE ROW LEVEL SECURITY;
ALTER TABLE entidades             ENABLE ROW LEVEL SECURITY;
ALTER TABLE secretarias           ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_users          ENABLE ROW LEVEL SECURITY;
ALTER TABLE sistemas_contratados  ENABLE ROW LEVEL SECURITY;
ALTER TABLE contratos             ENABLE ROW LEVEL SECURITY;
ALTER TABLE aditivos              ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais         ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios            ENABLE ROW LEVEL SECURITY;

-- Leitura pública apenas para tabelas do site
CREATE POLICY "leitura_publica_site_content"  ON site_content  FOR SELECT USING (true);
CREATE POLICY "leitura_publica_solucoes"       ON solucoes       FOR SELECT USING (true);
CREATE POLICY "leitura_publica_stats"          ON stats          FOR SELECT USING (true);
CREATE POLICY "leitura_publica_clientes"       ON clientes       FOR SELECT USING (true);
CREATE POLICY "leitura_publica_depoimentos"    ON depoimentos    FOR SELECT USING (true);
CREATE POLICY "leitura_publica_certidoes"      ON certidoes      FOR SELECT USING (true);
CREATE POLICY "leitura_publica_blog_posts"     ON blog_posts     FOR SELECT USING (true);

-- Escrita apenas via service_role (backend/admin)
-- As demais tabelas (entidades, secretarias, client_users, etc.)
-- não têm política de leitura pública — ficam restritas ao service_role
