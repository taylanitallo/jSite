import { supabase } from './supabase'

// ─── Tipos ────────────────────────────────────────────────────
export interface Aditivo {
  id: string; numero: string; objeto: string; tipos: string[];
  dataInicial: string; dataEncerramento: string; novoValorMensal: string; arquivo: string;
}
export interface Contrato {
  id: string; numero: string; objeto: string; numeroLicitacao: string;
  dataInicial: string; dataEncerramento: string; valorMensal: string;
  quantidadeMeses: string; arquivo: string; artigo?: string;
  dataEncerramentoOriginal?: string; valorMensalOriginal?: string;
  aditivos: Aditivo[];
}
export interface SecretariaData {
  id: string; nome: string; cnpj: string; responsavel: string; cargo: string;
  telefone: string; foto: string; ativo?: boolean;
  contratos: Contrato[];
  sistemasContratados: Array<{ nome: string; status: string; dataInicio: string }>;
  notasFiscais: Array<{ numero: string; data: string; dataVencimento: string; referencia: string; valor: string; status: string; arquivo: string; comprovante: string; dataPagamento: string }>;
  relatorios: Array<{ titulo: string; data: string; tipo: string; arquivo: string; referencia: string }>;
}
export interface Entidade {
  id: string; nome: string; tipo: string; cidade: string; responsavel: string;
  cnpj: string; telefone: string; ativo: boolean; secretarias: SecretariaData[];
}
export interface ClientUser {
  id: string; nome: string; login: string; senha: string;
  entidadeId: string; secretariaId: string; cargo?: string; telefone?: string; foto?: string;
}

// ─── Entidades ────────────────────────────────────────────────
export async function fetchEntidades(): Promise<Entidade[]> {
  const { data: ents, error } = await supabase.from('entidades').select('*').order('nome')
  if (error || !ents) return []

  const { data: secs } = await supabase.from('secretarias').select('*')
  const { data: contratos } = await supabase.from('contratos').select('*')
  const { data: aditivos } = await supabase.from('aditivos').select('*')
  const { data: nfs } = await supabase.from('notas_fiscais').select('*')
  const { data: relatorios } = await supabase.from('relatorios').select('*')
  const { data: sistemas } = await supabase.from('sistemas_contratados').select('*')

  return ents.map((e: any): Entidade => ({
    id: e.id, nome: e.nome, tipo: e.tipo, cidade: e.cidade,
    responsavel: e.responsavel, cnpj: e.cnpj, telefone: e.telefone, ativo: e.ativo,
    secretarias: (secs ?? []).filter((s: any) => s.entidade_id === e.id).map((s: any): SecretariaData => ({
      id: s.id, nome: s.nome, cnpj: s.cnpj, responsavel: s.responsavel,
      cargo: s.cargo, telefone: s.telefone, foto: s.foto, ativo: s.ativo,
      contratos: (contratos ?? []).filter((c: any) => c.secretaria_id === s.id).map((c: any): Contrato => ({
        id: c.id, numero: c.numero, objeto: c.objeto, numeroLicitacao: c.numero_licitacao,
        dataInicial: c.data_inicial, dataEncerramento: c.data_encerramento,
        valorMensal: c.valor_mensal, quantidadeMeses: c.quantidade_meses,
        arquivo: c.arquivo, artigo: c.artigo,
        dataEncerramentoOriginal: c.data_encerramento_original,
        valorMensalOriginal: c.valor_mensal_original,
        aditivos: (aditivos ?? []).filter((a: any) => a.contrato_id === c.id).map((a: any): Aditivo => ({
          id: a.id, numero: a.numero, objeto: a.objeto, tipos: a.tipos ?? [],
          dataInicial: a.data_inicial, dataEncerramento: a.data_encerramento,
          novoValorMensal: a.novo_valor_mensal, arquivo: a.arquivo,
        })),
      })),
      sistemasContratados: (sistemas ?? []).filter((x: any) => x.secretaria_id === s.id).map((x: any) => ({
        nome: x.nome, status: x.status, dataInicio: x.data_inicio,
      })),
      notasFiscais: (nfs ?? []).filter((x: any) => x.secretaria_id === s.id).map((x: any) => ({
        numero: x.numero, data: x.data, dataVencimento: x.data_vencimento,
        referencia: x.referencia, valor: x.valor, status: x.status,
        arquivo: x.arquivo, comprovante: x.comprovante, dataPagamento: x.data_pagamento,
      })),
      relatorios: (relatorios ?? []).filter((x: any) => x.secretaria_id === s.id).map((x: any) => ({
        titulo: x.titulo, data: x.data, tipo: x.tipo, arquivo: x.arquivo, referencia: x.referencia,
      })),
    })),
  }))
}

