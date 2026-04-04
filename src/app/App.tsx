import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Users, FileText, Inbox, Calculator, Package, CheckCircle2, Phone, Mail, MapPin, Briefcase, Shield, Headphones, TrendingUp, Award, Sun, Moon, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Quote, Download, FileCheck, Lock, LogIn, LogOut, Eye, DollarSign, Calendar, Settings, ChevronLeft, ChevronRight, Building2, Home, BarChart3, Globe, ClipboardList, BookOpen, Landmark, Database, PieChart, Truck, ArrowLeft, Pencil, Power, Menu, X } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import logoJeosColorida from "../assets/logo-colorida.png";
import logoJeosBranca from "../assets/logo-branca.png";
import logoJeosPreta from "../assets/logo-colorida.png";
import React, { useState, useEffect, useRef } from "react";
import {
  fetchEntidades, fetchClientUsers, fetchSiteContent, fetchSolucoes,
  fetchStats, fetchClientes, fetchDepoimentos, fetchCertidoes, fetchBlogPosts,
  saveSiteContent, saveSolucoes, saveStats, saveClientes, saveDepoimentos,
  saveCertidoes, upsertBlogPost, deleteBlogPost,
  upsertEntidade, deleteEntidade, upsertSecretaria, deleteSecretaria,
  createClientUser, updateClientUser, deleteClientUser as dbDeleteClientUser,
  upsertContrato, deleteContrato, upsertAditivo, deleteAditivo,
  upsertNotasFiscais, upsertRelatorios, upsertSistemas,
  authLogin, authLogout, fetchClientUserById,
} from '../lib/db';

const MUNICIPIOS_CE = ["Abaiara","Acaraú","Acopiara","Aiuaba","Alcântaras","Altaneira","Alto Santo","Amontada","Antonina do Norte","Apuiarés","Aquiraz","Aracati","Aracoiaba","Ararenda","Araripe","Aratuba","Arneiroz","Assaré","Aurora","Baixio","Banabuiú","Barbalha","Barreira","Barro","Barroquinha","Baturité","Beberibe","Bela Cruz","Boa Viagem","Brejo Santo","Camocim","Campos Sales","Canindé","Capistrano","Caridade","Caririaçu","Cariús","Carnaubal","Cascavel","Catarina","Catunda","Caucaia","Cedro","Chaval","Choró","Chorozinho","Coreaú","Crateús","Crato","Croatá","Cruz","Deputado Irapuan Pinheiro","Ererê","Eusébio","Farias Brito","Forquilha","Fortaleza","Fortim","Frecheirinha","General Sampaio","Graça","Granja","Granjeiro","Groaíras","Guaiúba","Guaraciaba do Norte","Guaramiranga","Hidrolândia","Horizonte","Ibaretama","Ibiapina","Ibicuitinga","Icapuí","Icó","Iguatu","Independência","Ipaporanga","Ipaumirim","Ipu","Ipueiras","Iracema","Irauçuba","Itaiçaba","Itaitinga","Itapajé","Itapipoca","Itapiúna","Itarema","Itatira","Jaguaretama","Jaguaribara","Jaguaribe","Jaguaruana","Jardim","Jati","Jijoca de Jericoacoara","Juazeiro do Norte","Jucás","Lavras da Mangabeira","Limoeiro do Norte","Madalena","Maracanaú","Maranguape","Marco","Martinópole","Massapê","Mauriti","Meruoca","Milagres","Milhã","Miraíma","Missão Velha","Mombaça","Monsenhor Tabosa","Morada Nova","Moraújo","Morrinhos","Mucambo","Mulungu","Nova Olinda","Nova Russas","Novo Oriente","Ocara","Orós","Pacajus","Pacatuba","Pacoti","Pacujá","Palhano","Palmácia","Paracuru","Paraipaba","Parambu","Paramoti","Pedra Branca","Penaforte","Pentecoste","Pereiro","Pindoretama","Piquet Carneiro","Pires Ferreira","Poranga","Porteiras","Potengi","Potiretama","Quiterianópolis","Quixadá","Quixelô","Quixeramobim","Quixeré","Redenção","Reriutaba","Russas","Saboeiro","Salitre","Santa Quitéria","Santana do Acaraú","Santana do Cariri","São Benedito","São Gonçalo do Amarante","São João do Jaguaribe","São Luís do Curu","Senador Pompeu","Senador Sá","Sobral","Solonópole","Tabuleiro do Norte","Tamboril","Tarrafas","Tauá","Tejuçoca","Tianguá","Trairi","Tururu","Ubajara","Umirim","Uruburetama","Uruoca","Varjota","Várzea Alegre","Viçosa do Ceará"];

interface ClientUserShape {
  id: string; nome: string; login: string; senha: string;
  entidadeId: string; secretariaId: string;
  cargo?: string; telefone?: string; foto?: string;
}

function ClientSettingsTab({ user, isDarkMode, onSave }: {
  user: ClientUserShape;
  isDarkMode: boolean;
  onSave: (patch: Partial<ClientUserShape>) => void;
}) {
  const [nome, setNome] = useState(user.nome ?? "");
  const [login, setLogin] = useState(user.login ?? "");
  const [telefone, setTelefone] = useState(user.telefone ?? "");
  const [cargo, setCargo] = useState(user.cargo ?? "");
  const [foto, setFoto] = useState(user.foto ?? "");
  const [salvo, setSalvo] = useState(false);
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confSenha, setConfSenha] = useState("");
  const [senhaErro, setSenhaErro] = useState("");
  const [senhaSalvo, setSenhaSalvo] = useState(false);

  const inputCls = isDarkMode
    ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
    : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500";
  const labelCls = isDarkMode
    ? "text-gray-300 text-sm font-medium mb-2 block"
    : "text-gray-700 text-sm font-medium mb-2 block";

  const handleSalvarPerfil = () => {
    onSave({ nome, login, telefone, cargo, foto });
    setSalvo(true);
    setTimeout(() => setSalvo(false), 3000);
  };

  const handleAlterarSenha = () => {
    setSenhaErro("");
    if (senhaAtual !== user.senha) { setSenhaErro("Senha atual incorreta."); return; }
    if (novaSenha.length < 4) { setSenhaErro("A nova senha deve ter pelo menos 4 caracteres."); return; }
    if (novaSenha !== confSenha) { setSenhaErro("As senhas não coincidem."); return; }
    onSave({ senha: novaSenha });
    setSenhaAtual(""); setNovaSenha(""); setConfSenha("");
    setSenhaSalvo(true);
    setTimeout(() => setSenhaSalvo(false), 3000);
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Configurações da Conta</h1>
      <div className="space-y-6">
        <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
          <CardHeader><CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Informações Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                {foto
                  ? <img src={foto} alt={nome} className="w-20 h-20 rounded-full object-cover border-4 border-purple-500" />
                  : <div className="w-20 h-20 rounded-full border-4 border-purple-500 flex items-center justify-center bg-slate-700 text-gray-400"><Users className="w-8 h-8" /></div>
                }
              </div>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer">
                  <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${isDarkMode ? "border-purple-500/40 text-purple-400 hover:bg-purple-500/10" : "border-purple-400 text-purple-600 hover:bg-purple-50"}`}>
                    {foto ? "Alterar foto" : "Adicionar foto"}
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = ev => setFoto(ev.target?.result as string);
                    reader.readAsDataURL(f);
                  }} />
                </label>
                {foto && (
                  <button onClick={() => setFoto("")} className={`text-xs text-left ${isDarkMode ? "text-gray-500 hover:text-red-400" : "text-gray-400 hover:text-red-500"}`}>Remover foto</button>
                )}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div><label className={labelCls}>Nome Completo</label><input type="text" value={nome} onChange={e => setNome(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Cargo</label><input type="text" value={cargo} onChange={e => setCargo(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>E-mail / Login</label><input type="email" value={login} onChange={e => setLogin(e.target.value)} className={inputCls} /></div>
              <div><label className={labelCls}>Telefone</label><input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} className={inputCls} /></div>
            </div>
            <div className="flex items-center gap-3">
              <Button onClick={handleSalvarPerfil} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Salvar Alterações</Button>
              {salvo && <span className="text-green-400 text-sm font-medium">✓ Salvo com sucesso!</span>}
            </div>
          </CardContent>
        </Card>

        <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
          <CardHeader><CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Alterar Senha</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div><label className={labelCls}>Senha Atual</label><input type="password" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)} placeholder="••••••••" className={inputCls} /></div>
            <div><label className={labelCls}>Nova Senha</label><input type="password" value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="••••••••" className={inputCls} /></div>
            <div><label className={labelCls}>Confirmar Nova Senha</label><input type="password" value={confSenha} onChange={e => setConfSenha(e.target.value)} placeholder="••••••••" className={inputCls} /></div>
            {senhaErro && <p className="text-red-400 text-sm">{senhaErro}</p>}
            <div className="flex items-center gap-3">
              <Button onClick={handleAlterarSenha} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Alterar Senha</Button>
              {senhaSalvo && <span className="text-green-400 text-sm font-medium">✓ Senha alterada!</span>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const ARTIGO_MAX_MESES: Record<string, number> = { art106: 60, art107: 120, art114: 180 };
const ARTIGO_NOMES: Record<string, string> = {
  art106: "Art. 106, §2º — máx. 60 meses (5 anos)",
  art107: "Art. 107 — máx. 120 meses (10 anos)",
  art114: "Art. 114 — máx. 180 meses (15 anos)",
};
const calcMesesDMY = (d1: string, d2: string): number => {
  const p1 = d1.split('/'); const p2 = d2.split('/');
  if (p1.length < 3 || p2.length < 3) return 0;
  const m1 = parseInt(p1[1]); const y1 = parseInt(p1[2]);
  const m2 = parseInt(p2[1]); const y2 = parseInt(p2[2]);
  if (!y1 || !y2) return 0;
  return (y2 - y1) * 12 + (m2 - m1) + 1;
};

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const productDetailRef = useRef<HTMLDivElement>(null);
  const solucoesRef = useRef<HTMLElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null); // 'contract', 'invoices', 'reports', 'settings'

  // Admin
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminLanding, setAdminLanding] = useState(true);
  const [showAddModal, setShowAddModal] = useState<null|"entidade"|"secretaria"|"sistema"|"nf"|"relatorio"|"usuario">(null);
  const [editEntidadeId, setEditEntidadeId] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminUser, setAdminUser] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminSection, setAdminSection] = useState("dashboard");
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [clienteAdminSidebarOpen, setClienteAdminSidebarOpen] = useState(false);
  const [clienteSidebarOpen, setClienteSidebarOpen] = useState(false);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [testimonialAnimating, setTestimonialAnimating] = useState(false);
  const [clienteIdx, setClienteIdx] = useState(0);
  const [clienteAnimating, setClienteAnimating] = useState(false);
  const [blogPreviewIdx, setBlogPreviewIdx] = useState(0);
  const [blogPreviewAnimating, setBlogPreviewAnimating] = useState(false);

  // Blog
  const [currentPage, setCurrentPage] = useState<"home" | "blog" | "post" | "sobre" | "certidoes">("home");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const defaultBlogPosts = [
    {
      id: "1",
      titulo: "JEOS lança nova versão do sistema de Contabilidade Pública",
      resumo: "A nova versão traz melhorias significativas na geração de relatórios e integração com o SICONFI, facilitando o trabalho dos contadores municipais.",
      conteudo: "A JEOS Sistemas e Governo acaba de lançar a nova versão do seu sistema de Contabilidade Pública, trazendo importantes melhorias para os municípios e órgãos públicos que utilizam a plataforma.\n\nEntre as principais novidades, destaca-se a integração aprimorada com o SICONFI (Sistema de Informações Contábeis e Fiscais do Setor Público), que agora permite a transmissão automática de dados com maior precisão e segurança.\n\nA geração de relatórios contábeis foi completamente redesenhada, oferecendo maior flexibilidade na criação de demonstrativos financeiros personalizados. O módulo de encerramento de exercício também foi atualizado para atender às novas exigências da STN.\n\nA atualização está disponível para todos os clientes ativos e será realizada de forma gradual ao longo das próximas semanas.",
      imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      autor: "Equipe JEOS",
      data: "10/03/2026",
      categoria: "Produto"
    },
    {
      id: "2",
      titulo: "Como a tecnologia está transformando a gestão pública municipal",
      resumo: "Um levantamento exclusivo mostra como municípios que adotaram sistemas integrados reduziram o tempo de processos administrativos em até 60%.",
      conteudo: "A transformação digital no setor público tem avançado de forma significativa nos últimos anos. Municípios que investiram em sistemas integrados de gestão estão colhendo resultados expressivos em eficiência e transparência.\n\nDe acordo com dados levantados pela JEOS em parceria com clientes de todo o Brasil, municípios que implantaram soluções tecnológicas integradas reportaram redução de até 60% no tempo de execução de processos administrativos.\n\nA integração entre os módulos de Contabilidade, RH, Licitações e Tributação elimina a necessidade de retrabalho e a duplicidade de informações, permitindo que os servidores públicos foquem em atividades estratégicas.\n\nAlém da eficiência operacional, a transparência pública também melhorou: com portais integrados, cidadãos passaram a ter acesso mais fácil às informações sobre gastos e contratos municipais.",
      imagem: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
      autor: "Equipe JEOS",
      data: "05/03/2026",
      categoria: "Tendências"
    },
    {
      id: "3",
      titulo: "JEOS participa do Congresso Nacional de Gestão Pública 2026",
      resumo: "Nossa equipe estava presente no maior evento de gestão pública do Brasil, apresentando as mais recentes inovações em tecnologia para o setor público.",
      conteudo: "A JEOS Sistemas e Governo marcou presença no Congresso Nacional de Gestão Pública 2026, realizado em Brasília, um dos maiores eventos do setor no Brasil.\n\nDurante o evento, nossa equipe apresentou as mais recentes soluções tecnológicas desenvolvidas para modernizar a administração pública, com destaque para o novo módulo de BI (Business Intelligence) integrado à plataforma.\n\nA participação foi uma oportunidade valiosa para trocar experiências com gestores de todo o Brasil e entender as principais demandas dos municípios para os próximos anos.\n\nAlém disso, firmamos importantes parcerias com associações municipalistas que nos permitirão ampliar ainda mais nossa presença no interior do país.",
      imagem: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
      autor: "Equipe JEOS",
      data: "28/02/2026",
      categoria: "Eventos"
    }
  ];
  const [blogPosts, setBlogPosts] = useState<Array<{id:string;titulo:string;resumo:string;conteudo:string;imagem:string;autor:string;data:string;categoria:string}>>(defaultBlogPosts);
  const [showAddPostModal, setShowAddPostModal] = useState(false);
  const [novoPostForm, setNovoPostForm] = useState({ titulo: "", resumo: "", conteudo: "", imagem: "", autor: "Equipe JEOS", data: "", categoria: "" });
  const [editPostIdx, setEditPostIdx] = useState<number | null>(null);

  const defaultSiteContent = {
    heroTitle: "Transformando a Gestão Pública com Tecnologia",
    heroSubtitle: "Há mais de 15 anos desenvolvendo soluções inovadoras para municípios, estados e órgãos públicos em todo o Brasil",
    sobreParagrafo1: "A JEOS Sistemas e Governo é referência nacional no desenvolvimento de soluções tecnológicas para gestão pública. Com mais de 15 anos de experiência, atendemos centenas de municípios, estados e órgãos públicos em todo o Brasil.",
    sobreParagrafo2: "Nosso compromisso é fornecer sistemas robustos, seguros e totalmente adequados às exigências legais, sempre com foco na eficiência e transparência da gestão pública.",
    stat1Valor: "+15 Anos", stat1Desc: "de Experiência",
    stat2Valor: "+500 Clientes", stat2Desc: "em Todo o Brasil",
    stat3Valor: "Suporte 24/7", stat3Desc: "Atendimento Contínuo",
    stat4Valor: "Certificado", stat4Desc: "Segurança e Compliance",
    contatoTelefone: "(00) 0000-0000",
    contatoEmail: "contato@jeossistemas.com.br",
    contatoEndereco: "São Paulo - SP",
    cnpj: "",
    fotoEquipe: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80",
    whatsapp: "",
    facebook: "",
    instagram: "",
    youtube: "",
    linkedin: "",
    diferencial1Titulo: "Inovação Constante",
    diferencial1Desc: "Atualizações frequentes seguindo as mudanças da legislação",
    diferencial1Icone: "TrendingUp",
    diferencial2Titulo: "Segurança Garantida",
    diferencial2Desc: "Proteção de dados e compliance com LGPD",
    diferencial2Icone: "Shield",
    diferencial3Titulo: "Suporte Especializado",
    diferencial3Desc: "Equipe técnica qualificada disponível sempre que precisar",
    diferencial3Icone: "Headphones",
    badgeNumero: "500+",
    badgeDesc: "Clientes Ativos",
    missao: "Desenvolver soluções tecnológicas inovadoras para a gestão pública, promovendo eficiência, transparência e resultados concretos para a sociedade.",
    visao: "Ser a maior referência nacional em tecnologia aplicada à administração pública, contribuindo para uma gestão mais moderna, inovadora e eficiente.",
    valores: "Inovação, Transparência, Comprometimento, Ética, Excelência no Atendimento e Responsabilidade Social.",
    stat1Icone: "Award",
    stat2Icone: "MapPin",
    stat3Icone: "Headphones",
    stat4Icone: "Shield",
  };

  const [siteContent, setSiteContent] = useState(defaultSiteContent);
  const [savedSiteContent, setSavedSiteContent] = useState(defaultSiteContent);

  const [adminEditIndex, setAdminEditIndex] = useState<number | null>(null);
  const [showAddSolucaoModal, setShowAddSolucaoModal] = useState(false);
  const [novaSolucaoForm, setNovaSolucaoForm] = useState({ title: "", description: "", image: "", url: "", features: "", icone: "Package" });
  const [showAddClienteModal, setShowAddClienteModal] = useState(false);
  const [novoClienteForm, setNovoClienteForm] = useState({ name: "", estado: "", logo: "" });
  const [showAddDepoimentoModal, setShowAddDepoimentoModal] = useState(false);
  const [novoDepoimentoForm, setNovoDepoimentoForm] = useState({ name: "", role: "", city: "", testimonial: "", photo: "" });
  const [showAddStatModal, setShowAddStatModal] = useState(false);
  const [novaStatForm, setNovaStatForm] = useState({ valor: "", desc: "", icone: "Award" });
  const [confirmDelete, setConfirmDelete] = useState<{ label: string; onConfirm: () => void } | null>(null);
  const [editBuffer, setEditBuffer] = useState<Record<string, any> | null>(null);
  const [openIconPicker, setOpenIconPicker] = useState<string | null>(null);
  const [blogSearch, setBlogSearch] = useState("");
  const [clientSearch, setClientSearch] = useState("");
  const [clientEstado, setClientEstado] = useState("");
  const [depSearch, setDepSearch] = useState("");
  const [depCliente, setDepCliente] = useState("");
  const [certHistoricoAberto, setCertHistoricoAberto] = useState<string | null>(null);
  const [certAdminExpandido, setCertAdminExpandido] = useState<string | null>(null);
  const [certSearch, setCertSearch] = useState("");
  const [certAntSearch, setCertAntSearch] = useState<Record<string, string>>({});

  const defaultSolucoes = [
    { id: "contabilidade", icone: "Calculator", title: "Contabilidade Pública", description: "Solução completa para gestão contábil e financeira de órgãos públicos", image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80", url: "", features: ["Conformidade total com a Lei de Responsabilidade Fiscal (LRF)", "Emissão automática de relatórios contábeis e balanços", "Controle orçamentário e financeiro integrado", "SICONFI e SIOPE - Transmissão automática", "Plano de Contas Aplicado ao Setor Público (PCASP)"] },
    { id: "rh", icone: "Users", title: "Recursos Humanos", description: "Gestão completa de pessoal e folha de pagamento para o setor público", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", url: "", features: ["Folha de pagamento com cálculos automatizados", "Controle de ponto eletrônico e banco de horas", "Gestão de benefícios e vantagens", "Portal do servidor para consultas online", "Integração com eSocial e DIRF"] },
    { id: "licitacoes", icone: "FileText", title: "Licitações e Contratos", description: "Gerenciamento completo de processos licitatórios e contratos administrativos", image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80", url: "", features: ["Controle de todas as modalidades de licitação", "Gestão completa de contratos e aditivos", "Portal de transparência integrado", "Cadastro de fornecedores e documentação", "Alertas automáticos de prazos e vencimentos"] },
    { id: "protocolo", icone: "Inbox", title: "Protocolo e Documentos", description: "Gestão digital de processos, documentos e tramitação", image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80", url: "", features: ["Protocolo digital e físico integrados", "Tramitação e acompanhamento de processos", "Gestão eletrônica de documentos (GED)", "Assinatura digital e certificação", "Consulta pública de processos"] },
    { id: "tributacao", icone: "DollarSign", title: "Tributação Municipal", description: "Solução completa para arrecadação e fiscalização tributária", image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80", url: "", features: ["Gestão de IPTU, ISS, ITBI e taxas diversas", "Cadastro imobiliário e cadastro econômico", "Emissão de guias e carnês automatizada", "Integração com bancos e PIX", "Nota Fiscal Eletrônica de Serviços (NFS-e)"] },
    { id: "patrimonio", icone: "Package", title: "Patrimônio e Almoxarifado", description: "Controle total de bens patrimoniais e estoque de materiais", image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80", url: "", features: ["Cadastro e tombamento de bens patrimoniais", "Controle de depreciação e reavaliação", "Gestão de almoxarifado e estoque", "Inventário com leitura de código de barras", "Transferência e movimentação de bens"] },
  ];
  const [solucoes, setSolucoes] = useState<Array<{id:string;icone?:string;title:string;description:string;image:string;url:string;features:string[]}>>(defaultSolucoes);

  const defaultStats = [
    { id: "stat1", valor: "+15 Anos", desc: "de Experiência", icone: "Award", ativo: true },
    { id: "stat2", valor: "+500 Clientes", desc: "em Todo o Brasil", icone: "MapPin", ativo: true },
    { id: "stat3", valor: "Suporte 24/7", desc: "Atendimento Contínuo", icone: "Headphones", ativo: true },
    { id: "stat4", valor: "Certificado", desc: "Segurança e Compliance", icone: "Shield", ativo: true },
  ];
  const [stats, setStats] = useState<Array<{id:string;valor:string;desc:string;icone:string;ativo:boolean}>>(defaultStats);
  const [savedStats, setSavedStats] = useState<Array<{id:string;valor:string;desc:string;icone:string;ativo:boolean}>>(defaultStats);

  const defaultClientes = [
    { name: "Prefeitura Municipal de São Paulo", estado: "SP", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
    { name: "Câmara Municipal de Brasília", estado: "DF", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
    { name: "Prefeitura de Belo Horizonte", estado: "MG", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
    { name: "Governo do Estado do Paraná", estado: "PR", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
    { name: "Prefeitura de Salvador", estado: "BA", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
    { name: "Câmara de Fortaleza", estado: "CE", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
    { name: "Prefeitura de Curitiba", estado: "PR", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
    { name: "Tribunal de Contas - MG", estado: "MG", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
    { name: "Prefeitura de Recife", estado: "PE", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
    { name: "Assembleia Legislativa - RS", estado: "RS", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
    { name: "Prefeitura de Manaus", estado: "AM", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
    { name: "Câmara de Porto Alegre", estado: "RS", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
  ];
  const [clientes, setClientes] = useState<Array<{name:string;estado?:string;logo:string}>>(defaultClientes);

  const defaultDepoimentos = [
    { name: "Maria Silva", role: "Secretária de Finanças", city: "Prefeitura Municipal de Santos", testimonial: "A JEOS revolucionou nossa gestão financeira. O sistema de contabilidade é extremamente intuitivo e nos trouxe total conformidade com a legislação vigente.", photo: "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80" },
    { name: "João Santos", role: "Diretor de RH", city: "Câmara Municipal de Campinas", testimonial: "O suporte da JEOS é excepcional. Sempre que precisamos, a equipe está disponível para nos auxiliar. O sistema de RH facilitou muito nossa rotina.", photo: "https://images.unsplash.com/photo-1578758837674-93ed0ab5fbab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80" },
    { name: "Ana Oliveira", role: "Controladora Geral", city: "Prefeitura de Ribeirão Preto", testimonial: "Com os sistemas integrados da JEOS, conseguimos aumentar nossa eficiência em 40%. A transparência nos processos melhorou significativamente.", photo: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80" },
  ];
  const [depoimentos, setDepoimentos] = useState<Array<{name:string;role:string;city:string;testimonial:string;photo:string}>>(defaultDepoimentos);

  const defaultCertidoes = [
    { titulo: "Certidão Negativa de Débitos - Receita Federal", validade: "Válida até: 15/06/2024", tipo: "Federal", arquivo: "", dataEmissao: "01/2024" },
    { titulo: "Certidão Negativa de Débitos - FGTS", validade: "Válida até: 20/07/2024", tipo: "Trabalhista", arquivo: "", dataEmissao: "01/2024" },
    { titulo: "Certidão Negativa de Débitos - Estadual", validade: "Válida até: 10/05/2024", tipo: "Estadual", arquivo: "", dataEmissao: "01/2024" },
    { titulo: "Certidão Negativa de Débitos - Municipal", validade: "Válida até: 25/04/2024", tipo: "Municipal", arquivo: "", dataEmissao: "01/2024" },
    { titulo: "Certidão Negativa Trabalhista - TST", validade: "Válida até: 30/06/2024", tipo: "Trabalhista", arquivo: "", dataEmissao: "01/2024" },
    { titulo: "Registro CNPJ - Receita Federal", validade: "Atualizado em: 01/01/2024", tipo: "Cadastral", arquivo: "", dataEmissao: "01/2024" },
  ];
  const [certidoes, setCertidoes] = useState<Array<{titulo:string;validade:string;tipo:string;arquivo:string;dataEmissao?:string}>>(defaultCertidoes);
  const [savedCertidoes, setSavedCertidoes] = useState<Array<{titulo:string;validade:string;tipo:string;arquivo:string;dataEmissao?:string}>>(defaultCertidoes);
  const [showAddCertidaoModal, setShowAddCertidaoModal] = useState(false);
  const [certidaoModoVersao, setCertidaoModoVersao] = useState(false);
  const [novaCertidaoForm, setNovaCertidaoForm] = useState({ titulo: "", tipo: "", validade: "", dataEmissao: "", arquivo: "" });

  // Dados do cliente logado — gerenciados pelo admin
  // ── Sistema Multi-Entidade ────────────────────────────────────
  interface Aditivo {
    id: string;
    numero: string;
    objeto: string;
    tipos: string[]; // ["Prazo"] | ["Acréscimo"] | ["Redução"] | ["Acréscimo","Prazo"] | ["Redução","Prazo"]
    dataInicial: string;
    dataEncerramento: string;
    novoValorMensal: string; // preenchido quando tipo inclui Acréscimo ou Redução
    arquivo: string;
  }
  interface Contrato {
    id: string;
    numero: string;
    objeto: string;
    numeroLicitacao: string;
    dataInicial: string;
    dataEncerramento: string; // atualizado automaticamente por aditivos de Prazo
    valorMensal: string;
    quantidadeMeses: string;
    arquivo: string;
    artigo?: string;
    dataEncerramentoOriginal?: string;
    valorMensalOriginal?: string;
    aditivos: Aditivo[];
  }
  interface SecretariaData {
    id: string; nome: string; cnpj: string; responsavel: string; cargo: string; telefone: string; foto: string; ativo?: boolean;
    contratos: Contrato[];
    sistemasContratados: Array<{ nome: string; status: string; dataInicio: string; }>;
    notasFiscais: Array<{ numero: string; data: string; dataVencimento: string; referencia: string; valor: string; status: string; arquivo: string; comprovante: string; dataPagamento: string; }>;
    relatorios: Array<{ titulo: string; data: string; tipo: string; arquivo: string; referencia: string; }>;
  }
  interface Entidade { id: string; nome: string; tipo: string; cidade: string; responsavel: string; cnpj: string; telefone: string; ativo: boolean; secretarias: SecretariaData[]; }
  interface ClientUser { id: string; nome: string; login: string; senha: string; entidadeId: string; secretariaId: string; cargo?: string; telefone?: string; foto?: string; }
  const emptySecretaria = (id: string, nome: string): SecretariaData => ({
    id, nome, cnpj: "", responsavel: "", cargo: "", telefone: "", foto: "",
    contratos: [], sistemasContratados: [], notasFiscais: [], relatorios: []
  });
  const [entidades, setEntidades] = useState<Entidade[]>([]);
  const [clientUsers, setClientUsers] = useState<ClientUser[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<ClientUser | null>(null);
  // Admin portal — subtabs e seleção de entidade/secretaria
  const [adminClientSubSection, setAdminClientSubSection] = useState<"entidades" | "usuarios">("entidades");
  const [entidadeInternalTab, setEntidadeInternalTab] = useState<"secretarias" | "usuarios">("secretarias");
  const [entSecretariaSearch, setEntSecretariaSearch] = useState("");
  const [entUsuarioSearch, setEntUsuarioSearch] = useState("");
  const [adminSelEntidadeId, setAdminSelEntidadeId] = useState<string | null>(null);
  const [adminSelSecretariaId, setAdminSelSecretariaId] = useState<string | null>(null);
  const [adminDataTab, setAdminDataTab] = useState<"contrato" | "sistemas" | "nfs" | "relatorios">("contrato");
  // Formulários de criação
  const maskCNPJ = (v: string): string => { const d = v.replace(/\D/g,"").slice(0,14); if(d.length<=2) return d; if(d.length<=5) return `${d.slice(0,2)}.${d.slice(2)}`; if(d.length<=8) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5)}`; if(d.length<=12) return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8)}`; return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`; };
  const maskPhone = (v: string): string => { const d = v.replace(/\D/g,"").slice(0,11); if(!d.length) return ""; if(d.length<=2) return `(${d}`; if(d.length<=6) return `(${d.slice(0,2)}) ${d.slice(2)}`; if(d.length<=10) return `(${d.slice(0,2)}) ${d.slice(2,6)}-${d.slice(6)}`; return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`; };
  const maskDate = (v: string): string => { const d = v.replace(/\D/g,"").slice(0,8); if(d.length<=2) return d; if(d.length<=4) return `${d.slice(0,2)}/${d.slice(2)}`; return `${d.slice(0,2)}/${d.slice(2,4)}/${d.slice(4)}`; };
  const validarCNPJ = (cnpj: string): boolean => { const d=cnpj.replace(/\D/g,""); if(d.length!==14||/^(\d)\1+$/.test(d)) return false; let s=0,pos=5; for(let i=0;i<12;i++){s+=parseInt(d[i])*pos--;if(pos<2)pos=9;} let r=s%11<2?0:11-(s%11); if(r!==parseInt(d[12])) return false; s=0;pos=6; for(let i=0;i<13;i++){s+=parseInt(d[i])*pos--;if(pos<2)pos=9;} r=s%11<2?0:11-(s%11); return r===parseInt(d[13]); };
  const [novaEntidadeForm, setNovaEntidadeForm] = useState({ nome: "", tipo: "", cidade: "", responsavel: "", cnpj: "", telefone: "" });
  const [entidadeSearch, setEntidadeSearch] = useState("");
  const [showCidadeDropdown, setShowCidadeDropdown] = useState(false);
  const [showEntidadeDropdown, setShowEntidadeDropdown] = useState(false);
  const [entidadeHighlight, setEntidadeHighlight] = useState(0);
  const [usuarioSearch, setUsuarioSearch] = useState("");
  const [clientNfSearch, setClientNfSearch] = useState("");
  const [clientContratoSearch, setClientContratoSearch] = useState("");
  const [clientRelatorioSearch, setClientRelatorioSearch] = useState("");
  const [clientContratoExpandido, setClientContratoExpandido] = useState<string | null>(null);
  const [showMarcarPagoModal, setShowMarcarPagoModal] = useState(false);
  const [nfPagamentoIdx, setNfPagamentoIdx] = useState<number | null>(null);
  const [pagamentoMinData, setPagamentoMinData] = useState("");
  const [pagamentoDataError, setPagamentoDataError] = useState("");
  const [pagamentoComprovanteNome, setPagamentoComprovanteNome] = useState("");
  const [nfPagamentoIsEdit, setNfPagamentoIsEdit] = useState(false);
  const [pagamentoData, setPagamentoData] = useState("");
  const [pagamentoComprovante, setPagamentoComprovante] = useState("");
  const [cidadeHighlight, setCidadeHighlight] = useState(0);
  const [editSecretariaId, setEditSecretariaId] = useState<string | null>(null);
  const [novaSecretariaForm, setNovaSecretariaForm] = useState({ nome: "", secretario: "", telefone: "" });
  const [novoUserForm, setNovoUserForm] = useState({ nome: "", login: "", senha: "", entidadeId: "", secretariaId: "", cargo: "", telefone: "", foto: "" });
  const [editUserForm, setEditUserForm] = useState<ClientUser | null>(null);
  const [novaNotaForm, setNovaNotaForm] = useState({ numero: "", data: "", dataVencimento: "", referencia: "", valor: "", status: "Pendente", arquivo: "", comprovante: "", dataPagamento: "" });
  const [editNfIndex, setEditNfIndex] = useState<number | null>(null);
  const [pagarNfIndex, setPagarNfIndex] = useState<number | null>(null);
  const [pagarNfForm, setPagarNfForm] = useState({ dataPagamento: "", comprovante: "" });
  const [nfSearch, setNfSearch] = useState("");
  const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  const [refSugestoes, setRefSugestoes] = useState<string[]>([]);
  const [novoRelatorioForm, setNovoRelatorioForm] = useState({ titulo: "", data: "", tipo: "", arquivo: "", referencia: "" });
  const [editRelatorioIndex, setEditRelatorioIndex] = useState<number | null>(null);
  const [relatorioSearch, setRelatorioSearch] = useState("");
  const [relSugestoes, setRelSugestoes] = useState<string[]>([]);
  const [sisSugestoes, setSisSugestoes] = useState<string[]>([]);
  const [contratoSearch, setContratoSearch] = useState("");
  const [sistemaSearch, setSistemaSearch] = useState("");
  const [novoSistemaForm, setNovoSistemaForm] = useState({ nome: "", status: "Ativo", dataInicio: "" });
  const [editSistemaIndex, setEditSistemaIndex] = useState<number | null>(null);
  // Contrato — states
  const emptyContratoForm = () => ({ numero: "", objeto: "", numeroLicitacao: "", dataInicial: "", dataEncerramento: "", valorMensal: "", quantidadeMeses: "", arquivo: "", artigo: "" });
  const emptyAditivoForm = () => ({ numero: "", objeto: "", tipos: [] as string[], dataInicial: "", dataEncerramento: "", novoValorMensal: "", arquivo: "" });
  const [showContratoModal, setShowContratoModal] = useState(false);
  const [editContratoId, setEditContratoId] = useState<string | null>(null);
  const [contratoForm, setContratoForm] = useState(emptyContratoForm());
  const [showAditivoModal, setShowAditivoModal] = useState(false);
  const [aditivoParaContratoId, setAditivoParaContratoId] = useState<string | null>(null);
  const [editAditivoId, setEditAditivoId] = useState<string | null>(null);
  const [aditivoForm, setAditivoForm] = useState(emptyAditivoForm());
  const [aditivoErroValor, setAditivoErroValor] = useState<string | null>(null);
  const [contratoExpandido, setContratoExpandido] = useState<string | null>(null);
  // Dados do usuário logado (null-safe)
  const loggedEnt = entidades.find(e => e.id === loggedInUser?.entidadeId) ?? null;
  const loggedSec = loggedEnt?.secretarias.find(s => s.id === loggedInUser?.secretariaId) ?? null;

  // helper: atualiza secretaria dentro da entidade
  const updateSecretaria = (entId: string, secId: string, fn: (s: SecretariaData) => SecretariaData) => {
    setEntidades(prev => prev.map(e => e.id === entId
      ? { ...e, secretarias: e.secretarias.map(s => s.id === secId ? fn(s) : s) }
      : e
    ));
  };

  // [SECURITY] Sanitização Anti-XSS: remove tags HTML e caracteres de injeção de inputs
  const sanitizeInput = (value: string): string => {
    return value
      .replace(/[<>"'`]/g, '')           // Remove caracteres HTML perigosos
      .replace(/javascript:/gi, '')       // Bloqueia javascript: URIs
      .replace(/on\w+\s*=/gi, '')         // Remove event handlers inline
      .replace(/[\x00-\x1F\x7F]/g, '')   // Remove caracteres de controle
      .trim()
      .slice(0, 200);                     // Limita tamanho máximo do input
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const safeEmail    = sanitizeInput(loginEmail);
    const safePassword = sanitizeInput(loginPassword);
    const { userId, error: authError } = await authLogin(safeEmail, safePassword);
    if (authError || !userId) {
      setLoginError("E-mail ou senha incorretos. Verifique seus dados e tente novamente.");
      return;
    }
    const user = await fetchClientUserById(userId);
    if (!user) {
      setLoginError("Usuário não encontrado. Entre em contato com o suporte.");
      return;
    }
    const ent = entidades.find(e => e.id === user.entidadeId);
    if (ent && !ent.ativo) {
      setLoginError("Contrato Inativo ou Suspenso, entre em contato com o nosso suporte.");
      return;
    }
    const sec = ent?.secretarias.find(s => s.id === user.secretariaId);
    if (sec && sec.ativo === false) {
      setLoginError("Contrato Inativo ou Suspenso, entre em contato com o nosso suporte.");
      return;
    }
    setLoggedInUser(user);
    setIsLoggedIn(true);
    setShowLoginModal(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginError("");
  };

  const handleLogout = () => {
    authLogout().catch(console.error);
    setIsLoggedIn(false);
    setLoggedInUser(null);
    setShowUserMenu(false);
    setCurrentModal(null);
  };

  useEffect(() => {
    Promise.all([
      fetchSiteContent(),
      fetchSolucoes(),
      fetchStats(),
      fetchClientes(),
      fetchDepoimentos(),
      fetchCertidoes(),
      fetchBlogPosts(),
      fetchEntidades(),
      fetchClientUsers(),
    ]).then(([sc, sol, st, cli, dep, cert, blog, ents, users]) => {
      if (Object.keys(sc).length > 0) {
        setSiteContent(prev => ({ ...prev, ...sc }));
        setSavedSiteContent(prev => ({ ...prev, ...sc }));
      }
      if (sol.length > 0) setSolucoes(sol);
      if (st.length > 0) { setStats(st); setSavedStats(st); }
      if (cli.length > 0) setClientes(cli);
      if (dep.length > 0) setDepoimentos(dep);
      if (cert.length > 0) { setCertidoes(cert); setSavedCertidoes(cert); }
      if (blog.length > 0) setBlogPosts(blog);
      setEntidades(ents);
      setClientUsers(users);
    });
  }, []);

  // [SECURITY] Kill-switch de inatividade: logout automático após 300s sem interação
  useEffect(() => {
    if (!isLoggedIn) return;
    const TIMEOUT_MS = 300_000; // 5 minutos
    let timer: ReturnType<typeof setTimeout>;
    const reset = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        // Limpa sessão e redireciona para tela inicial
        setIsLoggedIn(false);
        setLoggedInUser(null);
        setCurrentModal(null);
        try { localStorage.removeItem("jeosSessionToken"); } catch (_) {}
      }, TIMEOUT_MS);
    };
    const events: (keyof WindowEventMap)[] = ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'];
    events.forEach(ev => window.addEventListener(ev, reset, { passive: true }));
    reset(); // inicia o timer imediatamente
    return () => {
      clearTimeout(timer);
      events.forEach(ev => window.removeEventListener(ev, reset));
    };
  }, [isLoggedIn]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser === "admin" && adminPass === "jeos@2026") {
      setIsAdmin(true);
      setAdminLanding(true);
      setShowAdminLogin(false);
      setAdminUser("");
      setAdminPass("");
    } else {
      alert("Usuário ou senha incorretos!");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setAdminLanding(true);
    setAdminSection("dashboard");
  };

  const updateContent = (field: keyof typeof defaultSiteContent, value: string) => {
    setSiteContent((prev: typeof defaultSiteContent) => ({ ...prev, [field]: value }));
  };

  const readFileAsBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const stripCertDate = (v?: string) =>
    (v || '').replace(/^(válida\s*até|validade|atualizado\s*em|emiss[aã]o|emiss?\.?)\s*[:;.\s]*/gi, '').trim();

  const fmtDate = (raw: string) => {
    const orig = raw.replace(/\D/g, '');
    let dd = orig.slice(0, 2);
    let mm = orig.slice(2, 4);
    const yyyy = orig.slice(4, 8);
    if (dd.length === 1 && +dd > 3) dd = '0' + dd;
    if (dd.length === 2 && +dd > 31) dd = '31';
    if (dd === '00') dd = '01';
    if (mm.length === 1 && +mm > 1) mm = '0' + mm;
    if (mm.length === 2 && +mm > 12) mm = '12';
    if (mm === '00') mm = '01';
    if (orig.length <= 2) return dd;
    if (orig.length <= 4) return `${dd}/${mm}`;
    return `${dd}/${mm}/${yyyy}`;
  };

  const fmtValidade = fmtDate;
  const fmtEmissao = fmtDate;

  const fileInputClass = isDarkMode
    ? "w-full text-sm text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-500/20 file:text-purple-300 hover:file:bg-purple-500/30 cursor-pointer"
    : "w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-100 file:text-purple-700 hover:file:bg-purple-200 cursor-pointer";

  const saveContent = async () => {
    try {
      await Promise.all([
        saveSiteContent(siteContent),
        saveSolucoes(solucoes),
        saveStats(stats),
        saveClientes(clientes),
        saveDepoimentos(depoimentos),
        saveCertidoes(certidoes.map(c => ({ ...c, arquivo: c.arquivo ?? "" }))),
      ]);
      setSavedStats([...stats]);
      setSavedCertidoes([...certidoes]);
      setSavedSiteContent({...siteContent});
      setSavedFeedback(true);
      setTimeout(() => setSavedFeedback(false), 2500);
    } catch {
      alert('Erro ao salvar. Verifique a conexão e tente novamente.');
    }
  };

  useEffect(() => {
    if (blogPosts.length <= 3) return;
    const timer = setInterval(() => {
      setBlogPreviewAnimating(true);
      setTimeout(() => {
        setBlogPreviewIdx(prev => (prev + 3) % blogPosts.length);
        setBlogPreviewAnimating(false);
      }, 300);
    }, 4500);
    return () => clearInterval(timer);
  }, [blogPosts.length]);

  // Auto-play do carrossel de clientes
  useEffect(() => {
    if (clientes.length <= 5) return;
    const timer = setInterval(() => {
      setClienteAnimating(true);
      setTimeout(() => {
        setClienteIdx(prev => (prev + 5) % clientes.length);
        setClienteAnimating(false);
      }, 300);
    }, 4000);
    return () => clearInterval(timer);
  }, [clientes.length]);

  const goToCliente = (direction: "prev" | "next") => {
    setClienteAnimating(true);
    setTimeout(() => {
      setClienteIdx(prev =>
        direction === "next"
          ? (prev + 5) % clientes.length
          : (prev - 5 + clientes.length) % clientes.length
      );
      setClienteAnimating(false);
    }, 300);
  };

  // Auto-play do carrossel de depoimentos
  useEffect(() => {
    if (depoimentos.length <= 3) return;
    const timer = setInterval(() => {
      setTestimonialAnimating(true);
      setTimeout(() => {
        setTestimonialIdx(prev => (prev + 3) % depoimentos.length);
        setTestimonialAnimating(false);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, [depoimentos.length]);

  // Ao sair da aba Estatísticas sem salvar, reverte para o estado salvo
  useEffect(() => {
    if (adminSection !== "stats") {
      setStats([...savedStats]);
    }
    if (adminSection !== "certidoes") {
      setCertidoes([...savedCertidoes]);
    }
    // Ao sair de qualquer aba sem salvar, reverte siteContent para o estado salvo
    setSiteContent({...savedSiteContent});
    setAdminEditIndex(null);
    setEditBuffer(null);
  }, [adminSection]);

  const goToBlogPreview = (direction: "prev" | "next") => {
    setBlogPreviewAnimating(true);
    setTimeout(() => {
      setBlogPreviewIdx(prev =>
        direction === "next"
          ? (prev + 3) % blogPosts.length
          : (prev - 3 + blogPosts.length) % blogPosts.length
      );
      setBlogPreviewAnimating(false);
    }, 300);
  };

  const goToTestimonial = (direction: "prev" | "next") => {
    setTestimonialAnimating(true);
    setTimeout(() => {
      setTestimonialIdx(prev =>
        direction === "next"
          ? (prev + 3) % depoimentos.length
          : (prev - 3 + depoimentos.length) % depoimentos.length
      );
      setTestimonialAnimating(false);
    }, 300);
  };

  const solucoesIconMap: Record<string, typeof Calculator> = {
    contabilidade: Calculator,
    rh: Users,
    licitacoes: FileText,
    protocolo: Inbox,
    tributacao: Calculator,
    patrimonio: Package,
  };
  const solucaoIconPickerMap: Record<string, React.ElementType> = {
    Calculator, Users, FileText, Inbox, Package, DollarSign, Shield, Settings,
    Award, Briefcase, TrendingUp, CheckCircle2, Phone, Mail, MapPin, Calendar,
    FileCheck, Lock, MessageCircle, Headphones, Download, Eye,
    Building2, Home, BarChart3, Globe, ClipboardList, BookOpen, Landmark, Database, PieChart, Truck,
  };
  const solucaoIconOptions = [
    { key: "Calculator", label: "Calculadora" }, { key: "DollarSign", label: "Finanças" },
    { key: "Users", label: "Pessoas" }, { key: "Briefcase", label: "Pasta" },
    { key: "FileText", label: "Documento" }, { key: "ClipboardList", label: "Lista" },
    { key: "Inbox", label: "Protocolo" }, { key: "BookOpen", label: "Manual" },
    { key: "Package", label: "Caixa" }, { key: "Database", label: "Banco Dados" },
    { key: "Shield", label: "Segurança" }, { key: "Lock", label: "Cadeado" },
    { key: "Settings", label: "Config." }, { key: "TrendingUp", label: "Gráfico" },
    { key: "BarChart3", label: "Estatística" }, { key: "PieChart", label: "Pizza" },
    { key: "Award", label: "Premiação" }, { key: "CheckCircle2", label: "Aprovado" },
    { key: "Calendar", label: "Calendário" }, { key: "FileCheck", label: "Arquivo OK" },
    { key: "Landmark", label: "Governo" }, { key: "Building2", label: "Prédio" },
    { key: "Home", label: "Casa" }, { key: "Globe", label: "Global" },
    { key: "Headphones", label: "Suporte" }, { key: "MessageCircle", label: "Chat" },
    { key: "Phone", label: "Telefone" }, { key: "Mail", label: "E-mail" },
    { key: "Download", label: "Download" }, { key: "Truck", label: "Transporte" },
    { key: "Eye", label: "Visualizar" }, { key: "MapPin", label: "Local" },
  ];
  const products = solucoes.map(s => ({ ...s, icon: (solucaoIconPickerMap[s.icone ?? ""] ?? solucoesIconMap[s.id] ?? Package) as React.ElementType }));

  // Painel Administrativo
  if (isAdmin) {

    // Tela de seleção de área
    if (adminLanding) {
      return (
        <div className={isDarkMode ? "min-h-screen bg-slate-950 flex flex-col" : "min-h-screen bg-gray-100 flex flex-col"}>
          {/* Header */}
          <header className={isDarkMode
            ? "bg-slate-900 border-b border-purple-500/20 py-4 sticky top-0 z-50 shadow-2xl"
            : "bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-md"
          }>
            <div className="container mx-auto px-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={isDarkMode ? logoJeosBranca : logoJeosColorida} alt="JEOS" className="h-12 w-auto" />
                <span className="text-xs font-bold px-2 py-1 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white tracking-wider">ADMIN</span>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}
                  className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "border-purple-500 text-purple-600 hover:bg-purple-50"}>
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={handleAdminLogout}
                  className={isDarkMode ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-500 text-red-600 hover:bg-red-50"}>
                  <LogOut className="w-4 h-4 mr-2" />Sair
                </Button>
              </div>
            </div>
          </header>

          {/* Seleção de área */}
          <div className="flex-1 flex flex-col items-center justify-center p-8">
            <div className="text-center mb-12">
              <h1 className={`text-4xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                Painel Administrativo
              </h1>
              <p className={isDarkMode ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}>
                Selecione a área que deseja gerenciar
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-3xl">
              {/* Card Página Pública */}
              <button
                onClick={() => setAdminLanding(false)}
                className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border border-purple-500/20 hover:border-purple-500/60"
                    : "bg-white border border-gray-200 shadow-lg hover:border-purple-400 hover:shadow-xl"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-cyan-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/30 transition-shadow">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Página Pública
                  </h2>
                  <p className={isDarkMode ? "text-gray-400 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed"}>
                    Gerencie o conteúdo do site: hero, sobre nós, soluções, clientes, depoimentos, certidões, blog e muito mais.
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>
                      Acessar
                    </span>
                    <span className={`text-lg transition-transform duration-200 group-hover:translate-x-1 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>→</span>
                  </div>
                </div>
              </button>

              {/* Card Portal do Cliente */}
              <button
                onClick={() => { setAdminSection("cliente"); setAdminLanding(false); }}
                className={`group relative overflow-hidden rounded-2xl p-8 text-left transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none ${
                  isDarkMode
                    ? "bg-slate-900 border border-cyan-500/20 hover:border-cyan-500/60"
                    : "bg-white border border-gray-200 shadow-lg hover:border-cyan-400 hover:shadow-xl"
                }`}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center mb-6 shadow-lg group-hover:shadow-cyan-500/30 transition-shadow">
                    <Lock className="w-8 h-8 text-white" />
                  </div>
                  <h2 className={`text-2xl font-bold mb-3 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                    Portal do Cliente
                  </h2>
                  <p className={isDarkMode ? "text-gray-400 text-sm leading-relaxed" : "text-gray-600 text-sm leading-relaxed"}>
                    Gerencie as informações do cliente: dados, contrato, sistemas contratados, notas fiscais e relatórios.
                  </p>
                  <div className="mt-6 flex items-center gap-2">
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>
                      Acessar
                    </span>
                    <span className={`text-lg transition-transform duration-200 group-hover:translate-x-1 ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>→</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      );
    }

    const adminMenuItems = [
      { id: "dashboard", label: "Dashboard", icon: TrendingUp },
      { id: "hero", label: "Hero / Banner", icon: Award },
      { id: "sobre", label: "Sobre Nós", icon: Users },
      { id: "stats", label: "Estatísticas", icon: Shield },
      { id: "solucoes", label: "Soluções", icon: Package },
      { id: "clientes", label: "Clientes", icon: Briefcase },
      { id: "depoimentos", label: "Depoimentos", icon: Quote },
      { id: "certidoes", label: "Certidões", icon: FileCheck },
      { id: "contato", label: "Contato", icon: Phone },
      { id: "redes", label: "Redes Sociais", icon: Globe },
      { id: "blog", label: "Blog", icon: BookOpen },
    ];
    const inputClass = isDarkMode
      ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
      : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500";
    const labelClass = isDarkMode
      ? "text-gray-300 text-sm font-medium mb-2 block"
      : "text-gray-700 text-sm font-medium mb-2 block";

    // Portal do Cliente — layout dedicado, separado do painel da página pública
    if (adminSection === "cliente") {
      const selEntidade = entidades.find(e => e.id === adminSelEntidadeId) ?? null;
      const selSecretaria = selEntidade?.secretarias.find(s => s.id === adminSelSecretariaId) ?? null;
      const updSec = (fn: (s: SecretariaData) => SecretariaData) => {
        if (adminSelEntidadeId && adminSelSecretariaId) {
          updateSecretaria(adminSelEntidadeId, adminSelSecretariaId, fn);
          setTimeout(() => persistSec().catch(console.error), 100);
        }
      };
      const persistSec = async () => {
        const ent = entidades.find(e => e.id === adminSelEntidadeId);
        const sec = ent?.secretarias.find(s => s.id === adminSelSecretariaId);
        if (!ent || !sec) return;
        await upsertSecretaria(ent.id, sec);
        for (const ct of sec.contratos ?? []) {
          await upsertContrato(sec.id, ct);
          for (const ad of ct.aditivos ?? []) await upsertAditivo(ct.id, ad);
        }
        await upsertNotasFiscais(sec.id, sec.notasFiscais ?? []);
        await upsertRelatorios(sec.id, sec.relatorios ?? []);
        await upsertSistemas(sec.id, sec.sistemasContratados ?? []);
      };
      const saveTodo = async () => {
        try { await persistSec(); } catch(e) { console.error(e); }
        setSavedFeedback(true); setTimeout(() => setSavedFeedback(false), 2500);
      };
      return (
        <div className={`flex min-h-screen ${isDarkMode ? "bg-slate-950" : "bg-gray-100"}`}>
          {/* Overlay backdrop mobile */}
          {clienteAdminSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setClienteAdminSidebarOpen(false)} />
          )}
          {/* Sidebar */}
          <aside className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col transition-transform duration-300
            md:sticky md:top-0 md:translate-x-0 md:z-auto md:flex-shrink-0 md:h-screen md:self-start
            ${clienteAdminSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${isDarkMode ? "bg-slate-900 border-r border-purple-500/20" : "bg-white border-r border-gray-200 shadow-md"}
          `}>
            <div className="p-5 border-b border-purple-500/20 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img src={isDarkMode ? logoJeosBranca : logoJeosColorida} alt="JEOS" className="h-10 w-auto" />
                <span className="text-xs font-bold px-2 py-1 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white tracking-wider">ADMIN</span>
              </div>
              <button onClick={() => setClienteAdminSidebarOpen(false)} className={`md:hidden p-1.5 rounded-lg ${isDarkMode ? "text-gray-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-5 py-4">
              <p className={`text-xs font-semibold uppercase tracking-widest ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>Portal do Cliente</p>
            </div>
            <nav className="flex-1 px-3 space-y-1">
              {([
                { id: "entidades" as const, label: "Entidades", icon: Building2 },
                { id: "usuarios" as const, label: "Usuários", icon: Users },
              ]).map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} onClick={() => { setAdminClientSubSection(tab.id); setAdminSelEntidadeId(null); setAdminSelSecretariaId(null); setClienteAdminSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer text-left ${
                      adminClientSubSection === tab.id
                        ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow"
                        : isDarkMode ? "text-gray-400 hover:bg-slate-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                    }`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />{tab.label}
                  </button>
                );
              })}
            </nav>
            <div className={`p-4 border-t space-y-2 ${isDarkMode ? "border-purple-500/20" : "border-gray-200"}`}>
              <button onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${isDarkMode ? "text-gray-400 hover:bg-slate-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"}`}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Modo Claro" : "Modo Escuro"}
              </button>
              <button onClick={() => { setAdminLanding(true); setAdminSection("dashboard"); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${isDarkMode ? "text-cyan-400 hover:bg-cyan-500/10" : "text-cyan-600 hover:bg-cyan-50"}`}>
                <ArrowLeft className="w-4 h-4" />Voltar
              </button>
              <button onClick={handleAdminLogout}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"}`}>
                <LogOut className="w-4 h-4" />Sair
              </button>
            </div>
          </aside>

          {/* Conteúdo principal */}
          <main className="flex-1 p-4 md:p-8 overflow-auto">
            {/* Barra mobile com botão de menu */}
            <div className="flex items-center gap-3 mb-4 md:hidden">
              <button onClick={() => setClienteAdminSidebarOpen(true)}
                className={`p-2 rounded-lg transition ${isDarkMode ? "bg-slate-800 text-purple-400 hover:bg-slate-700" : "bg-white text-purple-600 border border-gray-200 hover:bg-gray-50 shadow-sm"}`}>
                <Menu className="w-5 h-5" />
              </button>
              <span className={`text-sm font-semibold capitalize ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                {adminClientSubSection === "entidades" ? "Entidades" : "Usuários"}
              </span>
            </div>
            <div className="max-w-5xl mx-auto">

              {/* ── ABA ENTIDADES ── */}
              {adminClientSubSection === "entidades" && !adminSelEntidadeId && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Entidades</h1>
                    <div className="flex gap-3">
                      <Button onClick={() => setShowAddModal("entidade")} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">+ Adicionar</Button>
                      <Button onClick={saveTodo} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />{savedFeedback ? "Salvo!" : "Salvar"}
                      </Button>
                    </div>
                  </div>
                  {/* Lista de entidades */}
                  <div className="flex gap-3 mb-4">
                    <input type="text" value={entidadeSearch} onChange={e => setEntidadeSearch(e.target.value)} placeholder="Buscar por nome ou tipo..." className={`${inputClass} flex-1`} />
                    {entidadeSearch && <button onClick={() => setEntidadeSearch("")} className={`px-3 py-2 rounded-lg border text-sm ${isDarkMode ? "border-gray-600 text-gray-400 hover:text-white" : "border-gray-300 text-gray-500 hover:text-gray-700"}`}>× Limpar</button>}
                  </div>
                  <div className="space-y-3">
                    {entidades.length === 0 && (
                      <p className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma entidade cadastrada ainda.</p>
                    )}
                    {entidades.filter(e => !entidadeSearch.trim() || e.nome.toLowerCase().includes(entidadeSearch.toLowerCase()) || (e.tipo ?? "").toLowerCase().includes(entidadeSearch.toLowerCase())).map(ent => (
                      <Card key={ent.id} className={`transition ${ent.ativo !== false ? "cursor-pointer hover:border-orange-400" : "opacity-60"} ${isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}`}
                        onClick={() => ent.ativo !== false && (setAdminSelEntidadeId(ent.id), setEntidadeInternalTab("secretarias"))}>
                        <CardContent className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${ent.ativo !== false ? (isDarkMode ? "bg-orange-500/10" : "bg-orange-50") : (isDarkMode ? "bg-gray-700" : "bg-gray-100")}`}>
                              <Building2 className={`w-5 h-5 ${ent.ativo !== false ? "text-orange-500" : "text-gray-400"}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{ent.nome}</p>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ent.ativo !== false ? "bg-green-500/20 text-green-500" : "bg-gray-400/20 text-gray-400"}`}>{ent.ativo !== false ? "Ativo" : "Inativo"}</span>
                                {ent.tipo && <span className="text-xs px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 font-medium">{ent.tipo}</span>}
                              </div>
                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{ent.secretarias.length} secretaria(s)</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button title={ent.ativo !== false ? "Desativar" : "Ativar"}
                              onClick={e => { e.stopPropagation(); const novoAtivo = !(ent.ativo !== false); setEntidades(prev => prev.map(x => x.id === ent.id ? { ...x, ativo: novoAtivo } : x)); upsertEntidade({ ...ent, ativo: novoAtivo }).catch(console.error); }}
                              className={`p-2 rounded-lg transition ${ent.ativo !== false ? (isDarkMode ? "text-green-400 hover:bg-green-500/10" : "text-green-600 hover:bg-green-50") : (isDarkMode ? "text-gray-500 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100")}`}>
                              <Power className="w-4 h-4" />
                            </button>
                            <button title="Editar"
                              onClick={e => { e.stopPropagation(); setEditEntidadeId(ent.id); setNovaEntidadeForm({ nome: ent.nome, tipo: ent.tipo ?? "", cidade: ent.cidade ?? "", responsavel: ent.responsavel ?? "", cnpj: ent.cnpj ?? "", telefone: ent.telefone ?? "" }); setShowAddModal("entidade"); }}
                              className={`p-2 rounded-lg transition ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}>
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button title="Excluir"
                              onClick={e => { e.stopPropagation(); setConfirmDelete({ label: ent.nome, onConfirm: () => { setEntidades(prev => prev.filter(x => x.id !== ent.id)); deleteEntidade(ent.id).catch(console.error); } }); }}
                              className={`p-2 rounded-lg transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}>
                              <span className="text-base">🗑</span>
                            </button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* ── DENTRO DA ENTIDADE: lista de secretarias ── */}
              {adminClientSubSection === "entidades" && adminSelEntidadeId && !adminSelSecretariaId && selEntidade && (
                <div>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <button onClick={() => { setAdminSelEntidadeId(null); setEntidadeInternalTab("secretarias"); }} className="text-orange-400 hover:text-orange-300 transition">← Entidades</button>
                    <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>/</span>
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">{selEntidade.nome}</h1>
                    <div className="flex-1" />
                    <div className="flex gap-3">
                      {entidadeInternalTab === "secretarias" && (
                        <Button onClick={() => { setEditSecretariaId(null); setNovaSecretariaForm({ nome: "", secretario: "", telefone: "" }); setShowAddModal("secretaria"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">+ Adicionar</Button>
                      )}
                      {entidadeInternalTab === "usuarios" && (
                        <Button onClick={() => { setNovoUserForm({ nome: "", login: "", senha: "", entidadeId: adminSelEntidadeId, secretariaId: "", cargo: "", telefone: "", foto: "" }); setShowAddModal("usuario"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">+ Adicionar</Button>
                      )}
                      <Button onClick={saveTodo} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />{savedFeedback ? "Salvo!" : "Salvar"}
                      </Button>
                    </div>
                  </div>

                  {/* Sub-abas */}
                  <div className="flex gap-2 mb-5">
                    {(["secretarias", "usuarios"] as const).map(tab => (
                      <button key={tab} onClick={() => setEntidadeInternalTab(tab)}
                        className={`px-5 py-2 rounded-xl text-sm font-semibold transition ${entidadeInternalTab === tab ? "bg-gradient-to-r from-purple-600 to-cyan-600 text-white shadow" : isDarkMode ? "bg-slate-800 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-slate-800"}`}>
                        {tab === "secretarias" ? "Secretarias" : "Usuários"}
                      </button>
                    ))}
                  </div>

                  {/* Aba Secretarias */}
                  {entidadeInternalTab === "secretarias" && (
                    <div className="space-y-3">
                      <input type="text" value={entSecretariaSearch} onChange={e => setEntSecretariaSearch(e.target.value)}
                        placeholder="Pesquisar por nome, secretário, status..."
                        className={`w-full px-4 py-2 rounded-xl border text-sm mb-1 ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`} />
                      {selEntidade.secretarias.length === 0 && (
                        <p className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma secretaria cadastrada nesta entidade.</p>
                      )}
                      {selEntidade.secretarias.filter(sec => {
                        const q = entSecretariaSearch.trim().toLowerCase();
                        if (!q) return true;
                        return sec.nome.toLowerCase().includes(q) || (sec.responsavel ?? "").toLowerCase().includes(q) || (sec.ativo !== false ? "ativo" : "inativo").includes(q);
                      }).map(sec => (
                        <Card key={sec.id} className={`transition ${sec.ativo !== false ? "cursor-pointer hover:border-purple-400" : "opacity-60 cursor-default"} ${isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}`}
                          onClick={() => { if (sec.ativo !== false) { setAdminSelSecretariaId(sec.id); setAdminDataTab("contrato"); } }}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`p-2 rounded-lg ${sec.ativo !== false ? (isDarkMode ? "bg-purple-500/10" : "bg-purple-50") : (isDarkMode ? "bg-gray-700" : "bg-gray-100")}`}>
                                <Users className={`w-5 h-5 ${sec.ativo !== false ? "text-purple-500" : "text-gray-400"}`} />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{sec.nome}</p>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${sec.ativo !== false ? "bg-green-500/20 text-green-500" : "bg-gray-400/20 text-gray-400"}`}>{sec.ativo !== false ? "Ativo" : "Inativo"}</span>
                                </div>
                                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{sec.responsavel || "Secretário não definido"} · {sec.sistemasContratados.length} sistema(s)</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <button title={sec.ativo !== false ? "Desativar" : "Ativar"}
                                onClick={e => { e.stopPropagation(); const novoAtivo = !(sec.ativo !== false); setEntidades(prev => prev.map(ent => ent.id === adminSelEntidadeId ? { ...ent, secretarias: ent.secretarias.map(s => s.id === sec.id ? { ...s, ativo: novoAtivo } : s) } : ent)); if (adminSelEntidadeId) upsertSecretaria(adminSelEntidadeId, { ...sec, ativo: novoAtivo }).catch(console.error); }}
                                className={`p-2 rounded-lg transition ${sec.ativo !== false ? (isDarkMode ? "text-green-400 hover:bg-green-500/10" : "text-green-600 hover:bg-green-50") : (isDarkMode ? "text-gray-500 hover:bg-gray-700" : "text-gray-400 hover:bg-gray-100")}`}>
                                <Power className="w-4 h-4" />
                              </button>
                              <button title="Editar"
                                onClick={e => { e.stopPropagation(); setEditSecretariaId(sec.id); setNovaSecretariaForm({ nome: sec.nome, secretario: sec.responsavel ?? "", telefone: sec.telefone ?? "" }); setShowAddModal("secretaria"); }}
                                className={`p-2 rounded-lg transition ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}>
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button title="Excluir"
                                onClick={e => { e.stopPropagation(); setConfirmDelete({ label: sec.nome, onConfirm: () => { setEntidades(prev => prev.map(ent => ent.id === adminSelEntidadeId ? { ...ent, secretarias: ent.secretarias.filter(s => s.id !== sec.id) } : ent)); deleteSecretaria(sec.id).catch(console.error); } }); }}
                                className={`p-2 rounded-lg transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}>
                                <span className="text-base">🗑</span>
                              </button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Aba Usuários da Entidade */}
                  {entidadeInternalTab === "usuarios" && (() => {
                    const q = entUsuarioSearch.trim().toLowerCase();
                    const entUsers = clientUsers.filter(u => {
                      if (u.entidadeId !== adminSelEntidadeId) return false;
                      if (!q) return true;
                      const sec = selEntidade.secretarias.find(s => s.id === u.secretariaId);
                      return u.nome.toLowerCase().includes(q) || u.login.toLowerCase().includes(q) || (sec?.nome ?? "").toLowerCase().includes(q);
                    });
                    const allEntUsers = clientUsers.filter(u => u.entidadeId === adminSelEntidadeId);
                    return (
                      <div className="space-y-3">
                        <input type="text" value={entUsuarioSearch} onChange={e => setEntUsuarioSearch(e.target.value)}
                          placeholder="Pesquisar por nome, e-mail, secretaria..."
                          className={`w-full px-4 py-2 rounded-xl border text-sm mb-1 ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`} />
                        {allEntUsers.length === 0 && (
                          <p className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum usuário cadastrado nesta entidade.</p>
                        )}
                        {entUsers.map(user => {
                          const sec = selEntidade.secretarias.find(s => s.id === user.secretariaId);
                          return (
                            <Card key={user.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}>
                              <CardContent className="p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${isDarkMode ? "bg-cyan-500/10" : "bg-cyan-50"}`}>
                                    {user.foto ? <img src={user.foto} alt={user.nome} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-cyan-500" />}
                                  </div>
                                  <div>
                                    <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{user.nome}</p>
                                    {user.cargo && <p className={`text-xs font-medium ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>{user.cargo}</p>}
                                    <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.login}</p>
                                    <p className={`text-xs mt-0.5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>{sec?.nome ?? "Sem secretaria"}</p>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button size="sm" variant="outline" onClick={() => { setEditUserForm({...user}); setShowAddModal("usuario"); }} className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "border-purple-500 text-purple-600 hover:bg-purple-50"}>✎ Editar</Button>
                                  <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: user.nome, onConfirm: () => { setClientUsers(prev => prev.filter(u => u.id !== user.id)); dbDeleteClientUser(user.id).catch(console.error); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                        {q && entUsers.length === 0 && allEntUsers.length > 0 && (
                          <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum usuário encontrado para "{entUsuarioSearch}".</p>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ── EDIÇÃO DE SECRETARIA: dados, contrato, sistemas, NFs, relatórios ── */}
              {adminClientSubSection === "entidades" && adminSelEntidadeId && adminSelSecretariaId && selSecretaria && (
                <div>
                  {/* Breadcrumb */}
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <button onClick={() => setAdminSelEntidadeId(null)} className="text-orange-400 hover:text-orange-300 text-sm">← Entidades</button>
                    <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>/</span>
                    <button onClick={() => setAdminSelSecretariaId(null)} className="text-orange-400 hover:text-orange-300 text-sm">{selEntidade?.nome}</button>
                    <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>/</span>
                    <span className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{selSecretaria.nome}</span>
                    <div className="flex-1" />
                    <Button onClick={() => { saveTodo(); }} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />{savedFeedback ? "Salvo!" : "Salvar Alterações"}
                    </Button>
                  </div>
                  {/* Sub-tabs */}
                  <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
                    {([
                      { id: "contrato" as const, label: "Contrato", icon: FileText },
                      { id: "sistemas" as const, label: "Sistemas", icon: Package },
                      { id: "nfs" as const, label: "Notas Fiscais", icon: DollarSign },
                      { id: "relatorios" as const, label: "Relatórios", icon: Eye },
                    ]).map(tab => {
                      const Icon = tab.icon;
                      return (
                        <button key={tab.id} onClick={() => setAdminDataTab(tab.id)}
                          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                            adminDataTab === tab.id
                              ? "bg-gradient-to-r from-orange-500 to-red-600 text-white shadow"
                              : isDarkMode ? "bg-slate-800 text-gray-400 hover:text-white" : "bg-white text-gray-600 border border-gray-200 hover:border-orange-400"
                          }`}>
                          <Icon className="w-4 h-4" />{tab.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Contrato */}
                  {adminDataTab === "contrato" && (() => {
                    const parseDate = (d: string) => { const [dd,mm,yyyy] = d.split("/"); return new Date(Number(yyyy), Number(mm)-1, Number(dd)); };
                    const diasRestantes = (enc: string) => { try { const diff = parseDate(enc).getTime() - new Date().setHours(0,0,0,0); return Math.ceil(diff / 86400000); } catch { return null; } };
                    const vigBadge = (enc: string) => { const d = diasRestantes(enc); if (d === null) return null; if (d < 0) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400">Encerrado</span>; if (d <= 90) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/20 text-yellow-400">{d}d restantes</span>; return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/20 text-green-400">{d}d restantes</span>; };
                    const valorGlobal = (vm: string, qm: string) => { const v = parseFloat(vm.replace(/[^\d.,]/g,"").replace(",",".")); const q = parseInt(qm); if (!isNaN(v) && !isNaN(q)) return `R$ ${(v*q).toLocaleString("pt-BR",{minimumFractionDigits:2})}`; return "—"; };
                    return (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <input
                          type="text"
                          value={contratoSearch}
                          onChange={e => setContratoSearch(e.target.value)}
                          placeholder="Pesquisar por número, objeto, licitação, data..."
                          className={`flex-1 px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                        />
                        <Button onClick={() => { setEditContratoId(null); setContratoForm(emptyContratoForm()); setShowContratoModal(true); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0">+ Novo Contrato</Button>
                      </div>
                      {(selSecretaria.contratos ?? []).length === 0 && (
                        <p className={`text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum contrato cadastrado.</p>
                      )}
                      {(selSecretaria.contratos ?? []).filter(ct => {
                        const q = contratoSearch.trim().toLowerCase();
                        if (!q) return true;
                        return (
                          (ct.numero ?? "").toLowerCase().includes(q) ||
                          (ct.objeto ?? "").toLowerCase().includes(q) ||
                          (ct.numeroLicitacao ?? "").toLowerCase().includes(q) ||
                          (ct.dataInicial ?? "").includes(q) ||
                          (ct.dataEncerramento ?? "").includes(q) ||
                          (ct.valorMensal ?? "").toLowerCase().includes(q)
                        );
                      }).map((ct) => {
                        const aberto = contratoExpandido === ct.id;
                        const vg = valorGlobal(ct.valorMensal, ct.quantidadeMeses);
                        return (
                          <Card key={ct.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                            <CardContent className="p-5">
                              {/* Cabeçalho do contrato */}
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setContratoExpandido(aberto ? null : ct.id)}>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Contrato Nº {ct.numero || "—"}</span>
                                    {ct.dataEncerramento && vigBadge(ct.dataEncerramento)}
                                  </div>
                                  {ct.objeto && <p className={`text-sm mt-0.5 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>{ct.objeto}</p>}
                                  <div className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                    {ct.numeroLicitacao && <span>Licitação: {ct.numeroLicitacao} · </span>}
                                    {ct.dataInicial && <span>Início: {ct.dataInicial} · </span>}
                                    {ct.dataEncerramento && <span>Enc.: {ct.dataEncerramento} · </span>}
                                    {ct.quantidadeMeses && <span>{ct.quantidadeMeses} meses · </span>}
                                    {ct.valorMensal && <span>Mensal: R$ {parseFloat(ct.valorMensal.replace(/[^\d.,]/g,"").replace(",",".")).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2})} · </span>}
                                    <span>Valor Global: {vg}</span>
                                  </div>
                                </div>
                                <div className="flex gap-1 flex-shrink-0">
                                  {ct.arquivo ? (
                                    <a href={ct.arquivo} download={`Contrato-${ct.numero}.pdf`} title="Baixar PDF do Contrato"
                                      className={`p-2 rounded-lg transition inline-flex items-center justify-center ${isDarkMode ? "text-cyan-400 hover:bg-cyan-500/10" : "text-cyan-600 hover:bg-cyan-50"}`}>
                                      <FileText className="w-4 h-4" />
                                    </a>
                                  ) : (
                                    <span className={`p-2 rounded-lg inline-flex items-center justify-center ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} title="Sem PDF">
                                      <FileText className="w-4 h-4" />
                                    </span>
                                  )}
                                  <button title="Editar" onClick={() => { setEditContratoId(ct.id); setContratoForm({ numero: ct.numero, objeto: ct.objeto ?? "", numeroLicitacao: ct.numeroLicitacao, dataInicial: ct.dataInicial, dataEncerramento: ct.dataEncerramento, valorMensal: ct.valorMensal, quantidadeMeses: ct.quantidadeMeses, arquivo: ct.arquivo, artigo: ct.artigo ?? "" }); setShowContratoModal(true); }}
                                    className={`p-2 rounded-lg transition ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}><Pencil className="w-4 h-4" /></button>
                                  <button title="Excluir" onClick={() => setConfirmDelete({ label: `Contrato Nº ${ct.numero}`, onConfirm: () => updSec(s => ({...s, contratos: (s.contratos??[]).filter(c => c.id !== ct.id)})) })}
                                    className={`p-2 rounded-lg transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}><span className="text-base">🗑</span></button>
                                  <button onClick={() => setContratoExpandido(aberto ? null : ct.id)}
                                    className={`p-2 rounded-lg transition ${isDarkMode ? "text-gray-400 hover:bg-slate-700" : "text-gray-500 hover:bg-gray-100"}`}>
                                    {aberto ? <ChevronLeft className="w-4 h-4 rotate-90" /> : <ChevronRight className="w-4 h-4 rotate-90" />}
                                  </button>
                                </div>
                              </div>
                              {/* Detalhes expandidos */}
                              {aberto && (
                                <div className="mt-4 pt-4 border-t border-purple-500/20 space-y-4">
                                  {/* Aditivos */}
                                  <div>
                                    <div className="flex items-center justify-between mb-3">
                                      <p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Aditivos ({ct.aditivos.length})</p>
                                      <button onClick={() => { setAditivoParaContratoId(ct.id); setAditivoForm(emptyAditivoForm()); setShowAditivoModal(true); }}
                                        className="text-xs px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-red-600 text-white hover:from-orange-600 hover:to-red-700 transition">+ Aditivo</button>
                                    </div>
                                    {ct.aditivos.length === 0 && <p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum aditivo.</p>}
                                    <div className="space-y-2">
                                      {ct.aditivos.map((ad, ai) => (
                                        <div key={ad.id} className={`rounded-lg p-3 ${isDarkMode ? "bg-slate-800 border border-purple-500/10" : "bg-gray-50 border border-gray-200"}`}>
                                          <div className="flex items-start justify-between">
                                            <div>
                                              <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                                {ad.numero && <span className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Aditivo Nº {ad.numero}</span>}
                                                {ad.tipos.map(t => <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${t==="Prazo" ? "bg-blue-500/20 text-blue-400" : t==="Acréscimo" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{t}</span>)}
                                              </div>
                                              {ad.objeto && <p className={`text-xs font-medium mb-0.5 ${isDarkMode ? "text-gray-200" : "text-slate-700"}`}>{ad.objeto}</p>}
                                              <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                                {ad.dataInicial} → {ad.dataEncerramento}
                                                {(ad.tipos.includes("Acréscimo") || ad.tipos.includes("Redução")) && ad.novoValorMensal && <span> · Novo valor: R$ {ad.novoValorMensal}</span>}
                                              </p>
                                            </div>
                                            <div className="flex gap-1 flex-shrink-0">
                                              {ad.arquivo ? (
                                                <a href={ad.arquivo} download={`Aditivo-${ai+1}.pdf`} title="Baixar PDF do Aditivo"
                                                  className={`p-1.5 rounded inline-flex items-center justify-center ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}>
                                                  <FileText className="w-3.5 h-3.5" />
                                                </a>
                                              ) : (
                                                <span title="Sem PDF" className={`p-1.5 rounded inline-flex items-center justify-center ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>
                                                  <FileText className="w-3.5 h-3.5" />
                                                </span>
                                              )}
                                              <button title="Editar" onClick={() => {
                                                setEditAditivoId(ad.id);
                                                setAditivoParaContratoId(ct.id);
                                                setAditivoForm({ numero: ad.numero, objeto: ad.objeto, tipos: ad.tipos, dataInicial: ad.dataInicial, dataEncerramento: ad.dataEncerramento, novoValorMensal: ad.novoValorMensal, arquivo: ad.arquivo ?? "" });
                                                setAditivoErroValor(null);
                                                setShowAditivoModal(true);
                                              }} className={`p-1.5 rounded inline-flex items-center justify-center ${isDarkMode ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-500 hover:bg-blue-50"}`}>
                                                <Pencil className="w-3.5 h-3.5" />
                                              </button>
                                              <button title="Excluir" onClick={() => setConfirmDelete({ label: `Aditivo ${ai+1}`, onConfirm: () => updSec(s => ({...s, contratos: (s.contratos??[]).map(c => {
                                                if (c.id !== ct.id) return c;
                                                const novosAds = c.aditivos.filter((_,idx) => idx !== ai);
                                                // Recalcula dataEncerramento: usa o último aditivo de Prazo restante, ou a data original do contrato
                                                const toN = (d: string) => { const p=d?.split('/'); return p?.length===3?parseInt(p[2])*10000+parseInt(p[1])*100+parseInt(p[0]):0; };
                                                const encRecalc = novosAds.filter(a => a.tipos?.includes("Prazo") && a.dataEncerramento).reduce((best, a) => toN(a.dataEncerramento)>toN(best)?a.dataEncerramento:best, "");
                                                const novaEnc = encRecalc || c.dataEncerramentoOriginal || c.dataEncerramento;
                                                // Recalcula valorMensal: usa o último aditivo de Acréscimo/Redução restante, ou o valor original
                                                const vmRecalc = novosAds.filter(a => (a.tipos?.includes("Acréscimo")||a.tipos?.includes("Redução")) && a.novoValorMensal).slice(-1)[0]?.novoValorMensal ?? null;
                                                const novoVM = vmRecalc ?? c.valorMensalOriginal ?? c.valorMensal;
                                                return {...c, aditivos: novosAds, dataEncerramento: novaEnc, valorMensal: novoVM};
                                              })})) })}
                                                className={`p-1.5 rounded inline-flex items-center justify-center ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}><span className="text-sm">🗑</span></button>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}

                      {/* Modal Novo/Editar Contrato */}
                      {showContratoModal && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                          onClick={() => { setShowContratoModal(false); setEditContratoId(null); }}>
                          <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                            onClick={e => e.stopPropagation()}>
                            <div className="p-6">
                              <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editContratoId ? "Editar Contrato" : "Novo Contrato"}</h2>
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Nº do Contrato</label><input type="text" value={contratoForm.numero} onChange={e => setContratoForm(p=>({...p,numero:e.target.value}))} className={inputClass} placeholder="001/2025" autoFocus /></div>
                                <div><label className={labelClass}>Nº Licitação/Dispensa</label><input type="text" value={contratoForm.numeroLicitacao} onChange={e => setContratoForm(p=>({...p,numeroLicitacao:e.target.value}))} className={inputClass} placeholder="DL-001/2025" /></div>
                                <div className="col-span-2"><label className={labelClass}>Objeto do Contrato</label><textarea value={contratoForm.objeto} onChange={e => setContratoForm(p=>({...p,objeto:e.target.value}))} className={`${inputClass} resize-none`} rows={2} placeholder="Fornecimento de sistema de gestão pública..." /></div>
                                <div><label className={labelClass}>Data Inicial</label><input type="text" value={contratoForm.dataInicial} onChange={e => setContratoForm(p=>({...p,dataInicial:maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                                <div><label className={labelClass}>Data Encerramento</label><input type="text" value={contratoForm.dataEncerramento} onChange={e => setContratoForm(p=>({...p,dataEncerramento:maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                                <div><label className={labelClass}>Valor Mensal (R$)</label><input type="text" value={contratoForm.valorMensal} onChange={e => setContratoForm(p=>({...p,valorMensal:e.target.value}))} className={inputClass} placeholder="0,00" /></div>
                                <div><label className={labelClass}>Quantidade de Meses</label><input type="number" min="1" value={contratoForm.quantidadeMeses} onChange={e => setContratoForm(p=>({...p,quantidadeMeses:e.target.value}))} className={inputClass} placeholder="12" /></div>
                                <div className="col-span-2">
                                  <label className={labelClass}>Valor Global</label>
                                  <p className={`px-3 py-2 rounded-lg text-sm font-bold ${isDarkMode ? "bg-slate-800 text-cyan-400" : "bg-gray-100 text-purple-700"}`}>{valorGlobal(contratoForm.valorMensal, contratoForm.quantidadeMeses)}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className={labelClass}>Embasamento Legal — Prazo Máximo (Lei 14.133/2021)</label>
                                  <select
                                    value={contratoForm.artigo ?? ""}
                                    onChange={e => setContratoForm(p => ({...p, artigo: e.target.value}))}
                                    className={inputClass}>
                                    <option value="">Não definido</option>
                                    <option value="art106">Art. 106, §2º — máx. 60 meses no total (5 anos)</option>
                                    <option value="art107">Art. 107 — máx. 120 meses no total (10 anos)</option>
                                    <option value="art114">Art. 114 — máx. 180 meses no total (15 anos)</option>
                                  </select>
                                </div>
                              </div>
                              <div className="mb-4"><label className={labelClass}>PDF do Contrato (opcional)</label>
                                {contratoForm.arquivo ? (
                                  <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl border ${isDarkMode ? "border-green-700 bg-green-900/20" : "border-green-400 bg-green-50"}`}>
                                    <span className="text-green-400 text-sm font-medium flex-1">✓ PDF carregado</span>
                                    <label className="cursor-pointer">
                                      <span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Substituir</span>
                                      <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setContratoForm(p=>({...p,arquivo:b64}));} }} />
                                    </label>
                                    <button type="button" onClick={() => setContratoForm(p=>({...p,arquivo:""}))} className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition">Remover</button>
                                  </div>
                                ) : (
                                  <div className="mt-1">
                                    <label className="cursor-pointer">
                                      <span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Escolher arquivo PDF</span>
                                      <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setContratoForm(p=>({...p,arquivo:b64}));} }} />
                                    </label>
                                    <span className={`ml-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nenhum arquivo selecionado</span>
                                  </div>
                                )}
                              </div>
                              <div className="flex justify-end gap-3">
                                <Button variant="outline" onClick={() => { setShowContratoModal(false); setEditContratoId(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                                <Button onClick={() => {
                                  if (!contratoForm.numero.trim()) return;
                                  if (editContratoId) {
                                    updSec(s => ({...s, contratos: (s.contratos??[]).map(c => c.id===editContratoId ? {...c,...contratoForm, dataEncerramentoOriginal: c.dataEncerramentoOriginal ?? c.dataEncerramento, valorMensalOriginal: c.valorMensalOriginal ?? c.valorMensal} : c)}));
                                  } else {
                                    const nc: Contrato = { id:`ct_${Date.now()}`, ...contratoForm, dataEncerramentoOriginal: contratoForm.dataEncerramento, valorMensalOriginal: contratoForm.valorMensal, aditivos: [] };
                                    updSec(s => ({...s, contratos: [...(s.contratos??[]), nc]}));
                                  }
                                  setShowContratoModal(false); setEditContratoId(null); setContratoForm(emptyContratoForm());
                                }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editContratoId ? "Salvar" : "Adicionar"}</Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Modal Novo/Editar Aditivo */}
                      {showAditivoModal && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                          onClick={() => { setShowAditivoModal(false); setAditivoParaContratoId(null); setEditAditivoId(null); setAditivoErroValor(null); }}>
                          <div className={`w-full max-w-xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh] ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                            onClick={e => e.stopPropagation()}>
                            {/* Header fixo */}
                            <div className={`flex items-center justify-between px-5 py-4 border-b flex-shrink-0 ${isDarkMode ? "border-purple-500/20" : "border-gray-200"}`}>
                              <h2 className={`text-base font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editAditivoId ? "Editar Aditivo" : "Novo Aditivo"}</h2>
                              <button onClick={() => { setShowAditivoModal(false); setAditivoParaContratoId(null); setEditAditivoId(null); setAditivoErroValor(null); }} className={`p-1.5 rounded-lg transition ${isDarkMode ? "text-gray-400 hover:bg-slate-700" : "text-gray-500 hover:bg-gray-100"}`}><X className="w-4 h-4" /></button>
                            </div>
                            {/* Corpo rolável */}
                            <div className="p-5 overflow-y-auto flex-1">
                              
                              {/* Linha 1: Nº do Aditivo + Tipo(s) */}
                              <div className="grid grid-cols-2 gap-4 mb-4 items-start">
                                <div><label className={labelClass}>Nº do Aditivo</label><input type="text" value={aditivoForm.numero} onChange={e => setAditivoForm(p=>({...p,numero:e.target.value}))} className={inputClass} placeholder="001/2025" autoFocus /></div>
                                <div>
                                  <label className={labelClass}>Tipo(s) do Aditivo</label>
                                  <div className="flex flex-wrap gap-3 mt-2">
                                  {(["Acréscimo","Redução","Prazo"] as string[]).map(t => (
                                    <label key={t} className="flex items-center gap-2 cursor-pointer">
                                      <input type="checkbox" checked={aditivoForm.tipos.includes(t)}
                                        onChange={e => setAditivoForm(p => { if (!e.target.checked) return {...p, tipos: p.tipos.filter(x => x !== t)}; let nt = [...p.tipos, t]; if (t === "Acréscimo") nt = nt.filter(x => x !== "Redução"); if (t === "Redução") nt = nt.filter(x => x !== "Acréscimo"); return {...p, tipos: nt}; })}
                                        className="w-4 h-4 accent-orange-500" />
                                      <span className={`text-sm ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>{t}</span>
                                    </label>
                                  ))}
                                  </div>
                                </div>
                              </div>
                              {/* Linha 2: Objeto do Aditivo */}
                              <div className="mb-4"><label className={labelClass}>Objeto do Aditivo</label><textarea value={aditivoForm.objeto} onChange={e => setAditivoForm(p=>({...p,objeto:e.target.value}))} className={`${inputClass} resize-none`} rows={3} placeholder="Reajuste de valor mensal..." /></div>
                              {/* Linha 3: Data Inicial + Data Encerramento */}
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div><label className={labelClass}>Data Inicial</label><input type="text" value={aditivoForm.dataInicial} onChange={e => setAditivoForm(p=>({...p,dataInicial:maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                                <div><label className={labelClass}>Data Encerramento</label><input type="text" value={aditivoForm.dataEncerramento} onChange={e => setAditivoForm(p=>({...p,dataEncerramento:maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                              </div>
                              {aditivoForm.tipos.includes("Prazo") && (() => {
                                const ct = selSecretaria?.contratos?.find(c => c.id === aditivoParaContratoId);
                                const artigo = ct?.artigo ?? "";
                                const maxMeses = artigo ? (ARTIGO_MAX_MESES[artigo] ?? null) : null;
                                // Calcula a data mais recente considerando o contrato + todos aditivos de Prazo já salvos
                                const toDateNum = (d: string) => { const p = d?.split('/'); return p?.length===3 ? parseInt(p[2])*10000+parseInt(p[1])*100+parseInt(p[0]) : 0; };
                                const latestEnc = (ct?.aditivos??[]).filter(a => a.tipos?.includes("Prazo") && a.dataEncerramento).reduce((best, a) => toDateNum(a.dataEncerramento)>toDateNum(best)?a.dataEncerramento:best, ct?.dataEncerramento??"");
                                const mesesUsados = (ct?.dataInicial && latestEnc) ? calcMesesDMY(ct.dataInicial, latestEnc) : 0;
                                const mesesNovos = (ct?.dataInicial && aditivoForm.dataEncerramento && aditivoForm.dataEncerramento.length === 10) ? calcMesesDMY(ct.dataInicial, aditivoForm.dataEncerramento) : null;
                                const restantes = maxMeses !== null ? maxMeses - mesesUsados : null;
                                const ultrapassaria = maxMeses !== null && mesesNovos !== null && mesesNovos > maxMeses;
                                return (
                                  <div className={`mb-4 p-3 rounded-xl border text-sm ${
                                    !artigo ? (isDarkMode ? "border-slate-600 bg-slate-800/50 text-gray-400" : "border-gray-300 bg-gray-50 text-gray-500")
                                    : ultrapassaria ? "border-red-500/60 bg-red-500/10 text-red-400"
                                    : restantes === 0 ? "border-orange-500/60 bg-orange-500/10 text-orange-400"
                                    : (isDarkMode ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300" : "border-purple-500/40 bg-purple-50 text-purple-700")
                                  }`}>
                                    {!artigo ? (
                                      <p>⚠ Embasamento legal não definido no contrato. Defina o artigo no formulário do contrato para calcular o limite de prorrogação.</p>
                                    ) : (
                                      <>
                                        <p className="font-semibold mb-1">📋 Limite legal: {ARTIGO_NOMES[artigo]}</p>
                                        <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
                                          <span>Total máximo: <strong>{maxMeses} meses</strong></span>
                                          <span>Já utilizado: <strong>{mesesUsados} meses</strong></span>
                                          <span>Disponível para prorrogação: <strong>{restantes} meses</strong></span>
                                        </div>
                                        {mesesNovos !== null && (
                                          <p className={`mt-2 font-medium ${ultrapassaria ? "text-red-400" : "text-green-400"}`}>
                                            {ultrapassaria
                                              ? `❌ Nova data resultaria em ${mesesNovos} meses totais — excede o limite em ${mesesNovos - maxMeses!} meses!`
                                              : `✅ Nova data: ${mesesNovos} meses totais (${maxMeses! - mesesNovos} meses ainda disponíveis)`
                                            }
                                          </p>
                                        )}
                                      </>
                                    )}
                                  </div>
                                );
                              })()}
                              {(aditivoForm.tipos.includes("Acréscimo") || aditivoForm.tipos.includes("Redução")) && (
                                <div className="mb-4"><label className={labelClass}>Novo Valor Mensal (R$)</label><input type="text" value={aditivoForm.novoValorMensal} onChange={e => setAditivoForm(p=>({...p,novoValorMensal:e.target.value}))} className={inputClass} placeholder="0,00" /></div>
                              )}
                              {/* PDF do Aditivo — mesmo padrão do contrato */}
                              <div className="mb-4"><label className={labelClass}>PDF do Aditivo</label>
                                {aditivoForm.arquivo ? (
                                  <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl border ${isDarkMode ? "border-green-700 bg-green-900/20" : "border-green-400 bg-green-50"}`}>
                                    <span className="text-green-400 text-sm font-medium flex-1">✓ PDF carregado</span>
                                    <label className="cursor-pointer">
                                      <span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Substituir</span>
                                      <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setAditivoForm(p=>({...p,arquivo:b64}));} }} />
                                    </label>
                                    <button type="button" onClick={() => setAditivoForm(p=>({...p,arquivo:""}))} className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition">Remover</button>
                                  </div>
                                ) : (
                                  <div className="mt-1">
                                    <label className="cursor-pointer">
                                      <span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Escolher arquivo PDF</span>
                                      <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setAditivoForm(p=>({...p,arquivo:b64}));} }} />
                                    </label>
                                    <span className={`ml-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nenhum arquivo selecionado</span>
                                  </div>
                                )}
                              </div>
                              {aditivoErroValor && (
                                <p className="text-red-400 text-xs mb-1 mt-1">{aditivoErroValor}</p>
                              )}
                            </div>
                            {/* Rodapé fixo com botões */}
                            <div className={`flex justify-end gap-3 px-5 py-3 border-t flex-shrink-0 ${isDarkMode ? "border-purple-500/20" : "border-gray-200"}`}>
                              <Button variant="outline" onClick={() => { setShowAditivoModal(false); setAditivoParaContratoId(null); setEditAditivoId(null); setAditivoErroValor(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                                <Button onClick={() => {
                                  if (aditivoForm.tipos.length === 0 || !aditivoForm.dataEncerramento) return;
                                  // Validação de valor para Acréscimo/Redução
                                  if (aditivoForm.tipos.includes("Acréscimo") || aditivoForm.tipos.includes("Redução")) {
                                    const contratoAtual = selSecretaria?.contratos?.find(c => c.id === aditivoParaContratoId);
                                    const valorAtual = parseFloat((contratoAtual?.valorMensal ?? "0").replace(/[^0-9,]/g,"").replace(",","."));
                                    const valorNovo = parseFloat((aditivoForm.novoValorMensal ?? "0").replace(/[^0-9,]/g,"").replace(",","."));
                                    if (aditivoForm.tipos.includes("Acréscimo") && valorNovo <= valorAtual) {
                                      setAditivoErroValor(`O novo valor mensal (R$ ${valorNovo.toLocaleString("pt-BR",{minimumFractionDigits:2})}) deve ser MAIOR que o valor atual (R$ ${valorAtual.toLocaleString("pt-BR",{minimumFractionDigits:2})}).`);
                                      return;
                                    }
                                    if (aditivoForm.tipos.includes("Redução") && valorNovo >= valorAtual) {
                                      setAditivoErroValor(`O novo valor mensal (R$ ${valorNovo.toLocaleString("pt-BR",{minimumFractionDigits:2})}) deve ser MENOR que o valor atual (R$ ${valorAtual.toLocaleString("pt-BR",{minimumFractionDigits:2})}).`);
                                      return;
                                    }
                                  }
                                  // Validação de limite de prazo (Lei 14.133/2021)
                                  if (aditivoForm.tipos.includes("Prazo") && aditivoForm.dataEncerramento) {
                                    const contratoAtualPrazo = selSecretaria?.contratos?.find(c => c.id === aditivoParaContratoId);
                                    if (contratoAtualPrazo?.artigo && contratoAtualPrazo.dataInicial) {
                                      const maxM = ARTIGO_MAX_MESES[contratoAtualPrazo.artigo] ?? 0;
                                      const totalM = calcMesesDMY(contratoAtualPrazo.dataInicial, aditivoForm.dataEncerramento);
                                      if (totalM > maxM) {
                                        setAditivoErroValor(`O novo prazo ultrapassa o limite legal (${ARTIGO_NOMES[contratoAtualPrazo.artigo]}). O total seria ${totalM} meses, mas o máximo é ${maxM} meses.`);
                                        return;
                                      }
                                    }
                                  }
                                  setAditivoErroValor(null);
                                  if (editAditivoId) {
                                    // Modo edição
                                    updSec(s => ({...s, contratos: (s.contratos??[]).map(c => {
                                      if (c.id !== aditivoParaContratoId) return c;
                                      // Recalcula enc e vm com base em TODOS os aditivos (substituindo o editado)
                                      const aditivosAtualizados = c.aditivos.map(a => a.id===editAditivoId ? {...a,...aditivoForm} : a);
                                      const toN2 = (d: string) => { const p=d?.split('/'); return p?.length===3?parseInt(p[2])*10000+parseInt(p[1])*100+parseInt(p[0]):0; };
                                      const encRecalcEdit = aditivosAtualizados.filter(a => a.tipos?.includes("Prazo") && a.dataEncerramento).reduce((best, a) => toN2(a.dataEncerramento)>toN2(best)?a.dataEncerramento:best, "");
                                      const novaEnc = encRecalcEdit || c.dataEncerramentoOriginal || c.dataEncerramento;
                                      const vmRecalcEdit = aditivosAtualizados.filter(a => (a.tipos?.includes("Acréscimo")||a.tipos?.includes("Redução")) && a.novoValorMensal).slice(-1)[0]?.novoValorMensal ?? null;
                                      const novoVM = vmRecalcEdit ?? c.valorMensalOriginal ?? c.valorMensal;
                                      return {
                                        ...c,
                                        dataEncerramentoOriginal: c.dataEncerramentoOriginal ?? c.dataEncerramento,
                                        valorMensalOriginal: c.valorMensalOriginal ?? c.valorMensal,
                                        aditivos: aditivosAtualizados,
                                        dataEncerramento: novaEnc,
                                        valorMensal: novoVM
                                      };
                                    })}));
                                  } else {
                                    // Modo criação
                                    const novoAd: Aditivo = { id:`ad_${Date.now()}`, ...aditivoForm };
                                    updSec(s => ({...s, contratos: (s.contratos??[]).map(c => {
                                      if (c.id !== aditivoParaContratoId) return c;
                                      const novosAds = [...c.aditivos, novoAd];
                                      const toN2 = (d: string) => { const p=d?.split('/'); return p?.length===3?parseInt(p[2])*10000+parseInt(p[1])*100+parseInt(p[0]):0; };
                                      const encRecalcNew = novosAds.filter(a => a.tipos?.includes("Prazo") && a.dataEncerramento).reduce((best, a) => toN2(a.dataEncerramento)>toN2(best)?a.dataEncerramento:best, "");
                                      const novaEnc = encRecalcNew || c.dataEncerramentoOriginal || c.dataEncerramento;
                                      const vmRecalcNew = novosAds.filter(a => (a.tipos?.includes("Acréscimo")||a.tipos?.includes("Redução")) && a.novoValorMensal).slice(-1)[0]?.novoValorMensal ?? null;
                                      const novoVM = vmRecalcNew ?? c.valorMensalOriginal ?? c.valorMensal;
                                      return {
                                        ...c,
                                        dataEncerramentoOriginal: c.dataEncerramentoOriginal ?? c.dataEncerramento,
                                        valorMensalOriginal: c.valorMensalOriginal ?? c.valorMensal,
                                        aditivos: novosAds,
                                        dataEncerramento: novaEnc,
                                        valorMensal: novoVM
                                      };
                                    })}));
                                  }
                                  setShowAditivoModal(false); setAditivoParaContratoId(null); setEditAditivoId(null); setAditivoForm(emptyAditivoForm()); setAditivoErroValor(null);
                                }} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">{editAditivoId ? "Salvar Aditivo" : "Adicionar Aditivo"}</Button>
                            </div>
                            {/* fim rodapé */}
                          </div>
                        </div>
                      )}
                      {contratoSearch.trim() && (selSecretaria.contratos ?? []).filter(ct => {
                        const q = contratoSearch.trim().toLowerCase();
                        return (ct.numero??'').toLowerCase().includes(q) || (ct.objeto??'').toLowerCase().includes(q) || (ct.numeroLicitacao??'').toLowerCase().includes(q) || (ct.dataInicial??'').includes(q) || (ct.dataEncerramento??'').includes(q);
                      }).length === 0 && (
                        <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum contrato encontrado para "{contratoSearch}".</p>
                      )}
                    </div>
                    );
                  })()}

                  {/* Sistemas */}
                  {adminDataTab === "sistemas" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <input
                          type="text"
                          value={sistemaSearch}
                          onChange={e => setSistemaSearch(e.target.value)}
                          placeholder="Pesquisar por nome, status, data de início..."
                          className={`flex-1 px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                        />
                        <Button onClick={() => { setNovoSistemaForm({ nome: "", status: "Ativo", dataInicio: "" }); setShowAddModal("sistema"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0">+ Adicionar</Button>
                      </div>
                      {selSecretaria.sistemasContratados.length === 0 && (
                        <p className={`text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum sistema cadastrado.</p>
                      )}
                      {(() => {
                        const q = sistemaSearch.trim().toLowerCase();
                        return selSecretaria.sistemasContratados.filter(sis => {
                          if (!q) return true;
                          return (
                            sis.nome.toLowerCase().includes(q) ||
                            sis.status.toLowerCase().includes(q) ||
                            (sis.dataInicio ?? "").includes(q)
                          );
                        }).map((sis, i) => (
                        <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                          <CardContent className="p-5">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{sis.nome || "—"}</span>
                                  <select value={sis.status} onChange={e => updSec(s => ({...s, sistemasContratados: s.sistemasContratados.map((x, idx) => idx===i ? {...x, status: e.target.value} : x)}))} className={`text-xs px-2 py-0.5 rounded-full font-medium border-0 outline-none cursor-pointer ${
                                    sis.status === "Ativo" ? "bg-green-600 text-white" :
                                    sis.status === "Suspenso" ? "bg-yellow-500 text-white" :
                                    "bg-gray-500 text-white"
                                  }`}>
                                    <option value="Ativo" style={{background:"#16a34a",color:"#fff"}}>Ativo</option>
                                    <option value="Inativo" style={{background:"#6b7280",color:"#fff"}}>Inativo</option>
                                    <option value="Suspenso" style={{background:"#eab308",color:"#fff"}}>Suspenso</option>
                                  </select>
                                </div>
                                {sis.dataInicio && <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Início: {sis.dataInicio}</p>}
                              </div>
                              <div className="flex gap-1">
                                <button title="Editar" onClick={() => { setEditSistemaIndex(i); setNovoSistemaForm({ nome: sis.nome, status: sis.status, dataInicio: sis.dataInicio }); setShowAddModal("sistema"); }}
                                  className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-500 hover:bg-blue-50"}`}>
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button title="Excluir" onClick={() => setConfirmDelete({ label: sis.nome, onConfirm: () => updSec(s => ({...s, sistemasContratados: s.sistemasContratados.filter((_, idx) => idx !== i)})) })}
                                  className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}><span className="text-base">🗑</span></button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        ));
                      })()}
                      {sistemaSearch.trim() && selSecretaria.sistemasContratados.filter(sis => {
                        const q = sistemaSearch.trim().toLowerCase();
                        return sis.nome.toLowerCase().includes(q) || sis.status.toLowerCase().includes(q) || (sis.dataInicio??'').includes(q);
                      }).length === 0 && (
                        <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum sistema encontrado para "{sistemaSearch}".</p>
                      )}
                    </div>
                  )}
                  {adminDataTab === "nfs" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <input
                          type="text"
                          value={nfSearch}
                          onChange={e => setNfSearch(e.target.value)}
                          placeholder="Pesquisar por número, referência, emissão, valor, status..."
                          className={`flex-1 px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                        />
                        <Button onClick={() => { setNovaNotaForm({ numero: "", data: "", dataVencimento: "", referencia: "", valor: "", status: "Pendente", arquivo: "", comprovante: "", dataPagamento: "" }); setEditNfIndex(null); setShowAddModal("nf"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0">+ Adicionar</Button>
                      </div>
                      {selSecretaria.notasFiscais.length === 0 && (
                        <p className={`text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma nota fiscal cadastrada.</p>
                      )}
                      {(() => {
                        const q = nfSearch.trim().toLowerCase();
                        return selSecretaria.notasFiscais.filter(nf => {
                          if (!q) return true;
                          const hoje = new Date(); hoje.setHours(0,0,0,0);
                          const isVencida = nf.dataVencimento && nf.status !== "Pago" && (() => { const [d,m,a] = nf.dataVencimento.split("/"); const dv = new Date(+a,+m-1,+d); dv.setHours(0,0,0,0); return dv < hoje; })();
                          const sr = isVencida ? "vencido" : nf.status.toLowerCase();
                          return (
                            nf.numero.toLowerCase().includes(q) ||
                            ((nf as any).referencia ?? "").toLowerCase().includes(q) ||
                            nf.data.toLowerCase().includes(q) ||
                            ((nf as any).dataVencimento ?? "").toLowerCase().includes(q) ||
                            nf.valor.toLowerCase().includes(q) ||
                            sr.includes(q) ||
                            ((nf as any).dataPagamento ?? "").toLowerCase().includes(q)
                          );
                        }).map((nf, i) => {
                        const origIndex = selSecretaria.notasFiscais.indexOf(nf);
                          const hoje = new Date(); hoje.setHours(0,0,0,0);
                          const isVencida = nf.dataVencimento && nf.status !== "Pago" && (() => { const [d,m,a] = nf.dataVencimento.split("/"); const dv = new Date(+a,+m-1,+d); dv.setHours(0,0,0,0); return dv < hoje; })();
                          const statusReal = isVencida ? "Vencido" : nf.status;
                          return (
                        <Card key={origIndex} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                          <CardContent className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              {/* Coluna Esquerda: dados da NF */}
                              <div className="flex-1 min-w-0 grid grid-cols-2 gap-x-6 gap-y-1">
                                {/* Linha 1: Número + Status */}
                                <div className="flex items-center gap-2 flex-wrap col-span-2">
                                  <span className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>NF {nf.numero || "—"}</span>
                                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                    statusReal === "Pago" ? "bg-green-600 text-white" :
                                    statusReal === "Pendente" ? "bg-yellow-500 text-white" :
                                    "bg-red-600 text-white"
                                  }`}>{statusReal}</span>
                                </div>
                                {/* Linha 2: Emissão | Vencimento */}
                                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {nf.data && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Emissão:</span> {nf.data}</p>}
                                </div>
                                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {(nf as any).dataVencimento && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Vencimento:</span> {(nf as any).dataVencimento}</p>}
                                </div>
                                {/* Linha 3: Valor | Referência */}
                                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {nf.valor && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Valor:</span> R$ {nf.valor}</p>}
                                </div>
                                <div className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {(nf as any).referencia && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Referência:</span> {(nf as any).referencia}</p>}
                                  {statusReal === "Pago" && (nf as any).dataPagamento && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Pago em:</span> {(nf as any).dataPagamento}</p>}
                                </div>
                              </div>
                              {/* Botões */}
                              <div className="flex gap-1 flex-shrink-0 items-center">
                                {nf.arquivo ? (
                                  <a href={nf.arquivo} download={`NF-${nf.numero}.pdf`} title="Baixar PDF da NF"
                                    className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`}>
                                    <FileText className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <span title="Sem PDF" className={`p-2 rounded-lg inline-flex items-center justify-center ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>
                                    <FileText className="w-4 h-4" />
                                  </span>
                                )}
                                {(nf as any).comprovante ? (
                                  <a href={(nf as any).comprovante} download={`Comprovante-NF-${nf.numero}`} title="Baixar Comprovante"
                                    className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-green-400 hover:bg-green-500/10" : "text-green-600 hover:bg-green-50"}`}>
                                    <Download className="w-4 h-4" />
                                  </a>
                                ) : (
                                  <span title="Sem comprovante" className={`p-2 rounded-lg inline-flex items-center justify-center ${isDarkMode ? "text-gray-600" : "text-gray-300"}`}>
                                    <Download className="w-4 h-4" />
                                  </span>
                                )}
                                <button title={statusReal === "Pago" ? "Editar pagamento" : "Marcar como Pago"}
                                  onClick={() => { setPagarNfIndex(origIndex); setPagarNfForm({ dataPagamento: (nf as any).dataPagamento ?? "", comprovante: (nf as any).comprovante ?? "" }); }}
                                  className={`p-2 rounded-lg inline-flex items-center justify-center transition text-xs font-bold px-3 ${
                                    statusReal === "Pago" ? "bg-green-700 hover:bg-green-800 text-white" : "bg-green-600 hover:bg-green-700 text-white"
                                  }`}>
                                  Pago
                                </button>
                                <button title="Editar" onClick={() => {
                                  setEditNfIndex(origIndex);
                                  setNovaNotaForm({ numero: nf.numero, data: nf.data, dataVencimento: (nf as any).dataVencimento ?? "", referencia: (nf as any).referencia ?? "", valor: nf.valor, status: nf.status, arquivo: nf.arquivo ?? "", comprovante: (nf as any).comprovante ?? "", dataPagamento: (nf as any).dataPagamento ?? "" });
                                  setShowAddModal("nf");
                                }} className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-500 hover:bg-blue-50"}`}>
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button title="Excluir" onClick={() => setConfirmDelete({ label: `NF ${nf.numero}`, onConfirm: () => updSec(s => ({...s, notasFiscais: s.notasFiscais.filter((_, idx) => idx !== origIndex)})) })}
                                  className={`p-2 rounded-lg inline-flex items-center justify-center transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}><span className="text-base">🗑</span></button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                          );
                        });
                      })()}
                      {nfSearch.trim() && selSecretaria.notasFiscais.filter(nf => {
                        const q = nfSearch.trim().toLowerCase();
                        const hoje = new Date(); hoje.setHours(0,0,0,0);
                        const isVencida = nf.dataVencimento && nf.status !== "Pago" && (() => { const [d,m,a] = nf.dataVencimento.split("/"); const dv = new Date(+a,+m-1,+d); dv.setHours(0,0,0,0); return dv < hoje; })();
                        const sr = isVencida ? "vencido" : nf.status.toLowerCase();
                        return nf.numero.toLowerCase().includes(q) || ((nf as any).referencia??'').toLowerCase().includes(q) || nf.data.toLowerCase().includes(q) || ((nf as any).dataVencimento??'').toLowerCase().includes(q) || nf.valor.toLowerCase().includes(q) || sr.includes(q);
                      }).length === 0 && (
                        <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma nota fiscal encontrada para "{nfSearch}".</p>
                      )}
                    </div>
                  )}

                  {/* Relatórios */}
                  {adminDataTab === "relatorios" && (
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-3 mb-2">
                        <input
                          type="text"
                          value={relatorioSearch}
                          onChange={e => setRelatorioSearch(e.target.value)}
                          placeholder="Pesquisar por título, tipo, referência, data..."
                          className={`flex-1 px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                        />
                        <Button onClick={() => { setNovoRelatorioForm({ titulo: "", data: "", tipo: "", arquivo: "", referencia: "" }); setEditRelatorioIndex(null); setShowAddModal("relatorio"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 flex-shrink-0">+ Adicionar</Button>
                      </div>
                      {selSecretaria.relatorios.length === 0 && (
                        <p className={`text-center py-10 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum relatório cadastrado.</p>
                      )}
                      {(() => {
                        const q = relatorioSearch.trim().toLowerCase();
                        return selSecretaria.relatorios.filter(rel => {
                          if (!q) return true;
                          return (
                            rel.titulo.toLowerCase().includes(q) ||
                            rel.tipo.toLowerCase().includes(q) ||
                            rel.data.toLowerCase().includes(q) ||
                            ((rel as any).referencia ?? "").toLowerCase().includes(q)
                          );
                        }).map((rel, _i) => {
                          const origIndex = selSecretaria.relatorios.indexOf(rel);
                          return (
                            <Card key={origIndex} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                              <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                  <div className="flex-1 min-w-0">
                                    <span className={`font-bold text-sm ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                                      {rel.titulo || "—"}{(rel as any).referencia ? ` - ${((rel as any).referencia as string).toUpperCase()}` : ""}
                                    </span>
                                    <div className={`flex gap-x-6 mt-1 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                      {rel.tipo && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Sistema:</span> {rel.tipo}</p>}
                                      {rel.data && <p><span className={`font-medium ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>Data:</span> {rel.data}</p>}
                                    </div>
                                  </div>
                                  <div className="flex gap-1 flex-shrink-0 items-center">
                                    {rel.arquivo ? (
                                      <a href={rel.arquivo} download={`Relatorio-${origIndex+1}.pdf`} className={`p-2 rounded-lg transition ${isDarkMode ? "text-purple-400 hover:bg-purple-500/10" : "text-purple-600 hover:bg-purple-50"}`} title="Baixar PDF">
                                        <Download className="w-4 h-4" />
                                      </a>
                                    ) : (
                                      <span className={`p-2 rounded-lg inline-flex items-center justify-center ${isDarkMode ? "text-gray-600" : "text-gray-300"}`} title="Sem PDF">
                                        <Download className="w-4 h-4" />
                                      </span>
                                    )}
                                    <button title="Editar" onClick={() => {
                                      setEditRelatorioIndex(origIndex);
                                      setNovoRelatorioForm({ titulo: rel.titulo, data: rel.data, tipo: rel.tipo, arquivo: rel.arquivo ?? "", referencia: (rel as any).referencia ?? "" });
                                      setShowAddModal("relatorio");
                                    }} className={`p-2 rounded-lg transition ${isDarkMode ? "text-blue-400 hover:bg-blue-500/10" : "text-blue-500 hover:bg-blue-50"}`}>
                                      <Pencil className="w-4 h-4" />
                                    </button>
                                    <button title="Excluir" onClick={() => setConfirmDelete({ label: rel.titulo, onConfirm: () => updSec(s => ({...s, relatorios: s.relatorios.filter((_, idx) => idx !== origIndex)})) })}
                                      className={`p-2 rounded-lg transition ${isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-500 hover:bg-red-50"}`}><span className="text-base">🗑</span></button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        });
                      })()}
                      {relatorioSearch.trim() && selSecretaria.relatorios.filter(rel => {
                        const q = relatorioSearch.trim().toLowerCase();
                        return rel.titulo.toLowerCase().includes(q) || rel.tipo.toLowerCase().includes(q) || rel.data.toLowerCase().includes(q) || ((rel as any).referencia??'').toLowerCase().includes(q);
                      }).length === 0 && (
                        <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum relatório encontrado para "{relatorioSearch}".</p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ── ABA USUÁRIOS ── */}
              {adminClientSubSection === "usuarios" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Usuários do Portal</h1>
                    <div className="flex gap-3">
                      <Button onClick={() => { setNovoUserForm({ nome: "", login: "", senha: "", entidadeId: "", secretariaId: "", cargo: "", telefone: "", foto: "" }); setShowAddModal("usuario"); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">+ Adicionar</Button>
                      <Button onClick={saveTodo} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                        <CheckCircle2 className="w-4 h-4 mr-2" />{savedFeedback ? "Salvo!" : "Salvar"}
                      </Button>
                    </div>
                  </div>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={usuarioSearch}
                      onChange={e => setUsuarioSearch(e.target.value)}
                      placeholder="Pesquisar por nome, e-mail, entidade, secretaria..."
                      className={`w-full px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                    />
                  </div>

                  {/* Lista de usuários */}
                  <div className="space-y-3">
                    {clientUsers.length === 0 && <p className={`text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum usuário cadastrado ainda.</p>}
                    {clientUsers.filter(user => {
                      const q = usuarioSearch.trim().toLowerCase();
                      if (!q) return true;
                      const ent = entidades.find(e => e.id === user.entidadeId);
                      const sec = ent?.secretarias.find(s => s.id === user.secretariaId);
                      return (
                        user.nome.toLowerCase().includes(q) ||
                        user.login.toLowerCase().includes(q) ||
                        (ent?.nome ?? "").toLowerCase().includes(q) ||
                        (sec?.nome ?? "").toLowerCase().includes(q)
                      );
                    }).map(user => {
                      const ent = entidades.find(e => e.id === user.entidadeId);
                      const sec = ent?.secretarias.find(s => s.id === user.secretariaId);
                      return (
                        <Card key={user.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}>
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${isDarkMode ? "bg-cyan-500/10" : "bg-cyan-50"}`}>
                                {user.foto ? <img src={user.foto} alt={user.nome} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-cyan-500" />}
                              </div>
                              <div>
                                <p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{user.nome}</p>
                                {user.cargo && <p className={`text-xs font-medium ${isDarkMode ? "text-cyan-400" : "text-cyan-600"}`}>{user.cargo}</p>}
                                <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{user.login}</p>
                                <p className={`text-xs mt-0.5 ${isDarkMode ? "text-purple-400" : "text-purple-600"}`}>{ent?.nome ?? "—"} / {sec?.nome ?? "—"}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" onClick={() => { setEditUserForm({...user}); setShowAddModal("usuario"); }} className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "border-purple-500 text-purple-600 hover:bg-purple-50"}>✎ Editar</Button>
                              <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: user.nome, onConfirm: () => setClientUsers(prev => prev.filter(u => u.id !== user.id)) })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                    {usuarioSearch.trim() && clientUsers.filter(user => {
                      const q = usuarioSearch.trim().toLowerCase();
                      const ent = entidades.find(e => e.id === user.entidadeId);
                      const sec = ent?.secretarias.find(s => s.id === user.secretariaId);
                      return user.nome.toLowerCase().includes(q) || user.login.toLowerCase().includes(q) || (ent?.nome??'').toLowerCase().includes(q) || (sec?.nome??'').toLowerCase().includes(q);
                    }).length === 0 && (
                      <p className={`text-center py-6 text-sm ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum usuário encontrado para "{usuarioSearch}".</p>
                    )}
                  </div>
                </div>
              )}

              {/* ── MODAIS DE ADIÇÃO ── */}

              {/* Modal: Nova Entidade */}
              {showAddModal === "entidade" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setNovaEntidadeForm({ nome: "", tipo: "", cidade: "", responsavel: "", cnpj: "", telefone: "" }); setEditEntidadeId(null); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editEntidadeId ? "Editar Entidade" : "Nova Entidade"}</h2>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2">
                          <label className={labelClass}>Nome da Entidade</label>
                          <input type="text" value={novaEntidadeForm.nome} onChange={e => setNovaEntidadeForm(p => ({...p, nome: e.target.value}))} className={inputClass} placeholder="Ex: PREFEITURA DE IRAUÇUBA" autoFocus />
                        </div>
                        <div className="md:col-span-2">
                          <label className={labelClass}>Tipo</label>
                          <select value={novaEntidadeForm.tipo} onChange={e => setNovaEntidadeForm(p => ({...p, tipo: e.target.value}))} className={inputClass}>
                            <option value="">Selecione o tipo</option>
                            {["PREFEITURA","CÂMARA","AUTARQUIA","SAAE","SINDICATO","ONG"].map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                        <div className="relative">
                          <label className={labelClass}>Cidade</label>
                          {(() => {
                            const q = novaEntidadeForm.cidade;
                            const sugs = q.trim().length > 0
                              ? MUNICIPIOS_CE.filter(m => m.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().includes(q.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase())).slice(0, 8)
                              : [];
                            const pick = (m: string) => { setNovaEntidadeForm(p => ({...p, cidade: m})); setShowCidadeDropdown(false); setCidadeHighlight(0); };
                            return (
                              <>
                                <input
                                  type="text"
                                  value={novaEntidadeForm.cidade}
                                  onChange={e => { setNovaEntidadeForm(p => ({...p, cidade: e.target.value})); setShowCidadeDropdown(true); setCidadeHighlight(0); }}
                                  onFocus={() => setShowCidadeDropdown(true)}
                                  onBlur={() => setTimeout(() => setShowCidadeDropdown(false), 150)}
                                  onKeyDown={e => {
                                    if (!showCidadeDropdown || sugs.length === 0) return;
                                    if (e.key === "ArrowDown") { e.preventDefault(); setCidadeHighlight(h => Math.min(h+1, sugs.length-1)); }
                                    else if (e.key === "ArrowUp") { e.preventDefault(); setCidadeHighlight(h => Math.max(h-1, 0)); }
                                    else if (e.key === "Enter") { e.preventDefault(); pick(sugs[cidadeHighlight]); }
                                    else if (e.key === "Escape") { setShowCidadeDropdown(false); }
                                  }}
                                  className={inputClass}
                                  placeholder="Ex: Irauçuba"
                                  autoComplete="off"
                                />
                                {showCidadeDropdown && sugs.length > 0 && (
                                  <ul className={`absolute z-[10000] left-0 right-0 mt-1 rounded-lg shadow-xl overflow-hidden border ${isDarkMode ? "bg-slate-800 border-purple-500/30" : "bg-white border-gray-200"}`}>
                                    {sugs.map((m, i) => (
                                      <li
                                        key={m}
                                        onMouseDown={() => pick(m)}
                                        onMouseEnter={() => setCidadeHighlight(i)}
                                        className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                                          i === cidadeHighlight
                                            ? isDarkMode ? "bg-purple-600 text-white" : "bg-purple-600 text-white"
                                            : isDarkMode ? "text-gray-200 hover:bg-slate-700" : "text-slate-800 hover:bg-purple-50"
                                        }`}
                                      >
                                        {m}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </>
                            );
                          })()}
                        </div>
                        <div>
                          <label className={labelClass}>Nome do Responsável</label>
                          <input type="text" value={novaEntidadeForm.responsavel} onChange={e => setNovaEntidadeForm(p => ({...p, responsavel: e.target.value}))} className={inputClass} placeholder="Ex: João Silva" />
                        </div>
                        <div>
                          <label className={labelClass}>CNPJ</label>
                          <input type="text" value={novaEntidadeForm.cnpj} onChange={e => setNovaEntidadeForm(p => ({...p, cnpj: maskCNPJ(e.target.value)}))} className={`${inputClass} ${novaEntidadeForm.cnpj.replace(/\D/g,"").length === 14 && !validarCNPJ(novaEntidadeForm.cnpj) ? "border-red-500 focus:ring-red-500" : ""}`} placeholder="00.000.000/0000-00" maxLength={18} />
                          {novaEntidadeForm.cnpj.replace(/\D/g,"").length === 14 && !validarCNPJ(novaEntidadeForm.cnpj) && <p className="text-red-400 text-xs mt-1">CNPJ inválido</p>}
                        </div>
                        <div>
                          <label className={labelClass}>Telefone</label>
                          <input type="tel" value={novaEntidadeForm.telefone} onChange={e => setNovaEntidadeForm(p => ({...p, telefone: maskPhone(e.target.value)}))} className={inputClass} placeholder="(00) 00000-0000" maxLength={15} />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddModal(null); setNovaEntidadeForm({ nome: "", tipo: "", cidade: "", responsavel: "", cnpj: "", telefone: "" }); setEditEntidadeId(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={async () => { if (!novaEntidadeForm.nome.trim()) return; if (editEntidadeId) { const updated = { id: editEntidadeId, nome: novaEntidadeForm.nome.trim().toUpperCase(), tipo: novaEntidadeForm.tipo.trim(), cidade: novaEntidadeForm.cidade.trim(), responsavel: novaEntidadeForm.responsavel.trim(), cnpj: novaEntidadeForm.cnpj.trim(), telefone: novaEntidadeForm.telefone.trim(), ativo: true, secretarias: entidades.find(e => e.id === editEntidadeId)?.secretarias ?? [] }; setEntidades(prev => prev.map(e => e.id === editEntidadeId ? updated : e)); await upsertEntidade(updated); } else { const id = `ent_${Date.now()}`; const nova = { id, nome: novaEntidadeForm.nome.trim().toUpperCase(), tipo: novaEntidadeForm.tipo.trim(), cidade: novaEntidadeForm.cidade.trim(), responsavel: novaEntidadeForm.responsavel.trim(), cnpj: novaEntidadeForm.cnpj.trim(), telefone: novaEntidadeForm.telefone.trim(), ativo: true, secretarias: [] }; setEntidades(prev => [...prev, nova]); await upsertEntidade(nova); } setNovaEntidadeForm({ nome: "", tipo: "", cidade: "", responsavel: "", cnpj: "", telefone: "" }); setEditEntidadeId(null); setShowAddModal(null); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editEntidadeId ? "Salvar" : "Adicionar"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Nova Secretaria */}
              {showAddModal === "secretaria" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setEditSecretariaId(null); setNovaSecretariaForm({ nome: "", secretario: "", telefone: "" }); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editSecretariaId ? "Editar Secretaria" : "Nova Secretaria"}</h2>
                      <div className="space-y-4 mb-4">
                        <div>
                          <label className={labelClass}>Nome da Secretaria</label>
                          <input type="text" value={novaSecretariaForm.nome} onChange={e => setNovaSecretariaForm(p => ({...p, nome: e.target.value}))} className={inputClass} placeholder="Ex: Secretaria de Finanças" autoFocus />
                        </div>
                        <div>
                          <label className={labelClass}>Nome do Secretário</label>
                          <input type="text" value={novaSecretariaForm.secretario} onChange={e => setNovaSecretariaForm(p => ({...p, secretario: e.target.value}))} className={inputClass} placeholder="Ex: Maria Souza" />
                        </div>
                        <div>
                          <label className={labelClass}>Telefone para Contato</label>
                          <input type="tel" value={novaSecretariaForm.telefone} onChange={e => setNovaSecretariaForm(p => ({...p, telefone: e.target.value}))} className={inputClass} placeholder="(00) 00000-0000" />
                        </div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddModal(null); setEditSecretariaId(null); setNovaSecretariaForm({ nome: "", secretario: "", telefone: "" }); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={async () => { if (!novaSecretariaForm.nome.trim()) return; if (editSecretariaId) { setEntidades(prev => prev.map(e => e.id === adminSelEntidadeId ? { ...e, secretarias: e.secretarias.map(s => s.id === editSecretariaId ? { ...s, nome: novaSecretariaForm.nome.trim(), responsavel: novaSecretariaForm.secretario.trim(), telefone: novaSecretariaForm.telefone.trim() } : s) } : e)); const sec = entidades.find(e => e.id === adminSelEntidadeId)?.secretarias.find(s => s.id === editSecretariaId); if (sec && adminSelEntidadeId) await upsertSecretaria(adminSelEntidadeId, { ...sec, nome: novaSecretariaForm.nome.trim(), responsavel: novaSecretariaForm.secretario.trim(), telefone: novaSecretariaForm.telefone.trim() }); } else { const id = `sec_${Date.now()}`; const nova = emptySecretaria(id, novaSecretariaForm.nome.trim()); nova.responsavel = novaSecretariaForm.secretario.trim(); nova.telefone = novaSecretariaForm.telefone.trim(); setEntidades(prev => prev.map(e => e.id === adminSelEntidadeId ? { ...e, secretarias: [...e.secretarias, nova] } : e)); if (adminSelEntidadeId) await upsertSecretaria(adminSelEntidadeId, nova); } setEditSecretariaId(null); setNovaSecretariaForm({ nome: "", secretario: "", telefone: "" }); setShowAddModal(null); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editSecretariaId ? "Salvar" : "Adicionar"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Novo Sistema */}
              {showAddModal === "sistema" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setEditSistemaIndex(null); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editSistemaIndex !== null ? "Editar Sistema" : "Novo Sistema"}</h2>
                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div><label className={labelClass}>Nome do Sistema</label><input type="text" value={novoSistemaForm.nome} onChange={e => setNovoSistemaForm(p => ({...p, nome: e.target.value}))} className={inputClass} placeholder="Ex: Portal de Gestão" autoFocus /></div>
                        <div><label className={labelClass}>Status</label><select value={novoSistemaForm.status} onChange={e => setNovoSistemaForm(p => ({...p, status: e.target.value}))} className={inputClass}><option>Ativo</option><option>Inativo</option><option>Suspenso</option></select></div>
                        <div><label className={labelClass}>Data de Início</label><input type="text" value={novoSistemaForm.dataInicio} onChange={e => setNovoSistemaForm(p => ({...p, dataInicio: maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddModal(null); setEditSistemaIndex(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={() => {
                          if (!novoSistemaForm.nome.trim()) return;
                          if (editSistemaIndex !== null) {
                            updSec(s => ({...s, sistemasContratados: s.sistemasContratados.map((x, idx) => idx === editSistemaIndex ? {...novoSistemaForm} : x)}));
                          } else {
                            updSec(s => ({...s, sistemasContratados: [...s.sistemasContratados, {...novoSistemaForm}]}));
                          }
                          setNovoSistemaForm({ nome: "", status: "Ativo", dataInicio: "" }); setEditSistemaIndex(null); setShowAddModal(null);
                        }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editSistemaIndex !== null ? "Salvar" : "Adicionar"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Nova Nota Fiscal */}
              {/* Modal: Marcar como Pago */}
              {pagarNfIndex !== null && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => setPagarNfIndex(null)}>
                  <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Pagamento da NF</h2>
                      <p className={`text-xs mb-4 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Deixe a data em branco para remover o pagamento e reverter o status.</p>
                      <div className="mb-4">
                        <label className={labelClass}>Data do Pagamento</label>
                        <input type="text" value={pagarNfForm.dataPagamento} onChange={e => setPagarNfForm(p=>({...p, dataPagamento: maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} autoFocus />
                      </div>
                      <div className="mb-4"><label className={labelClass}>Comprovante (opcional)</label>
                        {pagarNfForm.comprovante ? (
                          <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl border ${isDarkMode ? "border-green-700 bg-green-900/20" : "border-green-400 bg-green-50"}`}>
                            <span className="text-green-400 text-sm font-medium flex-1">✓ Comprovante carregado</span>
                            <label className="cursor-pointer"><span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Substituir</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setPagarNfForm(p=>({...p,comprovante:b64}));} }} /></label>
                            <button type="button" onClick={() => setPagarNfForm(p=>({...p,comprovante:""}))} className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition">Remover</button>
                          </div>
                        ) : (
                          <div className="mt-1"><label className="cursor-pointer"><span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Escolher comprovante</span><input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setPagarNfForm(p=>({...p,comprovante:b64}));} }} /></label><span className={`ml-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nenhum arquivo selecionado</span></div>
                        )}
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setPagarNfIndex(null)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={() => {
                          updSec(s => ({...s, notasFiscais: s.notasFiscais.map((x, idx) => {
                            if (idx !== pagarNfIndex) return x;
                            if (!pagarNfForm.dataPagamento.trim()) {
                              // Sem data → reverter: verifica vencimento
                              const hoje = new Date(); hoje.setHours(0,0,0,0);
                              const dv = (x as any).dataVencimento;
                              const isVenc = dv && (() => { const [d,m,a] = dv.split("/"); const vd = new Date(+a,+m-1,+d); vd.setHours(0,0,0,0); return vd < hoje; })();
                              return {...x, status: isVenc ? "Vencido" : "Pendente", dataPagamento: "", comprovante: pagarNfForm.comprovante || (x as any).comprovante || ""};
                            }
                            return {...x, status: "Pago", dataPagamento: pagarNfForm.dataPagamento, comprovante: pagarNfForm.comprovante || (x as any).comprovante || ""};
                          })}));
                          setPagarNfIndex(null);
                        }} className="bg-green-600 hover:bg-green-700 text-white">Salvar</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Nova/Editar Nota Fiscal */}
              {showAddModal === "nf" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setEditNfIndex(null); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editNfIndex !== null ? "Editar Nota Fiscal" : "Nova Nota Fiscal"}</h2>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div><label className={labelClass}>Número da NF</label><input type="text" value={novaNotaForm.numero} onChange={e => setNovaNotaForm(p => ({...p, numero: e.target.value}))} className={inputClass} placeholder="NF-001/2026" autoFocus /></div>
                        <div className="relative">
                          <label className={labelClass}>Referência do Mês</label>
                          <input type="text" value={novaNotaForm.referencia} onChange={e => {
                            const v = e.target.value;
                            setNovaNotaForm(p => ({...p, referencia: v}));
                            setRefSugestoes(v.trim() === "" ? [] : MESES.filter(m => m.toLowerCase().startsWith(v.toLowerCase())));
                          }} onBlur={() => setTimeout(() => setRefSugestoes([]), 200)} className={inputClass} placeholder="Ex: Janeiro" />
                          {refSugestoes.length > 0 && (
                            <ul className={`absolute z-50 left-0 right-0 mt-1 rounded-xl shadow-lg border overflow-hidden ${isDarkMode ? "bg-slate-800 border-purple-500/30" : "bg-white border-gray-200"}`}>
                              {refSugestoes.map(s => (
                                <li key={s} onMouseDown={() => { setNovaNotaForm(p => ({...p, referencia: s})); setRefSugestoes([]); }}
                                  className={`px-4 py-2 cursor-pointer text-sm ${isDarkMode ? "hover:bg-purple-500/20 text-gray-200" : "hover:bg-purple-50 text-slate-700"}`}>{s}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div><label className={labelClass}>Data de Emissão</label><input type="text" value={novaNotaForm.data} onChange={e => setNovaNotaForm(p => ({...p, data: maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                        <div><label className={labelClass}>Data de Vencimento</label><input type="text" value={novaNotaForm.dataVencimento} onChange={e => setNovaNotaForm(p => ({...p, dataVencimento: maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                        <div><label className={labelClass}>Valor</label><input type="text" value={novaNotaForm.valor} onChange={e => setNovaNotaForm(p => ({...p, valor: e.target.value}))} className={inputClass} placeholder="R$ 0,00" /></div>
                      </div>
                      <div className="mb-4"><label className={labelClass}>PDF da Nota Fiscal (opcional)</label>
                        {novaNotaForm.arquivo ? (
                          <div className={`flex items-center gap-3 mt-1 p-3 rounded-xl border ${isDarkMode ? "border-green-700 bg-green-900/20" : "border-green-400 bg-green-50"}`}>
                            <span className="text-green-400 text-sm font-medium flex-1">✓ PDF carregado</span>
                            <label className="cursor-pointer"><span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Substituir</span><input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setNovaNotaForm(p=>({...p,arquivo:b64}));} }} /></label>
                            <button type="button" onClick={() => setNovaNotaForm(p=>({...p,arquivo:""}))} className="px-3 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700 transition">Remover</button>
                          </div>
                        ) : (
                          <div className="mt-1"><label className="cursor-pointer"><span className="px-3 py-1 rounded text-xs bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer">Escolher arquivo PDF</span><input type="file" accept=".pdf" className="hidden" onChange={async e => { const f=e.target.files?.[0]; if(f){const b64=await readFileAsBase64(f);setNovaNotaForm(p=>({...p,arquivo:b64}));} }} /></label><span className={`ml-3 text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nenhum arquivo selecionado</span></div>
                        )}
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddModal(null); setEditNfIndex(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={() => {
                          if (!novaNotaForm.numero.trim()) return;
                          const dados = {...novaNotaForm, status: editNfIndex !== null ? novaNotaForm.status : "Pendente"};
                          if (editNfIndex !== null) {
                            updSec(s => ({...s, notasFiscais: s.notasFiscais.map((x, idx) => idx === editNfIndex ? {...x, ...dados} : x)}));
                          } else {
                            updSec(s => ({...s, notasFiscais: [...s.notasFiscais, dados]}));
                          }
                          setNovaNotaForm({ numero: "", data: "", dataVencimento: "", referencia: "", valor: "", status: "Pendente", arquivo: "", comprovante: "", dataPagamento: "" }); setEditNfIndex(null); setShowAddModal(null);
                        }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editNfIndex !== null ? "Salvar" : "Adicionar"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Novo Relatório */}
              {showAddModal === "relatorio" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setEditRelatorioIndex(null); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editRelatorioIndex !== null ? "Editar Relatório" : "Novo Relatório"}</h2>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div className="md:col-span-2"><label className={labelClass}>Título</label><input type="text" value={novoRelatorioForm.titulo} onChange={e => setNovoRelatorioForm(p => ({...p, titulo: e.target.value}))} className={inputClass} placeholder="Ex: Relatório de Uso - Janeiro 2026" autoFocus /></div>
                        <div className="relative">
                          <label className={labelClass}>Sistema</label>
                          <input type="text" value={novoRelatorioForm.tipo}
                            onChange={e => {
                              const v = e.target.value;
                              setNovoRelatorioForm(p => ({...p, tipo: v}));
                              if (v.trim()) setSisSugestoes((selSecretaria?.sistemasContratados ?? []).map((s: any) => s.nome).filter((n: string) => n.toLowerCase().includes(v.toLowerCase())));
                              else setSisSugestoes((selSecretaria?.sistemasContratados ?? []).map((s: any) => s.nome));
                            }}
                            onFocus={() => {
                              setSisSugestoes((selSecretaria?.sistemasContratados ?? []).map((s: any) => s.nome));
                            }}
                            onBlur={() => setTimeout(() => setSisSugestoes([]), 150)}
                            className={inputClass} placeholder="Digite para buscar sistema..." />
                          {sisSugestoes.length > 0 && (
                            <ul className={`absolute z-50 w-full mt-1 rounded-xl shadow-lg border overflow-hidden ${isDarkMode ? "bg-slate-800 border-purple-500/30" : "bg-white border-gray-200"}`}>
                              {sisSugestoes.map((s: string) => (
                                <li key={s} onMouseDown={() => { setNovoRelatorioForm(p => ({...p, tipo: s})); setSisSugestoes([]); }}
                                  className={`px-4 py-2 text-sm cursor-pointer ${isDarkMode ? "text-white hover:bg-purple-600/30" : "text-slate-800 hover:bg-purple-50"}`}>{s}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div><label className={labelClass}>Data</label><input type="text" value={novoRelatorioForm.data} onChange={e => setNovoRelatorioForm(p => ({...p, data: maskDate(e.target.value)}))} className={inputClass} placeholder="DD/MM/AAAA" maxLength={10} /></div>
                        <div className="md:col-span-2 relative">
                          <label className={labelClass}>Referência do Mês</label>
                          <input type="text" value={novoRelatorioForm.referencia}
                            onChange={e => {
                              const v = e.target.value;
                              setNovoRelatorioForm(p => ({...p, referencia: v}));
                              if (v.trim()) setRelSugestoes(MESES.filter(m => m.toLowerCase().startsWith(v.toLowerCase())));
                              else setRelSugestoes([]);
                            }}
                            onBlur={() => setTimeout(() => setRelSugestoes([]), 150)}
                            className={inputClass} placeholder="Ex: Janeiro" />
                          {relSugestoes.length > 0 && (
                            <ul className={`absolute z-50 w-full mt-1 rounded-xl shadow-lg border overflow-hidden ${isDarkMode ? "bg-slate-800 border-purple-500/30" : "bg-white border-gray-200"}`}>
                              {relSugestoes.map(m => (
                                <li key={m} onMouseDown={() => { setNovoRelatorioForm(p => ({...p, referencia: m})); setRelSugestoes([]); }}
                                  className={`px-4 py-2 text-sm cursor-pointer ${isDarkMode ? "text-white hover:bg-purple-600/30" : "text-slate-800 hover:bg-purple-50"}`}>{m}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                      <div className="mb-4">
                        <label className={labelClass}>PDF (opcional)</label>
                        {novoRelatorioForm.arquivo ? (
                          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isDarkMode ? "bg-green-900/20 border-green-500/30" : "bg-green-50 border-green-200"}`}>
                            <span className="text-green-400 text-sm font-medium flex-1">✓ PDF carregado</span>
                            <label className={`cursor-pointer text-xs px-3 py-1 rounded-lg ${isDarkMode ? "bg-slate-700 text-gray-300 hover:bg-slate-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
                              Substituir
                              <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovoRelatorioForm(p => ({...p, arquivo: b64})); } }} />
                            </label>
                            <button type="button" onClick={() => setNovoRelatorioForm(p => ({...p, arquivo: ""}))} className="text-xs px-3 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700">Remover</button>
                          </div>
                        ) : (
                          <label className={`flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-dashed ${isDarkMode ? "border-purple-500/30 hover:border-purple-400/50" : "border-gray-300 hover:border-purple-400"} transition`}>
                            <span className={`text-xs px-3 py-1.5 rounded-lg font-medium ${isDarkMode ? "bg-purple-600 text-white" : "bg-purple-600 text-white"}`}>Escolher arquivo</span>
                            <span className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Nenhum arquivo escolhido</span>
                            <input type="file" accept=".pdf" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovoRelatorioForm(p => ({...p, arquivo: b64})); } }} />
                          </label>
                        )}
                      </div>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => { setShowAddModal(null); setEditRelatorioIndex(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                        <Button onClick={() => {
                          if (!novoRelatorioForm.titulo.trim()) return;
                          if (editRelatorioIndex !== null) {
                            updSec(s => ({ ...s, relatorios: s.relatorios.map((r, idx) => idx === editRelatorioIndex ? { ...novoRelatorioForm } : r) }));
                            setEditRelatorioIndex(null);
                          } else {
                            updSec(s => ({...s, relatorios: [...s.relatorios, {...novoRelatorioForm}]}));
                          }
                          setNovoRelatorioForm({ titulo: "", data: "", tipo: "", arquivo: "", referencia: "" });
                          setShowAddModal(null);
                        }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">{editRelatorioIndex !== null ? "Salvar Relatório" : "Adicionar"}</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal: Novo/Editar Usuário */}
              {showAddModal === "usuario" && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                  onClick={() => { setShowAddModal(null); setEditUserForm(null); }}>
                  <div className={`w-full max-w-lg rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                    onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <h2 className={`text-lg font-bold mb-5 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{editUserForm ? "Editar Usuário" : "Novo Usuário"}</h2>
                      {(() => {
                        const form = editUserForm ?? novoUserForm;
                        type FormShape = typeof novoUserForm;
                        const setForm = editUserForm
                          ? (fn: (p: FormShape) => FormShape) => setEditUserForm(prev => prev ? { ...fn({ ...prev, cargo: prev.cargo ?? "", telefone: prev.telefone ?? "", foto: prev.foto ?? "" }), id: prev.id } : null)
                          : (fn: (p: FormShape) => FormShape) => setNovoUserForm(fn);
                        const formNorm: FormShape = { ...novoUserForm, ...form, cargo: form.cargo ?? "", telefone: form.telefone ?? "", foto: form.foto ?? "" };
                        return (
                          <div className="space-y-4">
                            {/* Avatar / Foto */}
                            <div className="flex flex-col items-center gap-2 pb-2">
                              <div className={`relative w-20 h-20 rounded-full border-2 overflow-hidden flex items-center justify-center ${isDarkMode ? "border-purple-500/50 bg-slate-800" : "border-purple-300 bg-gray-100"}`}>
                                {form.foto ? (
                                  <img src={form.foto} alt="foto" className="w-full h-full object-cover" />
                                ) : (
                                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
                                )}
                                <label className="absolute inset-0 flex items-end justify-center cursor-pointer">
                                  <span className={`w-full text-center text-[10px] py-1 font-medium ${isDarkMode ? "bg-slate-900/80 text-purple-300" : "bg-white/80 text-purple-600"}`}>alterar</span>
                                  <input type="file" accept="image/*" className="hidden" onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const reader = new FileReader();
                                    reader.onload = ev => setForm(p => ({...p, foto: ev.target?.result as string ?? ""}));
                                    reader.readAsDataURL(file);
                                    e.target.value = "";
                                  }} />
                                </label>
                              </div>
                              {form.foto && (
                                <button type="button" onClick={() => setForm(p => ({...p, foto: ""}))} className={`text-xs ${isDarkMode ? "text-red-400 hover:text-red-300" : "text-red-500 hover:text-red-600"}`}>Remover foto</button>
                              )}
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                              <div><label className={labelClass}>Nome</label><input type="text" value={form.nome} onChange={e => setForm(p => ({...p, nome: e.target.value}))} className={inputClass} placeholder="Nome completo" autoFocus /></div>
                              <div><label className={labelClass}>Login (e-mail)</label><input type="email" value={form.login} onChange={e => setForm(p => ({...p, login: e.target.value}))} className={inputClass} placeholder="usuario@exemplo.gov.br" /></div>
                              <div><label className={labelClass}>Senha</label><input type="password" value={form.senha} onChange={e => setForm(p => ({...p, senha: e.target.value}))} className={inputClass} placeholder="••••••••" /></div>
                              <div><label className={labelClass}>Cargo</label><input type="text" value={form.cargo ?? ""} onChange={e => setForm(p => ({...p, cargo: e.target.value}))} className={inputClass} placeholder="Ex: Analista, Secretário(a)..." /></div>
                              <div><label className={labelClass}>Telefone</label><input type="tel" value={form.telefone ?? ""} onChange={e => setForm(p => ({...p, telefone: e.target.value}))} className={inputClass} placeholder="(00) 00000-0000" /></div>
                              <div className="md:col-span-2"><label className={labelClass}>Entidade</label>
                                <div className="relative">
                                  {(() => {
                                    if (adminSelEntidadeId && form.entidadeId === adminSelEntidadeId) {
                                      return (
                                        <div className={`${inputClass} flex items-center gap-2 cursor-not-allowed opacity-80`}>
                                          <span className="flex-1 truncate whitespace-nowrap overflow-hidden">{entidades.find(e => e.id === form.entidadeId)?.nome ?? "—"}</span>
                                          <span className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full ${isDarkMode ? "bg-slate-700 text-gray-400" : "bg-gray-100 text-gray-400"}`}>fixo</span>
                                        </div>
                                      );
                                    }
                                    const entSugs = entidadeSearch.trim().length > 0
                                      ? entidades.filter(e => e.nome.toLowerCase().includes(entidadeSearch.toLowerCase()))
                                      : entidades;
                                    const entSelecionada = entidades.find(e => e.id === form.entidadeId);
                                    const pickEnt = (ent: typeof entidades[0]) => {
                                      setForm(p => ({...p, entidadeId: ent.id, secretariaId: ""}));
                                      setEntidadeSearch(ent.nome);
                                      setShowEntidadeDropdown(false);
                                      setEntidadeHighlight(0);
                                    };
                                    return (
                                      <>
                                        <input
                                          type="text"
                                          value={entidadeSearch || (entSelecionada ? entSelecionada.nome : "")}
                                          onChange={e => { setEntidadeSearch(e.target.value); setShowEntidadeDropdown(true); setEntidadeHighlight(0); if (!e.target.value) setForm(p => ({...p, entidadeId: "", secretariaId: ""})); }}
                                          onFocus={() => { setShowEntidadeDropdown(true); }}
                                          onBlur={() => setTimeout(() => setShowEntidadeDropdown(false), 150)}
                                          onKeyDown={e => {
                                            if (!showEntidadeDropdown || entSugs.length === 0) return;
                                            if (e.key === "ArrowDown") { e.preventDefault(); setEntidadeHighlight(h => Math.min(h+1, entSugs.length-1)); }
                                            else if (e.key === "ArrowUp") { e.preventDefault(); setEntidadeHighlight(h => Math.max(h-1, 0)); }
                                            else if (e.key === "Enter") { e.preventDefault(); pickEnt(entSugs[entidadeHighlight]); }
                                            else if (e.key === "Escape") { setShowEntidadeDropdown(false); }
                                          }}
                                          className={inputClass}
                                          placeholder="Digite para buscar entidade..."
                                          autoComplete="off"
                                        />
                                        {showEntidadeDropdown && entSugs.length > 0 && (
                                          <ul className={`absolute z-[10000] left-0 right-0 mt-1 rounded-lg shadow-xl overflow-hidden border ${isDarkMode ? "bg-slate-800 border-purple-500/30" : "bg-white border-gray-200"}`}>
                                            {entSugs.map((ent, idx) => (
                                              <li key={ent.id} onMouseDown={() => pickEnt(ent)} onMouseEnter={() => setEntidadeHighlight(idx)}
                                                className={`px-3 py-2 text-sm cursor-pointer transition-colors ${
                                                  idx === entidadeHighlight
                                                    ? "bg-purple-600 text-white"
                                                    : isDarkMode ? "text-gray-200 hover:bg-slate-700" : "text-slate-800 hover:bg-purple-50"
                                                }`}>{ent.nome}</li>
                                            ))}
                                          </ul>
                                        )}
                                      </>
                                    );
                                  })()}
                                </div>
                              </div>
                              <div className="md:col-span-2"><label className={labelClass}>Secretaria</label>
                                <select value={form.secretariaId} onChange={e => setForm(p => ({...p, secretariaId: e.target.value}))} className={inputClass} disabled={!form.entidadeId}>
                                  <option value="">Selecione a secretaria</option>
                                  {(entidades.find(e => e.id === form.entidadeId)?.secretarias ?? []).map(sec => <option key={sec.id} value={sec.id}>{sec.nome}</option>)}
                                </select>
                              </div>
                            </div>
                            <div className="flex justify-end gap-3">
                              <Button variant="outline" onClick={() => { setShowAddModal(null); setEditUserForm(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-black"}>Cancelar</Button>
                              <Button onClick={async () => {
                                if (editUserForm) {
                                  if (!editUserForm.nome || !editUserForm.login || !editUserForm.entidadeId || !editUserForm.secretariaId) return;
                                  setClientUsers(prev => prev.map(u => u.id === editUserForm.id ? editUserForm : u));
                                  await updateClientUser(editUserForm);
                                  setEditUserForm(null);
                                } else {
                                  if (!novoUserForm.nome || !novoUserForm.login || !novoUserForm.senha || !novoUserForm.entidadeId || !novoUserForm.secretariaId) return;
                                  const { error } = await createClientUser({ id: '', ...novoUserForm });
                                  if (error) { alert(`Erro ao criar usuário: ${error}`); return; }
                                  const updated = await fetchClientUsers();
                                  setClientUsers(updated);
                                  setNovoUserForm({ nome: "", login: "", senha: "", entidadeId: "", secretariaId: "", cargo: "", telefone: "", foto: "" });
                                }
                                setShowAddModal(null);
                              }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                                {editUserForm ? "Salvar Edição" : "Adicionar Usuário"}
                              </Button>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Confirmar Exclusão */}
              {confirmDelete && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}} onClick={() => setConfirmDelete(null)}>
                  <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-red-500/30" : "bg-white border border-gray-200"}`} onClick={e => e.stopPropagation()}>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0"><span className="text-xl">🗑</span></div>
                        <div>
                          <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Confirmar Exclusão</h2>
                          <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Esta ação não pode ser desfeita.</p>
                        </div>
                      </div>
                      <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Excluir <span className="font-semibold text-red-400">"{confirmDelete.label}"</span>?</p>
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setConfirmDelete(null)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                        <Button onClick={() => { confirmDelete.onConfirm(); setConfirmDelete(null); }} className="bg-red-600 hover:bg-red-700 text-white">Sim, Excluir</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>{/* /max-w-5xl */}
          </main>
        </div>
      );
    }


    return (
      <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-gray-100"}>
        {/* Header Admin */}
        <header className={isDarkMode
          ? "bg-slate-900 border-b border-purple-500/20 py-4 sticky top-0 z-50 shadow-2xl"
          : "bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-md"
        }>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-lg transition mr-1" onClick={() => setAdminSidebarOpen(o => !o)}
                style={{color: isDarkMode ? "#c084fc" : "#9333ea", background: isDarkMode ? "rgba(168,85,247,0.1)" : "rgba(147,51,234,0.08)"}}>
                <Menu className="w-5 h-5" />
              </button>
              <img src={isDarkMode ? logoJeosBranca : logoJeosColorida} alt="JEOS" className="h-12 w-auto" />
              <span className="text-xs font-bold px-2 py-1 rounded bg-gradient-to-r from-orange-500 to-red-600 text-white tracking-wider">ADMIN</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsDarkMode(!isDarkMode)}
                className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10 px-2" : "border-purple-500 text-purple-600 hover:bg-purple-50 px-2"}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAdminLanding(true)}
                className={isDarkMode ? "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" : "border-cyan-500 text-cyan-600 hover:bg-cyan-50"}>
                <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline ml-1.5">Voltar</span>
              </Button>
              <Button variant="outline" size="sm" onClick={handleAdminLogout}
                className={isDarkMode ? "border-red-500/50 text-red-400 hover:bg-red-500/10" : "border-red-500 text-red-600 hover:bg-red-50"}>
                <LogOut className="w-4 h-4" /><span className="hidden sm:inline ml-1.5">Sair</span>
              </Button>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-73px)] overflow-hidden">
          {/* Overlay backdrop mobile */}
          {adminSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setAdminSidebarOpen(false)} />
          )}
          {/* Sidebar */}
          <aside className={`fixed top-0 left-0 h-full w-64 z-40 flex flex-col flex-shrink-0 overflow-y-auto p-4 transition-transform duration-300
            md:sticky md:top-[73px] md:translate-x-0 md:z-auto md:h-[calc(100vh-73px)] md:self-start
            ${adminSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${isDarkMode ? "bg-slate-900 border-r border-purple-500/20" : "bg-white border-r border-gray-200 shadow-sm"}
          `}>
            <div className="flex items-center justify-between mb-4 md:hidden">
              <p className={isDarkMode ? "text-gray-400 text-xs uppercase tracking-wider px-4" : "text-gray-500 text-xs uppercase tracking-wider px-4"}>Menu</p>
              <button onClick={() => setAdminSidebarOpen(false)} className={`p-2 rounded-lg ${isDarkMode ? "text-gray-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className={`${isDarkMode ? "text-gray-400" : "text-gray-500"} text-xs uppercase tracking-wider mb-4 px-4 hidden md:block`}>
              Editar Conteúdo
            </p>
            <nav className="space-y-1">
              {adminMenuItems.map(item => {
                const Icon = item.icon;
                const isActive = adminSection === item.id;
                return (
                  <button key={item.id} onClick={() => { setAdminSection(item.id); setAdminEditIndex(null); setAdminSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left cursor-pointer ${isActive
                      ? isDarkMode ? "bg-gradient-to-r from-orange-600/30 to-red-600/20 text-white border border-orange-500/30" : "bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 border border-orange-300"
                      : isDarkMode ? "text-gray-400 hover:bg-slate-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                    }`}>
                    <Icon className={`w-5 h-5 ${isActive ? (isDarkMode ? "text-orange-400" : "text-orange-600") : ""}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 p-6 md:p-8 overflow-y-auto">

            {/* Dashboard */}
            {adminSection === "dashboard" && (
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Painel Administrativo</h1>
                <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>Gerencie o conteúdo do site da JEOS Sistemas</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                  {([
                    { id: "hero", label: "Hero / Banner", desc: "Título e subtítulo da página inicial", icon: Award, color: "from-purple-600 to-purple-800" },
                    { id: "sobre", label: "Sobre Nós", desc: "Textos e foto da seção sobre a empresa", icon: Users, color: "from-cyan-600 to-cyan-800" },
                    { id: "stats", label: "Estatísticas", desc: "Números e destaques exibidos no site", icon: Shield, color: "from-pink-600 to-pink-800" },
                    { id: "solucoes", label: "Soluções", desc: "Títulos, descrições e imagens dos produtos", icon: Package, color: "from-green-600 to-green-800" },
                    { id: "clientes", label: "Clientes", desc: "Órgãos que usam nossos sistemas", icon: Briefcase, color: "from-yellow-600 to-yellow-800" },
                    { id: "depoimentos", label: "Depoimentos", desc: "Avaliações e testemunhos de clientes", icon: Quote, color: "from-orange-600 to-orange-800" },
                    { id: "certidoes", label: "Certidões", desc: "Documentos de regularidade do site", icon: FileCheck, color: "from-red-600 to-red-800" },
                    { id: "contato", label: "Contato", desc: "Telefone, e-mail e endereço no rodapé", icon: Phone, color: "from-indigo-600 to-indigo-800" },
                    { id: "redes", label: "Redes Sociais", desc: "Facebook, Instagram, YouTube, LinkedIn e WhatsApp", icon: Globe, color: "from-blue-600 to-blue-800" },
                    { id: "blog", label: "Blog", desc: "Criar, editar e excluir posts e notícias", icon: BookOpen, color: "from-teal-600 to-teal-800" },
                  ]).map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <Card key={i} onClick={() => { setAdminSection(item.id); setAdminEditIndex(null); }}
                        className={`cursor-pointer transition-all hover:scale-105 ${isDarkMode ? "bg-slate-900/50 border-purple-500/20 hover:border-orange-500/50" : "bg-white border-gray-200 shadow-md hover:shadow-xl hover:border-orange-400"}`}>
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${item.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{item.label}</p>
                            <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{item.desc}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Hero */}
            {adminSection === "hero" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Hero / Banner</h1>
                  <Button onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> {savedFeedback ? "Salvo com sucesso!" : "Salvar Alterações"}
                  </Button>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Formulário */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Editar Campos</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <label className={labelClass}>Título Principal</label>
                        <input type="text" value={siteContent.heroTitle} onChange={e => updateContent("heroTitle", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Subtítulo</label>
                        <textarea rows={4} value={siteContent.heroSubtitle} onChange={e => updateContent("heroSubtitle", e.target.value)} className={inputClass} />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Preview real */}
                  <div>
                    <p className={isDarkMode ? "text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3" : "text-orange-600 text-xs font-semibold uppercase tracking-wider mb-3"}>⚡ Preview em tempo real</p>
                    <div className={isDarkMode ? "rounded-2xl overflow-hidden border border-purple-500/20" : "rounded-2xl overflow-hidden border border-gray-200 shadow-lg"}>
                      {/* Simula o header */}
                      <div className={isDarkMode ? "bg-slate-900 px-4 py-2 flex items-center gap-2 border-b border-purple-500/20" : "bg-white px-4 py-2 flex items-center gap-2 border-b border-gray-200"}>
                        <img src={isDarkMode ? logoJeosBranca : logoJeosColorida} alt="JEOS" className="h-6 w-auto" />
                        <div className="flex gap-2 ml-4">
                          {["Início","Soluções","Sobre","Contato"].map(l => (
                            <span key={l} className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-500 text-xs"}>{l}</span>
                          ))}
                        </div>
                      </div>
                      {/* Simula o hero */}
                      <div className={isDarkMode
                        ? "bg-gradient-to-br from-purple-900/20 via-slate-950 to-cyan-900/20 px-8 py-10 text-center"
                        : "bg-gradient-to-br from-purple-50 via-white to-cyan-50 px-8 py-10 text-center"
                      }>
                        <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 mb-3 leading-tight">
                          {siteContent.heroTitle}
                        </h2>
                        <p className={isDarkMode ? "text-gray-300 text-xs mb-5 leading-relaxed" : "text-gray-600 text-xs mb-5 leading-relaxed"}>
                          {siteContent.heroSubtitle}
                        </p>
                        <div className="flex gap-2 justify-center">
                          <span className="px-3 py-1 rounded bg-gradient-to-r from-purple-600 to-cyan-600 text-white text-xs">Conheça Nossas Soluções</span>
                          <span className={isDarkMode ? "px-3 py-1 rounded border border-purple-500 text-purple-400 text-xs" : "px-3 py-1 rounded border border-purple-500 text-purple-600 text-xs"}>Fale com Especialista</span>
                        </div>
                      </div>
                      {/* Simula os stats */}
                      <div className={isDarkMode ? "bg-slate-900/30 px-4 py-3 grid gap-2 border-t border-purple-500/10" : "bg-gray-50 px-4 py-3 grid gap-2 border-t border-gray-100"} style={{gridTemplateColumns: `repeat(${Math.min(stats.filter(s => s.ativo).length || 1, 4)}, 1fr)`}}>
                        {stats.filter(s => s.ativo).map((s, i) => ({ v: s.valor, d: s.desc })).map((s, i) => (
                          <div key={i} className="text-center">
                            <p className={isDarkMode ? "text-cyan-400 text-xs font-bold" : "text-purple-600 text-xs font-bold"}>{s.v}</p>
                            <p className="text-gray-500 text-xs">{s.d}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Sobre */}
            {adminSection === "sobre" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Sobre Nós</h1>
                  <Button onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> {savedFeedback ? "Salvo com sucesso!" : "Salvar Alterações"}
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Textos */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>📝 Textos da Seção</CardTitle></CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Primeiro Parágrafo</label>
                        <textarea rows={4} value={siteContent.sobreParagrafo1} onChange={e => updateContent("sobreParagrafo1", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Segundo Parágrafo</label>
                        <textarea rows={4} value={siteContent.sobreParagrafo2} onChange={e => updateContent("sobreParagrafo2", e.target.value)} className={inputClass} />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Foto + Badge */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                      <CardHeader><CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>🖼️ Foto da Equipe</CardTitle></CardHeader>
                      <CardContent className="space-y-3">
                        <input type="file" accept="image/*" className={fileInputClass}
                          onChange={async e => { const f = e.target.files?.[0]; if (f) updateContent("fotoEquipe", await readFileAsBase64(f)); }} />
                        {(siteContent as typeof defaultSiteContent).fotoEquipe && (
                          <img src={(siteContent as typeof defaultSiteContent).fotoEquipe} alt="Preview" className="h-40 w-full rounded-lg object-cover border border-purple-500/20" />
                        )}
                      </CardContent>
                    </Card>

                    <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                      <CardHeader><CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>🏅 Badge de Destaque</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <label className={labelClass}>Número / Valor (ex: 500+)</label>
                          <input type="text" value={(siteContent as typeof defaultSiteContent).badgeNumero ?? "500+"} onChange={e => updateContent("badgeNumero", e.target.value)} className={inputClass} placeholder="500+" />
                        </div>
                        <div>
                          <label className={labelClass}>Descrição (ex: Clientes Ativos)</label>
                          <input type="text" value={(siteContent as typeof defaultSiteContent).badgeDesc ?? "Clientes Ativos"} onChange={e => updateContent("badgeDesc", e.target.value)} className={inputClass} placeholder="Clientes Ativos" />
                        </div>
                        <div className="bg-gradient-to-r from-purple-600 to-cyan-600 p-4 rounded-xl text-center">
                          <p className="text-white text-2xl font-bold">{(siteContent as typeof defaultSiteContent).badgeNumero || "500+"}</p>
                          <p className="text-white text-sm">{(siteContent as typeof defaultSiteContent).badgeDesc || "Clientes Ativos"}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Diferenciais */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>✨ Diferenciais</CardTitle></CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(n => (
                          <div key={n} className={isDarkMode ? "p-4 rounded-xl border border-purple-500/20 space-y-3" : "p-4 rounded-xl border border-gray-200 bg-gray-50 space-y-3"}>
                            <p className={isDarkMode ? "text-purple-400 text-xs font-bold uppercase tracking-wider" : "text-purple-600 text-xs font-bold uppercase tracking-wider"}>Diferencial {n}</p>
                            <div>
                              <label className={labelClass}>Título</label>
                              <input type="text" value={(siteContent as typeof defaultSiteContent)[`diferencial${n}Titulo` as keyof typeof defaultSiteContent] ?? ""} onChange={e => updateContent(`diferencial${n}Titulo` as keyof typeof defaultSiteContent, e.target.value)} className={inputClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Descrição</label>
                              <input type="text" value={(siteContent as typeof defaultSiteContent)[`diferencial${n}Desc` as keyof typeof defaultSiteContent] ?? ""} onChange={e => updateContent(`diferencial${n}Desc` as keyof typeof defaultSiteContent, e.target.value)} className={inputClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Ícone</label>
                              <select value={(siteContent as typeof defaultSiteContent)[`diferencial${n}Icone` as keyof typeof defaultSiteContent] ?? "TrendingUp"} onChange={e => updateContent(`diferencial${n}Icone` as keyof typeof defaultSiteContent, e.target.value)} className={inputClass}>
                                <option value="TrendingUp">📈 Tendência / Inovação</option>
                                <option value="Shield">🛡️ Segurança</option>
                                <option value="Headphones">🎧 Suporte</option>
                                <option value="Award">🏆 Prêmio / Qualidade</option>
                                <option value="CheckCircle2">✅ Aprovado / Check</option>
                                <option value="Briefcase">💼 Negócios</option>
                                <option value="Users">👥 Equipe / Pessoas</option>
                                <option value="Settings">⚙️ Configurações</option>
                                <option value="Phone">📞 Telefone</option>
                                <option value="Mail">✉️ E-mail</option>
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Missão, Visão e Valores */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>🎯 Missão, Visão e Valores</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className={labelClass}>Missão</label>
                        <textarea rows={3} value={(siteContent as typeof defaultSiteContent).missao ?? ""} onChange={e => updateContent("missao", e.target.value)} className={inputClass} placeholder="Descreva a missão da empresa..." />
                      </div>
                      <div>
                        <label className={labelClass}>Visão</label>
                        <textarea rows={3} value={(siteContent as typeof defaultSiteContent).visao ?? ""} onChange={e => updateContent("visao", e.target.value)} className={inputClass} placeholder="Descreva a visão da empresa..." />
                      </div>
                      <div>
                        <label className={labelClass}>Valores</label>
                        <textarea rows={3} value={(siteContent as typeof defaultSiteContent).valores ?? ""} onChange={e => updateContent("valores", e.target.value)} className={inputClass} placeholder="Liste os valores da empresa..." />
                      </div>
                      <p className={isDarkMode ? "text-gray-500 text-xs" : "text-gray-400 text-xs"}>Deixe um campo vazio para ocultá-lo no site.</p>
                    </CardContent>
                  </Card>

                  {/* Preview */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-white text-base" : "text-slate-900 text-base"}>⚡ Preview em tempo real</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={isDarkMode ? "rounded-xl overflow-hidden border border-purple-500/20 bg-slate-950" : "rounded-xl overflow-hidden border border-gray-200 bg-white"}>
                        <div className={isDarkMode ? "px-5 py-4 border-b border-purple-500/10" : "px-5 py-4 border-b border-gray-100 bg-gray-50"}>
                          <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Seção Sobre</p>
                          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Sobre a JEOS</h2>
                        </div>
                        <div className="px-5 py-4 space-y-3">
                          <p className={isDarkMode ? "text-gray-300 text-xs leading-relaxed" : "text-gray-700 text-xs leading-relaxed"}>{siteContent.sobreParagrafo1}</p>
                          <p className={isDarkMode ? "text-gray-300 text-xs leading-relaxed" : "text-gray-700 text-xs leading-relaxed"}>{siteContent.sobreParagrafo2}</p>
                          <div className="space-y-2 pt-1">
                            {[1, 2, 3].map(n => {
                              const diferencialIconMap: Record<string, React.ElementType> = { TrendingUp, Shield, Headphones, Award, CheckCircle2, Briefcase, Users, Settings, Phone, Mail };
                              const iconeKey = `diferencial${n}Icone` as keyof typeof defaultSiteContent;
                              const tituloKey = `diferencial${n}Titulo` as keyof typeof defaultSiteContent;
                              const descKey = `diferencial${n}Desc` as keyof typeof defaultSiteContent;
                              const DIcon = diferencialIconMap[(siteContent as typeof defaultSiteContent)[iconeKey] as string] ?? TrendingUp;
                              return (
                                <div key={n} className="flex items-start gap-2">
                                  <div className="p-1.5 bg-gradient-to-r from-purple-600 to-cyan-600 rounded flex-shrink-0">
                                    <DIcon className="w-3 h-3 text-white" />
                                  </div>
                                  <div>
                                    <p className={isDarkMode ? "text-white text-xs font-semibold" : "text-slate-900 text-xs font-semibold"}>{(siteContent as typeof defaultSiteContent)[tituloKey] as string}</p>
                                    <p className="text-gray-500 text-xs">{(siteContent as typeof defaultSiteContent)[descKey] as string}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {(siteContent as typeof defaultSiteContent).fotoEquipe && (
                            <div className="relative mt-3">
                              <img src={(siteContent as typeof defaultSiteContent).fotoEquipe} alt="Equipe" className="w-full h-28 object-cover rounded-xl" />
                              <div className="absolute bottom-2 right-2 bg-gradient-to-r from-purple-600 to-cyan-600 px-3 py-1.5 rounded-lg shadow-lg text-center">
                                <p className="text-white text-sm font-bold leading-none">{(siteContent as typeof defaultSiteContent).badgeNumero || "500+"}</p>
                                <p className="text-white text-xs">{(siteContent as typeof defaultSiteContent).badgeDesc || "Clientes Ativos"}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
            {adminSection === "stats" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Estatísticas</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setNovaStatForm({ valor: "", desc: "", icone: "Award" }); setShowAddStatModal(true); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">+ Adicionar</Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Formulário */}
                  <div className="space-y-4">
                    {stats.map((stat, i) => (
                      <Card key={stat.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 min-w-0 flex-1 mr-3">
                              {(() => { const IC = solucaoIconPickerMap[stat.icone ?? "Award"] ?? Award; return <IC className={isDarkMode ? "w-5 h-5 text-cyan-400 shrink-0" : "w-5 h-5 text-purple-600 shrink-0"} />; })()}
                              <p className={isDarkMode ? "text-white font-semibold truncate" : "text-slate-900 font-semibold truncate"}>{stat.valor}</p>
                              <span className={isDarkMode ? "text-gray-400 text-sm truncate" : "text-gray-500 text-sm truncate"}>— {stat.desc}</span>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button size="sm" variant="outline" onClick={() => setStats(prev => prev.map((s, idx) => idx === i ? { ...s, ativo: !s.ativo } : s))}
                                className={stat.ativo ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : "border-gray-500/50 text-gray-400 hover:bg-gray-500/10"}>
                                {stat.ativo ? "● Ativo" : "○ Inativo"}
                              </Button>
                              <Button size="sm" variant="outline"
                                onClick={() => { if (adminEditIndex === i + 1000) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i + 1000); setEditBuffer({...stat}); } }}
                                className={isDarkMode ? "border-purple-500/50 text-purple-400 px-2.5" : "border-purple-500 text-purple-600 px-2.5"}>
                                {adminEditIndex === i + 1000 ? "↑" : "✏"}
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: `Estatística ${i + 1} (${stat.valor})`, onConfirm: () => { setStats(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-2.5">🗑</Button>
                            </div>
                          </div>
                          {adminEditIndex === i + 1000 && editBuffer && (
                            <div className="space-y-4 mt-4 border-t border-purple-500/20 pt-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className={labelClass}>Valor</label>
                                  <input type="text" value={(editBuffer as any).valor ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, valor: e.target.value}))} className={inputClass} />
                                </div>
                                <div>
                                  <label className={labelClass}>Descrição</label>
                                  <input type="text" value={(editBuffer as any).desc ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, desc: e.target.value}))} className={inputClass} />
                                </div>
                              </div>
                              <div>
                                <label className={labelClass}>Ícone</label>
                                <div className="relative inline-block">
                                  {(() => { const CurIco = solucaoIconPickerMap[(editBuffer as any).icone ?? "Award"] ?? Award; const curLabel = solucaoIconOptions.find(o => o.key === ((editBuffer as any).icone ?? "Award"))?.label ?? ""; return (
                                    <button type="button" onClick={() => setOpenIconPicker(openIconPicker === `stat-edit-${i}` ? null : `stat-edit-${i}`)}
                                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white hover:border-purple-400" : "bg-white border-gray-300 text-slate-800 hover:border-purple-400"}`}>
                                      <CurIco className="w-5 h-5" />
                                      <span className="text-sm">{curLabel}</span>
                                      <span className="text-xs opacity-60 ml-1">▼</span>
                                    </button>
                                  ); })()}
                                  {openIconPicker === `stat-edit-${i}` && (
                                    <div className={`absolute z-50 mt-1 p-3 rounded-xl border shadow-2xl ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`} style={{width: 320}}>
                                      <div className="grid grid-cols-8 gap-1.5">
                                        {solucaoIconOptions.map(opt => {
                                          const IcoC = solucaoIconPickerMap[opt.key];
                                          const isSel = ((editBuffer as any).icone ?? "Award") === opt.key;
                                          return (
                                            <button key={opt.key} type="button" onClick={() => { setEditBuffer(prev => ({...prev!, icone: opt.key})); setOpenIconPicker(null); }} title={opt.label}
                                              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition ${isSel ? "bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg" : isDarkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"}`}>
                                              <IcoC className="w-4 h-4" />
                                              <span className="text-[9px] leading-tight text-center">{opt.label}</span>
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex justify-end gap-3 pt-2 border-t border-purple-500/20">
                                <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                                <Button onClick={() => { setStats(prev => prev.map((s, idx) => idx === i ? { ...s, ...(editBuffer as any) } : s)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Confirmar Alterações</Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  {/* Preview real */}
                  <div>
                    <p className={isDarkMode ? "text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3" : "text-orange-600 text-xs font-semibold uppercase tracking-wider mb-3"}>⚡ Preview em tempo real</p>
                    <div className={isDarkMode ? "rounded-2xl border border-purple-500/20 overflow-hidden" : "rounded-2xl border border-gray-200 shadow-lg overflow-hidden"}>
                      <div className={isDarkMode ? "bg-slate-900/30 px-4 py-2 border-b border-purple-500/10" : "bg-gray-50 px-4 py-2 border-b border-gray-100"}>
                        <p className="text-gray-500 text-xs">Como aparece na página</p>
                      </div>
                      <div className={isDarkMode ? "bg-slate-950 grid gap-0" : "bg-white grid gap-0"} style={{gridTemplateColumns: `repeat(${Math.min(stats.filter(s => s.ativo).length || 1, 4)}, 1fr)`}}>
                        {stats.filter(s => s.ativo).map((s, i) => {
                          const Icon = solucaoIconPickerMap[s.icone ?? "Award"] ?? Award;
                          return (
                            <div key={i} className={`text-center p-6 ${isDarkMode ? "border border-purple-500/10" : "border border-gray-100"}`}>
                              <div className="w-10 h-10 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                              <h3 className={isDarkMode ? "text-cyan-400 font-bold mb-1" : "text-purple-600 font-bold mb-1"}>{s.valor}</h3>
                              <p className="text-gray-500 text-xs">{s.desc}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contato */}
            {adminSection === "contato" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Contato</h1>
                  <Button onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> {savedFeedback ? "Salvo com sucesso!" : "Salvar Alterações"}
                  </Button>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Formulário */}
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Editar Campos</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <label className={labelClass}>Telefone</label>
                        <input type="text" value={siteContent.contatoTelefone} onChange={e => updateContent("contatoTelefone", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>E-mail</label>
                        <input type="email" value={siteContent.contatoEmail} onChange={e => updateContent("contatoEmail", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Endereço</label>
                        <input type="text" value={siteContent.contatoEndereco} onChange={e => updateContent("contatoEndereco", e.target.value)} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>CNPJ</label>
                        <input
                          type="text"
                          value={(siteContent as typeof defaultSiteContent).cnpj ?? ""}
                          onChange={e => {
                            // Máscara: 00.000.000/0000-00
                            let v = e.target.value.replace(/\D/g, "").slice(0, 14);
                            if (v.length > 12) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{1,2}).*/, "$1.$2.$3/$4-$5");
                            else if (v.length > 8) v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d*)/, "$1.$2.$3/$4");
                            else if (v.length > 5) v = v.replace(/^(\d{2})(\d{3})(\d*)/, "$1.$2.$3");
                            else if (v.length > 2) v = v.replace(/^(\d{2})(\d*)/, "$1.$2");
                            updateContent("cnpj", v);
                          }}
                          maxLength={18}
                          className={(() => {
                            const raw = ((siteContent as typeof defaultSiteContent).cnpj ?? "").replace(/\D/g, "");
                            const isValid = raw.length === 0 || (raw.length === 14 && (() => {
                              if (/^(\d)\1+$/.test(raw)) return false;
                              const calc = (s: string, n: number) => {
                                let sum = 0;
                                for (let i = 0; i < n; i++) sum += parseInt(s[i]) * (n + 1 - i > 1 ? n + 1 - i : n + 2 - i);
                                const r = sum % 11; return r < 2 ? 0 : 11 - r;
                              };
                              const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
                              const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
                              let s1 = 0, s2 = 0;
                              for (let i = 0; i < 12; i++) s1 += parseInt(raw[i]) * weights1[i];
                              const d1 = s1 % 11 < 2 ? 0 : 11 - (s1 % 11);
                              if (d1 !== parseInt(raw[12])) return false;
                              for (let i = 0; i < 13; i++) s2 += parseInt(raw[i]) * weights2[i];
                              const d2 = s2 % 11 < 2 ? 0 : 11 - (s2 % 11);
                              return d2 === parseInt(raw[13]);
                            })());
                            const base = inputClass;
                            if (raw.length === 0) return base;
                            return isValid ? base + " border-green-500" : base + " border-red-500";
                          })()}
                          placeholder="00.000.000/0001-00"
                        />
                        {(() => {
                          const raw = ((siteContent as typeof defaultSiteContent).cnpj ?? "").replace(/\D/g, "");
                          if (raw.length === 0) return null;
                          const isValid = raw.length === 14 && (() => {
                            if (/^(\d)\1+$/.test(raw)) return false;
                            const weights1 = [5,4,3,2,9,8,7,6,5,4,3,2];
                            const weights2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
                            let s1 = 0, s2 = 0;
                            for (let i = 0; i < 12; i++) s1 += parseInt(raw[i]) * weights1[i];
                            const d1 = s1 % 11 < 2 ? 0 : 11 - (s1 % 11);
                            if (d1 !== parseInt(raw[12])) return false;
                            for (let i = 0; i < 13; i++) s2 += parseInt(raw[i]) * weights2[i];
                            const d2 = s2 % 11 < 2 ? 0 : 11 - (s2 % 11);
                            return d2 === parseInt(raw[13]);
                          })();
                          return <p className={`text-xs mt-1 ${isValid ? "text-green-400" : "text-red-400"}`}>{isValid ? "✓ CNPJ válido" : "✗ CNPJ inválido"}</p>;
                        })()}
                      </div>
                      <div>
                        <label className={labelClass}>WhatsApp (número com DDD, ex: 11999998888)</label>
                        <input type="tel" value={(siteContent as typeof defaultSiteContent).whatsapp ?? ""} onChange={e => updateContent("whatsapp", e.target.value)} className={inputClass} placeholder="11999998888" />
                        <p className="text-gray-400 text-xs mt-1">Usado no botão "Fale com Especialista" da página inicial</p>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Preview real */}
                  <div>
                    <p className={isDarkMode ? "text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3" : "text-orange-600 text-xs font-semibold uppercase tracking-wider mb-3"}>⚡ Preview em tempo real</p>
                    <div className={isDarkMode ? "rounded-2xl overflow-hidden border border-purple-500/20" : "rounded-2xl overflow-hidden border border-gray-200 shadow-lg"}>
                      <div className={isDarkMode ? "bg-slate-950 px-4 py-2 border-b border-purple-500/10" : "bg-gray-50 px-4 py-2 border-b border-gray-100"}>
                        <p className="text-gray-500 text-xs">Como aparece no rodapé</p>
                      </div>
                      <div className={isDarkMode ? "bg-slate-950 p-6" : "bg-slate-900 p-6"}>
                        <h4 className="text-white font-semibold mb-4 text-sm">Contato</h4>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-center gap-2 text-gray-400">
                            <Phone className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span>{siteContent.contatoTelefone}</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-400">
                            <Mail className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span className="break-all">{siteContent.contatoEmail}</span>
                          </li>
                          <li className="flex items-center gap-2 text-gray-400">
                            <MapPin className="w-4 h-4 text-purple-400 flex-shrink-0" />
                            <span>{siteContent.contatoEndereco}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Redes Sociais */}
            {adminSection === "redes" && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Redes Sociais</h1>
                  <Button onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                    <CheckCircle2 className="w-4 h-4 mr-2" /> {savedFeedback ? "Salvo com sucesso!" : "Salvar Alterações"}
                  </Button>
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                    <CardHeader><CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Links das Redes Sociais</CardTitle></CardHeader>
                    <CardContent className="space-y-5">
                      <div>
                        <label className={labelClass}><Facebook className="w-4 h-4 inline mr-2 text-blue-400" />Facebook (URL completa)</label>
                        <input type="url" value={(siteContent as typeof defaultSiteContent).facebook ?? ""} onChange={e => updateContent("facebook", e.target.value)} className={inputClass} placeholder="https://facebook.com/suapagina" />
                      </div>
                      <div>
                        <label className={labelClass}><Instagram className="w-4 h-4 inline mr-2 text-pink-400" />Instagram (URL completa)</label>
                        <input type="url" value={(siteContent as typeof defaultSiteContent).instagram ?? ""} onChange={e => updateContent("instagram", e.target.value)} className={inputClass} placeholder="https://instagram.com/suapagina" />
                      </div>
                      <div>
                        <label className={labelClass}><MessageCircle className="w-4 h-4 inline mr-2 text-green-400" />WhatsApp (número com DDD, ex: 11999998888)</label>
                        <input type="tel" value={(siteContent as typeof defaultSiteContent).whatsapp ?? ""} onChange={e => updateContent("whatsapp", e.target.value)} className={inputClass} placeholder="11999998888" />
                        <p className={isDarkMode ? "text-gray-400 text-xs mt-1" : "text-gray-500 text-xs mt-1"}>Apenas números com DDD. Usado também no botão "Fale com Especialista"</p>
                      </div>
                      <div>
                        <label className={labelClass}><Youtube className="w-4 h-4 inline mr-2 text-red-400" />YouTube (URL completa)</label>
                        <input type="url" value={(siteContent as typeof defaultSiteContent).youtube ?? ""} onChange={e => updateContent("youtube", e.target.value)} className={inputClass} placeholder="https://youtube.com/@seucanal" />
                      </div>
                      <div>
                        <label className={labelClass}><Linkedin className="w-4 h-4 inline mr-2 text-blue-300" />LinkedIn (URL completa)</label>
                        <input type="url" value={(siteContent as typeof defaultSiteContent).linkedin ?? ""} onChange={e => updateContent("linkedin", e.target.value)} className={inputClass} placeholder="https://linkedin.com/company/suaempresa" />
                      </div>
                    </CardContent>
                  </Card>
                  {/* Preview */}
                  <div>
                    <p className={isDarkMode ? "text-orange-400 text-xs font-semibold uppercase tracking-wider mb-3" : "text-orange-600 text-xs font-semibold uppercase tracking-wider mb-3"}>⚡ Preview em tempo real</p>
                    <div className={isDarkMode ? "rounded-2xl overflow-hidden border border-purple-500/20" : "rounded-2xl overflow-hidden border border-gray-200 shadow-lg"}>
                      <div className={isDarkMode ? "bg-slate-950 px-4 py-2 border-b border-purple-500/10" : "bg-gray-50 px-4 py-2 border-b border-gray-100"}>
                        <p className="text-gray-500 text-xs">Como aparecem no rodapé</p>
                      </div>
                      <div className="bg-slate-950 p-6">
                        <div className="flex justify-center gap-4 flex-wrap">
                          {[(siteContent as typeof defaultSiteContent).facebook, (siteContent as typeof defaultSiteContent).instagram, (siteContent as typeof defaultSiteContent).whatsapp, (siteContent as typeof defaultSiteContent).youtube, (siteContent as typeof defaultSiteContent).linkedin].some(Boolean) ? (
                            <>
                              {(siteContent as typeof defaultSiteContent).facebook && <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center"><Facebook className="w-5 h-5 text-white" /></div>}
                              {(siteContent as typeof defaultSiteContent).instagram && <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center"><Instagram className="w-5 h-5 text-white" /></div>}
                              {(siteContent as typeof defaultSiteContent).whatsapp && <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white" /></div>}
                              {(siteContent as typeof defaultSiteContent).youtube && <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center"><Youtube className="w-5 h-5 text-white" /></div>}
                              {(siteContent as typeof defaultSiteContent).linkedin && <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center"><Linkedin className="w-5 h-5 text-white" /></div>}
                            </>
                          ) : (
                            <p className="text-gray-500 text-sm">Preencha os links acima para ver o preview</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Blog */}
            {adminSection === "blog" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Blog</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setShowAddPostModal(true); setEditPostIdx(null); setNovoPostForm({ titulo: "", resumo: "", conteudo: "", imagem: "", autor: "Equipe JEOS", data: new Date().toISOString().split("T")[0], categoria: "" }); }}
                      className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      + Novo Post
                    </Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                {/* Busca */}
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <input
                    type="text"
                    placeholder="🔍 Pesquisar por título, categoria, autor..."
                    value={blogSearch}
                    onChange={e => setBlogSearch(e.target.value)}
                    className={`flex-1 min-w-0 px-4 py-2 rounded-lg border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                  />
                  {blogSearch && (
                    <button onClick={() => setBlogSearch("")} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition">× Limpar</button>
                  )}
                  <span className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {blogPosts.filter(p => !blogSearch || p.titulo.toLowerCase().includes(blogSearch.toLowerCase()) || (p.categoria||'').toLowerCase().includes(blogSearch.toLowerCase()) || p.autor.toLowerCase().includes(blogSearch.toLowerCase())).length} de {blogPosts.length}
                  </span>
                </div>

                {blogPosts.length === 0 ? (
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                    <CardContent className="p-12 text-center">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Nenhum post cadastrado. Clique em "+ Novo Post" para começar.</p>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {blogPosts.filter(p => !blogSearch || p.titulo.toLowerCase().includes(blogSearch.toLowerCase()) || (p.categoria||'').toLowerCase().includes(blogSearch.toLowerCase()) || p.autor.toLowerCase().includes(blogSearch.toLowerCase())).map((post, _fi) => {
                    const i = blogPosts.indexOf(post);
                    return (
                      <Card key={post.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            {post.imagem && (
                              <img src={post.imagem} alt={post.titulo} className="w-16 h-14 sm:w-20 sm:h-16 object-cover rounded-lg flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold text-sm sm:text-base leading-snug ${isDarkMode ? "text-white" : "text-slate-900"}`}>{post.titulo}</p>
                              <p className="text-gray-500 text-xs mt-0.5">{post.categoria && <span className="mr-2 text-cyan-400">{post.categoria}</span>}{post.data} · {post.autor}</p>
                              <div className="flex gap-2 mt-2">
                                <Button size="sm" variant="outline" onClick={() => { setEditPostIdx(i); setNovoPostForm({ titulo: post.titulo, resumo: post.resumo, conteudo: post.conteudo, imagem: post.imagem, autor: post.autor, data: post.data, categoria: post.categoria }); setShowAddPostModal(true); }}
                                  className={isDarkMode ? "border-purple-500/50 text-purple-400 px-2.5" : "border-purple-500 text-purple-600 px-2.5"}>
                                  Editar ✎
                                </Button>
                                <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: post.titulo, onConfirm: () => { setBlogPosts(prev => prev.filter((_, idx) => idx !== i)); deleteBlogPost(post.id).catch(console.error); } })}
                                  className="border-red-500/50 text-red-400 hover:bg-red-500/10 px-2.5">
                                  🗑 Excluir
                                </Button>
                              </div>
                              <p className={`text-xs mt-1.5 line-clamp-2 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{post.resumo}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ); })}
                  </div>
                )}

                {/* Modal Adicionar/Editar Post */}
                {showAddPostModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className={`w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}>
                      <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
                        <h2 className={isDarkMode ? "text-white text-xl font-bold" : "text-slate-900 text-xl font-bold"}>{editPostIdx !== null ? "Editar Post" : "Novo Post"}</h2>
                        <button onClick={() => { setShowAddPostModal(false); setEditPostIdx(null); }} className="text-gray-400 hover:text-white transition text-2xl leading-none">×</button>
                      </div>
                      <div className="p-6 space-y-4">
                        <div>
                          <label className={labelClass}>Título *</label>
                          <input type="text" value={novoPostForm.titulo} onChange={e => setNovoPostForm(p => ({...p, titulo: e.target.value}))} className={inputClass} placeholder="Título do post" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Categoria</label>
                            <input type="text" value={novoPostForm.categoria} onChange={e => setNovoPostForm(p => ({...p, categoria: e.target.value}))} className={inputClass} placeholder="Ex: Tecnologia" />
                          </div>
                          <div>
                            <label className={labelClass}>Data</label>
                            <input type="date" value={novoPostForm.data} onChange={e => setNovoPostForm(p => ({...p, data: e.target.value}))} className={inputClass} />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Autor</label>
                          <input type="text" value={novoPostForm.autor} onChange={e => setNovoPostForm(p => ({...p, autor: e.target.value}))} className={inputClass} placeholder="Nome do autor" />
                        </div>
                        <div>
                          <label className={labelClass}>Imagem de capa</label>
                          <input type="file" accept="image/*" className={fileInputClass}
                            onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovoPostForm(p => ({...p, imagem: b64})); } }} />
                          {novoPostForm.imagem && (
                            <img src={novoPostForm.imagem} alt="preview" className="mt-2 h-28 w-full object-cover rounded-lg" />
                          )}
                        </div>
                        <div>
                          <label className={labelClass}>Resumo (exibido nos cards)</label>
                          <textarea rows={2} value={novoPostForm.resumo} onChange={e => setNovoPostForm(p => ({...p, resumo: e.target.value}))} className={inputClass} placeholder="Breve descrição do post..." />
                        </div>
                        <div>
                          <label className={labelClass}>Conteúdo completo</label>
                          <textarea rows={8} value={novoPostForm.conteudo} onChange={e => setNovoPostForm(p => ({...p, conteudo: e.target.value}))} className={inputClass} placeholder="Escreva o conteúdo completo do post aqui..." />
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button onClick={() => { setShowAddPostModal(false); setEditPostIdx(null); }} variant="outline"
                            className={isDarkMode ? "flex-1 border-gray-600 text-gray-400" : "flex-1 border-gray-300 text-gray-600"}>
                            Cancelar
                          </Button>
                          <Button onClick={() => {
                            if (!novoPostForm.titulo.trim()) return;
                            const newPosts = editPostIdx !== null
                              ? blogPosts.map((p, idx) => idx === editPostIdx ? { ...p, ...novoPostForm } : p)
                              : [...blogPosts, { ...novoPostForm, id: Date.now().toString() }];
                            setBlogPosts(newPosts);
                            const postToSave = editPostIdx !== null ? newPosts[editPostIdx] : newPosts[newPosts.length - 1];
                            upsertBlogPost(postToSave).catch(console.error);
                            setShowAddPostModal(false);
                            setEditPostIdx(null);
                            setSavedFeedback(true);
                            setTimeout(() => setSavedFeedback(false), 2500);
                          }} className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white">
                            {editPostIdx !== null ? "Salvar Alterações" : "Publicar Post"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}


            {/* Soluções */}
            {adminSection === "solucoes" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Soluções</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => {
                      setNovaSolucaoForm({ title: "", description: "", image: "", url: "", features: "", icone: "Package" });
                      setShowAddSolucaoModal(true);
                    }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      + Adicionar
                    </Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {solucoes.map((sol, i) => (
                    <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {(() => { const IC = solucaoIconPickerMap[sol.icone ?? "Package"] ?? Package; return <IC className={isDarkMode ? "w-5 h-5 text-cyan-400" : "w-5 h-5 text-purple-600"} />; })()}
                            <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{sol.title}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { if (adminEditIndex === i) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i); setEditBuffer({...sol}); } }}
                              className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>
                              {adminEditIndex === i ? "Fechar ↑" : "Editar ✎"}
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: sol.title, onConfirm: () => { setSolucoes(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })}
                              className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                              🗑 Excluir
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-xs">{sol.description}</p>
                        {adminEditIndex === i && editBuffer && (
                          <div className="space-y-4 mt-4 border-t border-purple-500/20 pt-4">
                            <div className="grid md:grid-cols-2 gap-4">
                              <div>
                                <label className={labelClass}>Título</label>
                                <input type="text" value={(editBuffer as any).title ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, title: e.target.value}))} className={inputClass} />
                              </div>
                              <div>
                                <label className={labelClass}>Imagem</label>
                                <input type="file" accept="image/*" className={fileInputClass}
                                  onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setEditBuffer(prev => ({...prev!, image: b64})); } }} />
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Ícone do Sistema</label>
                              <div className="relative inline-block">
                                {(() => { const curKey = (editBuffer as any).icone ?? "Package"; const CurIco = solucaoIconPickerMap[curKey] ?? Package; const curLabel = solucaoIconOptions.find(o => o.key === curKey)?.label ?? ""; return (
                                  <button type="button" onClick={() => setOpenIconPicker(openIconPicker === "editBuffer-icone" ? null : "editBuffer-icone")}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white hover:border-purple-400" : "bg-white border-gray-300 text-slate-800 hover:border-purple-400"}`}>
                                    <CurIco className="w-5 h-5" />
                                    <span className="text-sm">{curLabel}</span>
                                    <span className="text-xs opacity-60 ml-1">▼</span>
                                  </button>
                                ); })()}
                                {openIconPicker === "editBuffer-icone" && (
                                  <div className={`absolute z-50 mt-1 p-3 rounded-xl border shadow-2xl ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`} style={{width: 320}}>
                                    <div className="grid grid-cols-8 gap-1.5">
                                      {solucaoIconOptions.map(opt => {
                                        const IcoComp = solucaoIconPickerMap[opt.key];
                                        const isSelected = ((editBuffer as any).icone ?? "") === opt.key;
                                        return (
                                          <button key={opt.key} type="button" onClick={() => { setEditBuffer(prev => ({...prev!, icone: opt.key})); setOpenIconPicker(null); }} title={opt.label}
                                            className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition ${isSelected ? "bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg" : isDarkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"}`}>
                                            <IcoComp className="w-4 h-4" />
                                            <span className="text-[9px] leading-tight text-center">{opt.label}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Link do Sistema (URL de acesso)</label>
                              <input type="url" value={(editBuffer as any).url ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, url: e.target.value}))} className={inputClass} placeholder="https://sistema.exemplo.com.br" />
                            </div>
                            <div>
                              <label className={labelClass}>Descrição</label>
                              <textarea rows={2} value={(editBuffer as any).description ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, description: e.target.value}))} className={inputClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Recursos — um por linha</label>
                              <textarea rows={6} value={((editBuffer as any).features ?? []).join("\n")} onChange={e => setEditBuffer(prev => ({...prev!, features: e.target.value.split("\n").filter((f: string) => f.trim())}))} className={inputClass} />
                            </div>
                            {(editBuffer as any).image && <img src={(editBuffer as any).image} alt={(editBuffer as any).title} className="h-24 rounded-lg object-cover" />}
                            <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/20">
                              <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>
                                Cancelar
                              </Button>
                              <Button onClick={() => { setSolucoes(prev => prev.map((s, idx) => idx === i ? {...s, ...(editBuffer as any)} : s)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                                <CheckCircle2 className="w-4 h-4 mr-2" />Confirmar Alterações
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Clientes */}
            {adminSection === "clientes" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Clientes</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setNovoClienteForm({ name: "", estado: "", logo: "" }); setShowAddClienteModal(true); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      + Adicionar
                    </Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                {/* Barra de pesquisa e filtro */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="relative flex-1 min-w-0" style={{minWidth: "160px"}}>
                    <input
                      type="text"
                      placeholder="🔍 Pesquisar cliente..."
                      value={clientSearch}
                      onChange={e => setClientSearch(e.target.value)}
                      className={`w-full pl-4 pr-4 py-2 rounded-lg border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                    />
                  </div>
                  <select
                    value={clientEstado}
                    onChange={e => setClientEstado(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm max-w-[180px] ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white" : "bg-white border-gray-300 text-slate-900"}`}
                  >
                    <option value="">Todos os municípios</option>
                    {["Abaiara","Acaraú","Acopiara","Aiuaba","Alcântaras","Altaneira","Alto Santo","Amontada","Antonina do Norte","Apuiarés","Aquiraz","Aracati","Aracoiaba","Ararендá","Araripe","Aratuba","Arneiroz","Assaré","Aurora","Baixio","Banabuiú","Barbalha","Barreira","Barro","Barroquinha","Baturité","Beberibe","Bela Cruz","Boa Viagem","Brejo Santo","Camocim","Campos Sales","Canindé","Capistrano","Caridade","Caririaçu","Caririaçu","Cariús","Carnaubal","Cascavel","Catarina","Catunda","Caucaia","Cedro","Chaval","Choró","Chorozinho","Coreaú","Crateús","Crato","Croatá","Cruz","Deputado Irapuan Pinheiro","Ererê","Eusébio","Farias Brito","Forquilha","Fortaleza","Fortim","Frecheirinha","General Sampaio","Graça","Granja","Granjeiro","Groaíras","Guaiuba","Guaraciaba do Norte","Guaramiranga","Hidrolândia","Horizonte","Ibaretama","Ibiapina","Ibicuitinga","Icapuí","Icó","Iguatu","Independência","Ipaporanga","Ipaumirim","Ipu","Ipueiras","Iracema","Irauçuba","Itaiçaba","Itaitinga","Itapajé","Itapipoca","Itapiúna","Itarema","Itatira","Jaguaretama","Jaguaribara","Jaguaribe","Jaguaruana","Jardim","Jati","Jijoca de Jericoacoara","Juazeiro do Norte","Jucás","Lavras da Mangabeira","Limoeiro do Norte","Madalena","Maracanaú","Maranguape","Marco","Martinópole","Massapê","Mauriti","Meruoca","Milagres","Milhã","Miraíma","Missão Velha","Mombaça","Monsenhor Tabosa","Morada Nova","Moraújo","Morrinhos","Mucambo","Mulungu","Nova Olinda","Nova Russas","Novo Oriente","Ocara","Orós","Pacajus","Pacatuba","Pacoti","Pacujá","Palhano","Palmácia","Paracuru","Paraipaba","Parambu","Paramoti","Pedra Branca","Penaforte","Pentecoste","Pereiro","Pindoretama","Piquet Carneiro","Pires Ferreira","Poranga","Porteiras","Potengi","Potiretama","Quiterianópolis","Quixadá","Quixelô","Quixeramobim","Quixeré","Redenção","Reriutaba","Russas","Saboeiro","Salitre","Santa Quitéria","Santana do Acaraú","Santana do Cariri","São Benedito","São Gonçalo do Amarante","São João do Jaguaribe","São Luís do Curu","Senador Pompeu","Senador Sá","Sobral","Solonópole","Tabuleiro do Norte","Tamboril","Tarrafas","Tauá","Tejuçoca","Tianguá","Trairi","Tururu","Ubajara","Umirim","Uruburetama","Uruoca","Varjota","Várzea Alegre","Viçosa do Ceará"].map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  {(clientSearch || clientEstado) && (
                    <button onClick={() => { setClientSearch(""); setClientEstado(""); }} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition">× Limpar</button>
                  )}
                  <span className={`self-center text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {clientes.filter(c => (!clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase())) && (!clientEstado || (c as any).estado === clientEstado)).length} de {clientes.length}
                  </span>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {clientes.filter(c =>
                    (!clientSearch || c.name.toLowerCase().includes(clientSearch.toLowerCase())) &&
                    (!clientEstado || (c as any).estado === clientEstado)
                  ).map((cl, _fi) => {
                    const i = clientes.indexOf(cl);
                    return (
                    <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3 min-w-0">
                            {cl.logo && <img src={cl.logo} alt={cl.name} className="w-10 h-10 rounded object-contain bg-white p-1 flex-shrink-0" onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display="none"; }} />}
                            <p className={`${isDarkMode ? "text-white" : "text-slate-900"} text-sm font-medium truncate`}>{cl.name}</p>
                          </div>
                          <div className="flex gap-2 ml-2 flex-shrink-0">
                            <Button size="sm" variant="outline" onClick={() => { if (adminEditIndex === i) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i); setEditBuffer({...cl}); } }} className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>{adminEditIndex === i ? "✕" : "✎"}</Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: cl.name, onConfirm: () => { setClientes(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                          </div>
                        </div>
                        {adminEditIndex === i && editBuffer && (
                          <div className="space-y-3 mt-3 border-t border-purple-500/20 pt-3">
                            <div>
                              <label className={labelClass}>Nome do Órgão</label>
                              <input type="text" value={(editBuffer as any).name ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, name: e.target.value}))} className={inputClass} />
                            </div>
                            <div>
                              <label className={labelClass}>Município</label>
                              <select value={(editBuffer as any).estado ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, estado: e.target.value}))} className={inputClass}>
                                <option value="">Selecione...</option>
                                {["Abaiara","Acaraú","Acopiara","Aiuaba","Alcântaras","Altaneira","Alto Santo","Amontada","Antonina do Norte","Apuiarés","Aquiraz","Aracati","Aracoiaba","Ararendá","Araripe","Aratuba","Arneiroz","Assaré","Aurora","Baixio","Banabuiú","Barbalha","Barreira","Barro","Barroquinha","Baturité","Beberibe","Bela Cruz","Boa Viagem","Brejo Santo","Camocim","Campos Sales","Canindé","Capistrano","Caridade","Cariré","Caririaçu","Cariús","Carnaubal","Cascavel","Catarina","Catunda","Caucaia","Cedro","Chaval","Choró","Chorozinho","Coreaú","Crateús","Crato","Croatá","Cruz","Deputado Irapuan Pinheiro","Ererê","Eusébio","Farias Brito","Forquilha","Fortaleza","Fortim","Frecheirinha","General Sampaio","Graça","Granja","Granjeiro","Groaíras","Guaiúba","Guaraciaba do Norte","Guaramiranga","Hidrolândia","Horizonte","Ibaretama","Ibiapina","Ibicuitinga","Icapuí","Icó","Iguatu","Independência","Ipaporanga","Ipaumirim","Ipu","Ipueiras","Iracema","Irauçuba","Itaiçaba","Itaitinga","Itapajé","Itapipoca","Itapiúna","Itarema","Itatira","Jaguaretama","Jaguaribara","Jaguaribe","Jaguaruana","Jardim","Jati","Jijoca de Jericoacoara","Juazeiro do Norte","Jucás","Lavras da Mangabeira","Limoeiro do Norte","Madalena","Maracanaú","Maranguape","Marco","Martinópole","Massapê","Mauriti","Meruoca","Milagres","Milhã","Miraíma","Missão Velha","Mombaça","Monsenhor Tabosa","Morada Nova","Moraújo","Morrinhos","Mucambo","Mulungu","Nova Olinda","Nova Russas","Novo Oriente","Ocara","Orós","Pacajus","Pacatuba","Pacoti","Pacujá","Palhano","Palmácia","Paracuru","Paraipaba","Parambu","Paramoti","Pedra Branca","Penaforte","Pentecoste","Pereiro","Pindoretama","Piquet Carneiro","Pires Ferreira","Poranga","Porteiras","Potengi","Potiretama","Quiterianópolis","Quixadá","Quixelô","Quixeramobim","Quixeré","Redenção","Reriutaba","Russas","Saboeiro","Salitre","Santa Quitéria","Santana do Acaraú","Santana do Cariri","São Benedito","São Gonçalo do Amarante","São João do Jaguaribe","São Luís do Curu","Senador Pompeu","Senador Sá","Sobral","Solonópole","Tabuleiro do Norte","Tamboril","Tarrafas","Tauá","Tejuçuoca","Tianguá","Trairi","Tururu","Ubajara","Umirim","Uruburetama","Uruoca","Varjota","Várzea Alegre","Viçosa do Ceará"].map(m => <option key={m} value={m}>{m}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className={labelClass}>Logo do Órgão</label>
                              <input type="file" accept="image/*" className={fileInputClass}
                                onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setEditBuffer(prev => ({...prev!, logo: b64})); } }} />
                              {(editBuffer as any).logo && <img src={(editBuffer as any).logo} alt={(editBuffer as any).name} className="mt-2 h-16 rounded object-contain" />}
                            </div>
                            <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
                              <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                              <Button onClick={() => { setClientes(prev => prev.map((c, idx) => idx === i ? {...c, ...(editBuffer as any)} : c)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Confirmar</Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Depoimentos */}
            {adminSection === "depoimentos" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Depoimentos</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setNovoDepoimentoForm({ name: "", role: "", city: "", testimonial: "", photo: "" }); setShowAddDepoimentoModal(true); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      + Adicionar
                    </Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                {/* Barra de pesquisa e filtro */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="relative flex-1 min-w-0" style={{minWidth: "160px"}}>
                    <input
                      type="text"
                      placeholder="🔍 Pesquisar depoimento..."
                      value={depSearch}
                      onChange={e => setDepSearch(e.target.value)}
                      className={`w-full pl-4 pr-4 py-2 rounded-lg border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                    />
                  </div>
                  <select
                    value={depCliente}
                    onChange={e => setDepCliente(e.target.value)}
                    className={`px-3 py-2 rounded-lg border text-sm max-w-[180px] ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white" : "bg-white border-gray-300 text-slate-900"}`}
                  >
                    <option value="">Todos os órgãos</option>
                    {clientes.map((c, ci) => (
                      <option key={ci} value={c.name}>{c.name}{c.estado ? ` (${c.estado})` : ""}</option>
                    ))}
                  </select>
                  {(depSearch || depCliente) && (
                    <button onClick={() => { setDepSearch(""); setDepCliente(""); }} className="px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 transition">× Limpar</button>
                  )}
                  <span className={`self-center text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {depoimentos.filter(d => (!depSearch || d.name.toLowerCase().includes(depSearch.toLowerCase()) || d.role.toLowerCase().includes(depSearch.toLowerCase())) && (!depCliente || d.city === depCliente)).length} de {depoimentos.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {depoimentos.filter(d =>
                    (!depSearch || d.name.toLowerCase().includes(depSearch.toLowerCase()) || d.role.toLowerCase().includes(depSearch.toLowerCase())) &&
                    (!depCliente || d.city === depCliente)
                  ).map((dep, _fi) => {
                    const i = depoimentos.indexOf(dep);
                    return (
                    <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-3">
                            {dep.photo && <img src={dep.photo} alt={dep.name} className="w-10 h-10 rounded-full object-cover border-2 border-purple-500" onError={(ev) => { (ev.currentTarget as HTMLImageElement).style.display="none"; }} />}
                            <div>
                              <p className={isDarkMode ? "text-white text-sm font-semibold" : "text-slate-900 text-sm font-semibold"}>{dep.name || "Novo Depoimento"}</p>
                              <p className="text-gray-500 text-xs">{dep.role}{dep.city ? ` — ${dep.city}` : ""}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => { if (adminEditIndex === i) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i); setEditBuffer({...dep}); } }} className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>{adminEditIndex === i ? "✕" : "✎"}</Button>
                            <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: dep.name, onConfirm: () => { setDepoimentos(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                          </div>
                        </div>
                        {adminEditIndex === i && editBuffer && (
                          <div className="space-y-3 mt-3 border-t border-purple-500/20 pt-3">
                            <div className="grid md:grid-cols-2 gap-3">
                              <div>
                                <label className={labelClass}>Nome</label>
                                <input type="text" value={(editBuffer as any).name ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, name: e.target.value}))} className={inputClass} />
                              </div>
                              <div>
                                <label className={labelClass}>Cargo</label>
                                <input type="text" value={(editBuffer as any).role ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, role: e.target.value}))} className={inputClass} />
                              </div>
                              <div>
                                <label className={labelClass}>Órgão / Cidade</label>
                                <select value={(editBuffer as any).city ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, city: e.target.value}))} className={inputClass}>
                                  <option value="">Selecione um órgão...</option>
                                  {clientes.map((c, ci) => <option key={ci} value={c.name}>{c.name}{c.estado ? ` (${c.estado})` : ""}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className={labelClass}>Foto</label>
                                <input type="file" accept="image/*" className={fileInputClass}
                                  onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setEditBuffer(prev => ({...prev!, photo: b64})); } }} />
                                {(editBuffer as any).photo && <img src={(editBuffer as any).photo} alt={(editBuffer as any).name} className="mt-2 w-14 h-14 rounded-full object-cover border-2 border-purple-500" />}
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Depoimento</label>
                              <textarea rows={3} value={(editBuffer as any).testimonial ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, testimonial: e.target.value}))} className={inputClass} />
                            </div>
                            <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
                              <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                              <Button onClick={() => { setDepoimentos(prev => prev.map((d, idx) => idx === i ? {...d, ...(editBuffer as any)} : d)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Confirmar</Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                  })}
                </div>
              </div>
            )}

            {/* Certidões */}
            {adminSection === "certidoes" && (
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Certidões</h1>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => { setNovaCertidaoForm({ titulo: "", tipo: "", validade: "", dataEmissao: "", arquivo: "" }); setCertidaoModoVersao(false); setShowAddCertidaoModal(true); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      + Adicionar
                    </Button>
                    <Button size="sm" onClick={saveContent} className={savedFeedback ? "bg-green-600 hover:bg-green-700" : "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"}>
                      <CheckCircle2 className="w-4 h-4 mr-1" /> {savedFeedback ? "Salvo!" : "Salvar"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-8">
                  {(() => {
                    const parseDt = (d?: string) => { if (!d) return 0; const [mm, yyyy] = (d||'').split('/'); return parseInt(yyyy||'0')*100+parseInt(mm||'0'); };
                    const order = ["Federal","Estadual","Municipal","Trabalhista","Cadastral","Outros"];
                    const grupos: Record<string, { cert: typeof certidoes[0]; i: number }[]> = {};
                    certidoes.forEach((cert, i) => {
                      const key = cert.tipo || "Outros";
                      if (!grupos[key]) grupos[key] = [];
                      grupos[key].push({ cert, i });
                    });
                    const sortedKeys = Object.keys(grupos).sort((a, b) => {
                      const ai = order.indexOf(a); const bi = order.indexOf(b);
                      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
                    });
                    if (sortedKeys.length === 0) return (
                      <p className="text-gray-500 text-center py-8">Nenhuma certidão cadastrada. Clique em + Adicionar para começar.</p>
                    );
                    return sortedKeys.map(tipo => {
                      const entries = [...grupos[tipo]].sort((a, b) => parseDt(b.cert.dataEmissao) - parseDt(a.cert.dataEmissao));
                      return (
                        <div key={tipo}>
                          {/* Cabeçalho do grupo */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className={`h-px flex-1 ${isDarkMode ? "bg-purple-500/30" : "bg-purple-200"}`} />
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-400">{tipo}</span>
                            <div className={`h-px flex-1 ${isDarkMode ? "bg-purple-500/30" : "bg-purple-200"}`} />
                          </div>
                          <div className="space-y-2">
                            {entries.slice(0, 1).map(({ cert, i }) => (
                              <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between mb-1">
                                    <div className="flex-1 min-w-0 pr-3">
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className={isDarkMode ? "text-white text-sm font-semibold" : "text-slate-900 text-sm font-semibold"}>{cert.titulo}</p>
                                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/20 text-green-400">Atual</span>
                                      </div>
                                      <p className="text-gray-500 text-xs mt-0.5">
                                        {cert.dataEmissao ? <span><span className="text-cyan-400">Emissão: {stripCertDate(cert.dataEmissao)}</span>{cert.validade ? " · " : ""}</span> : ""}{cert.validade ? `Válida até: ${stripCertDate(cert.validade)}` : ""}
                                      </p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                      {entries.length > 1 && (
                                        <Button size="sm" variant="outline" title="Ver anteriores" onClick={() => setCertAdminExpandido(certAdminExpandido === tipo ? null : tipo)} className={isDarkMode ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200" : "border-gray-300 text-gray-500 hover:border-gray-500"}>{certAdminExpandido === tipo ? "▲" : "▼"}</Button>
                                      )}
                                      <Button size="sm" variant="outline" title="Adicionar nova versão" onClick={() => { setNovaCertidaoForm({ titulo: cert.titulo, tipo: cert.tipo, validade: "", dataEmissao: "", arquivo: "" }); setCertidaoModoVersao(true); setShowAddCertidaoModal(true); }} className={isDarkMode ? "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" : "border-cyan-500 text-cyan-600 hover:bg-cyan-50"}>+</Button>
                                      <Button size="sm" variant="outline" onClick={() => { if (adminEditIndex === i) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i); setEditBuffer({...cert}); } }} className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>{adminEditIndex === i ? "✕" : "✎"}</Button>
                                      <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: cert.titulo + (cert.dataEmissao ? ` (${cert.dataEmissao})` : ""), onConfirm: () => { setCertidoes(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                                    </div>
                                  </div>
                                  {adminEditIndex === i && editBuffer && (
                                    <div className="space-y-3 mt-3 border-t border-purple-500/20 pt-3">
                                      <div>
                                        <label className={labelClass}>Título da Certidão</label>
                                        <input type="text" value={(editBuffer as any).titulo ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, titulo: e.target.value}))} className={inputClass} />
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className={labelClass}>Emissão (dd/mm/aaaa)</label>
                                          <input type="text" value={(editBuffer as any).dataEmissao ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, dataEmissao: fmtEmissao(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                                        </div>
                                        <div>
                                          <label className={labelClass}>Tipo</label>
                                          <select value={(editBuffer as any).tipo ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, tipo: e.target.value}))} className={inputClass}>
                                            <option value="">Selecione...</option>
                                            {["Federal","Estadual","Municipal","Trabalhista","Cadastral","Outros"].map(t => <option key={t} value={t}>{t}</option>)}
                                          </select>
                                        </div>
                                        <div>
                                          <label className={labelClass}>Validade (dd/mm/aaaa)</label>
                                          <input type="text" value={(editBuffer as any).validade ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, validade: fmtValidade(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className={labelClass}>Arquivo da Certidão (PDF ou imagem)</label>
                                        <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const base64 = await readFileAsBase64(file); setEditBuffer(prev => ({...prev!, arquivo: base64})); }} className={fileInputClass} />
                                        {(editBuffer as any).arquivo && <p className="text-green-400 text-xs mt-1">✓ Arquivo carregado</p>}
                                      </div>
                                      <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
                                        <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                                        <Button onClick={() => { setCertidoes(prev => prev.map((c, idx) => idx === i ? {...c, ...(editBuffer as any)} : c)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Confirmar</Button>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                            {/* Certidões antigas - colapsáveis */}
                            {certAdminExpandido === tipo && entries.slice(1).map(({ cert, i }) => (
                              <Card key={i} className={isDarkMode ? "bg-slate-800/40 border-gray-700/40" : "bg-gray-50 border-gray-200 shadow-sm"}>
                                <CardContent className="p-3">
                                  <div className="flex items-center justify-between">
                                    <p className="text-gray-500 text-xs">
                                      {cert.dataEmissao ? <span className="text-cyan-500 font-medium">Emissão: {stripCertDate(cert.dataEmissao)}</span> : ""}
                                      {cert.dataEmissao && cert.validade ? <span className="mx-1">·</span> : ""}
                                      {cert.validade ? `Válida até: ${stripCertDate(cert.validade)}` : ""}
                                    </p>
                                    <div className="flex gap-2 flex-shrink-0">
                                      <Button size="sm" variant="outline" onClick={() => { if (adminEditIndex === i) { setAdminEditIndex(null); setEditBuffer(null); } else { setAdminEditIndex(i); setEditBuffer({...cert}); } }} className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>{adminEditIndex === i ? "✕" : "✎"}</Button>
                                      <Button size="sm" variant="outline" onClick={() => setConfirmDelete({ label: cert.titulo + (cert.dataEmissao ? ` (${cert.dataEmissao})` : ""), onConfirm: () => { setCertidoes(prev => prev.filter((_, idx) => idx !== i)); setAdminEditIndex(null); setEditBuffer(null); } })} className="border-red-500/50 text-red-400 hover:bg-red-500/10">🗑</Button>
                                    </div>
                                  </div>
                                  {adminEditIndex === i && editBuffer && (
                                    <div className="space-y-3 mt-3 border-t border-purple-500/20 pt-3">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div>
                                          <label className={labelClass}>Emissão (dd/mm/aaaa)</label>
                                          <input type="text" value={(editBuffer as any).dataEmissao ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, dataEmissao: fmtEmissao(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                                        </div>
                                        <div>
                                          <label className={labelClass}>Validade (dd/mm/aaaa)</label>
                                          <input type="text" value={(editBuffer as any).validade ?? ""} onChange={e => setEditBuffer(prev => ({...prev!, validade: fmtValidade(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                                        </div>
                                      </div>
                                      <div>
                                        <label className={labelClass}>Arquivo da Certidão (PDF ou imagem)</label>
                                        <div className="flex items-center gap-3 mt-1">
                                          <label htmlFor={`cert-file-h-${i}`} className={isDarkMode ? "py-2 px-4 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer" : "py-2 px-4 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"}>Escolher arquivo</label>
                                          <input type="file" id={`cert-file-h-${i}`} accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={async e => { const file = e.target.files?.[0]; if (!file) return; const base64 = await readFileAsBase64(file); setEditBuffer(prev => ({...prev!, arquivo: base64})); }} />
                                          {!(editBuffer as any).arquivo && <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>}
                                        </div>
                                        {(editBuffer as any).arquivo && <p className="text-green-400 text-xs mt-1">✓ Arquivo carregado</p>}
                                      </div>
                                      <div className="flex justify-end gap-3 pt-3 border-t border-purple-500/20">
                                        <Button variant="outline" onClick={() => { setAdminEditIndex(null); setEditBuffer(null); }} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
                                        <Button onClick={() => { setCertidoes(prev => prev.map((c, idx) => idx === i ? {...c, ...(editBuffer as any)} : c)); setAdminEditIndex(null); setEditBuffer(null); }} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"><CheckCircle2 className="w-4 h-4 mr-2" />Confirmar</Button>
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            )}

          </main>
        </div>

      {/* Modal Confirmar Exclusão */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}} onClick={() => setConfirmDelete(null)}>
          <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-red-500/30" : "bg-white border border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">🗑</span>
                </div>
                <div>
                  <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Confirmar Exclusão</h2>
                  <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Esta ação não pode ser desfeita.</p>
                </div>
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
                Tem certeza que deseja excluir <span className="font-semibold text-red-400">"{confirmDelete.label}"</span>?
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setConfirmDelete(null)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>
                  Cancelar
                </Button>
                <Button onClick={() => { confirmDelete.onConfirm(); setConfirmDelete(null); }} className="bg-red-600 hover:bg-red-700 text-white">
                  Sim, Excluir
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Solução */}

      {/* Modal Novo Cliente */}
      {showAddClienteModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowAddClienteModal(false); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddClienteModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <h2 className={isDarkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>Novo Cliente</h2>
              <button onClick={() => setShowAddClienteModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nome do Órgão</label>
                <input type="text" value={novoClienteForm.name} onChange={e => setNovoClienteForm(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="Ex: Prefeitura Municipal de ..." />
              </div>
              <div>
                <label className={labelClass}>Município</label>
                <select value={novoClienteForm.estado} onChange={e => setNovoClienteForm(p => ({...p, estado: e.target.value}))} className={inputClass}>
                  <option value="">Selecione...</option>
                  {["Abaiara","Acaraú","Acopiara","Aiuaba","Alcântaras","Altaneira","Alto Santo","Amontada","Antonina do Norte","Apuiarés","Aquiraz","Aracati","Aracoiaba","Ararendá","Araripe","Aratuba","Arneiroz","Assaré","Aurora","Baixio","Banabuiú","Barbalha","Barreira","Barro","Barroquinha","Baturité","Beberibe","Bela Cruz","Boa Viagem","Brejo Santo","Camocim","Campos Sales","Canindé","Capistrano","Caridade","Cariré","Caririaçu","Cariús","Carnaubal","Cascavel","Catarina","Catunda","Caucaia","Cedro","Chaval","Choró","Chorozinho","Coreaú","Crateús","Crato","Croatá","Cruz","Deputado Irapuan Pinheiro","Ererê","Eusébio","Farias Brito","Forquilha","Fortaleza","Fortim","Frecheirinha","General Sampaio","Graça","Granja","Granjeiro","Groaíras","Guaiúba","Guaraciaba do Norte","Guaramiranga","Hidrolândia","Horizonte","Ibaretama","Ibiapina","Ibicuitinga","Icapuí","Icó","Iguatu","Independência","Ipaporanga","Ipaumirim","Ipu","Ipueiras","Iracema","Irauçuba","Itaiçaba","Itaitinga","Itapajé","Itapipoca","Itapiúna","Itarema","Itatira","Jaguaretama","Jaguaribara","Jaguaribe","Jaguaruana","Jardim","Jati","Jijoca de Jericoacoara","Juazeiro do Norte","Jucás","Lavras da Mangabeira","Limoeiro do Norte","Madalena","Maracanaú","Maranguape","Marco","Martinópole","Massapê","Mauriti","Meruoca","Milagres","Milhã","Miraíma","Missão Velha","Mombaça","Monsenhor Tabosa","Morada Nova","Moraújo","Morrinhos","Mucambo","Mulungu","Nova Olinda","Nova Russas","Novo Oriente","Ocara","Orós","Pacajus","Pacatuba","Pacoti","Pacujá","Palhano","Palmácia","Paracuru","Paraipaba","Parambu","Paramoti","Pedra Branca","Penaforte","Pentecoste","Pereiro","Pindoretama","Piquet Carneiro","Pires Ferreira","Poranga","Porteiras","Potengi","Potiretama","Quiterianópolis","Quixadá","Quixelô","Quixeramobim","Quixeré","Redenção","Reriutaba","Russas","Saboeiro","Salitre","Santa Quitéria","Santana do Acaraú","Santana do Cariri","São Benedito","São Gonçalo do Amarante","São João do Jaguaribe","São Luís do Curu","Senador Pompeu","Senador Sá","Sobral","Solonópole","Tabuleiro do Norte","Tamboril","Tarrafas","Tauá","Tejuçuoca","Tianguá","Trairi","Tururu","Ubajara","Umirim","Uruburetama","Uruoca","Varjota","Várzea Alegre","Viçosa do Ceará"].map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Logo do Órgão</label>
                <input type="file" accept="image/*" className={fileInputClass}
                  onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovoClienteForm(p => ({...p, logo: b64})); } }} />
                {novoClienteForm.logo && <img src={novoClienteForm.logo} alt="preview" className="mt-2 h-16 rounded object-contain" />}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-purple-500/20">
              <Button variant="outline" onClick={() => setShowAddClienteModal(false)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
              <Button onClick={() => { if (!novoClienteForm.name.trim()) return; setClientes(prev => [...prev, { name: novoClienteForm.name, estado: novoClienteForm.estado, logo: novoClienteForm.logo }]); setShowAddClienteModal(false); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Certidão */}
      {showAddCertidaoModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" onClick={e => { if (e.target === e.currentTarget) setShowAddCertidaoModal(false); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddCertidaoModal(false)} />
          <div className={`relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <h2 className={isDarkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>{certidaoModoVersao ? "Nova Versão" : "Nova Certidão"}</h2>
              <button onClick={() => setShowAddCertidaoModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              {certidaoModoVersao && (
                <p className={`text-sm font-medium px-3 py-2 rounded-lg ${isDarkMode ? "bg-slate-800 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                  <span className="font-semibold">{novaCertidaoForm.titulo}</span> — {novaCertidaoForm.tipo}
                </p>
              )}
              {!certidaoModoVersao && (
                <div>
                  <label className={labelClass}>Título da Certidão</label>
                  <input type="text" value={novaCertidaoForm.titulo} onChange={e => setNovaCertidaoForm(p => ({...p, titulo: e.target.value}))} className={inputClass} placeholder="Ex: Certidão Negativa de Débitos - Receita Federal" />
                </div>
              )}
              {!certidaoModoVersao && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Tipo</label>
                    <select value={novaCertidaoForm.tipo} onChange={e => setNovaCertidaoForm(p => ({...p, tipo: e.target.value}))} className={inputClass}>
                      <option value="">Selecione...</option>
                      {["Federal","Estadual","Municipal","Trabalhista","Cadastral","Outros"].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Emissão (dd/mm/aaaa)</label>
                    <input type="text" value={novaCertidaoForm.dataEmissao} onChange={e => setNovaCertidaoForm(p => ({...p, dataEmissao: fmtEmissao(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                  </div>
                </div>
              )}
              {certidaoModoVersao && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Emissão (dd/mm/aaaa)</label>
                    <input type="text" value={novaCertidaoForm.dataEmissao} onChange={e => setNovaCertidaoForm(p => ({...p, dataEmissao: fmtEmissao(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                  </div>
                  <div>
                    <label className={labelClass}>Validade (dd/mm/aaaa)</label>
                    <input type="text" value={novaCertidaoForm.validade} onChange={e => setNovaCertidaoForm(p => ({...p, validade: fmtValidade(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                  </div>
                </div>
              )}
              {!certidaoModoVersao && (
                <div>
                  <label className={labelClass}>Validade (dd/mm/aaaa)</label>
                  <input type="text" value={novaCertidaoForm.validade} onChange={e => setNovaCertidaoForm(p => ({...p, validade: fmtValidade(e.target.value)}))} className={inputClass} placeholder="dd/mm/aaaa" />
                </div>
              )}
              <div>
                <label className={labelClass}>Arquivo da Certidão (PDF ou imagem)</label>
                <div className="flex items-center gap-3 mt-1">
                  <label htmlFor="cert-file-new" className={isDarkMode ? "py-2 px-4 rounded-lg text-sm font-semibold bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 cursor-pointer" : "py-2 px-4 rounded-lg text-sm font-semibold bg-purple-100 text-purple-700 hover:bg-purple-200 cursor-pointer"}>Escolher arquivo</label>
                  <input type="file" id="cert-file-new" accept=".pdf,.jpg,.jpeg,.png" className="hidden"
                    onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovaCertidaoForm(p => ({...p, arquivo: b64})); } }} />
                  {!novaCertidaoForm.arquivo && <span className="text-sm text-gray-500">Nenhum arquivo escolhido</span>}
                </div>
                {novaCertidaoForm.arquivo && <p className="text-green-400 text-xs mt-1">✓ Arquivo carregado</p>}
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-purple-500/20">
              <Button variant="outline" onClick={() => setShowAddCertidaoModal(false)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
              <Button onClick={() => { if (!novaCertidaoForm.titulo.trim()) return; setCertidoes(prev => [...prev, { titulo: novaCertidaoForm.titulo, tipo: novaCertidaoForm.tipo, validade: novaCertidaoForm.validade, dataEmissao: novaCertidaoForm.dataEmissao, arquivo: novaCertidaoForm.arquivo }]); setShowAddCertidaoModal(false); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Depoimento */}
      {showAddDepoimentoModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6" onClick={e => { if (e.target === e.currentTarget) setShowAddDepoimentoModal(false); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddDepoimentoModal(false)} />
          <div className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl border ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <h2 className={isDarkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>Novo Depoimento</h2>
              <button onClick={() => setShowAddDepoimentoModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Nome</label>
                <input type="text" value={novoDepoimentoForm.name} onChange={e => setNovoDepoimentoForm(p => ({...p, name: e.target.value}))} className={inputClass} placeholder="Ex: João Silva" />
              </div>
              <div>
                <label className={labelClass}>Cargo</label>
                <input type="text" value={novoDepoimentoForm.role} onChange={e => setNovoDepoimentoForm(p => ({...p, role: e.target.value}))} className={inputClass} placeholder="Ex: Secretário de Finanças" />
              </div>
              <div>
                <label className={labelClass}>Órgão</label>
                <select value={novoDepoimentoForm.city} onChange={e => setNovoDepoimentoForm(p => ({...p, city: e.target.value}))} className={inputClass}>
                  <option value="">Selecione um órgão...</option>
                  {clientes.map((c, ci) => <option key={ci} value={c.name}>{c.name}{c.estado ? ` (${c.estado})` : ""}</option>)}
                </select>
              </div>
              <div>
                <label className={labelClass}>Foto</label>
                <input type="file" accept="image/*" className={fileInputClass}
                  onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovoDepoimentoForm(p => ({...p, photo: b64})); } }} />
                {novoDepoimentoForm.photo && <img src={novoDepoimentoForm.photo} alt="preview" className="mt-2 w-14 h-14 rounded-full object-cover border-2 border-purple-500" />}
              </div>
              <div>
                <label className={labelClass}>Depoimento</label>
                <textarea rows={3} value={novoDepoimentoForm.testimonial} onChange={e => setNovoDepoimentoForm(p => ({...p, testimonial: e.target.value}))} className={inputClass} placeholder="Escreva o depoimento aqui..." />
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-purple-500/20">
              <Button variant="outline" onClick={() => setShowAddDepoimentoModal(false)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
              <Button onClick={() => { if (!novoDepoimentoForm.name.trim()) return; setDepoimentos(prev => [...prev, { name: novoDepoimentoForm.name, role: novoDepoimentoForm.role, city: novoDepoimentoForm.city, testimonial: novoDepoimentoForm.testimonial, photo: novoDepoimentoForm.photo }]); setShowAddDepoimentoModal(false); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Adicionar</Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Estatística */}
      {showAddStatModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={e => { if (e.target === e.currentTarget) setShowAddStatModal(false); }}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddStatModal(false)} />
          <div className={`relative w-full max-w-md rounded-2xl shadow-2xl border ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`}>
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <h2 className={isDarkMode ? "text-xl font-bold text-white" : "text-xl font-bold text-slate-900"}>Nova Estatística</h2>
              <button onClick={() => setShowAddStatModal(false)} className="text-gray-400 hover:text-white text-2xl leading-none">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Valor</label>
                <input type="text" value={novaStatForm.valor} onChange={e => setNovaStatForm(p => ({...p, valor: e.target.value}))} className={inputClass} placeholder="Ex: +500 Clientes" />
              </div>
              <div>
                <label className={labelClass}>Descrição</label>
                <input type="text" value={novaStatForm.desc} onChange={e => setNovaStatForm(p => ({...p, desc: e.target.value}))} className={inputClass} placeholder="Ex: em Todo o Brasil" />
              </div>
              <div>
                <label className={labelClass}>Ícone</label>
                <div className="relative inline-block">
                  {(() => { const CurIco = solucaoIconPickerMap[novaStatForm.icone] ?? Award; const curLabel = solucaoIconOptions.find(o => o.key === novaStatForm.icone)?.label ?? ""; return (
                    <button type="button" onClick={() => setOpenIconPicker(openIconPicker === "novaStat-icone" ? null : "novaStat-icone")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white hover:border-purple-400" : "bg-white border-gray-300 text-slate-800 hover:border-purple-400"}`}>
                      <CurIco className="w-5 h-5" />
                      <span className="text-sm">{curLabel}</span>
                      <span className="text-xs opacity-60 ml-1">▼</span>
                    </button>
                  ); })()}
                  {openIconPicker === "novaStat-icone" && (
                    <div className={`absolute z-50 mt-1 p-3 rounded-xl border shadow-2xl ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`} style={{width: 320}}>
                      <div className="grid grid-cols-8 gap-1.5">
                        {solucaoIconOptions.map(opt => {
                          const IcoComp = solucaoIconPickerMap[opt.key];
                          const isSelected = novaStatForm.icone === opt.key;
                          return (
                            <button key={opt.key} type="button" onClick={() => { setNovaStatForm(p => ({...p, icone: opt.key})); setOpenIconPicker(null); }} title={opt.label}
                              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition ${isSelected ? "bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg" : isDarkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"}`}>
                              <IcoComp className="w-4 h-4" />
                              <span className="text-[9px] leading-tight text-center">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-purple-500/20">
              <Button variant="outline" onClick={() => setShowAddStatModal(false)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>Cancelar</Button>
              <Button onClick={() => { if (!novaStatForm.valor.trim()) return; setStats(prev => [...prev, { id: `stat-${Date.now()}`, valor: novaStatForm.valor, desc: novaStatForm.desc, icone: novaStatForm.icone, ativo: true }]); setShowAddStatModal(false); }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">Adicionar</Button>
            </div>
          </div>
        </div>
      )}
      {showAddSolucaoModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}} onClick={() => setShowAddSolucaoModal(false)}>
          <div className={`w-full max-w-2xl rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh] ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-6 border-b border-purple-500/20">
              <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Nova Solução</h2>
              <button onClick={() => setShowAddSolucaoModal(false)} className={`text-2xl leading-none ${isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900"} transition`}>✕</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Título</label>
                  <input type="text" value={novaSolucaoForm.title} onChange={e => setNovaSolucaoForm(p => ({...p, title: e.target.value}))} className={inputClass} placeholder="Nome da solução" />
                </div>
                <div>
                  <label className={labelClass}>Imagem</label>
                  <input type="file" accept="image/*" className={fileInputClass}
                    onChange={async e => { const f = e.target.files?.[0]; if (f) { const b64 = await readFileAsBase64(f); setNovaSolucaoForm(p => ({...p, image: b64})); } }} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Link do Sistema (URL de acesso)</label>
                <input type="url" value={novaSolucaoForm.url} onChange={e => setNovaSolucaoForm(p => ({...p, url: e.target.value}))} className={inputClass} placeholder="https://sistema.exemplo.com.br" />
              </div>
              <div>
                <label className={labelClass}>Descrição</label>
                <textarea rows={2} value={novaSolucaoForm.description} onChange={e => setNovaSolucaoForm(p => ({...p, description: e.target.value}))} className={inputClass} placeholder="Descrição da solução" />
              </div>
              <div>
                <label className={labelClass}>Recursos — um por linha</label>
                <textarea rows={5} value={novaSolucaoForm.features} onChange={e => setNovaSolucaoForm(p => ({...p, features: e.target.value}))} className={inputClass} placeholder="Funcionalidade 1&#10;Funcionalidade 2" />
              </div>
              <div>
                <label className={labelClass}>Ícone do Sistema</label>
                <div className="relative inline-block">
                  {(() => { const curKey = novaSolucaoForm.icone || "Package"; const CurIco = solucaoIconPickerMap[curKey] ?? Package; const curLabel = solucaoIconOptions.find(o => o.key === curKey)?.label ?? ""; return (
                    <button type="button" onClick={() => setOpenIconPicker(openIconPicker === "novaSolucao-icone" ? null : "novaSolucao-icone")}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white hover:border-purple-400" : "bg-white border-gray-300 text-slate-800 hover:border-purple-400"}`}>
                      <CurIco className="w-5 h-5" />
                      <span className="text-sm">{curLabel}</span>
                      <span className="text-xs opacity-60 ml-1">▼</span>
                    </button>
                  ); })()}
                  {openIconPicker === "novaSolucao-icone" && (
                    <div className={`absolute z-50 mt-1 p-3 rounded-xl border shadow-2xl ${isDarkMode ? "bg-slate-900 border-purple-500/30" : "bg-white border-gray-200"}`} style={{width: 320}}>
                      <div className="grid grid-cols-8 gap-1.5">
                        {solucaoIconOptions.map(opt => {
                          const IcoComp = solucaoIconPickerMap[opt.key];
                          const isSelected = novaSolucaoForm.icone === opt.key;
                          return (
                            <button key={opt.key} type="button" onClick={() => { setNovaSolucaoForm(p => ({...p, icone: opt.key})); setOpenIconPicker(null); }} title={opt.label}
                              className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition ${isSelected ? "bg-gradient-to-br from-purple-600 to-cyan-600 text-white shadow-lg" : isDarkMode ? "bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white" : "bg-gray-50 text-gray-600 hover:bg-purple-50 hover:text-purple-600 border border-gray-200"}`}>
                              <IcoComp className="w-4 h-4" />
                              <span className="text-[9px] leading-tight text-center">{opt.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {novaSolucaoForm.image && <img src={novaSolucaoForm.image} alt="preview" className="h-24 rounded-lg object-cover" />}
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-purple-500/20">
              <Button variant="outline" onClick={() => setShowAddSolucaoModal(false)} className={isDarkMode ? "border-gray-500 text-gray-300" : "border-gray-400 text-gray-900"}>
                Cancelar
              </Button>
              <Button onClick={() => {
                if (!novaSolucaoForm.title.trim()) return;
                const nova = {
                  id: `solucao-${Date.now()}`,
                  icone: novaSolucaoForm.icone,
                  title: novaSolucaoForm.title.trim(),
                  description: novaSolucaoForm.description.trim(),
                  image: novaSolucaoForm.image,
                  url: novaSolucaoForm.url.trim(),
                  features: novaSolucaoForm.features.split("\n").map(f => f.trim()).filter(Boolean),
                };
                setSolucoes(prev => [...prev, nova]);
                setShowAddSolucaoModal(false);
              }} className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                Adicionar Solução
              </Button>
            </div>
          </div>
        </div>
      )}
      </div>
    );
  }

  // Portal do Cliente - página exclusiva após login
  if (isLoggedIn) {
    return (
      <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-gray-100"}>

        {/* Header do Portal */}
        <header className={isDarkMode
          ? "bg-slate-900 border-b border-purple-500/20 py-4 sticky top-0 z-50 shadow-2xl"
          : "bg-white border-b border-gray-200 py-4 sticky top-0 z-50 shadow-md"
        }>
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-2 rounded-lg transition mr-1" onClick={() => setClienteSidebarOpen(o => !o)}
                style={{color: isDarkMode ? "#c084fc" : "#9333ea", background: isDarkMode ? "rgba(168,85,247,0.1)" : "rgba(147,51,234,0.08)"}}>
                <Menu className="w-5 h-5" />
              </button>
              <img src={isDarkMode ? logoJeosBranca : logoJeosColorida} alt="JEOS Sistemas e Governo" className="h-12 w-auto" />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <ImageWithFallback src={loggedInUser?.foto ?? loggedSec?.foto ?? ""} alt={loggedInUser?.nome ?? ""} className="w-10 h-10 rounded-full object-cover border-2 border-purple-500" />
                <div className="hidden md:block">
                  <p className={isDarkMode ? "text-white text-sm font-semibold" : "text-slate-900 text-sm font-semibold"}>{loggedInUser?.nome ?? ""}</p>
                  <p className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>{(loggedEnt?.nome ?? "")}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Principal */}
        <div className="flex min-h-[calc(100vh-73px)]">

          {/* Overlay backdrop mobile */}
          {clienteSidebarOpen && (
            <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setClienteSidebarOpen(false)} />
          )}
          {/* Sidebar */}
          <aside className={`fixed top-[73px] left-0 h-[calc(100vh-73px)] w-64 z-40 flex flex-col transition-transform duration-300
            md:sticky md:top-[73px] md:translate-x-0 md:z-auto md:h-[calc(100vh-73px)] md:self-start md:max-h-[calc(100vh-73px)]
            ${clienteSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${isDarkMode ? "bg-slate-900 border-r border-purple-500/20" : "bg-white border-r border-gray-200 shadow-sm"}
          `}>
            <div className="flex items-center justify-between p-4 pb-2 flex-shrink-0">
              <p className={isDarkMode ? "text-gray-400 text-xs uppercase tracking-wider" : "text-gray-500 text-xs uppercase tracking-wider"}>
                Portal do Cliente
              </p>
              <button onClick={() => setClienteSidebarOpen(false)} className={`md:hidden p-1.5 rounded-lg ${isDarkMode ? "text-gray-400 hover:bg-slate-800" : "text-gray-500 hover:bg-gray-100"}`}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <nav className="px-3 space-y-0.5 flex-shrink-0">
              {([
                { id: null as string | null, label: "Dashboard", icon: TrendingUp },
                { id: 'contract' as string | null, label: "Meu Contrato", icon: FileText },
                { id: 'systems' as string | null, label: "Sistemas", icon: Package },
                { id: 'invoices' as string | null, label: "Notas Fiscais", icon: DollarSign },
                { id: 'reports' as string | null, label: "Relatórios", icon: Eye },
                { id: 'settings' as string | null, label: "Configurações", icon: Users },
              ]).map((item) => {
                const Icon = item.icon;
                const isActive = currentModal === item.id;
                return (
                  <button key={String(item.id)} onClick={() => { setCurrentModal(item.id); setClienteSidebarOpen(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all text-left ${
                      isActive
                        ? isDarkMode
                          ? "bg-gradient-to-r from-purple-600/30 to-cyan-600/20 text-white border border-purple-500/30"
                          : "bg-gradient-to-r from-purple-100 to-cyan-100 text-purple-700 border border-purple-300"
                        : isDarkMode
                          ? "text-gray-400 hover:bg-slate-800 hover:text-white"
                          : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? (isDarkMode ? "text-purple-400" : "text-purple-600") : ""}`} />
                    {item.label}
                  </button>
                );
              })}
            </nav>
            {/* Rodapé do sidebar */}
            <div className={`mt-auto px-3 pb-3 pt-2 border-t flex-shrink-0 ${isDarkMode ? "border-purple-500/20" : "border-gray-200"}`}>
              <button onClick={() => setIsDarkMode(!isDarkMode)}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isDarkMode ? "text-gray-400 hover:bg-slate-800 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-slate-900"
                }`}>
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDarkMode ? "Modo Claro" : "Modo Escuro"}
              </button>
              <button onClick={handleLogout}
                className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition ${
                  isDarkMode ? "text-red-400 hover:bg-red-500/10" : "text-red-600 hover:bg-red-50"
                }`}>
                <LogOut className="w-4 h-4" />Sair
              </button>
            </div>
          </aside>

          {/* Conteúdo Principal */}
          <main className="flex-1 p-6 md:p-8 overflow-auto">

            {/* Dashboard Overview */}
            {currentModal === null && (
              <div>
                <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                  Bem-vindo, {loggedInUser?.nome ?? ""}!
                </h1>
                <p className={`mb-8 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{(loggedEnt?.nome ?? "")}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {([
                    { label: "Sistemas Ativos", value: String((loggedSec?.sistemasContratados ?? []).length), icon: Package, color: "from-purple-600 to-purple-800" },
                    { label: "Valor Mensal", value: (loggedSec?.contratos ?? [])[0]?.valorMensal ? `R$ ${(loggedSec?.contratos ?? [])[0]?.valorMensal}` : "—", icon: DollarSign, color: "from-cyan-600 to-cyan-800" },
                    { label: "Encerramento", value: (loggedSec?.contratos ?? [])[0]?.dataEncerramento ?? "—", icon: Calendar, color: "from-pink-600 to-pink-800" },
                    { label: "Notas Fiscais", value: String((loggedSec?.notasFiscais ?? []).length), icon: FileText, color: "from-indigo-600 to-indigo-800" },
                  ]).map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={i} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                        <CardContent className="p-6 flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{stat.label}</p>
                            <p className={isDarkMode ? "text-white font-bold text-lg" : "text-slate-900 font-bold text-lg"}>{stat.value}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-white flex items-center gap-2" : "text-slate-900 flex items-center gap-2"}>
                        <Package className="w-5 h-5 text-purple-400" /> Sistemas Contratados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 cursor-pointer" onClick={() => setCurrentModal('systems')}>
                      {(loggedSec?.sistemasContratados ?? []).map((s, i) => {
                        const sl = s.status?.toLowerCase();
                        const badgeCls = sl === "ativo" ? "bg-green-500" : sl === "inativo" ? "bg-red-500" : sl === "suspenso" ? "bg-yellow-500" : "bg-gray-500";
                        const iconCls = sl === "ativo" ? "text-green-400" : sl === "inativo" ? "text-red-400" : sl === "suspenso" ? "text-yellow-400" : "text-gray-400";
                        return (
                        <div key={i} className={isDarkMode ? "flex justify-between items-center p-3 bg-slate-800 rounded-lg" : "flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"}>
                          <div className="flex items-center gap-3">
                            <CheckCircle2 className={`w-5 h-5 ${iconCls}`} />
                            <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{s.nome}</span>
                          </div>
                          <Badge className={`${badgeCls} text-white border-none`}>{s.status}</Badge>
                        </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                  <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-md"}>
                    <CardHeader>
                      <CardTitle className={isDarkMode ? "text-white flex items-center gap-2" : "text-slate-900 flex items-center gap-2"}>
                        <FileText className="w-5 h-5 text-purple-400" /> Últimas Notas Fiscais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 cursor-pointer" onClick={() => setCurrentModal('invoices')}>
                      {(loggedSec?.notasFiscais ?? []).map((nf, i) => {
                        const valorFmt = (() => { const n = parseFloat((nf.valor??"").replace(/[^\d.,]/g,"").replace(",",".")); return isNaN(n) ? (nf.valor||"—") : `R$ ${n.toLocaleString("pt-BR",{minimumFractionDigits:2})}`; })();
                        const statusReal = nf.dataPagamento ? "Pago" : (() => {
                          if (!nf.dataVencimento) return nf.status;
                          const [d,m,a] = nf.dataVencimento.split("/");
                          const dv = new Date(+a,+m-1,+d); dv.setHours(0,0,0,0);
                          const hoje = new Date(); hoje.setHours(0,0,0,0);
                          return dv < hoje ? "Vencida" : nf.status;
                        })();
                        const statusCls = (s: string) => { const sl=s?.toLowerCase(); if(sl==="pago"||sl==="paga") return "bg-green-500"; if(sl==="vencida"||sl==="vencido") return "bg-red-500"; if(sl==="pendente") return "bg-yellow-500"; return "bg-gray-500"; };
                        return (
                        <div key={i} className={isDarkMode ? "flex justify-between items-center p-3 bg-slate-800 rounded-lg" : "flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100"}>
                          <div>
                            <p className={isDarkMode ? "text-gray-300 font-medium" : "text-gray-700 font-medium"}>{nf.numero}</p>
                            <p className="text-gray-500 text-xs">{nf.data}</p>
                          </div>
                          <div className="text-right">
                            <p className={isDarkMode ? "text-cyan-400 font-semibold" : "text-purple-600 font-semibold"}>{valorFmt}</p>
                            <Badge className={`${statusCls(statusReal)} text-white border-none text-xs`}>{statusReal}</Badge>
                          </div>
                        </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Meu Contrato */}
            {currentModal === 'contract' && (() => {
              const pDate = (d: string) => { const [dd,mm,yyyy] = d.split("/"); return new Date(Number(yyyy), Number(mm)-1, Number(dd)); };
              const diasR = (enc: string) => { try { return Math.ceil((pDate(enc).getTime() - new Date().setHours(0,0,0,0)) / 86400000); } catch { return null; } };
              const vigTag = (enc: string) => { const d = diasR(enc); if (d === null) return null; if (d < 0) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400">Encerrado</span>; if (d <= 90) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/20 text-yellow-400">{d}d restantes</span>; return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/20 text-green-400">{d}d restantes</span>; };
              const toDateNum2 = (d: string) => { const p = d?.split('/'); return p?.length===3 ? parseInt(p[2])*10000+parseInt(p[1])*100+parseInt(p[0]) : 0; };
              const latestEnc2 = (ct: any) => (ct.aditivos??[]).filter((a: any) => a.tipos?.includes("Prazo") && a.dataEncerramento).reduce((best: string, a: any) => toDateNum2(a.dataEncerramento)>toDateNum2(best)?a.dataEncerramento:best, ct.dataEncerramento??"");
              const mesesUsados2 = (ct: any) => { const enc = latestEnc2(ct); return (ct.dataInicial && enc) ? calcMesesDMY(ct.dataInicial, enc) : 0; };
              const prazoTag = (ct: any) => {
                if (!ct.artigo) return null;
                const max = ARTIGO_MAX_MESES[ct.artigo] ?? 0;
                const usado = mesesUsados2(ct);
                const restam = max - usado;
                if (restam <= 0) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400">Limite de aditivo atingido</span>;
                return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDarkMode ? "bg-cyan-500/20 text-cyan-400" : "bg-purple-500/20 text-purple-600"}`}>{restam}m aditivo disponível</span>;
              };
              const vGlobal = (vm: string, qm: string) => { const v = parseFloat(vm.replace(/[^\d.,]/g,"").replace(",",".")); const q = parseInt(qm); return (!isNaN(v)&&!isNaN(q)) ? `R$ ${(v*q).toLocaleString("pt-BR",{minimumFractionDigits:2})}` : "—"; };
              return (
              <div>
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Meus Contratos</h1>
                <p className={`mb-6 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{loggedEnt?.nome ?? ""} · CNPJ: {loggedSec?.cnpj ?? ""}</p>
                <div className="flex gap-2 mb-6">
                  <input
                    type="text"
                    value={clientContratoSearch}
                    onChange={e => setClientContratoSearch(e.target.value)}
                    placeholder="Pesquisar por número, objeto, licitação..."
                    className={`flex-1 px-4 py-2 rounded-xl border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                  />
                </div>
                {(loggedSec?.contratos ?? []).filter(ct => {
                  const q = clientContratoSearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (ct.numero ?? "").toLowerCase().includes(q) ||
                    (ct.objeto ?? "").toLowerCase().includes(q) ||
                    (ct.numeroLicitacao ?? "").toLowerCase().includes(q) ||
                    (ct.dataInicial ?? "").toLowerCase().includes(q) ||
                    (ct.dataEncerramento ?? "").toLowerCase().includes(q)
                  );
                }).length === 0 && (
                  <p className={`text-center py-16 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{clientContratoSearch ? "Nenhum contrato encontrado." : "Nenhum contrato disponível."}</p>
                )}
                <div className="space-y-3">
                  {(loggedSec?.contratos ?? []).filter(ct => {
                    const q = clientContratoSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (ct.numero ?? "").toLowerCase().includes(q) ||
                      (ct.objeto ?? "").toLowerCase().includes(q) ||
                      (ct.numeroLicitacao ?? "").toLowerCase().includes(q) ||
                      (ct.dataInicial ?? "").toLowerCase().includes(q) ||
                      (ct.dataEncerramento ?? "").toLowerCase().includes(q)
                    );
                  }).map((ct, ci) => {
                    const aberto = clientContratoExpandido === ct.id;
                    return (
                      <div key={ct.id} className={`rounded-xl border transition-all ${isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}`}>
                        {/* Cabeçalho clicável */}
                        <button
                          onClick={() => setClientContratoExpandido(aberto ? null : ct.id)}
                          className="w-full text-left px-5 py-4 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className={`font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Contrato Nº {ct.numero || `${ci + 1}`}</span>
                              {ct.dataEncerramento && vigTag(ct.dataEncerramento)}
                              {prazoTag(ct)}
                            </div>
                            {ct.objeto && <p className={`text-sm truncate ${isDarkMode ? "text-gray-300" : "text-slate-600"}`}>{ct.objeto}</p>}
                            <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>
                              {[ct.numeroLicitacao && `Licitação: ${ct.numeroLicitacao}`, ct.dataInicial && `Início: ${ct.dataInicial}`, ct.dataEncerramento && `Enc.: ${ct.dataEncerramento}`, ct.quantidadeMeses && `${ct.quantidadeMeses} meses`, ct.valorMensal && `Mensal: R$ ${ct.valorMensal}`, ct.valorMensal && ct.quantidadeMeses && `Valor Global: ${vGlobal(ct.valorMensal, ct.quantidadeMeses)}`].filter(Boolean).join(" · ")}
                            </p>
                          </div>
                          <ChevronRight className={`w-5 h-5 flex-shrink-0 transition-transform ${isDarkMode ? "text-gray-400" : "text-gray-400"} ${aberto ? "rotate-90" : ""}`} />
                        </button>

                        {/* Detalhes expandidos */}
                        {aberto && (
                          <div className={`px-5 pb-5 pt-1 border-t space-y-5 ${isDarkMode ? "border-purple-500/20" : "border-gray-100"}`}>
                            {/* Painel de limite de prorrogação */}
                            {ct.artigo && (() => {
                              const max = ARTIGO_MAX_MESES[ct.artigo] ?? 0;
                              const usado = mesesUsados2(ct);
                              const restam = max - usado;
                              const esgotado = restam <= 0;
                              return (
                                <div className={`mt-3 p-3 rounded-xl border text-sm ${
                                  esgotado
                                    ? "border-red-500/50 bg-red-500/10"
                                    : restam <= 12
                                    ? "border-orange-500/40 bg-orange-500/10"
                                    : (isDarkMode ? "border-cyan-500/30 bg-cyan-500/10" : "border-purple-500/30 bg-purple-50")
                                }`}>
                                  <p className={`font-semibold mb-1 ${
                                    esgotado ? "text-red-400" : restam <= 12 ? "text-orange-400" : (isDarkMode ? "text-cyan-300" : "text-purple-700")
                                  }`}>
                                    📋 {ARTIGO_NOMES[ct.artigo]}
                                  </p>
                                  <div className={`flex flex-wrap gap-x-5 gap-y-1 text-xs ${
                                    esgotado ? "text-red-300" : restam <= 12 ? "text-orange-300" : (isDarkMode ? "text-cyan-200" : "text-purple-600")
                                  }`}>
                                    <span>Máximo total: <strong>{max} meses</strong></span>
                                    <span>Já utilizado: <strong>{usado} meses</strong></span>
                                    <span className={esgotado ? "text-red-400 font-bold" : restam <= 12 ? "text-orange-400 font-bold" : ""}>
                                      {esgotado ? "⛔ Limite atingido — sem prazo para novos aditivos" : `Disponível para prorrogação: `}
                                      {!esgotado && <strong>{restam} meses</strong>}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3">
                              {[["Data Inicial",ct.dataInicial],["Data Encerramento",ct.dataEncerramento],["Qtd. Meses",ct.quantidadeMeses]].map(([l,v])=>(
                                <div key={l}><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{l}</p><p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{v || "—"}</p></div>
                              ))}
                              <div><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Valor Mensal</p><p className={`font-bold text-lg ${isDarkMode ? "text-cyan-400" : "text-purple-600"}`}>R$ {ct.valorMensal || "—"}</p></div>
                              <div><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Valor Global</p><p className={`font-bold text-lg ${isDarkMode ? "text-cyan-400" : "text-purple-600"}`}>{vGlobal(ct.valorMensal, ct.quantidadeMeses)}</p></div>
                            </div>
                            {ct.arquivo && (
                              <a href={ct.arquivo} download={`Contrato-${ct.numero}.pdf`} className="inline-flex">
                                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                                  <Download className="w-4 h-4 mr-2" /> Baixar PDF do Contrato
                                </Button>
                              </a>
                            )}
                            {ct.aditivos.length > 0 && (
                              <div>
                                <p className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>Aditivos ({ct.aditivos.length})</p>
                                <div className="space-y-2">
                                  {ct.aditivos.map((ad, ai) => (
                                    <div key={ad.id} className={`rounded-lg p-3 ${isDarkMode ? "bg-slate-800 border border-purple-500/10" : "bg-gray-50 border border-gray-200"}`}>
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                            {ad.numero && <span className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Aditivo Nº {ad.numero}</span>}
                                            {ad.tipos.map(t => <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${t==="Prazo" ? "bg-blue-500/20 text-blue-400" : t==="Acréscimo" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{t}</span>)}
                                          </div>
                                          {ad.objeto && <p className={`text-xs font-medium mb-0.5 ${isDarkMode ? "text-gray-200" : "text-slate-700"}`}>{ad.objeto}</p>}
                                          <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                            {ad.dataInicial} → {ad.dataEncerramento}
                                            {(ad.tipos.includes("Acréscimo")||ad.tipos.includes("Redução")) && ad.novoValorMensal && <span> · Novo valor: R$ {ad.novoValorMensal}</span>}
                                          </p>
                                        </div>
                                        {ad.arquivo && (
                                          <a href={ad.arquivo} download={`Aditivo-${ci+1}-${ai+1}.pdf`}>
                                            <Button size="sm" variant="outline" className={`text-xs h-7 ${isDarkMode ? "border-purple-500/30 text-purple-400" : "border-purple-300 text-purple-600"}`}>
                                              <Download className="w-3 h-3 mr-1" /> PDF
                                            </Button>
                                          </a>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              );
            })()}

            {/* Sistemas */}
            {currentModal === 'systems' && (
              <div>
                <h1 className="text-3xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Sistemas</h1>
                <p className={`mb-8 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{loggedEnt?.nome ?? ""} · CNPJ: {loggedSec?.cnpj ?? ""}</p>
                {(loggedSec?.sistemasContratados ?? []).length === 0 ? (
                  <p className={`text-center py-16 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum sistema contratado.</p>
                ) : (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(loggedSec?.sistemasContratados ?? []).map((sistema, index) => {
                      const statusColor = sistema.status?.toLowerCase() === "ativo" ? "bg-green-500" : sistema.status?.toLowerCase() === "inativo" ? "bg-red-500" : "bg-yellow-500";
                      return (
                      <div key={index} className={`rounded-xl border p-5 flex items-center gap-4 ${isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-sm"}`}>
                        <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-xl flex-shrink-0">
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className={`font-bold truncate ${isDarkMode ? "text-white" : "text-slate-900"}`}>{sistema.nome}</p>
                            <Badge className={`${statusColor} text-white border-none text-xs flex-shrink-0`}>{sistema.status}</Badge>
                          </div>
                          <p className={`text-xs mt-0.5 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Início: {sistema.dataInicio || "—"}</p>
                        </div>
                        <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                      </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Notas Fiscais */}
            {currentModal === 'invoices' && (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Notas Fiscais</h1>

                {/* Barra de pesquisa */}
                <input
                  type="text"
                  value={clientNfSearch}
                  onChange={e => setClientNfSearch(e.target.value)}
                  placeholder="Pesquisar por número, referência, data, valor..."
                  className={`w-full px-4 py-2 rounded-xl border text-sm mb-6 ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                />

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(loggedSec?.notasFiscais ?? []).filter(nf => {
                    const q = clientNfSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (nf.numero ?? "").toLowerCase().includes(q) ||
                      (nf.referencia ?? "").toLowerCase().includes(q) ||
                      (nf.data ?? "").toLowerCase().includes(q) ||
                      (nf.dataVencimento ?? "").toLowerCase().includes(q) ||
                      (nf.valor ?? "").toLowerCase().includes(q) ||
                      (nf.status ?? "").toLowerCase().includes(q)
                    );
                  }).map((nf, index) => {
                    const statusReal = nf.dataPagamento ? "Pago" : (() => {
                      if (!nf.dataVencimento) return nf.status;
                      const [d,m,a] = nf.dataVencimento.split("/");
                      const dv = new Date(+a,+m-1,+d);
                      dv.setHours(0,0,0,0);
                      const hoje = new Date(); hoje.setHours(0,0,0,0);
                      return dv < hoje ? "Vencida" : nf.status;
                    })();
                    const badgeColor = statusReal === "Pago" ? "bg-green-500" : statusReal === "Vencida" ? "bg-red-500" : "bg-yellow-500";
                    const realIdx = (loggedSec?.notasFiscais ?? []).indexOf(nf);
                    return (
                      <Card key={index} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                        <CardContent className="p-5 space-y-3">
                          {/* Número + Status */}
                          <div className="flex items-center justify-between">
                            <span className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Nº {nf.numero}</span>
                            <button
                              onClick={() => {
                                setNfPagamentoIdx(realIdx);
                                setPagamentoDataError("");
                                setPagamentoComprovanteNome(nf.comprovante ? "comprovante" : "");
                                setPagamentoComprovante(nf.comprovante ?? "");
                                setNfPagamentoIsEdit(statusReal === "Pago");
                                if (nf.dataPagamento) {
                                  const [d,m,a] = nf.dataPagamento.split("/");
                                  if (d && m && a) setPagamentoData(`${a}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
                                  else setPagamentoData("");
                                } else {
                                  setPagamentoData("");
                                }
                                if (nf.data) {
                                  const [d,m,a] = nf.data.split("/");
                                  if (d && m && a) setPagamentoMinData(`${a}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
                                  else setPagamentoMinData("");
                                } else { setPagamentoMinData(""); }
                                setShowMarcarPagoModal(true);
                              }}
                              className={`text-xs font-semibold px-2 py-1 rounded-full text-white cursor-pointer hover:opacity-80 transition-opacity ${badgeColor}`}>{statusReal}</button>
                          </div>

                          {/* Grid de infos */}
                          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                            <div>
                              <p className={`text-xs mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Referência</p>
                              <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>{nf.referencia || "—"}</p>
                            </div>
                            <div>
                              <p className={`text-xs mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Emissão</p>
                              <p className={`font-medium ${isDarkMode ? "text-gray-200" : "text-slate-800"}`}>{nf.data || "—"}</p>
                            </div>
                            <div>
                              <p className={`text-xs mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Vencimento</p>
                              <p className={`font-medium ${statusReal === "Vencida" ? "text-red-400" : isDarkMode ? "text-gray-200" : "text-slate-800"}`}>{nf.dataVencimento || "—"}</p>
                            </div>
                            <div>
                              <p className={`text-xs mb-0.5 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Valor</p>
                              <p className={`font-bold text-base ${isDarkMode ? "text-cyan-400" : "text-purple-600"}`}>R$ {nf.valor}</p>
                            </div>
                          </div>

                          {/* Pago em */}
                          {statusReal === "Pago" && nf.dataPagamento && (
                            <button onClick={() => {
                              setNfPagamentoIdx(realIdx);
                              setPagamentoDataError("");
                              setPagamentoComprovanteNome(nf.comprovante ? "comprovante" : "");
                              setPagamentoComprovante(nf.comprovante ?? "");
                              setNfPagamentoIsEdit(true);
                              const [d,m,a] = nf.dataPagamento.split("/");
                              if (d && m && a) setPagamentoData(`${a}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
                              else setPagamentoData("");
                              if (nf.data) {
                                const [dd,mm,aa] = nf.data.split("/");
                                if (dd && mm && aa) setPagamentoMinData(`${aa}-${mm.padStart(2,"0")}-${dd.padStart(2,"0")}`);
                                else setPagamentoMinData("");
                              } else { setPagamentoMinData(""); }
                              setShowMarcarPagoModal(true);
                            }} className={`text-xs text-left hover:underline cursor-pointer ${isDarkMode ? "text-green-400" : "text-green-600"}`}>✓ Pago em {nf.dataPagamento}</button>
                          )}

                          {/* Botões */}
                          <div className="space-y-2 pt-1">
                            {nf.arquivo ? (
                              <a href={nf.arquivo} download={`NF-${nf.numero}.pdf`} className="block">
                                <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-sm">
                                  <Download className="w-4 h-4 mr-2" /> Baixar Nota Fiscal
                                </Button>
                              </a>
                            ) : (
                              <Button disabled className="w-full text-sm opacity-40 cursor-not-allowed bg-gradient-to-r from-purple-600 to-cyan-600">
                                <Download className="w-4 h-4 mr-2" /> PDF não disponível
                              </Button>
                            )}
                            {statusReal !== "Pago" && (
                              <Button variant="outline" onClick={() => {
                                setNfPagamentoIdx(realIdx);
                                setPagamentoData("");
                                setPagamentoComprovante("");
                                setPagamentoComprovanteNome("");
                                setPagamentoDataError("");
                                setNfPagamentoIsEdit(false);
                                if (nf.data) {
                                  const [d,m,a] = nf.data.split("/");
                                  if (d && m && a) setPagamentoMinData(`${a}-${m.padStart(2,"0")}-${d.padStart(2,"0")}`);
                                  else setPagamentoMinData("");
                                } else {
                                  setPagamentoMinData("");
                                }
                                setShowMarcarPagoModal(true);
                              }}
                                className={`w-full text-sm ${isDarkMode ? "border-green-500/50 text-green-400 hover:bg-green-500/10" : "border-green-500 text-green-600 hover:bg-green-50"}`}>
                                ✓ Marcar como Pago
                              </Button>
                            )}
                            {statusReal === "Pago" && nf.comprovante && (
                              <a href={nf.comprovante} download={`Comprovante-NF-${nf.numero}`} className="block">
                                <Button variant="outline" className={`w-full text-sm ${isDarkMode ? "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10" : "border-cyan-500 text-cyan-600 hover:bg-cyan-50"}`}>
                                  <Download className="w-4 h-4 mr-2" /> Baixar Comprovante
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                  {(loggedSec?.notasFiscais ?? []).length === 0 && (
                    <p className={`col-span-3 text-center py-12 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma nota fiscal disponível.</p>
                  )}
                </div>

                {/* Modal: Marcar/Editar Pagamento */}
                {showMarcarPagoModal && (
                  <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{backdropFilter:"blur(4px)",background:"rgba(0,0,0,0.6)"}}
                    onClick={() => setShowMarcarPagoModal(false)}>
                    <div className={`w-full max-w-md rounded-2xl shadow-2xl ${isDarkMode ? "bg-slate-900 border border-purple-500/30" : "bg-white border border-gray-200"}`}
                      onClick={e => e.stopPropagation()}>
                      <div className="p-6 space-y-4">
                        <h2 className={`text-lg font-bold ${isDarkMode ? "text-white" : "text-slate-900"}`}>
                          {nfPagamentoIsEdit ? "Editar Pagamento" : "Confirmar Pagamento"}
                        </h2>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Data de Pagamento</label>
                          <div className="relative flex items-center gap-2">
                            <input type="date" value={pagamentoData}
                            min={pagamentoMinData || undefined}
                            max="2099-12-31"
                            onChange={e => {
                              const val = e.target.value;
                              setPagamentoData(val);
                              if (!val) { setPagamentoDataError(""); return; }
                              const [ano, mes, dia] = val.split("-").map(Number);
                              if (!ano || !mes || !dia) { setPagamentoDataError("Data inválida."); return; }
                              if (ano < 1900 || ano > 2099) { setPagamentoDataError("Ano deve estar entre 1900 e 2099."); return; }
                              const dt = new Date(ano, mes - 1, dia);
                              if (dt.getFullYear() !== ano || dt.getMonth() !== mes - 1 || dt.getDate() !== dia) {
                                setPagamentoDataError("Data inválida para o calendário (ex: 31/02 não existe).");
                                return;
                              }
                              if (pagamentoMinData) {
                                const [mA, mM, mD] = pagamentoMinData.split("-").map(Number);
                                const dtMin = new Date(mA, mM - 1, mD);
                                if (dt < dtMin) { setPagamentoDataError("Data não pode ser anterior à emissão da nota."); return; }
                              }
                              setPagamentoDataError("");
                            }}
                            className={`flex-1 px-3 py-2 rounded-lg border text-sm ${pagamentoDataError ? "border-red-500" : isDarkMode ? "border-purple-500/30" : "border-gray-300"} ${isDarkMode ? "bg-slate-800 text-white" : "bg-white text-slate-900"}`} />
                            {nfPagamentoIsEdit && pagamentoData && (
                              <button type="button" onClick={() => { setPagamentoData(""); setPagamentoDataError(""); }}
                                title="Limpar data (desfaz pagamento)"
                                className={`flex-shrink-0 px-3 py-2 rounded-lg border text-xs font-medium cursor-pointer transition-colors ${isDarkMode ? "border-red-500/50 text-red-400 hover:bg-red-500/10 bg-transparent" : "border-red-400 text-red-500 hover:bg-red-50 bg-white"}`}>✕ Limpar</button>
                            )}
                          </div>
                          {pagamentoDataError && <p className="text-xs text-red-400 mt-1">⚠ {pagamentoDataError}</p>}
                        </div>
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>Comprovante <span className={isDarkMode ? "text-gray-500" : "text-gray-400"}>(opcional)</span></label>
                          {pagamentoComprovanteNome ? (
                            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-gray-300" : "bg-gray-50 border-gray-300 text-slate-700"}`}>
                              <span className="flex-1 truncate">📎 {pagamentoComprovanteNome}</span>
                              <label className={`cursor-pointer text-xs px-2 py-0.5 rounded font-medium ${isDarkMode ? "bg-purple-700 text-white hover:bg-purple-600" : "bg-purple-100 text-purple-700 hover:bg-purple-200"}`}>
                                Substituir
                                <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  setPagamentoComprovanteNome(file.name);
                                  const reader = new FileReader();
                                  reader.onload = ev => setPagamentoComprovante(ev.target?.result as string ?? "");
                                  reader.readAsDataURL(file);
                                  e.target.value = "";
                                }} />
                              </label>
                              <button type="button" onClick={() => { setPagamentoComprovante(""); setPagamentoComprovanteNome(""); }}
                                className="text-xs text-red-400 hover:text-red-300 px-1">Remover</button>
                            </div>
                          ) : (
                            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer text-sm ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-gray-400 hover:border-purple-400" : "bg-white border-gray-300 text-gray-500 hover:border-purple-400"}`}>
                              <span>📎 Escolher arquivo...</span>
                              <input type="file" accept="image/*,.pdf" className="hidden" onChange={e => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setPagamentoComprovanteNome(file.name);
                                const reader = new FileReader();
                                reader.onload = ev => setPagamentoComprovante(ev.target?.result as string ?? "");
                                reader.readAsDataURL(file);
                                e.target.value = "";
                              }} />
                            </label>
                          )}
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                          <Button variant="outline" onClick={() => setShowMarcarPagoModal(false)} className="border-gray-400 text-black hover:bg-gray-100">Cancelar</Button>
                          <Button
                            disabled={!!pagamentoDataError || (!pagamentoData && !nfPagamentoIsEdit)}
                            onClick={() => {
                              if (nfPagamentoIdx === null || !loggedInUser) return;
                              if (!pagamentoData && nfPagamentoIsEdit) {
                                // Desfaz pagamento — reverte para Pendente
                                updateSecretaria(loggedInUser.entidadeId, loggedInUser.secretariaId, sec => ({
                                  ...sec,
                                  notasFiscais: sec.notasFiscais.map((nf, i) => i === nfPagamentoIdx
                                    ? { ...nf, status: "Pendente", dataPagamento: "", comprovante: "" }
                                    : nf
                                  )
                                }));
                              } else if (pagamentoData) {
                                const fmt = (() => { const [a,m,d] = pagamentoData.split("-"); return `${d}/${m}/${a}`; })();
                                updateSecretaria(loggedInUser.entidadeId, loggedInUser.secretariaId, sec => ({
                                  ...sec,
                                  notasFiscais: sec.notasFiscais.map((nf, i) => i === nfPagamentoIdx
                                    ? { ...nf, status: "Pago", dataPagamento: fmt, comprovante: pagamentoComprovante || nf.comprovante }
                                    : nf
                                  )
                                }));
                              }
                              setShowMarcarPagoModal(false);
                            }}
                            className={nfPagamentoIsEdit && !pagamentoData ? "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"}>
                            {nfPagamentoIsEdit && !pagamentoData ? "Desfazer Pagamento" : "Confirmar Pagamento"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Relatórios */}
            {currentModal === 'reports' && (
              <div>
                <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Relatórios</h1>
                <input
                  type="text"
                  value={clientRelatorioSearch}
                  onChange={e => setClientRelatorioSearch(e.target.value)}
                  placeholder="Pesquisar por título, tipo ou data..."
                  className={`w-full px-4 py-2 rounded-xl border text-sm mb-6 ${isDarkMode ? "bg-slate-800 border-purple-500/30 text-white placeholder-gray-500" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400"}`}
                />
                {(loggedSec?.relatorios ?? []).filter(r => {
                  const q = clientRelatorioSearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (r.titulo ?? "").toLowerCase().includes(q) ||
                    (r.tipo ?? "").toLowerCase().includes(q) ||
                    (r.data ?? "").toLowerCase().includes(q)
                  );
                }).length === 0 && (
                  <p className={`text-center py-16 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{clientRelatorioSearch ? "Nenhum relatório encontrado." : "Nenhum relatório disponível."}</p>
                )}
                <div className="grid md:grid-cols-2 gap-6">
                  {(loggedSec?.relatorios ?? []).filter(r => {
                    const q = clientRelatorioSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (r.titulo ?? "").toLowerCase().includes(q) ||
                      (r.tipo ?? "").toLowerCase().includes(q) ||
                      (r.data ?? "").toLowerCase().includes(q)
                    );
                  }).map((relatorio, index) => (
                    <Card key={index} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2">
                          <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>{relatorio.titulo}</CardTitle>
                          <Badge variant="outline" className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>{relatorio.tipo}</Badge>
                        </div>
                        <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>Gerado em: {relatorio.data}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {relatorio.arquivo ? (
                          <a href={relatorio.arquivo} download={`${relatorio.titulo}.pdf`}>
                            <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                              <Download className="w-4 h-4 mr-2" /> Baixar Relatório
                            </Button>
                          </a>
                        ) : (
                          <Button disabled className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 opacity-40 cursor-not-allowed">
                            <Download className="w-4 h-4 mr-2" /> Arquivo não disponível
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Configurações */}
            {currentModal === 'settings' && loggedInUser && (
              <ClientSettingsTab
                key={loggedInUser.id}
                user={loggedInUser}
                isDarkMode={isDarkMode}
                onSave={(patch) => {
                  const updated = { ...loggedInUser, ...patch };
                  setClientUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
                  setLoggedInUser(updated);
                }}
              />
            )}

          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
      {/* Header */}
      <header className={isDarkMode 
        ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-4 shadow-2xl border-b border-purple-500/20 sticky top-0 z-50"
        : "bg-white text-slate-900 py-4 shadow-lg border-b border-gray-200 sticky top-0 z-50"
      }>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <img
              src={isDarkMode ? logoJeosBranca : logoJeosColorida}
              alt="JEOS Sistemas e Governo"
              className="h-16 w-auto cursor-pointer"
              onClick={() => { setCurrentPage("home"); window.scrollTo(0, 0); }}
            />
            <nav className="hidden md:flex gap-6 items-center">
              <button onClick={() => { setCurrentPage("home"); setTimeout(() => document.getElementById("inicio")?.scrollIntoView({ behavior: "smooth" }), 50); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Início</button>
              <button onClick={() => { setCurrentPage("home"); setTimeout(() => document.getElementById("solucoes")?.scrollIntoView({ behavior: "smooth" }), 50); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Soluções</button>
              <button onClick={() => { setCurrentPage("sobre"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Sobre</button>
              <button onClick={() => { setCurrentPage("certidoes"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Certidões</button>
              <button onClick={() => { setCurrentPage("home"); setTimeout(() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" }), 50); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Contato</button>
              <button onClick={() => { setCurrentPage("blog"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition cursor-pointer" : "text-gray-700 hover:text-purple-600 transition cursor-pointer"}>Blog</button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={isDarkMode 
                  ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" 
                  : "border-purple-500 text-purple-600 hover:bg-purple-50"
                }
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </nav>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={isDarkMode 
                  ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10 md:hidden" 
                  : "border-purple-500 text-purple-600 hover:bg-purple-50 md:hidden"
                }
              >
                {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              
              {isLoggedIn ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
                  >
                    <ImageWithFallback 
                      src={loggedInUser?.foto ?? loggedSec?.foto ?? ""}
                      alt={loggedInUser?.nome ?? ""}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="hidden md:block text-left">
                      <p className={isDarkMode ? "text-white text-sm font-semibold" : "text-slate-900 text-sm font-semibold"}>
                        {loggedInUser?.nome ?? ""}
                      </p>
                      <p className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>
                        {loggedInUser?.cargo ?? ""}
                      </p>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className={isDarkMode 
                      ? "absolute right-0 mt-2 w-64 bg-slate-900 border border-purple-500/20 rounded-lg shadow-2xl z-50"
                      : "absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-2xl z-50"
                    }>
                      <div className="p-4 border-b border-purple-500/20">
                        <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>
                          {loggedInUser?.nome ?? ""}
                        </p>
                        <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>
                          {(loggedEnt?.nome ?? "")}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setCurrentModal('contract');
                            setShowUserMenu(false);
                          }}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300 cursor-pointer"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700 cursor-pointer"
                          }
                        >
                          <FileText className="w-5 h-5 text-purple-400" />
                          Meu Contrato
                        </button>
                        <button
                          onClick={() => {
                            setCurrentModal('invoices');
                            setShowUserMenu(false);
                          }}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300 cursor-pointer"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700 cursor-pointer"
                          }
                        >
                          <DollarSign className="w-5 h-5 text-purple-400" />
                          Notas Fiscais
                        </button>
                        <button
                          onClick={() => {
                            setCurrentModal('reports');
                            setShowUserMenu(false);
                          }}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300 cursor-pointer"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700 cursor-pointer"
                          }
                        >
                          <Eye className="w-5 h-5 text-purple-400" />
                          Relatórios
                        </button>
                        <button
                          onClick={() => {
                            setCurrentModal('settings');
                            setShowUserMenu(false);
                          }}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300 cursor-pointer"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700 cursor-pointer"
                          }
                        >
                          <Users className="w-5 h-5 text-purple-400" />
                          Configurações
                        </button>
                      </div>
                      <div className="border-t border-purple-500/20 py-2">
                        <button
                          onClick={handleLogout}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-red-500/10 transition flex items-center gap-3 text-red-400 cursor-pointer"
                            : "w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-3 text-red-600 cursor-pointer"
                          }
                        >
                          <LogOut className="w-5 h-5" />
                          Sair
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Button 
                  variant="outline"
                  onClick={() => setShowLoginModal(true)}
                  className={isDarkMode 
                    ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" 
                    : "border-purple-500 text-purple-600 hover:bg-purple-50"
                  }
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Área do Cliente
                </Button>
              )}
              
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 hidden md:block" onClick={() => { if(savedSiteContent.whatsapp) window.open(`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`, "_blank"); }}>
                Solicitar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Página Blog */}
      {currentPage === "blog" && (
        <div className="container mx-auto px-4 py-10">
          <div className="flex items-center gap-3 mb-8">
            <button onClick={() => { setCurrentPage("home"); }} className={`flex items-center gap-1 text-sm ${isDarkMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-500 hover:text-purple-600"} transition cursor-pointer`}>
              <ChevronLeft className="w-4 h-4" /> Voltar ao site
            </button>
          </div>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Blog & Notícias</h1>
            <p className={isDarkMode ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}>Acompanhe as novidades e tendências da gestão pública</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map(post => (
              <Card key={post.id} className={`cursor-pointer transition-all hover:scale-[1.02] ${isDarkMode ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50" : "bg-white border-gray-200 shadow-md hover:shadow-xl"}`}
                onClick={() => { setSelectedPostId(post.id); setCurrentPage("post"); window.scrollTo(0,0); }}>
                {post.imagem && (
                  <div className="aspect-video overflow-hidden rounded-t-lg">
                    <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                )}
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium">{post.categoria}</span>
                    <span className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-500 text-xs"}>{post.data}</span>
                  </div>
                  <h3 className={`font-bold text-base mb-2 line-clamp-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{post.titulo}</h3>
                  <p className={`text-sm line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{post.resumo}</p>
                  <button className="mt-3 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 hover:opacity-80 transition">Leia mais →</button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Página Artigo */}
      {currentPage === "post" && (() => {
        const post = blogPosts.find(p => p.id === selectedPostId);
        if (!post) return null;
        return (
          <div className="container mx-auto px-4 py-10 max-w-4xl">
            <button onClick={() => { setCurrentPage("blog"); window.scrollTo(0,0); }} className={`flex items-center gap-1 text-sm mb-8 ${isDarkMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-500 hover:text-purple-600"} transition cursor-pointer`}>
              <ChevronLeft className="w-4 h-4" /> Voltar ao blog
            </button>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium">{post.categoria}</span>
              <span className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-500 text-sm"}>{post.data}</span>
              <span className={isDarkMode ? "text-gray-500 text-sm" : "text-gray-400 text-sm"}>• Por {post.autor}</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${isDarkMode ? "text-white" : "text-slate-900"}`}>{post.titulo}</h1>
            {post.imagem && (
              <div className="aspect-video overflow-hidden rounded-2xl mb-8 border border-purple-500/20">
                <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover" />
              </div>
            )}
            <p className={`text-lg mb-8 font-medium italic ${isDarkMode ? "text-gray-300 border-l-4 border-purple-500 pl-4" : "text-gray-600 border-l-4 border-purple-400 pl-4"}`}>{post.resumo}</p>
            <div className={`space-y-4 text-base leading-relaxed ${isDarkMode ? "text-gray-300" : "text-gray-700"}`}>
              {post.conteudo.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className={`mt-10 pt-8 border-t ${isDarkMode ? "border-purple-500/20" : "border-gray-200"}`}>
              <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? "text-white" : "text-slate-900"}`}>Outras notícias</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {blogPosts.filter(p => p.id !== post.id).slice(0, 2).map(p => (
                  <div key={p.id} className={`cursor-pointer p-4 rounded-xl border transition hover:scale-[1.01] ${isDarkMode ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/40" : "bg-gray-50 border-gray-200 hover:border-purple-300"}`}
                    onClick={() => { setSelectedPostId(p.id); window.scrollTo(0,0); }}>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium mb-2 inline-block">{p.categoria}</span>
                    <h4 className={`font-semibold text-sm line-clamp-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{p.titulo}</h4>
                    <p className={`text-xs mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{p.data}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Página Sobre */}
      {currentPage === "sobre" && (
        <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
          <div className="container mx-auto px-4 pt-8 pb-4">
            <button onClick={() => { setCurrentPage("home"); window.scrollTo(0,0); }} className={`flex items-center gap-1 text-sm mb-6 ${isDarkMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-500 hover:text-purple-600"} transition cursor-pointer`}>
              <ChevronLeft className="w-4 h-4" /> Voltar ao início
            </button>
          </div>
          <section className={isDarkMode ? "py-12 bg-slate-900/30" : "py-12 bg-gray-50"}>
            <div className="container mx-auto px-4">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    Sobre a JEOS
                  </h2>
                  <p className={isDarkMode ? "text-gray-300 mb-6 leading-relaxed" : "text-gray-700 mb-6 leading-relaxed"}>
                    {savedSiteContent.sobreParagrafo1}
                  </p>
                  <p className={isDarkMode ? "text-gray-300 mb-6 leading-relaxed" : "text-gray-700 mb-6 leading-relaxed"}>
                    {savedSiteContent.sobreParagrafo2}
                  </p>
                  <div className="space-y-4">
                    {[
                      { titulo: (savedSiteContent as typeof defaultSiteContent).diferencial1Titulo, desc: (savedSiteContent as typeof defaultSiteContent).diferencial1Desc, icone: (savedSiteContent as typeof defaultSiteContent).diferencial1Icone },
                      { titulo: (savedSiteContent as typeof defaultSiteContent).diferencial2Titulo, desc: (savedSiteContent as typeof defaultSiteContent).diferencial2Desc, icone: (savedSiteContent as typeof defaultSiteContent).diferencial2Icone },
                      { titulo: (savedSiteContent as typeof defaultSiteContent).diferencial3Titulo, desc: (savedSiteContent as typeof defaultSiteContent).diferencial3Desc, icone: (savedSiteContent as typeof defaultSiteContent).diferencial3Icone },
                    ].map((d, i) => {
                      const diferencialIconMap: Record<string, React.ElementType> = { TrendingUp, Shield, Headphones, Award, CheckCircle2, Briefcase, Users, Settings, Phone, Mail };
                      const DIcon = diferencialIconMap[d.icone] ?? TrendingUp;
                      return (
                        <div key={i} className="flex items-start gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded">
                            <DIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className={isDarkMode ? "text-white font-semibold mb-1" : "text-slate-900 font-semibold mb-1"}>{d.titulo}</h4>
                            <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>{d.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative">
                  <div className={isDarkMode
                    ? "aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-purple-500/20"
                    : "aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
                  }>
                    <ImageWithFallback
                      src={(savedSiteContent as typeof defaultSiteContent).fotoEquipe}
                      alt="Equipe JEOS"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-600 to-cyan-600 p-8 rounded-2xl shadow-2xl">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-white mb-1">{(savedSiteContent as typeof defaultSiteContent).badgeNumero}</div>
                      <div className="text-white text-sm">{(savedSiteContent as typeof defaultSiteContent).badgeDesc}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {((savedSiteContent as typeof defaultSiteContent).missao || (savedSiteContent as typeof defaultSiteContent).visao || (savedSiteContent as typeof defaultSiteContent).valores) && (
            <section className={isDarkMode ? "py-8 bg-slate-950" : "py-8 bg-white"}>
              <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-3 gap-6">
                  {(savedSiteContent as typeof defaultSiteContent).missao && (
                    <div className={isDarkMode ? "p-8 rounded-2xl border border-purple-500/20 bg-slate-900/50" : "p-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"}>
                      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-wide">Missão</h3>
                      <p className={isDarkMode ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>{(savedSiteContent as typeof defaultSiteContent).missao}</p>
                    </div>
                  )}
                  {(savedSiteContent as typeof defaultSiteContent).visao && (
                    <div className={isDarkMode ? "p-8 rounded-2xl border border-cyan-500/20 bg-slate-900/50" : "p-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"}>
                      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400 uppercase tracking-wide">Visão</h3>
                      <p className={isDarkMode ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>{(savedSiteContent as typeof defaultSiteContent).visao}</p>
                    </div>
                  )}
                  {(savedSiteContent as typeof defaultSiteContent).valores && (
                    <div className={isDarkMode ? "p-8 rounded-2xl border border-purple-500/20 bg-slate-900/50" : "p-8 rounded-2xl border border-gray-200 bg-gray-50 shadow-sm"}>
                      <h3 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 uppercase tracking-wide">Valores</h3>
                      <p className={isDarkMode ? "text-gray-300 leading-relaxed" : "text-gray-700 leading-relaxed"}>{(savedSiteContent as typeof defaultSiteContent).valores}</p>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>
      )}

      {/* Página Certidões */}
      {currentPage === "certidoes" && (
        <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
          <div className="container mx-auto px-4 pt-8 pb-4">
            <button onClick={() => { setCurrentPage("home"); window.scrollTo(0,0); }} className={`flex items-center gap-1 text-sm mb-6 ${isDarkMode ? "text-gray-400 hover:text-cyan-400" : "text-gray-500 hover:text-purple-600"} transition cursor-pointer`}>
              <ChevronLeft className="w-4 h-4" /> Voltar ao início
            </button>
          </div>
          <section className="pb-12">
            <div className="container mx-auto px-4">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Certidões e Documentos
                </h1>
                <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
                  Transparência e conformidade: acesse nossas certidões e comprovantes de regularidade
                </p>
              </div>
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-md">
                  <input type="text" value={certSearch} onChange={e => setCertSearch(e.target.value)} placeholder="Buscar por nome ou tipo de certidão..."
                    className={`w-full pl-10 pr-10 py-2.5 rounded-xl border text-sm outline-none transition ${isDarkMode ? "bg-slate-800 border-slate-600 text-white placeholder-gray-500 focus:border-purple-400" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400 focus:border-purple-500"}`} />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">🔍</span>
                  {certSearch && (<button onClick={() => setCertSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-lg leading-none">×</button>)}
                </div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {(() => {
                  const parseDt = (d?: string) => { if (!d) return 0; const p = (d||'').split('/'); if (p.length === 3) return parseInt(p[2]||'0')*10000+parseInt(p[1]||'0')*100+parseInt(p[0]||'0'); if (p.length === 2) return parseInt(p[1]||'0')*100+parseInt(p[0]||'0'); return 0; };
                  const q = certSearch.trim().toLowerCase();
                  const grupos: Record<string, typeof savedCertidoes> = {};
                  savedCertidoes.forEach(c => { if (!grupos[c.titulo]) grupos[c.titulo] = []; grupos[c.titulo].push(c); });
                  const gruposSorted = Object.values(grupos).map(g => [...g].sort((a, b) => parseDt(b.dataEmissao) - parseDt(a.dataEmissao)));
                  const filtrados = q ? gruposSorted.filter(grupo => grupo[0].titulo.toLowerCase().includes(q) || grupo[0].tipo.toLowerCase().includes(q)) : gruposSorted;
                  return filtrados.map((grupo, gi) => {
                    const atual = grupo[0];
                    const anteriores = grupo.slice(1);
                    const isOpen = certHistoricoAberto === atual.titulo;
                    return (
                      <Card key={gi} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all" : "bg-white border-gray-200 hover:border-purple-400 transition-all shadow-md hover:shadow-xl"}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg"><FileCheck className="w-6 h-6 text-white" /></div>
                            <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-none">{atual.tipo}</Badge>
                          </div>
                          <CardTitle className={isDarkMode ? "text-white mt-4" : "text-slate-900 mt-4"}>{atual.titulo}</CardTitle>
                          <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                            {[atual.dataEmissao ? `Emissão: ${stripCertDate(atual.dataEmissao)}` : '', atual.validade ? `Válida até: ${stripCertDate(atual.validade)}` : ''].filter(Boolean).join(' • ')}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          {atual.arquivo ? (
                            <a href={atual.arquivo} download={`${atual.titulo}${atual.dataEmissao ? ` - ${atual.dataEmissao}` : ""}.pdf`} className="block">
                              <Button variant="outline" className={isDarkMode ? "w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "w-full border-purple-500 text-purple-600 hover:bg-purple-50"}>
                                <Download className="w-4 h-4 mr-2" />Baixar Certidão{atual.dataEmissao ? ` (${atual.dataEmissao})` : ""}
                              </Button>
                            </a>
                          ) : (
                            <Button variant="outline" disabled className="w-full opacity-40 cursor-not-allowed border-gray-500/30 text-gray-500">
                              <Download className="w-4 h-4 mr-2" />Arquivo não disponível
                            </Button>
                          )}
                          {anteriores.length > 0 && (
                            <div>
                              <button onClick={() => setCertHistoricoAberto(isOpen ? null : atual.titulo)}
                                className={`w-full mt-1 px-3 py-2 rounded-lg border text-sm flex items-center justify-between transition ${isDarkMode ? "border-gray-600 text-gray-400 hover:border-gray-400 hover:text-gray-200" : "border-gray-300 text-gray-500 hover:border-gray-500 hover:text-gray-700"}`}>
                                <span>Certidões Anteriores ({anteriores.length})</span>
                                <span className="text-xs">{isOpen ? "▲" : "▼"}</span>
                              </button>
                              {isOpen && (
                                <div className={`mt-2 rounded-lg border p-2 space-y-2 ${isDarkMode ? "border-gray-700 bg-slate-800/50" : "border-gray-200 bg-gray-50"}`}>
                                  <div className="relative mb-1">
                                    <input type="text" value={certAntSearch[atual.titulo] || ""} onChange={e => setCertAntSearch(prev => ({...prev, [atual.titulo]: fmtDate(e.target.value)}))} placeholder="dd/mm/aaaa — buscar certidão válida nesta data"
                                      className={`w-full pl-7 pr-7 py-1.5 rounded-lg border text-xs outline-none transition ${isDarkMode ? "bg-slate-700 border-slate-600 text-white placeholder-gray-500 focus:border-purple-400" : "bg-white border-gray-300 text-slate-900 placeholder-gray-400 focus:border-purple-400"}`} />
                                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">🔍</span>
                                    {certAntSearch[atual.titulo] && (<button onClick={() => setCertAntSearch(prev => ({...prev, [atual.titulo]: ""}))} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm leading-none">×</button>)}
                                  </div>
                                  {(() => {
                                    const rawQ = (certAntSearch[atual.titulo] || "").trim();
                                    if (!rawQ || rawQ.length < 10) return (<p className={`text-xs text-center py-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Digite uma data completa para buscar</p>);
                                    const toNum = (d: string) => { const p = d.split('/'); if (p.length !== 3) return 0; return parseInt(p[2])*10000 + parseInt(p[1])*100 + parseInt(p[0]); };
                                    const qNum = toNum(rawQ);
                                    const encontradas = anteriores.filter(old => { const emNum = toNum(stripCertDate(old.dataEmissao)); const valNum = toNum(stripCertDate(old.validade)); if (!emNum && !valNum) return false; if (emNum && valNum) return qNum >= emNum && qNum <= valNum; if (emNum) return qNum >= emNum; return qNum <= valNum; });
                                    if (encontradas.length === 0) return (<p className={`text-xs text-center py-2 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhuma certidão válida nesta data</p>);
                                    return encontradas.map((old, oi) => (
                                      <div key={oi} className="flex items-center justify-between gap-2">
                                        <span className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{[old.dataEmissao ? `Emissão: ${stripCertDate(old.dataEmissao)}` : '', old.validade ? `Válida até: ${stripCertDate(old.validade)}` : ''].filter(Boolean).join(' · ') || '—'}</span>
                                        {old.arquivo ? (
                                          <a href={old.arquivo} download={`${old.titulo}${old.dataEmissao ? ` - ${old.dataEmissao}` : ""}.pdf`}>
                                            <Button size="sm" variant="outline" className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10 text-xs h-7" : "border-purple-500 text-purple-600 hover:bg-purple-50 text-xs h-7"}><Download className="w-3 h-3 mr-1" />Baixar</Button>
                                          </a>
                                        ) : (<span className={`text-xs ${isDarkMode ? "text-gray-600" : "text-gray-400"}`}>Sem arquivo</span>)}
                                      </div>
                                    ));
                                  })()}
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  });
                })()}
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Hero Section + Home Sections */}
      {currentPage === "home" && <>
      <section id="inicio" className="relative py-12 md:py-20 overflow-hidden">
        <div className={isDarkMode 
          ? "absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-cyan-900/20" 
          : "absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-cyan-50"
        }></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 animate-fade-in-down">
              {savedSiteContent.heroTitle}
            </h1>
            <p className={`${isDarkMode ? "text-xl text-gray-300 mb-6 leading-relaxed" : "text-xl text-gray-700 mb-6 leading-relaxed"} animate-fade-in-up delay-200`}>
              {savedSiteContent.heroSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8 cursor-pointer"
                onClick={() => solucoesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              >
                Conheça Nossas Soluções
              </Button>
              {savedSiteContent.whatsapp ? (
                <a
                  href={`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button size="lg" variant="outline" className={isDarkMode
                    ? "border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 cursor-pointer w-full"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50 text-lg px-8 cursor-pointer w-full"
                  }>
                    Fale com Especialista
                  </Button>
                </a>
              ) : (
                <Button size="lg" variant="outline" className={isDarkMode
                  ? "border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8 cursor-pointer"
                  : "border-purple-500 text-purple-600 hover:bg-purple-50 text-lg px-8 cursor-pointer"
                }>
                  Fale com Especialista
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      {savedStats.filter(s => s.ativo).length > 0 && (
      <section className={isDarkMode ? "py-8 bg-slate-900/30" : "py-8 bg-gray-50"}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {savedStats.filter(s => s.ativo).map((stat, i) => {
              const IC = solucaoIconPickerMap[stat.icone ?? "Award"] ?? Award;
              return (
                <div key={i} className="text-center animate-fade-in-up" style={{animationDelay: `${i * 0.1}s`}}>
                  <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center animate-float" style={{animationDelay: `${i * 0.4}s`}}>
                    <IC className="w-7 h-7 md:w-8 md:h-8 text-white" />
                  </div>
                  <h3 className={`text-base md:text-lg font-bold ${isDarkMode ? "text-cyan-400 mb-1" : "text-purple-600 mb-1"}`}>{stat.valor}</h3>
                  <p className={`text-xs md:text-sm ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{stat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      )}

      {/* Soluções */}
      <section id="solucoes" ref={solucoesRef} className="py-10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 animate-fade-in-up">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Nossas Soluções
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Sistemas integrados e especializados para atender todas as necessidades da gestão pública
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <Card 
                  key={product.id}
                  className={`card-hover ${isDarkMode 
                    ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer group"
                    : "bg-white border-gray-200 hover:border-purple-400 transition-all cursor-pointer group shadow-md hover:shadow-xl"
                  }`}
                  onClick={() => setSelectedProduct(product.id)}
                >
                  <CardHeader>
                    <div className="w-14 h-14 mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className={isDarkMode 
                      ? "text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition"
                      : "text-slate-900 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-cyan-600 transition"
                    }>
                      {product.title}
                    </CardTitle>
                    <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Button 
                        variant="outline"
                        className={isDarkMode 
                          ? "w-full border-purple-500/50 text-purple-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:text-white hover:border-transparent"
                          : "w-full border-purple-500 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:text-white hover:border-transparent"
                        }
                        onClick={() => {
                          setSelectedProduct(product.id);
                          setTimeout(() => productDetailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
                        }}
                      >
                        Saiba Mais
                      </Button>
                      {product.url && (
                        <a href={product.url} target="_blank" rel="noopener noreferrer" className="block">
                          <Button className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                            Acessar Sistema
                          </Button>
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detalhes do Produto Selecionado */}
          {selectedProduct && (
            <div ref={productDetailRef}>
            <Card className={isDarkMode 
              ? "bg-slate-900/50 border-purple-500/20 text-white"
              : "bg-white border-gray-200 text-slate-900 shadow-xl"
            }>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
                    {(() => {
                      const product = products.find(p => p.id === selectedProduct);
                      if (product) {
                        const Icon = product.icon;
                        return <Icon className="w-7 h-7 text-white" />;
                      }
                      return null;
                    })()}
                  </div>
                  <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                    {products.find(p => p.id === selectedProduct)?.title}
                  </CardTitle>
                </div>
                <CardDescription className={isDarkMode ? "text-gray-400 text-lg" : "text-gray-600 text-lg"}>
                  {products.find(p => p.id === selectedProduct)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className={isDarkMode 
                    ? "aspect-video bg-slate-800 rounded-lg overflow-hidden border border-purple-500/20 flex items-center justify-center"
                    : "aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center"
                  }>
                    <ImageWithFallback 
                      src={products.find(p => p.id === selectedProduct)?.image || ""} 
                      alt={products.find(p => p.id === selectedProduct)?.title || ""}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className={isDarkMode ? "text-xl font-semibold mb-4 text-cyan-400" : "text-xl font-semibold mb-4 text-purple-600"}>Principais Recursos:</h3>
                    <ul className="space-y-3">
                      {products.find(p => p.id === selectedProduct)?.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle2 className={isDarkMode ? "w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" : "w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0"} />
                          <span className={isDarkMode ? "text-gray-300" : "text-gray-700"}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700" onClick={() => { if(savedSiteContent.whatsapp) window.open(`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`, "_blank"); }}>
                    Solicitar Demonstração
                  </Button>
                  <Button 
                    variant="outline" 
                    className={isDarkMode 
                      ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      : "border-purple-500 text-purple-600 hover:bg-purple-50"
                    }
                    onClick={() => setSelectedProduct(null)}
                  >
                    Fechar
                  </Button>
                </div>
              </CardContent>
            </Card>
            </div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      {blogPosts.length > 0 && (
        <section className={isDarkMode ? "py-10 bg-slate-900/30" : "py-10 bg-gray-50"}>
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-4 pb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Blog & Notícias
              </h2>
              <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
                Acompanhe as novidades e tendências da gestão pública
              </p>
            </div>
            {/* Carrossel de blog */}
            <div className="relative">
              {/* Botão anterior */}
              {blogPosts.length > 3 && (
              <button
                  onClick={() => goToBlogPreview("prev")}
                  className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                      : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
                  }`}
                  aria-label="Anterior"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                style={{
                  opacity: blogPreviewAnimating ? 0 : 1,
                  transform: blogPreviewAnimating ? "translateY(10px)" : "translateY(0)",
                  transition: "opacity 0.3s ease, transform 0.3s ease",
                }}
              >
                {[0, 1, 2].map(offset => {
                  const post = blogPosts[(blogPreviewIdx + offset) % blogPosts.length];
                  if (!post) return null;
                  return (
                    <Card key={`${blogPreviewIdx}-${offset}`} className={`cursor-pointer transition-all hover:scale-[1.02] ${isDarkMode ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50" : "bg-white border-gray-200 shadow-md hover:shadow-xl"}`}
                      onClick={() => { setSelectedPostId(post.id); setCurrentPage("post"); window.scrollTo(0,0); }}>
                      {post.imagem && (
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img src={post.imagem} alt={post.titulo} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 text-white font-medium">{post.categoria}</span>
                          <span className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-500 text-xs"}>{post.data}</span>
                        </div>
                        <h3 className={`font-bold text-base mb-2 line-clamp-2 ${isDarkMode ? "text-white" : "text-slate-900"}`}>{post.titulo}</h3>
                        <p className={`text-sm line-clamp-3 ${isDarkMode ? "text-gray-400" : "text-gray-600"}`}>{post.resumo}</p>
                        <button className="mt-3 text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 hover:opacity-80 transition">Leia mais →</button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Botão próximo */}
              {blogPosts.length > 3 && (
              <button
                  onClick={() => goToBlogPreview("next")}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                    isDarkMode
                      ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                      : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
                  }`}
                  aria-label="Próximo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Indicadores (dots) */}
            {blogPosts.length > 3 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: Math.ceil(blogPosts.length / 3) }).map((_, page) => (
                  <button
                    key={page}
                    onClick={() => {
                      setBlogPreviewAnimating(true);
                      setTimeout(() => {
                        setBlogPreviewIdx(page * 3);
                        setBlogPreviewAnimating(false);
                      }, 300);
                    }}
                    className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                      Math.floor(blogPreviewIdx / 3) === page
                        ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-125"
                        : isDarkMode
                          ? "bg-slate-600 hover:bg-slate-500"
                          : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`Página ${page + 1}`}
                  />
                ))}
              </div>
            )}
            <div className="text-center mt-10">
              <Button variant="outline" onClick={() => { setCurrentPage("blog"); window.scrollTo(0,0); }}
                className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "border-purple-500 text-purple-600 hover:bg-purple-50"}>
                Ver Todas as Notícias
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Órgãos que Usam Nossos Sistemas */}
      <section id="clientes" className="py-10 scroll-mt-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Quem Confia na JEOS
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Centenas de municípios, câmaras e órgãos públicos em todo o Brasil confiam em nossas soluções
            </p>
          </div>

          {/* Carrossel de clientes */}
          <div className="relative">
            {/* Botão anterior */}
            {clientes.length > 5 && (
              <button
                onClick={() => goToCliente("prev")}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                    : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
                }`}
                aria-label="Anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            {/* Cards visíveis */}
            <div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
              style={{
                opacity: clienteAnimating ? 0 : 1,
                transform: clienteAnimating ? "translateY(8px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {[0, 1, 2, 3, 4].map(offset => {
                const client = clientes[(clienteIdx + offset) % clientes.length];
                if (!client) return null;
                return (
                  <Card
                    key={`${clienteIdx}-${offset}`}
                    className={isDarkMode
                      ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all"
                      : "bg-white border-gray-200 hover:border-purple-400 transition-all shadow-md hover:shadow-lg"
                    }
                  >
                    <CardContent className="p-6 flex items-center justify-center h-40">
                      <div className="text-center w-full">
                        <div className={isDarkMode ? "bg-white/10 rounded-lg p-3 mb-3 mx-auto w-20 h-20 flex items-center justify-center" : "bg-gray-100 rounded-lg p-3 mb-3 mx-auto w-20 h-20 flex items-center justify-center"}>
                          <ImageWithFallback
                            src={client.logo}
                            alt={`Brasão ${client.name}`}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <p className={isDarkMode ? "text-gray-300 text-xs font-medium leading-tight" : "text-gray-700 text-xs font-medium leading-tight"}>
                          {client.name}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Botão próximo */}
            {clientes.length > 5 && (
              <button
                onClick={() => goToCliente("next")}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                  isDarkMode
                    ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                    : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
                }`}
                aria-label="Próximo"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Indicadores (dots) */}
          {clientes.length > 5 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: Math.ceil(clientes.length / 5) }).map((_, page) => (
                <button
                  key={page}
                  onClick={() => {
                    setClienteAnimating(true);
                    setTimeout(() => {
                      setClienteIdx(page * 5);
                      setClienteAnimating(false);
                    }, 300);
                  }}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    Math.floor(clienteIdx / 5) === page
                      ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-125"
                      : isDarkMode
                        ? "bg-slate-600 hover:bg-slate-500"
                        : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Página ${page + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Depoimentos */}
      <section className={isDarkMode ? "py-12 bg-slate-900/30" : "py-12 bg-gray-50"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              O Que Dizem Nossos Clientes
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Depoimentos de gestores públicos que transformaram sua gestão com a JEOS
            </p>
          </div>

          {/* Carrossel */}
          <div className="relative">
            {/* Botão anterior */}
            {depoimentos.length > 3 && <button
              onClick={() => goToTestimonial("prev")}
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                  : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
              }`}
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>}

            {/* Cards visíveis */}
            <div
              className="grid md:grid-cols-3 gap-8 overflow-hidden items-stretch"
              style={{
                opacity: testimonialAnimating ? 0 : 1,
                transform: testimonialAnimating ? "translateY(10px)" : "translateY(0)",
                transition: "opacity 0.3s ease, transform 0.3s ease",
              }}
            >
              {[0, 1, 2].map(offset => {
                const testimonial = depoimentos[(testimonialIdx + offset) % depoimentos.length];
                if (!testimonial) return null;
                return (
                  <Card
                    key={`${testimonialIdx}-${offset}`}
                    className={`flex flex-col h-full ${isDarkMode
                      ? "bg-slate-900/50 border-purple-500/20"
                      : "bg-white border-gray-200 shadow-lg"
                    }`}
                  >
                    <CardContent className="p-6 flex flex-col flex-1">
                      <Quote className={isDarkMode ? "w-10 h-10 text-purple-400 mb-4" : "w-10 h-10 text-purple-600 mb-4"} />
                      <p className={isDarkMode ? "text-gray-300 mb-6 italic flex-1" : "text-gray-700 mb-6 italic flex-1"}>
                        "{testimonial.testimonial}"
                      </p>
                      <div className="flex items-center gap-3 mt-auto">
                        <ImageWithFallback
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-purple-500 flex-shrink-0"
                        />
                        <div>
                          <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>
                            {testimonial.name}
                          </p>
                          <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>
                            {testimonial.role}
                          </p>
                          <p className={isDarkMode ? "text-gray-500 text-xs" : "text-gray-500 text-xs"}>
                            {testimonial.city}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Botão próximo */}
            {depoimentos.length > 3 && <button
              onClick={() => goToTestimonial("next")}
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 cursor-pointer ${
                isDarkMode
                  ? "bg-slate-800 border border-purple-500/40 text-purple-400 hover:bg-slate-700"
                  : "bg-white border border-purple-300 text-purple-600 hover:bg-purple-50"
              }`}
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>}
          </div>

          {/* Indicadores (dots) */}
          {depoimentos.length > 3 && <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: Math.ceil(depoimentos.length / 3) }).map((_, page) => (
              <button
                key={page}
                onClick={() => {
                  setTestimonialAnimating(true);
                  setTimeout(() => {
                    setTestimonialIdx(page * 3);
                    setTestimonialAnimating(false);
                  }, 300);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  Math.floor(testimonialIdx / 3) === page
                    ? "bg-gradient-to-r from-purple-500 to-cyan-500 scale-125"
                    : isDarkMode
                      ? "bg-slate-600 hover:bg-slate-500"
                      : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Página ${page + 1}`}
              />
            ))}
          </div>}
        </div>
      </section>

      {/* Modal Fullscreen - Meu Contrato */}
      {currentModal === 'contract' && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Meus Contratos</h1>
                  <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>{loggedEnt?.nome ?? ""} · CNPJ: {loggedSec?.cnpj ?? ""}</p>
                </div>
                <Button variant="outline" onClick={() => setCurrentModal(null)} className={isDarkMode ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10" : "border-purple-500 text-purple-600 hover:bg-purple-50"}>Fechar</Button>
              </div>
              {(() => {
                const pD = (d: string) => { const [dd,mm,yyyy] = d.split("/"); return new Date(Number(yyyy),Number(mm)-1,Number(dd)); };
                const dR = (enc: string) => { try { return Math.ceil((pD(enc).getTime()-new Date().setHours(0,0,0,0))/86400000); } catch { return null; } };
                const vT = (enc: string) => { const d=dR(enc); if(d===null) return null; if(d<0) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-500/20 text-red-400">Encerrado</span>; if(d<=90) return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-yellow-500/20 text-yellow-400">{d}d restantes</span>; return <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/20 text-green-400">{d}d restantes</span>; };
                const vG = (vm: string, qm: string) => { const v=parseFloat(vm.replace(/[^\d.,]/g,"").replace(",",".")); const q=parseInt(qm); return (!isNaN(v)&&!isNaN(q))?`R$ ${(v*q).toLocaleString("pt-BR",{minimumFractionDigits:2})}`:"—"; };
                return (
                  <div className="space-y-6">
                    {(loggedSec?.contratos ?? []).length === 0 && <p className={`text-center py-16 ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Nenhum contrato disponível.</p>}
                    {(loggedSec?.contratos ?? []).map((ct, ci) => (
                      <Card key={ct.id} className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                        <CardHeader className="pb-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>Contrato Nº {ct.numero || `${ci + 1}`}</CardTitle>
                            {ct.dataEncerramento && vT(ct.dataEncerramento)}
                          </div>
                          {ct.objeto && <p className={`text-sm mt-1 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>{ct.objeto}</p>}
                          {ct.numeroLicitacao && <p className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>Licitação/Dispensa: {ct.numeroLicitacao}</p>}
                        </CardHeader>
                        <CardContent className="space-y-5">
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[["Data Inicial",ct.dataInicial],["Data Encerramento",ct.dataEncerramento],["Qtd. Meses",ct.quantidadeMeses]].map(([l,v])=>(
                              <div key={l}><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>{l}</p><p className={`font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>{v || "—"}</p></div>
                            ))}
                            <div><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Valor Mensal</p><p className={`font-bold text-lg ${isDarkMode ? "text-cyan-400" : "text-purple-600"}`}>R$ {ct.valorMensal || "—"}</p></div>
                            <div><p className={`text-xs ${isDarkMode ? "text-gray-500" : "text-gray-400"}`}>Valor Global</p><p className={`font-bold text-lg ${isDarkMode ? "text-cyan-400" : "text-purple-600"}`}>{vG(ct.valorMensal, ct.quantidadeMeses)}</p></div>
                          </div>
                          {ct.arquivo && (
                            <a href={ct.arquivo} download={`Contrato-${ct.numero}.pdf`} className="inline-flex">
                              <Button size="sm" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                                <Download className="w-4 h-4 mr-2" /> Baixar PDF do Contrato
                              </Button>
                            </a>
                          )}
                          {ct.aditivos.length > 0 && (
                            <div>
                              <p className={`text-sm font-semibold mb-2 ${isDarkMode ? "text-gray-300" : "text-slate-700"}`}>Aditivos ({ct.aditivos.length})</p>
                              <div className="space-y-2">
                                {ct.aditivos.map((ad, ai) => (
                                  <div key={ad.id} className={`rounded-lg p-3 ${isDarkMode ? "bg-slate-800 border border-purple-500/10" : "bg-gray-50 border border-gray-200"}`}>
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="flex items-center gap-1.5 flex-wrap mb-1">
                                          {ad.numero && <span className={`text-xs font-semibold ${isDarkMode ? "text-white" : "text-slate-900"}`}>Aditivo Nº {ad.numero}</span>}
                                          {ad.tipos.map(t => <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-medium ${t==="Prazo" ? "bg-blue-500/20 text-blue-400" : t==="Acréscimo" ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400"}`}>{t}</span>)}
                                        </div>
                                        {ad.objeto && <p className={`text-xs font-medium mb-0.5 ${isDarkMode ? "text-gray-200" : "text-slate-700"}`}>{ad.objeto}</p>}
                                        <p className={`text-xs ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}>
                                          {ad.dataInicial} → {ad.dataEncerramento}
                                          {(ad.tipos.includes("Acréscimo")||ad.tipos.includes("Redução")) && ad.novoValorMensal && <span> · Novo valor: R$ {ad.novoValorMensal}</span>}
                                        </p>
                                      </div>
                                      {ad.arquivo && (
                                        <a href={ad.arquivo} download={`Aditivo-${ci+1}-${ai+1}.pdf`}>
                                          <Button size="sm" variant="outline" className={`text-xs h-7 ${isDarkMode ? "border-purple-500/30 text-purple-400" : "border-purple-300 text-purple-600"}`}>
                                            <Download className="w-3 h-3 mr-1" /> PDF
                                          </Button>
                                        </a>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                    <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                      <CardHeader>
                        <CardTitle className={isDarkMode ? "text-white flex items-center gap-2" : "text-slate-900 flex items-center gap-2"}>
                          <Package className="w-6 h-6 text-purple-400" /> Sistemas Contratados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {(loggedSec?.sistemasContratados ?? []).map((sistema, index) => (
                            <div key={index} className={isDarkMode ? "flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-purple-500/10" : "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"}>
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded"><CheckCircle2 className="w-5 h-5 text-white" /></div>
                                <div>
                                  <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{sistema.nome}</p>
                                  <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Início: {sistema.dataInicio}</p>
                                </div>
                              </div>
                              <Badge className="bg-green-500 text-white border-none">{sistema.status}</Badge>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Modal Fullscreen - Notas Fiscais */}
      {currentModal === 'invoices' && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Notas Fiscais
                </h1>
                <Button
                  variant="outline"
                  onClick={() => setCurrentModal(null)}
                  className={isDarkMode 
                    ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50"
                  }
                >
                  Fechar
                </Button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(loggedSec?.notasFiscais ?? []).map((nf, index) => (
                  <Card 
                    key={index}
                    className={isDarkMode 
                      ? "bg-slate-900/50 border-purple-500/20"
                      : "bg-white border-gray-200 shadow-lg"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                          {nf.numero}
                        </CardTitle>
                        <Badge className="bg-green-500 text-white border-none">
                          {nf.status}
                        </Badge>
                      </div>
                      <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        Emissão: {nf.data}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Valor Total</p>
                        <p className={isDarkMode ? "text-cyan-400 font-semibold text-2xl" : "text-purple-600 font-semibold text-2xl"}>
                          {nf.valor}
                        </p>
                      </div>
                      {nf.arquivo ? (
                        <a href={nf.arquivo} download={`${nf.numero}.pdf`}>
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar NF
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 opacity-40 cursor-not-allowed">
                          <Download className="w-4 h-4 mr-2" />
                          Arquivo não disponível
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fullscreen - Relatórios */}
      {currentModal === 'reports' && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Relatórios
                </h1>
                <Button
                  variant="outline"
                  onClick={() => setCurrentModal(null)}
                  className={isDarkMode 
                    ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50"
                  }
                >
                  Fechar
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {(loggedSec?.relatorios ?? []).map((relatorio, index) => (
                  <Card 
                    key={index}
                    className={isDarkMode 
                      ? "bg-slate-900/50 border-purple-500/20"
                      : "bg-white border-gray-200 shadow-lg"
                    }
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                          {relatorio.titulo}
                        </CardTitle>
                        <Badge variant="outline" className={isDarkMode ? "border-purple-500/50 text-purple-400" : "border-purple-500 text-purple-600"}>
                          {relatorio.tipo}
                        </Badge>
                      </div>
                      <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                        Gerado em: {relatorio.data}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {relatorio.arquivo ? (
                        <a href={relatorio.arquivo} download={`${relatorio.titulo}.pdf`}>
                          <Button 
                            className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Baixar Relatório
                          </Button>
                        </a>
                      ) : (
                        <Button disabled className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 opacity-40 cursor-not-allowed">
                          <Download className="w-4 h-4 mr-2" />
                          Arquivo não disponível
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Fullscreen - Configurações */}
      {currentModal === 'settings' && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Configurações da Conta
                </h1>
                <Button
                  variant="outline"
                  onClick={() => setCurrentModal(null)}
                  className={isDarkMode 
                    ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                    : "border-purple-500 text-purple-600 hover:bg-purple-50"
                  }
                >
                  Fechar
                </Button>
              </div>

              <div className="space-y-6">
                {/* Informações Pessoais */}
                <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                      Informações Pessoais
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                      <ImageWithFallback 
                        src={loggedInUser?.foto ?? loggedSec?.foto ?? ""}
                        alt={loggedInUser?.nome ?? ""}
                        className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
                      />
                      <div>
                        <p className={isDarkMode ? "text-white font-semibold text-lg" : "text-slate-900 font-semibold text-lg"}>
                          {loggedInUser?.nome ?? ""}
                        </p>
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          {loggedInUser?.cargo ?? ""}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={loggedInUser?.nome ?? ""}
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                      />
                    </div>

                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        E-mail
                      </label>
                      <input
                        type="email"
                        defaultValue={loggedInUser?.login ?? ""}
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                      />
                    </div>

                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Telefone
                      </label>
                      <input
                        type="tel"
                        defaultValue={loggedInUser?.telefone ?? loggedSec?.telefone ?? ""}
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                      />
                    </div>

                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      Salvar Alterações
                    </Button>
                  </CardContent>
                </Card>

                {/* Alterar Senha */}
                <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                      Alterar Senha
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Senha Atual
                      </label>
                      <input
                        type="password"
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Nova Senha
                      </label>
                      <input
                        type="password"
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                        placeholder="••••••••"
                      />
                    </div>

                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Confirmar Nova Senha
                      </label>
                      <input
                        type="password"
                        className={isDarkMode 
                          ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                        }
                        placeholder="••••••••"
                      />
                    </div>

                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      Alterar Senha
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login Admin */}
      {showAdminLogin && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className={isDarkMode ? "bg-slate-900 border-orange-500/30 w-full max-w-md" : "bg-white border-gray-200 w-full max-w-md shadow-2xl"}>
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg">
                  <Settings className="w-5 h-5 text-white" />
                </div>
                <CardTitle className={isDarkMode ? "text-white text-2xl" : "text-slate-900 text-2xl"}>
                  Acesso Administrativo
                </CardTitle>
              </div>
              <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Restrito a administradores do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>Usuário</label>
                  <input type="text" value={adminUser} onChange={e => setAdminUser(e.target.value)}
                    className={isDarkMode ? "w-full p-3 bg-slate-800 border border-orange-500/20 rounded-lg text-white focus:outline-none focus:border-orange-500" : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"}
                    placeholder="admin" required />
                </div>
                <div>
                  <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>Senha</label>
                  <input type="password" value={adminPass} onChange={e => setAdminPass(e.target.value)}
                    className={isDarkMode ? "w-full p-3 bg-slate-800 border border-orange-500/20 rounded-lg text-white focus:outline-none focus:border-orange-500" : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500"}
                    placeholder="••••••••" required />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700">
                    <LogIn className="w-4 h-4 mr-2" />Entrar
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowAdminLogin(false)}
                    className={isDarkMode ? "border-orange-500/50 text-orange-400 hover:bg-orange-500/10" : "border-orange-500 text-orange-600 hover:bg-orange-50"}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <Card className={isDarkMode ? "bg-slate-900 border-purple-500/20 w-full max-w-md" : "bg-white border-gray-200 w-full max-w-md shadow-2xl"}>
            <CardHeader>
              <CardTitle className={isDarkMode ? "text-white text-2xl" : "text-slate-900 text-2xl"}>
                Portal do Cliente
              </CardTitle>
              <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                Faça login para acessar informações do seu contrato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => { setLoginEmail(e.target.value); setLoginError(""); }}
                    className={`w-full p-3 rounded-lg focus:outline-none transition ${loginError ? "border-2 border-red-500 bg-red-500/5" : isDarkMode ? "bg-slate-800 border border-purple-500/20 focus:border-purple-500 text-white" : "bg-white border border-gray-300 focus:border-purple-500 text-slate-900"}`}
                    placeholder="seu.email@exemplo.com.br"
                    required
                  />
                </div>
                <div>
                  <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                    Senha
                  </label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError(""); }}
                    className={`w-full p-3 rounded-lg focus:outline-none transition ${loginError ? "border-2 border-red-500 bg-red-500/5" : isDarkMode ? "bg-slate-800 border border-purple-500/20 focus:border-purple-500 text-white" : "bg-white border border-gray-300 focus:border-purple-500 text-slate-900"}`}
                    placeholder="••••••••"
                    required
                  />
                </div>

                {/* Erro inline */}
                {loginError && (
                  <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/40 rounded-xl px-4 py-3">
                    <span className="text-red-400 text-lg leading-none mt-0.5">&#9888;</span>
                    <p className="text-red-400 text-sm font-medium leading-snug">{loginError}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Entrar
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setShowLoginModal(false); setLoginError(""); }}
                    className={isDarkMode 
                      ? "border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      : "border-purple-500 text-purple-600 hover:bg-purple-50"
                    }
                  >
                    Cancelar
                  </Button>
                </div>
                <p className={isDarkMode ? "text-gray-400 text-xs text-center mt-4" : "text-gray-600 text-xs text-center mt-4"}>
                  Esqueceu sua senha? Entre em contato com nosso suporte.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Call to Action */}
      <section id="cta" className="py-10">
        <div className="container mx-auto px-4">
          <div className={isDarkMode 
            ? "bg-gradient-to-r from-purple-900/50 via-slate-900/50 to-cyan-900/50 rounded-2xl p-12 border border-purple-500/20 text-center"
            : "bg-gradient-to-r from-purple-100 via-pink-50 to-cyan-100 rounded-2xl p-12 border border-purple-200 text-center"
          }>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 animate-fade-in-up">
              Pronto para Modernizar sua Gestão?
            </h2>
            <p className={isDarkMode ? "text-gray-300 text-lg mb-8 max-w-2xl mx-auto" : "text-gray-700 text-lg mb-8 max-w-2xl mx-auto"}>
              Entre em contato conosco e descubra como nossas soluções podem transformar a administração pública da sua instituição
            </p>
            {savedSiteContent.whatsapp ? (
              <a
                href={`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-12 cursor-pointer">
                  Solicitar Contato
                </Button>
              </a>
            ) : (
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-12">
                Solicitar Contato
              </Button>
            )}
          </div>
        </div>
      </section>
      </>}

      {/* Footer */}
      <footer id="contato" className={isDarkMode
        ? "bg-slate-950 border-t border-purple-500/20 py-8"
        : "bg-slate-900 text-white border-t border-slate-800 py-8"
      }>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
            {/* Logo + slogan */}
            <div className="flex items-center gap-4">
              <img src={isDarkMode ? logoJeosBranca : logoJeosPreta} alt="JEOS" className="h-14" />
              <p className={isDarkMode ? "text-gray-400 text-sm max-w-xs" : "text-gray-300 text-sm max-w-xs"}>
                Soluções inteligentes para a gestão pública moderna
              </p>
            </div>
            {/* Links rápidos */}
            <nav className="flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
              <button onClick={() => { setCurrentPage("sobre"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition cursor-pointer" : "text-gray-300 hover:text-cyan-400 transition cursor-pointer"}>Sobre</button>
              <button onClick={() => { setCurrentPage("home"); setTimeout(() => document.getElementById("clientes")?.scrollIntoView({ behavior: "smooth" }), 50); }} className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition cursor-pointer" : "text-gray-300 hover:text-cyan-400 transition cursor-pointer"}>Clientes</button>
              <button onClick={() => { setCurrentPage("certidoes"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition cursor-pointer" : "text-gray-300 hover:text-cyan-400 transition cursor-pointer"}>Certidões</button>
              <button onClick={() => { setCurrentPage("blog"); window.scrollTo(0,0); }} className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition cursor-pointer" : "text-gray-300 hover:text-cyan-400 transition cursor-pointer"}>Blog</button>
              <button onClick={() => { if(savedSiteContent.whatsapp) window.open(`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`, "_blank"); }} className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition cursor-pointer" : "text-gray-300 hover:text-cyan-400 transition cursor-pointer"}>Trabalhe Conosco</button>
            </nav>
            {/* Contato */}
            <div className="flex flex-col gap-1 text-sm">
              {savedSiteContent.contatoTelefone && <span className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}><Phone className="w-3.5 h-3.5 text-purple-400" />{savedSiteContent.contatoTelefone}</span>}
              {savedSiteContent.contatoEmail && <span className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}><Mail className="w-3.5 h-3.5 text-purple-400" />{savedSiteContent.contatoEmail}</span>}
              {savedSiteContent.contatoEndereco && <span className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}><MapPin className="w-3.5 h-3.5 text-purple-400" />{savedSiteContent.contatoEndereco}</span>}
            </div>
          </div>
          <div className={isDarkMode ? "border-t border-purple-500/20 pt-5 flex flex-col items-center gap-3" : "border-t border-slate-800 pt-5 flex flex-col items-center gap-3"}>
            <div className="flex justify-center gap-4">
              {savedSiteContent.facebook && (<a href={savedSiteContent.facebook} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Facebook className="w-4 h-4 text-white" /></a>)}
              {savedSiteContent.instagram && (<a href={savedSiteContent.instagram} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Instagram className="w-4 h-4 text-white" /></a>)}
              {savedSiteContent.whatsapp && (<a href={`https://wa.me/${savedSiteContent.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><MessageCircle className="w-4 h-4 text-white" /></a>)}
              {savedSiteContent.youtube && (<a href={savedSiteContent.youtube} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Youtube className="w-4 h-4 text-white" /></a>)}
              {savedSiteContent.linkedin && (<a href={savedSiteContent.linkedin} target="_blank" rel="noopener noreferrer" className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"><Linkedin className="w-4 h-4 text-white" /></a>)}
            </div>
            <div className="flex flex-col items-center gap-0.5">
              <p className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-300 text-xs"}>
                © 2026 JEOS Sistemas e Governo. Todos os direitos reservados.
              </p>
              {(savedSiteContent as typeof defaultSiteContent).cnpj && (
                <p className={isDarkMode ? "text-gray-500 text-xs" : "text-gray-400 text-xs"}>
                  CNPJ: {(savedSiteContent as typeof defaultSiteContent).cnpj}
                </p>
              )}
            </div>
            <button onClick={() => setShowAdminLogin(true)} className="flex items-center gap-1 text-xs text-gray-600 hover:text-orange-400 transition cursor-pointer opacity-40 hover:opacity-100">
              <Settings className="w-3 h-3" /> Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
