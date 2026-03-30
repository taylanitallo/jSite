-- ============================================================
-- Corrige permissões de escrita para o admin (anon key)
-- Execute no SQL Editor do Supabase
-- ============================================================

-- Desativa RLS nas tabelas operacionais (admin gerencia via anon key)
ALTER TABLE entidades            DISABLE ROW LEVEL SECURITY;
ALTER TABLE secretarias          DISABLE ROW LEVEL SECURITY;
ALTER TABLE client_users         DISABLE ROW LEVEL SECURITY;
ALTER TABLE contratos            DISABLE ROW LEVEL SECURITY;
ALTER TABLE aditivos             DISABLE ROW LEVEL SECURITY;
ALTER TABLE notas_fiscais        DISABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios           DISABLE ROW LEVEL SECURITY;
ALTER TABLE sistemas_contratados DISABLE ROW LEVEL SECURITY;

-- Garante permissão total para anon e authenticated nessas tabelas
GRANT ALL ON entidades            TO anon, authenticated;
GRANT ALL ON secretarias          TO anon, authenticated;
GRANT ALL ON client_users         TO anon, authenticated;
GRANT ALL ON contratos            TO anon, authenticated;
GRANT ALL ON aditivos             TO anon, authenticated;
GRANT ALL ON notas_fiscais        TO anon, authenticated;
GRANT ALL ON relatorios           TO anon, authenticated;
GRANT ALL ON sistemas_contratados TO anon, authenticated;

-- Garante uso das sequences (para IDs serial)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Tabelas do site também precisam de escrita pelo admin
GRANT ALL ON site_content  TO anon, authenticated;
GRANT ALL ON solucoes      TO anon, authenticated;
GRANT ALL ON stats         TO anon, authenticated;
GRANT ALL ON clientes      TO anon, authenticated;
GRANT ALL ON depoimentos   TO anon, authenticated;
GRANT ALL ON certidoes     TO anon, authenticated;
GRANT ALL ON blog_posts    TO anon, authenticated;
