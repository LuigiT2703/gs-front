import type { PerguntaFaq } from '../types/integrante'

export const PERGUNTAS_FAQ: PerguntaFaq[] = [
  {
    pergunta: 'O que é o ZelaCidade?',
    resposta:
      'É um serviço de zeladoria colaborativa: você relata um problema do espaço público (buraco, poste apagado, lixo, calçada quebrada, bueiro entupido), os vizinhos apoiam a mesma ocorrência e o sistema monta uma fila de prioridade transparente para a prefeitura.',
  },
  {
    pergunta: 'Preciso pagar para usar?',
    resposta: 'Não. O cidadão usa de graça. Quem contrata a plataforma é a prefeitura ou a subprefeitura.',
  },
  {
    pergunta: 'Como a prioridade é calculada?',
    resposta:
      'Somamos pontos: gravidade de 1 a 5 vezes 10; 1 ponto a cada 10 pessoas afetadas por dia (até 20); 2 pontos por dia sem solução (até 20); +15 se fica perto de escola, hospital ou posto de saúde; +10 se atrapalha a acessibilidade; +3 por apoio de vizinho (até 15). Com 80 pontos ou mais a ocorrência é URGENTE (até 48 horas); de 55 a 79, ALTA (7 dias); de 30 a 54, MÉDIA (15 dias); abaixo de 30, BAIXA (30 dias).',
  },
  {
    pergunta: 'Vi um problema que alguém já registrou. O que faço?',
    resposta:
      'Abra a ocorrência e use "Também vi isso". Seu apoio soma 3 pontos e evita um registro duplicado. Cada pessoa apoia uma vez só, e quem registrou já conta como apoio.',
  },
  {
    pergunta: 'Por que problemas de calçada já contam como acessibilidade?',
    resposta:
      'Porque uma calçada quebrada ou sem rampa impede a passagem de cadeirantes, idosos e pais com carrinho de bebê. Segundo o IBGE (Censo 2022), só 15,2% dos brasileiros moram em vias com rampa para cadeirantes.',
  },
  {
    pergunta: 'Meu nome aparece para outras pessoas?',
    resposta: 'Não. O nome serve só para evitar apoio repetido. Nas listas e relatórios aparece apenas a quantidade de apoios.',
  },
  {
    pergunta: 'Quem atualiza o status da ocorrência?',
    resposta:
      'A equipe da subprefeitura muda o status para "Em andamento" ou "Resolvida" e deixa um comentário. Tudo fica no histórico da ocorrência.',
  },
  {
    pergunta: 'Por que a página às vezes demora para carregar?',
    resposta:
      'O servidor da API está num plano gratuito que "dorme" quando ninguém usa. A primeira consulta pode levar até 1 minuto; depois fica rápida.',
  },
]
