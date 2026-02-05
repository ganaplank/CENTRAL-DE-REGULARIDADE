import { AppData } from './types';

export const DEFAULT_DATA: AppData = [
  {
    id: 'fiscal',
    title: 'Regularidade Fiscal e Cadastral',
    color: 'emerald',
    items: [
      { id: 'f1', name: 'Certidão Federal (Nova)', url: 'https://servicos.receitafederal.gov.br/servico/certidoes/#/home/cnpj', icon: '🏢' },
      { id: 'f2', name: 'Receita (CNPJ)', url: 'https://solucoes.receita.fazenda.gov.br/Servicos/cnpjreva/cnpjreva_solicitacao.asp', icon: '🏢' },
      { id: 'f3', name: 'Caixa (FGTS)', url: 'https://consulta-crf.caixa.gov.br/consultacrf/pages/consultaEmpregador.jsf', icon: '🏦' },
      { id: 'f4', name: 'Pref. SP (DUC)', url: 'https://duc.prefeitura.sp.gov.br/certidoes/forms_anonimo/frmConsultaEmissaoCertificado.aspx', icon: '🏙️' },
      { id: 'f5', name: 'Sefaz SP (Estadual)', url: 'https://www10.fazenda.sp.gov.br/CertidaoNegativaDeb/Pages/EmissaoCertidaoNegativa.aspx', icon: '📍' },
      { id: 'f6', name: 'Jucesp (Ficha)', url: 'https://www.jucesponline.sp.gov.br/Default.aspx', icon: '📂' }
    ]
  },
  {
    id: 'trabalhista',
    title: 'Regularidade Trabalhista',
    color: 'blue',
    items: [
      { id: 't1', name: 'TST (CNDT Nacional)', url: 'https://cndt-certidao.tst.jus.br/inicio.faces', icon: '👷' },
      { id: 't2', name: 'TRT-2 (Regional SP)', url: 'https://pje.trt2.jus.br/certidoes/trabalhista/emissao', icon: '⚖️' }
    ]
  },
  {
    id: 'juridico',
    title: 'Justiça e Protestos',
    color: 'rose',
    items: [
      { id: 'j1', name: 'Falência TJSP', url: 'https://esaj.tjsp.jus.br/sco/abrirCadastro.do', icon: '🏛️' },
      { id: 'j2', name: 'TRF-3 (Federal)', url: 'https://web.trf3.jus.br/certidao-regional/CertidaoCivelEleitoralCriminal/SolicitarDadosCertidao', icon: '⚖️' },
      { id: 'j3', name: 'Protesto (IEPTB)', url: 'https://protestosp.com.br/consulta-de-protesto', icon: '🚫' }
    ]
  }
];