export async function upsertEntidade(e: Entidade): Promise<void> {
  await supabase.from('entidades').upsert({
    id: e.id, nome: e.nome, tipo: e.tipo, cidade: e.cidade,
    responsavel: e.responsavel, cnpj: e.cnpj, telefone: e.telefone, ativo: e.ativo,
  })
}

export async function deleteEntidade(id: string): Promise<void> {
  await supabase.from('entidades').delete().eq('id', id)
}

export async function upsertSecretaria(entidadeId: string, s: SecretariaData): Promise<void> {
  await supabase.from('secretarias').upsert({
    id: s.id, entidade_id: entidadeId, nome: s.nome, cnpj: s.cnpj,
    responsavel: s.responsavel, cargo: s.cargo, telefone: s.telefone, foto: s.foto, ativo: s.ativo ?? true,
  })
}

export async function deleteSecretaria(id: string): Promise<void> {
  await supabase.from('secretarias').delete().eq('id', id)
}

// ─── Usuários (Supabase Auth) ─────────────────────────────────
export async function fetchClientUsers(): Promise<ClientUser[]> {
  const { data, error } = await supabase.from('client_users').select('*')
  if (error || !data) return []
  return data.map((u: any): ClientUser => ({
    id: u.id, nome: u.nome, login: u.login, senha: '',
    entidadeId: u.entidade_id, secretariaId: u.secretaria_id,
    cargo: u.cargo, telefone: u.telefone, foto: u.foto,
  }))
}

export async function createClientUser(u: ClientUser): Promise<{ error?: string }> {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: u.login,
    password: u.senha,
    options: { data: { role: 'client' } },
  })
  if (authError) return { error: authError.message }
  const authId = authData.user?.id
  if (!authId) return { error: 'Erro ao criar usuário.' }
  const { error: dbError } = await supabase.from('client_users').insert({
    id: authId, nome: u.nome, login: u.login,
    entidade_id: u.entidadeId, secretaria_id: u.secretariaId,
    cargo: u.cargo ?? '', telefone: u.telefone ?? '', foto: u.foto ?? '',
  })
  if (dbError) return { error: dbError.message }
  return {}
}

export async function updateClientUser(u: ClientUser): Promise<void> {
  await supabase.from('client_users').update({
    nome: u.nome, login: u.login,
    entidade_id: u.entidadeId, secretaria_id: u.secretariaId,
    cargo: u.cargo ?? '', telefone: u.telefone ?? '', foto: u.foto ?? '',
  }).eq('id', u.id)
}

export async function updateClientUserPassword(userId: string, newPassword: string): Promise<{ error?: string }> {
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return {}
}

export async function deleteClientUser(id: string): Promise<void> {
  await supabase.from('client_users').delete().eq('id', id)
}

// ─── Auth ─────────────────────────────────────────────────────
export async function authLogin(email: string, password: string): Promise<{ userId?: string; error?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }
  return { userId: data.user?.id }
}

export async function authLogout(): Promise<void> {
  await supabase.auth.signOut()
}

export async function fetchClientUserById(id: string): Promise<ClientUser | null> {
  const { data, error } = await supabase.from('client_users').select('*').eq('id', id).single()
  if (error || !data) return null
  return {
    id: data.id, nome: data.nome, login: data.login, senha: '',
    entidadeId: data.entidade_id, secretariaId: data.secretaria_id,
    cargo: data.cargo, telefone: data.telefone, foto: data.foto,
  }
}

