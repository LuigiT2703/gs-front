# Contrato da API REST: ZelaCidade

Este é o contrato que o front-end (React) consome. Ele foi escrito **antes** da API Java existir. Quem implementar o Java deve seguir exatamente estes nomes de campos, rotas e status. Se algo mudar, avise a equipe do front.

- **Formato:** JSON (`Content-Type: application/json`), campos em camelCase.
- **Datas:** `aaaa-mm-dd`. Data e hora: `aaaa-mm-ddThh:mm:ss`.
- **URL base:** a do Render, por exemplo `https://zelacidade-api.onrender.com`. No front ela fica em `VITE_API_URL`.
- **CORS:** liberar `http://localhost:5173`, `http://localhost:4173` e a URL da Vercel. Métodos `GET, POST, PUT, DELETE, OPTIONS`, header `Content-Type`, e expor o header `Location`.

## Erro padrão
Todo erro (400, 404 e 409) devolve este corpo. O front mostra o campo `mensagem` para o usuário, então escreva frases amigáveis em português.
```json
{ "status": 400, "mensagem": "A gravidade deve ser um número de 1 a 5." }
```

## Enums
| Campo | Valores |
|---|---|
| `categoria` | `BURACO_NA_VIA`, `ILUMINACAO_PUBLICA`, `LIXO_ENTULHO`, `CALCADA_ACESSIBILIDADE`, `ARVORE_PODA`, `ALAGAMENTO_BUEIRO`, `OUTRO` |
| `status` | `ABERTA`, `EM_ANDAMENTO`, `RESOLVIDA` |

## Objeto `Ocorrencia` (resposta)
```json
{
  "id": 1,
  "categoria": "BURACO_NA_VIA",
  "descricao": "Buraco grande na faixa de ônibus, em frente ao ponto",
  "bairro": "Capão Redondo",
  "gravidade": 4,
  "pessoasAfetadas": 400,
  "pertoServicoEssencial": true,
  "afetaAcessibilidade": false,
  "status": "ABERTA",
  "dataAbertura": "2026-11-07",
  "dataResolucao": null,
  "totalApoios": 3,
  "pontos": 102
}
```
- **Privacidade (LGPD):** o nome de quem registrou e os nomes dos apoiadores **não** aparecem na resposta, só `totalApoios`.
- **`pontos` é opcional.** Se a API devolver, o front usa esse valor. Se não devolver, o front calcula com a mesma regra do motor Python:
  - gravidade×10;
  - mín(pessoas÷10, 20);
  - mín(dias×2, 20);
  - +15 perto de escola ou saúde;
  - +10 acessibilidade;
  - mín(apoios×3, 15).

## Rotas

| Método | Rota | Corpo | Sucesso | Erros |
|---|---|---|---|---|
| GET | `/ocorrencias` | — | 200 + lista de `Ocorrencia` | — |
| GET | `/ocorrencias/{id}` | — | 200 + `Ocorrencia` | 404 |
| POST | `/ocorrencias` | `NovaOcorrencia` | 201 + `Location: /ocorrencias/{id}` + `Ocorrencia` | 400 · 409 |
| PUT | `/ocorrencias/{id}` | `NovaOcorrencia` sem `nomeCidadao` + `status` | 200 + `Ocorrencia` | 400 · 404 · 409 |
| DELETE | `/ocorrencias/{id}` | — | 204 (sem corpo) | 404 · 409 |
| GET | `/ocorrencias/{id}/atualizacoes` | — | 200 + lista de `Atualizacao` | 404 |
| POST | `/ocorrencias/{id}/atualizacoes` | `NovaAtualizacao` | 201 + `Location` + `Atualizacao` | 400 · 404 |
| POST | `/ocorrencias/{id}/apoios` | `{ "nome": "Ana Lima" }` | 201 + `{ "ocorrenciaId": 1, "totalApoios": 4 }` | 400 · 404 · 409 |

