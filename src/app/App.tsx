import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import { Users, FileText, Inbox, Calculator, Package, CheckCircle2, Phone, Mail, MapPin, Briefcase, Shield, Headphones, TrendingUp, Award, Sun, Moon, Facebook, Instagram, Linkedin, Youtube, MessageCircle, Quote, Download, FileCheck, Lock, LogIn, LogOut, Eye, DollarSign, Calendar } from "lucide-react";
import { ImageWithFallback } from "./components/figma/ImageWithFallback";
import logoJeosColorida from "figma:asset/6add02d66dfe0101a31b4dcc0de6bbf011fe3a24.png";
import logoJeosBranca from "figma:asset/cee7a8f2e35fcd5bb9a9d1a2fe270accb056d247.png";
import logoJeosPreta from "figma:asset/431623e1ecb5c4131a0a17893d5b9cefa51dd9a6.png";
import { useState } from "react";

export default function App() {
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentModal, setCurrentModal] = useState<string | null>(null); // 'contract', 'invoices', 'reports', 'settings'

  // Dados mockados do cliente logado
  const clientData = {
    orgao: "Prefeitura Municipal de Santos",
    cnpj: "12.345.678/0001-90",
    responsavel: "Maria Silva",
    cargo: "Secretária de Finanças",
    email: "maria.silva@santos.sp.gov.br",
    telefone: "(13) 3222-3333",
    foto: "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80",
    sistemasContratados: [
      { nome: "Contabilidade Pública", status: "Ativo", dataInicio: "01/01/2023" },
      { nome: "Recursos Humanos", status: "Ativo", dataInicio: "01/01/2023" },
      { nome: "Tributação Municipal", status: "Ativo", dataInicio: "15/06/2023" }
    ],
    contrato: {
      numero: "2023/001-JEOS",
      vigencia: "01/01/2023 até 31/12/2025",
      valorMensal: "R$ 15.500,00",
      valorAnual: "R$ 186.000,00",
      dataEncerramento: "31/12/2025"
    },
    notasFiscais: [
      { numero: "NF-2024/001", data: "05/01/2024", valor: "R$ 15.500,00", status: "Pago" },
      { numero: "NF-2023/012", data: "05/12/2023", valor: "R$ 15.500,00", status: "Pago" },
      { numero: "NF-2023/011", data: "05/11/2023", valor: "R$ 15.500,00", status: "Pago" }
    ],
    relatorios: [
      { titulo: "Relatório de Uso - Dezembro 2023", data: "15/01/2024", tipo: "Uso do Sistema" },
      { titulo: "Relatório de Atendimentos - Dezembro 2023", data: "15/01/2024", tipo: "Suporte" },
      { titulo: "Relatório de Conformidade - 4º Trimestre 2023", data: "20/12/2023", tipo: "Compliance" }
    ]
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulação de login - em produção, validar com backend
    if (loginEmail && loginPassword) {
      setIsLoggedIn(true);
      setShowLoginModal(false);
      setLoginEmail("");
      setLoginPassword("");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowUserMenu(false);
    setCurrentModal(null);
  };

  const products = [
    {
      id: "contabilidade",
      title: "Contabilidade Pública",
      icon: Calculator,
      description: "Solução completa para gestão contábil e financeira de órgãos públicos",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      features: [
        "Conformidade total com a Lei de Responsabilidade Fiscal (LRF)",
        "Emissão automática de relatórios contábeis e balanços",
        "Controle orçamentário e financeiro integrado",
        "SICONFI e SIOPE - Transmissão automática",
        "Plano de Contas Aplicado ao Setor Público (PCASP)"
      ]
    },
    {
      id: "rh",
      title: "Recursos Humanos",
      icon: Users,
      description: "Gestão completa de pessoal e folha de pagamento para o setor público",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      features: [
        "Folha de pagamento com cálculos automatizados",
        "Controle de ponto eletrônico e banco de horas",
        "Gestão de benefícios e vantagens",
        "Portal do servidor para consultas online",
        "Integração com eSocial e DIRF"
      ]
    },
    {
      id: "licitacoes",
      title: "Licitações e Contratos",
      icon: FileText,
      description: "Gerenciamento completo de processos licitatórios e contratos administrativos",
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
      features: [
        "Controle de todas as modalidades de licitação",
        "Gestão completa de contratos e aditivos",
        "Portal de transparência integrado",
        "Cadastro de fornecedores e documentação",
        "Alertas automáticos de prazos e vencimentos"
      ]
    },
    {
      id: "protocolo",
      title: "Protocolo e Documentos",
      icon: Inbox,
      description: "Gestão digital de processos, documentos e tramitação",
      image: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=800&q=80",
      features: [
        "Protocolo digital e físico integrados",
        "Tramitação e acompanhamento de processos",
        "Gestão eletrônica de documentos (GED)",
        "Assinatura digital e certificação",
        "Consulta pública de processos"
      ]
    },
    {
      id: "tributacao",
      title: "Tributação Municipal",
      icon: Calculator,
      description: "Solução completa para arrecadação e fiscalização tributária",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
      features: [
        "Gestão de IPTU, ISS, ITBI e taxas diversas",
        "Cadastro imobiliário e cadastro econômico",
        "Emissão de guias e carnês automatizada",
        "Integração com bancos e PIX",
        "Nota Fiscal Eletrônica de Serviços (NFS-e)"
      ]
    },
    {
      id: "patrimonio",
      title: "Patrimônio e Almoxarifado",
      icon: Package,
      description: "Controle total de bens patrimoniais e estoque de materiais",
      image: "https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80",
      features: [
        "Cadastro e tombamento de bens patrimoniais",
        "Controle de depreciação e reavaliação",
        "Gestão de almoxarifado e estoque",
        "Inventário com leitura de código de barras",
        "Transferência e movimentação de bens"
      ]
    }
  ];

  return (
    <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
      {/* Header */}
      <header className={isDarkMode 
        ? "bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white py-4 shadow-2xl border-b border-purple-500/20 sticky top-0 z-50"
        : "bg-white text-slate-900 py-4 shadow-lg border-b border-gray-200 sticky top-0 z-50"
      }>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <img src={logoJeosColorida} alt="JEOS Sistemas e Governo" className="h-16 w-auto" />
            <nav className="hidden md:flex gap-6 items-center">
              <a href="#inicio" className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition" : "text-gray-700 hover:text-purple-600 transition"}>Início</a>
              <a href="#solucoes" className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition" : "text-gray-700 hover:text-purple-600 transition"}>Soluções</a>
              <a href="#sobre" className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition" : "text-gray-700 hover:text-purple-600 transition"}>Sobre</a>
              <a href="#certidoes" className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition" : "text-gray-700 hover:text-purple-600 transition"}>Certidões</a>
              <a href="#contato" className={isDarkMode ? "text-gray-300 hover:text-cyan-400 transition" : "text-gray-700 hover:text-purple-600 transition"}>Contato</a>
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
                    className="flex items-center gap-3 hover:opacity-80 transition"
                  >
                    <ImageWithFallback 
                      src={clientData.foto}
                      alt={clientData.responsavel}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-500"
                    />
                    <div className="hidden md:block text-left">
                      <p className={isDarkMode ? "text-white text-sm font-semibold" : "text-slate-900 text-sm font-semibold"}>
                        {clientData.responsavel}
                      </p>
                      <p className={isDarkMode ? "text-gray-400 text-xs" : "text-gray-600 text-xs"}>
                        {clientData.cargo}
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
                          {clientData.responsavel}
                        </p>
                        <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>
                          {clientData.orgao}
                        </p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setCurrentModal('contract');
                            setShowUserMenu(false);
                          }}
                          className={isDarkMode 
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700"
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
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700"
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
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700"
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
                            ? "w-full px-4 py-3 text-left hover:bg-purple-500/10 transition flex items-center gap-3 text-gray-300"
                            : "w-full px-4 py-3 text-left hover:bg-purple-50 transition flex items-center gap-3 text-gray-700"
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
                            ? "w-full px-4 py-3 text-left hover:bg-red-500/10 transition flex items-center gap-3 text-red-400"
                            : "w-full px-4 py-3 text-left hover:bg-red-50 transition flex items-center gap-3 text-red-600"
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
              
              <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 hidden md:block">
                Solicitar Demonstração
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative py-20 md:py-32 overflow-hidden">
        <div className={isDarkMode 
          ? "absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-950 to-cyan-900/20" 
          : "absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-cyan-50"
        }></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">
              Transformando a Gestão Pública com Tecnologia
            </h1>
            <p className={isDarkMode ? "text-xl text-gray-300 mb-8 leading-relaxed" : "text-xl text-gray-700 mb-8 leading-relaxed"}>
              Há mais de 15 anos desenvolvendo soluções inovadoras para municípios, estados e órgãos públicos em todo o Brasil
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-8">
                Conheça Nossas Soluções
              </Button>
              <Button size="lg" variant="outline" className={isDarkMode 
                ? "border-purple-500 text-purple-400 hover:bg-purple-500/10 text-lg px-8"
                : "border-purple-500 text-purple-600 hover:bg-purple-50 text-lg px-8"
              }>
                Fale com Especialista
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className={isDarkMode ? "py-16 bg-slate-900/30" : "py-16 bg-gray-50"}>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className={isDarkMode ? "text-cyan-400 mb-2" : "text-purple-600 mb-2"}>+15 Anos</h3>
              <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>de Experiência</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className={isDarkMode ? "text-cyan-400 mb-2" : "text-purple-600 mb-2"}>+500 Clientes</h3>
              <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>em Todo o Brasil</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Headphones className="w-8 h-8 text-white" />
              </div>
              <h3 className={isDarkMode ? "text-cyan-400 mb-2" : "text-purple-600 mb-2"}>Suporte 24/7</h3>
              <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Atendimento Contínuo</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className={isDarkMode ? "text-cyan-400 mb-2" : "text-purple-600 mb-2"}>Certificado</h3>
              <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Segurança e Compliance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Soluções */}
      <section id="solucoes" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
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
                  className={isDarkMode 
                    ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all cursor-pointer group"
                    : "bg-white border-gray-200 hover:border-purple-400 transition-all cursor-pointer group shadow-md hover:shadow-xl"
                  }
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
                    <Button 
                      variant="outline" 
                      className={isDarkMode 
                        ? "w-full border-purple-500/50 text-purple-400 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:text-white hover:border-transparent"
                        : "w-full border-purple-500 text-purple-600 hover:bg-gradient-to-r hover:from-purple-600 hover:to-cyan-600 hover:text-white hover:border-transparent"
                      }
                    >
                      Saiba Mais
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Detalhes do Produto Selecionado */}
          {selectedProduct && (
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
                    ? "aspect-video bg-slate-800 rounded-lg overflow-hidden border border-purple-500/20"
                    : "aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                  }>
                    <ImageWithFallback 
                      src={products.find(p => p.id === selectedProduct)?.image || ""} 
                      alt={products.find(p => p.id === selectedProduct)?.title || ""}
                      className="w-full h-full object-cover"
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
                  <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
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
          )}
        </div>
      </section>

      {/* Sobre Nós */}
      <section id="sobre" className={isDarkMode ? "py-20 bg-slate-900/30" : "py-20 bg-gray-50"}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                Sobre a JEOS
              </h2>
              <p className={isDarkMode ? "text-gray-300 mb-6 leading-relaxed" : "text-gray-700 mb-6 leading-relaxed"}>
                A JEOS Sistemas e Governo é referência nacional no desenvolvimento de soluções tecnológicas para gestão pública. Com mais de 15 anos de experiência, atendemos centenas de municípios, estados e órgãos públicos em todo o Brasil.
              </p>
              <p className={isDarkMode ? "text-gray-300 mb-6 leading-relaxed" : "text-gray-700 mb-6 leading-relaxed"}>
                Nosso compromisso é fornecer sistemas robustos, seguros e totalmente adequados às exigências legais, sempre com foco na eficiência e transparência da gestão pública.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className={isDarkMode ? "text-white font-semibold mb-1" : "text-slate-900 font-semibold mb-1"}>Inovação Constante</h4>
                    <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Atualizações frequentes seguindo as mudanças da legislação</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className={isDarkMode ? "text-white font-semibold mb-1" : "text-slate-900 font-semibold mb-1"}>Segurança Garantida</h4>
                    <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Proteção de dados e compliance com LGPD</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded">
                    <Headphones className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className={isDarkMode ? "text-white font-semibold mb-1" : "text-slate-900 font-semibold mb-1"}>Suporte Especializado</h4>
                    <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Equipe técnica qualificada disponível sempre que precisar</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className={isDarkMode 
                ? "aspect-square bg-slate-800 rounded-2xl overflow-hidden border border-purple-500/20"
                : "aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200"
              }>
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80" 
                  alt="Equipe JEOS"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-purple-600 to-cyan-600 p-8 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white mb-1">500+</div>
                  <div className="text-white text-sm">Clientes Ativos</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Órgãos que Usam Nossos Sistemas */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Quem Confia na JEOS
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Centenas de municípios, câmaras e órgãos públicos em todo o Brasil confiam em nossas soluções
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[
              { name: "Prefeitura Municipal de São Paulo", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
              { name: "Câmara Municipal de Brasília", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
              { name: "Prefeitura de Belo Horizonte", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
              { name: "Governo do Estado do Paraná", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
              { name: "Prefeitura de Salvador", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
              { name: "Câmara de Fortaleza", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
              { name: "Prefeitura de Curitiba", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
              { name: "Tribunal de Contas - MG", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
              { name: "Prefeitura de Recife", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" },
              { name: "Assembleia Legislativa - RS", logo: "https://images.unsplash.com/photo-1763431791977-efa5ea8c7997?w=200&q=80" },
              { name: "Prefeitura de Manaus", logo: "https://images.unsplash.com/photo-1589200412802-8a0fc9ce8875?w=200&q=80" },
              { name: "Câmara de Porto Alegre", logo: "https://images.unsplash.com/photo-1621957674929-39c14c298291?w=200&q=80" }
            ].map((client, index) => (
              <Card 
                key={index} 
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
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className={isDarkMode ? "py-20 bg-slate-900/30" : "py-20 bg-gray-50"}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              O Que Dizem Nossos Clientes
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Depoimentos de gestores públicos que transformaram sua gestão com a JEOS
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria Silva",
                role: "Secretária de Finanças",
                city: "Prefeitura Municipal de Santos",
                testimonial: "A JEOS revolucionou nossa gestão financeira. O sistema de contabilidade é extremamente intuitivo e nos trouxe total conformidade com a legislação vigente.",
                photo: "https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80"
              },
              {
                name: "João Santos",
                role: "Diretor de RH",
                city: "Câmara Municipal de Campinas",
                testimonial: "O suporte da JEOS é excepcional. Sempre que precisamos, a equipe está disponível para nos auxiliar. O sistema de RH facilitou muito nossa rotina.",
                photo: "https://images.unsplash.com/photo-1578758837674-93ed0ab5fbab?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80"
              },
              {
                name: "Ana Oliveira",
                role: "Controladora Geral",
                city: "Prefeitura de Ribeirão Preto",
                testimonial: "Com os sistemas integrados da JEOS, conseguimos aumentar nossa eficiência em 40%. A transparência nos processos melhorou significativamente.",
                photo: "https://images.unsplash.com/photo-1649589244330-09ca58e4fa64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80"
              }
            ].map((testimonial, index) => (
              <Card 
                key={index}
                className={isDarkMode 
                  ? "bg-slate-900/50 border-purple-500/20"
                  : "bg-white border-gray-200 shadow-lg"
                }
              >
                <CardContent className="p-6">
                  <Quote className={isDarkMode ? "w-10 h-10 text-purple-400 mb-4" : "w-10 h-10 text-purple-600 mb-4"} />
                  <p className={isDarkMode ? "text-gray-300 mb-6 italic" : "text-gray-700 mb-6 italic"}>
                    "{testimonial.testimonial}"
                  </p>
                  <div className="flex items-center gap-3">
                    <ImageWithFallback 
                      src={testimonial.photo}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500"
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
            ))}
          </div>
        </div>
      </section>

      {/* Certidões da Empresa */}
      <section id="certidoes" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Certidões e Documentos
            </h2>
            <p className={isDarkMode ? "text-gray-400 text-lg max-w-2xl mx-auto" : "text-gray-600 text-lg max-w-2xl mx-auto"}>
              Transparência e conformidade: acesse nossas certidões e comprovantes de regularidade
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                titulo: "Certidão Negativa de Débitos - Receita Federal",
                validade: "Válida até: 15/06/2024",
                tipo: "Federal"
              },
              {
                titulo: "Certidão Negativa de Débitos - FGTS",
                validade: "Válida até: 20/07/2024",
                tipo: "Trabalhista"
              },
              {
                titulo: "Certidão Negativa de Débitos - Estadual",
                validade: "Válida até: 10/05/2024",
                tipo: "Estadual"
              },
              {
                titulo: "Certidão Negativa de Débitos - Municipal",
                validade: "Válida até: 25/04/2024",
                tipo: "Municipal"
              },
              {
                titulo: "Certidão Negativa Trabalhista - TST",
                validade: "Válida até: 30/06/2024",
                tipo: "Trabalhista"
              },
              {
                titulo: "Registro CNPJ - Receita Federal",
                validade: "Atualizado em: 01/01/2024",
                tipo: "Cadastral"
              }
            ].map((certidao, index) => (
              <Card
                key={index}
                className={isDarkMode 
                  ? "bg-slate-900/50 border-purple-500/20 hover:border-purple-500/50 transition-all"
                  : "bg-white border-gray-200 hover:border-purple-400 transition-all shadow-md hover:shadow-xl"
                }
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg">
                      <FileCheck className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-gradient-to-r from-purple-600 to-cyan-600 text-white border-none">
                      {certidao.tipo}
                    </Badge>
                  </div>
                  <CardTitle className={isDarkMode ? "text-white mt-4" : "text-slate-900 mt-4"}>
                    {certidao.titulo}
                  </CardTitle>
                  <CardDescription className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                    {certidao.validade}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    variant="outline"
                    className={isDarkMode 
                      ? "w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      : "w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                    }
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar Certidão
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Modal Fullscreen - Meu Contrato */}
      {currentModal === 'contract' && (
        <div className="fixed inset-0 bg-black/90 z-50 overflow-y-auto">
          <div className={isDarkMode ? "min-h-screen bg-slate-950" : "min-h-screen bg-white"}>
            <div className="container mx-auto px-4 py-8">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                  Meu Contrato
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

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                      Informações do Contrato
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Órgão</p>
                      <p className={isDarkMode ? "text-white font-semibold text-lg" : "text-slate-900 font-semibold text-lg"}>{clientData.orgao}</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>CNPJ</p>
                      <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{clientData.cnpj}</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Nº do Contrato</p>
                      <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{clientData.contrato.numero}</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Vigência</p>
                      <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{clientData.contrato.vigencia}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                  <CardHeader>
                    <CardTitle className={isDarkMode ? "text-white" : "text-slate-900"}>
                      Valores
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Valor Mensal</p>
                      <p className={isDarkMode ? "text-cyan-400 font-semibold text-2xl" : "text-purple-600 font-semibold text-2xl"}>{clientData.contrato.valorMensal}</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Valor Anual</p>
                      <p className={isDarkMode ? "text-cyan-400 font-semibold text-2xl" : "text-purple-600 font-semibold text-2xl"}>{clientData.contrato.valorAnual}</p>
                    </div>
                    <div>
                      <p className={isDarkMode ? "text-gray-400 text-sm mb-1" : "text-gray-600 text-sm mb-1"}>Data de Encerramento</p>
                      <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{clientData.contrato.dataEncerramento}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className={isDarkMode ? "bg-slate-900/50 border-purple-500/20" : "bg-white border-gray-200 shadow-lg"}>
                <CardHeader>
                  <CardTitle className={isDarkMode ? "text-white flex items-center gap-2" : "text-slate-900 flex items-center gap-2"}>
                    <Package className="w-6 h-6 text-purple-400" />
                    Sistemas Contratados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {clientData.sistemasContratados.map((sistema, index) => (
                      <div 
                        key={index}
                        className={isDarkMode 
                          ? "flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-purple-500/10"
                          : "flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        }
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-600 rounded">
                            <CheckCircle2 className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className={isDarkMode ? "text-white font-semibold" : "text-slate-900 font-semibold"}>{sistema.nome}</p>
                            <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-600 text-sm"}>Início: {sistema.dataInicio}</p>
                          </div>
                        </div>
                        <Badge className="bg-green-500 text-white border-none">
                          {sistema.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Button className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700">
                      <Download className="w-4 h-4 mr-2" />
                      Baixar Contrato Completo (PDF)
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
                {clientData.notasFiscais.map((nf, index) => (
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
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar NF
                      </Button>
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
                {clientData.relatorios.map((relatorio, index) => (
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
                      <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Relatório
                      </Button>
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
                        src={clientData.foto}
                        alt={clientData.responsavel}
                        className="w-20 h-20 rounded-full object-cover border-4 border-purple-500"
                      />
                      <div>
                        <p className={isDarkMode ? "text-white font-semibold text-lg" : "text-slate-900 font-semibold text-lg"}>
                          {clientData.responsavel}
                        </p>
                        <p className={isDarkMode ? "text-gray-400" : "text-gray-600"}>
                          {clientData.cargo}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label className={isDarkMode ? "text-gray-300 text-sm font-medium mb-2 block" : "text-gray-700 text-sm font-medium mb-2 block"}>
                        Nome Completo
                      </label>
                      <input
                        type="text"
                        defaultValue={clientData.responsavel}
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
                        defaultValue={clientData.email}
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
                        defaultValue={clientData.telefone}
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
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className={isDarkMode 
                      ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                    }
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
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className={isDarkMode 
                      ? "w-full p-3 bg-slate-800 border border-purple-500/20 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      : "w-full p-3 bg-white border border-gray-300 rounded-lg text-slate-900 focus:outline-none focus:border-purple-500"
                    }
                    placeholder="••••••••"
                    required
                  />
                </div>
                <div className="flex gap-3 pt-4">
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
                    onClick={() => setShowLoginModal(false)}
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className={isDarkMode 
            ? "bg-gradient-to-r from-purple-900/50 via-slate-900/50 to-cyan-900/50 rounded-2xl p-12 border border-purple-500/20 text-center"
            : "bg-gradient-to-r from-purple-100 via-pink-50 to-cyan-100 rounded-2xl p-12 border border-purple-200 text-center"
          }>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Pronto para Modernizar sua Gestão?
            </h2>
            <p className={isDarkMode ? "text-gray-300 text-lg mb-8 max-w-2xl mx-auto" : "text-gray-700 text-lg mb-8 max-w-2xl mx-auto"}>
              Entre em contato conosco e descubra como nossas soluções podem transformar a administração pública da sua instituição
            </p>
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-lg px-12">
              Solicitar Contato
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contato" className={isDarkMode 
        ? "bg-slate-950 border-t border-purple-500/20 py-12"
        : "bg-slate-900 text-white border-t border-slate-800 py-12"
      }>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <img src={logoJeosColorida} alt="JEOS" className="h-20 mb-4" />
              <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-300 text-sm"}>
                Soluções inteligentes para a gestão pública moderna
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Soluções</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Contabilidade</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Recursos Humanos</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Licitações</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Tributação</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Sobre Nós</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Clientes</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Blog</a></li>
                <li><a href="#" className={isDarkMode ? "text-gray-400 hover:text-cyan-400 transition" : "text-gray-300 hover:text-cyan-400 transition"}>Trabalhe Conosco</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contato</h4>
              <ul className="space-y-3 text-sm">
                <li className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}>
                  <Phone className="w-4 h-4 text-purple-400" />
                  (00) 0000-0000
                </li>
                <li className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}>
                  <Mail className="w-4 h-4 text-purple-400" />
                  contato@jeossistemas.com.br
                </li>
                <li className={isDarkMode ? "flex items-center gap-2 text-gray-400" : "flex items-center gap-2 text-gray-300"}>
                  <MapPin className="w-4 h-4 text-purple-400" />
                  São Paulo - SP
                </li>
              </ul>
            </div>
          </div>
          <div className={isDarkMode ? "border-t border-purple-500/20 pt-8 text-center" : "border-t border-slate-800 pt-8 text-center"}>
            <div className="flex justify-center gap-6 mb-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://wa.me/5500000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <MessageCircle className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Youtube className="w-5 h-5 text-white" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
            <p className={isDarkMode ? "text-gray-400 text-sm" : "text-gray-300 text-sm"}>
              © 2024 JEOS Sistemas e Governo. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}