// ─── Contratos ───────────────────────────────────────────────
export async function upsertContrato(secretariaId: string, c: Contrato): Promise<void> {
  await supabase.from('contratos').upsert({
    id: c.id, secretaria_id: secretariaId, numero: c.numero, objeto: c.objeto,
    numero_licitacao: c.numeroLicitacao, data_inicial: c.dataInicial,
    data_encerramento: c.dataEncerramento, valor_mensal: c.valorMensal,
    quantidade_meses: c.quantidadeMeses, arquivo: c.arquivo, artigo: c.artigo ?? null,
    data_encerramento_original: c.dataEncerramentoOriginal ?? null,
    valor_mensal_original: c.valorMensalOriginal ?? null,
  })
}

export async function deleteContrato(id: string): Promise<void> {
  await supabase.from('contratos').delete().eq('id', id)
}

export async function upsertAditivo(contratoId: string, a: Aditivo): Promise<void> {
  await supabase.from('aditivos').upsert({
    id: a.id, contrato_id: contratoId, numero: a.numero, objeto: a.objeto,
    tipos: a.tipos, data_inicial: a.dataInicial, data_encerramento: a.dataEncerramento,
    novo_valor_mensal: a.novoValorMensal, arquivo: a.arquivo,
  })
}

export async function deleteAditivo(id: string): Promise<void> {
  await supabase.from('aditivos').delete().eq('id', id)
}

// ─── Notas Fiscais ───────────────────────────────────────────
export async function upsertNotasFiscais(secretariaId: string, nfs: SecretariaData['notasFiscais']): Promise<void> {
  await supabase.from('notas_fiscais').delete().eq('secretaria_id', secretariaId)
  if (nfs.length === 0) return
  await supabase.from('notas_fiscais').insert(nfs.map(x => ({
    secretaria_id: secretariaId, numero: x.numero, data: x.data,
    data_vencimento: x.dataVencimento, referencia: x.referencia, valor: x.valor,
    status: x.status, arquivo: x.arquivo, comprovante: x.comprovante, data_pagamento: x.dataPagamento,
  })))
}

// ─── Relatórios ──────────────────────────────────────────────
export async function upsertRelatorios(secretariaId: string, rels: SecretariaData['relatorios']): Promise<void> {
  await supabase.from('relatorios').delete().eq('secretaria_id', secretariaId)
  if (rels.length === 0) return
  await supabase.from('relatorios').insert(rels.map(x => ({
    secretaria_id: secretariaId, titulo: x.titulo, data: x.data,
    tipo: x.tipo, arquivo: x.arquivo, referencia: x.referencia,
  })))
}

// ─── Sistemas Contratados ────────────────────────────────────
export async function upsertSistemas(secretariaId: string, sistemas: SecretariaData['sistemasContratados']): Promise<void> {
  await supabase.from('sistemas_contratados').delete().eq('secretaria_id', secretariaId)
  if (sistemas.length === 0) return
  await supabase.from('sistemas_contratados').insert(sistemas.map(x => ({
    secretaria_id: secretariaId, nome: x.nome, status: x.status, data_inicio: x.dataInicio,
  })))
}

// ─── Conteúdo do Site ────────────────────────────────────────
export async function fetchSiteContent(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from('site_content').select('campo, valor')
  if (error || !data) return {}
  return Object.fromEntries(data.map((r: any) => [r.campo, r.valor]))
}

export async function saveSiteContent(content: Record<string, string>): Promise<void> {
  const rows = Object.entries(content).map(([campo, valor]) => ({ campo, valor }))
  await supabase.from('site_content').upsert(rows, { onConflict: 'campo' })
}

// ─── Soluções ────────────────────────────────────────────────
export async function fetchSolucoes(): Promise<any[]> {
  const { data, error } = await supabase.from('solucoes').select('*').order('ordem')
  if (error || !data) return []
  return data.map((s: any) => ({
    id: s.id, icone: s.icone, title: s.title, description: s.description,
    image: s.image, url: s.url, features: s.features ?? [],
  }))
}

