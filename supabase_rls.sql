-- ============================================================
-- RLS — Isolamento de dados por cliente (Supabase Auth)
-- Execute este script no SQL Editor do Supabase após o schema
-- ============================================================

-- Adiciona coluna auth_id na tabela client_users para vincular
-- ao usuário do Supabase Auth (se ainda não existir)
ALTER TABLE client_users ADD COLUMN IF NOT EXISTS auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Cria índice para performance nas buscas por auth_id
CREATE INDEX IF NOT EXISTS idx_client_users_auth_id ON client_users(auth_id);

-- Função auxiliar: retorna o secretaria_id do usuário logado
CREATE OR REPLACE FUNCTION get_my_secretaria_id()
RETURNS TEXT AS $$
  SELECT secretaria_id FROM client_users WHERE id = auth.uid()::TEXT LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Função auxiliar: retorna o entidade_id do usuário logado
CREATE OR REPLACE FUNCTION get_my_entidade_id()
RETURNS TEXT AS $$
  SELECT entidade_id FROM client_users WHERE id = auth.uid()::TEXT LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================
-- POLÍTICAS — client_users
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprio_perfil" ON client_users;
CREATE POLICY "cliente_ve_proprio_perfil"
  ON client_users FOR SELECT
  USING (id = auth.uid()::TEXT);

-- ============================================================
-- POLÍTICAS — entidades
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_propria_entidade" ON entidades;
CREATE POLICY "cliente_ve_propria_entidade"
  ON entidades FOR SELECT
  USING (id = get_my_entidade_id());

-- ============================================================
-- POLÍTICAS — secretarias
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_propria_secretaria" ON secretarias;
CREATE POLICY "cliente_ve_propria_secretaria"
  ON secretarias FOR SELECT
  USING (id = get_my_secretaria_id());

-- ============================================================
-- POLÍTICAS — contratos
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprios_contratos" ON contratos;
CREATE POLICY "cliente_ve_proprios_contratos"
  ON contratos FOR SELECT
  USING (secretaria_id = get_my_secretaria_id());

-- ============================================================
-- POLÍTICAS — aditivos
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprios_aditivos" ON aditivos;
CREATE POLICY "cliente_ve_proprios_aditivos"
  ON aditivos FOR SELECT
  USING (
    contrato_id IN (
      SELECT id FROM contratos WHERE secretaria_id = get_my_secretaria_id()
    )
  );

-- ============================================================
-- POLÍTICAS — notas_fiscais
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprias_nfs" ON notas_fiscais;
CREATE POLICY "cliente_ve_proprias_nfs"
  ON notas_fiscais FOR SELECT
  USING (secretaria_id = get_my_secretaria_id());

-- Permite ao cliente marcar NF como paga
DROP POLICY IF EXISTS "cliente_atualiza_proprias_nfs" ON notas_fiscais;
CREATE POLICY "cliente_atualiza_proprias_nfs"
  ON notas_fiscais FOR UPDATE
  USING (secretaria_id = get_my_secretaria_id());

-- ============================================================
-- POLÍTICAS — relatorios
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprios_relatorios" ON relatorios;
CREATE POLICY "cliente_ve_proprios_relatorios"
  ON relatorios FOR SELECT
  USING (secretaria_id = get_my_secretaria_id());

-- ============================================================
-- POLÍTICAS — sistemas_contratados
-- ============================================================
DROP POLICY IF EXISTS "cliente_ve_proprios_sistemas" ON sistemas_contratados;
CREATE POLICY "cliente_ve_proprios_sistemas"
  ON sistemas_contratados FOR SELECT
  USING (secretaria_id = get_my_secretaria_id());

-- ============================================================
-- NOTA: O admin usa a service_role key (sem RLS)
-- As tabelas públicas (site_content, solucoes, etc.) já têm
-- políticas de leitura pública definidas no schema inicial
-- ============================================================