> O front usa todas as rotas **menos o PUT**. A mudança de status é feita pelo `POST /atualizacoes`, que guarda o histórico.

### POST `/ocorrencias`: `NovaOcorrencia`
```json
{
  "categoria": "ALAGAMENTO_BUEIRO",
  "descricao": "Bueiro sem tampa na calçada em frente à escola municipal",
  "bairro": "Jardim São Luís",
  "gravidade": 5,
  "pessoasAfetadas": 200,
  "pertoServicoEssencial": true,
  "afetaAcessibilidade": true,
  "nomeCidadao": "Ana Lima"
}
```
- **Validações (400):**
  - `categoria` deve ser válida;
  - `descricao` deve ter de 10 a 300 caracteres;
  - `bairro`, de 3 a 60;
  - `gravidade`, inteiro de 1 a 5;
  - `pessoasAfetadas`, inteiro de 1 a 100.000;
  - os booleanos são obrigatórios;
  - `nomeCidadao`, de 2 a 80.
- **Regras do servidor:**
  - `status` começa como `ABERTA`;
  - `dataAbertura` é hoje;
  - se a categoria for `CALCADA_ACESSIBILIDADE`, `afetaAcessibilidade` é sempre `true` (RN04).
- **409:** já existe uma ocorrência **pendente** com a mesma categoria, o mesmo bairro e a mesma descrição (comparando sem acento e sem diferenciar maiúsculas).
  - Exemplo de mensagem: `"Já existe uma ocorrência igual em aberto (#3). Apoie a ocorrência existente em vez de registrar de novo."`

### DELETE `/ocorrencias/{id}`
- **409:** quando a ocorrência está `RESOLVIDA`, porque ela faz parte do histórico.
  - Mensagem: `"Ocorrências resolvidas fazem parte do histórico e não podem ser excluídas."`
- **O id não é reaproveitado** (RN07): use uma sequence no Oracle.

### POST `/ocorrencias/{id}/atualizacoes`: `NovaAtualizacao`
```json
{ "status": "EM_ANDAMENTO", "comentario": "Equipe agendada para quinta-feira.", "responsavel": "Subprefeitura - drenagem" }
```
- **Resposta `Atualizacao`:**
  `{ "id": 4, "ocorrenciaId": 3, "status": "EM_ANDAMENTO", "comentario": "...", "responsavel": "...", "dataHora": "2026-11-16T18:34:00" }`
- **Efeito na ocorrência:**
  - muda o `status` da ocorrência;
  - se o novo status for `RESOLVIDA`, grava `dataResolucao` com a data de hoje;
  - se a ocorrência for reaberta, `dataResolucao` volta a ser `null` (RN06).
- **400:**
  - status inválido;
  - status igual ao atual (`"A ocorrência já está com o status ABERTA."`);
  - `comentario` com menos de 10 caracteres;
  - `responsavel` com menos de 3.

### POST `/ocorrencias/{id}/apoios`
- **Padronização do nome:** antes de comparar, o servidor deixa o nome em minúsculas e tira os espaços extras.
- **400:** nome com menos de 2 letras.
- **409 (RN05):**
  - quem registrou tenta apoiar: `"Você registrou esta ocorrência, então seu apoio já está contado."`;
  - a pessoa já apoiou: `"Você já apoiou esta ocorrência. Cada pessoa pode apoiar só uma vez."`;
  - a ocorrência está resolvida: `"Ocorrências resolvidas não recebem apoio."`.

## Sugestão de tabelas no Oracle (para a disciplina de banco)
`OCORRENCIA` (1) ─< `ATUALIZACAO` (N) e `OCORRENCIA` (N) >─< (N) `CIDADAO` pela tabela associativa `APOIO` (com UNIQUE em `id_ocorrencia` + `id_cidadao`). Esse UNIQUE garante a RN05 no próprio banco.