export async function saveSolucoes(solucoes: any[]): Promise<void> {
  await supabase.from('solucoes').delete().neq('id', '')
  if (solucoes.length === 0) return
  await supabase.from('solucoes').insert(solucoes.map((s, i) => ({
    id: s.id, icone: s.icone ?? 'Package', title: s.title, description: s.description,
    image: s.image, url: s.url, features: s.features, ordem: i,
  })))
}

// ─── Stats ───────────────────────────────────────────────────
export async function fetchStats(): Promise<any[]> {
  const { data, error } = await supabase.from('stats').select('*').order('ordem')
  if (error || !data) return []
  return data.map((s: any) => ({
    id: s.id, valor: s.valor, desc: s.descricao, icone: s.icone, ativo: s.ativo,
  }))
}

export async function saveStats(stats: any[]): Promise<void> {
  await supabase.from('stats').delete().neq('id', '')
  if (stats.length === 0) return
  await supabase.from('stats').insert(stats.map((s, i) => ({
    id: s.id, valor: s.valor, descricao: s.desc, icone: s.icone, ativo: s.ativo, ordem: i,
  })))
}

// ─── Clientes ────────────────────────────────────────────────
export async function fetchClientes(): Promise<any[]> {
  const { data, error } = await supabase.from('clientes').select('*').order('ordem')
  if (error || !data) return []
  return data.map((c: any) => ({ name: c.name, estado: c.estado, logo: c.logo }))
}

export async function saveClientes(clientes: any[]): Promise<void> {
  await supabase.from('clientes').delete().gt('id', 0)
  if (clientes.length === 0) return
  await supabase.from('clientes').insert(clientes.map((c, i) => ({
    name: c.name, estado: c.estado ?? null, logo: c.logo, ordem: i,
  })))
}

// ─── Depoimentos ────────────────────────────────────────────
export async function fetchDepoimentos(): Promise<any[]> {
  const { data, error } = await supabase.from('depoimentos').select('*').order('ordem')
  if (error || !data) return []
  return data.map((d: any) => ({
    name: d.name, role: d.role, city: d.city, testimonial: d.testimonial, photo: d.photo,
  }))
}

export async function saveDepoimentos(deps: any[]): Promise<void> {
  await supabase.from('depoimentos').delete().gt('id', 0)
  if (deps.length === 0) return
  await supabase.from('depoimentos').insert(deps.map((d, i) => ({
    name: d.name, role: d.role, city: d.city, testimonial: d.testimonial, photo: d.photo, ordem: i,
  })))
}

// ─── Certidões ───────────────────────────────────────────────
export async function fetchCertidoes(): Promise<any[]> {
  const { data, error } = await supabase.from('certidoes').select('*').order('ordem')
  if (error || !data) return []
  return data.map((c: any) => ({
    titulo: c.titulo, validade: c.validade, tipo: c.tipo,
    arquivo: c.arquivo, dataEmissao: c.data_emissao,
  }))
}

export async function saveCertidoes(certs: any[]): Promise<void> {
  await supabase.from('certidoes').delete().gt('id', 0)
  if (certs.length === 0) return
  await supabase.from('certidoes').insert(certs.map((c, i) => ({
    titulo: c.titulo, validade: c.validade, tipo: c.tipo,
    arquivo: c.arquivo ?? '', data_emissao: c.dataEmissao ?? '', ordem: i,
  })))
}

// ─── Blog Posts ──────────────────────────────────────────────
export async function fetchBlogPosts(): Promise<any[]> {
  const { data, error } = await supabase.from('blog_posts').select('*').order('criado_em', { ascending: false })
  if (error || !data) return []
  return data.map((p: any) => ({
    id: p.id, titulo: p.titulo, resumo: p.resumo, conteudo: p.conteudo,
    imagem: p.imagem, autor: p.autor, data: p.data, categoria: p.categoria,
  }))
}

export async function upsertBlogPost(post: any): Promise<void> {
  await supabase.from('blog_posts').upsert({
    id: post.id, titulo: post.titulo, resumo: post.resumo, conteudo: post.conteudo,
    imagem: post.imagem, autor: post.autor, data: post.data, categoria: post.categoria,
  })
}

export async function deleteBlogPost(id: string): Promise<void> {
  await supabase.from('blog_posts').delete().eq('id', id)
}
