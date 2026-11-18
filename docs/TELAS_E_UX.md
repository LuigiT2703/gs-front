# Telas e UX: ZelaCidade (front-end)

Este documento alimenta a seção 7 (UX e protótipo) do PDF de Engenharia de Software.
- **Prints:** estão em `docs/prints/`, nas pastas `mobile-390x844/`, `tablet-768x1024/` e `desktop-1440x900/`.
- **Estados especiais:** carregando, erro, vazio, sucesso e confirmação estão em `docs/prints/estados/`.
- **HUs:** são as mesmas do backlog do Jira (HU01 a HU15).

## Telas

| # | Tela (rota) | Finalidade | HUs | Prints |
|---|---|---|---|---|
| F1 | Home (`/`) | Explicar o serviço, levar para "Relatar" e mostrar o topo da fila ao vivo | HU01, HU06, HU11 | `01-home` |
| F2 | Fila de ocorrências (`/ocorrencias`) | Lista ordenada por pontos, com filtros por bairro, categoria, status e prioridade | HU04, HU06, HU07 | `02-ocorrencias`, `estados/filtro-sem-resultado`, `estados/vazio`, `estados/carregando`, `estados/erro-requisicao` |
| F3 | Registrar ocorrência (`/ocorrencias/nova`) | Formulário com prévia da prioridade antes de enviar | HU01, HU02, HU03 | `03-registrar`, `estados/registrar-previa`, `registrar-erro-validacao`, `registrar-erro-400`, `registrar-erro-409`, `registrar-sucesso` |
| F4 | Detalhe da ocorrência (`/ocorrencias/:id`) | Pontos explicados, apoiar, atualizar status, histórico e excluir | HU05, HU08, HU09, HU10 | `04-detalhe`, `estados/apoio-erro-409`, `detalhe-status-sucesso`, `excluir-confirmacao`, `excluir-erro-409`, `excluir-sucesso`, `detalhe-404`, `mobile-detalhe-historico` |
| F5 | Painel (`/painel`) | Indicadores para o gestor: totais, urgentes, tempo médio, por bairro e categoria | HU12, HU13 | `05-painel` |
| F6 | Sobre (`/sobre`) | Problema com dados do IBGE, solução, ODS e tecnologias | — | `06-sobre` |
| F7 | Integrantes (`/integrantes`) | Equipe com foto, RM, turma, GitHub e LinkedIn | — | `07-integrantes` |
| F8 | FAQ (`/faq`) | Dúvidas frequentes em sanfona (acordeão) | HU11 | `08-faq` |
| F9 | Contato (`/contato`) | Formulário validado + contatos da equipe | — | `09-contato`, `estados/contato-erro-validacao`, `contato-sucesso` |
| F10 | 404 | Endereço inexistente, com caminho de volta | — | `10-404` |
| F11 | Menu mobile | Navegação no celular e no tablet | — | `11-menu-mobile-aberto` |

## Estados de cada tela que usa a API

| Tela | Carregando | Erro de requisição | Sem dados | Sucesso |
|---|---|---|---|---|
| Home | "Buscando a fila de prioridade…" | Mensagem + "Tentar de novo" | "Nenhuma ocorrência pendente" + "Relatar um problema" | 3 cards do topo da fila |
| Fila | "Carregando ocorrências…" + aviso do Render depois de 4 s | idem | "Ainda não há ocorrências" e "Nada encontrado com esses filtros" + "Limpar filtros" | Lista ordenada; aviso verde depois de excluir |
| Registrar | Botão vira "Registrando…" (desabilitado) | Caixa vermelha com a `mensagem` da API (400/409); no 409, link "Procure na fila e apoie" | — | "Ocorrência #7 registrada!" + "Acompanhar a #7" |
| Detalhe | "Carregando a ocorrência #3…" e "Carregando o histórico…" | 404: "Não encontramos a ocorrência #9999"; outros: "Tentar de novo"; id inválido: "Número de ocorrência inválido" | Histórico: "Ainda não há atualizações da prefeitura…" | "Obrigado pelo apoio! A pontuação foi de 85 para 88." · "Status alterado para…" · volta para a fila com "Ocorrência #7 excluída." |
| Painel | "Calculando os números do painel…" | idem | "O painel ainda está vazio" | KPIs e barras |

## Heurísticas de Nielsen visíveis

| Heurística | Onde aparece |
|---|---|
| 1. Visibilidade do status do sistema | Barra de pontos (0/130) em cada card; status em badge; "Registrando…"; aviso de demora do servidor; contador "5 de 6 ocorrências"; histórico em linha do tempo |
| 2. Correspondência com o mundo real | "Também vi isso" em vez de "apoiar registro"; categorias com ícones (buraco, poste, lixo, cadeirante, árvore, gota); prazos em "até 48 horas" |
| 3. Controle e liberdade do usuário | "Limpar filtros"; "Manter a ocorrência" no diálogo de exclusão; fechar avisos (X); menu fecha com Esc |
| 4. Consistência e padrões | As mesmas cores de prioridade em todas as telas (e no PDF); botão primário verde e ação principal em âmbar; mesmo componente `CardOcorrencia` na Home e na fila |
| 5. Prevenção de erros | Gravidade e sim/não em botões (não dá para digitar valor inválido); calçada marca acessibilidade sozinha; prévia antes de enviar; confirmação antes de excluir; não deixa escolher o mesmo status |
| 6. Reconhecer em vez de lembrar | As 7 categorias à vista com ícone; a legenda da gravidade muda conforme a escolha; "Acompanhar a #7" já com o número |
| 7. Flexibilidade e eficiência | Filtros combináveis; links diretos do painel para cada ocorrência; "Pular para o conteúdo" pelo teclado |
| 8. Estética e design minimalista | Cards com só o essencial (o detalhe completo fica na página da ocorrência); painel com 4 números grandes |
| 9. Ajudar a reconhecer e corrigir erros | Campo vermelho + ícone + frase que diz como corrigir; mensagens da API traduzidas ("Você já apoiou esta ocorrência. Cada pessoa pode apoiar só uma vez.") |
| 10. Ajuda e documentação | FAQ; "Por que essa prioridade?" no detalhe; dicas abaixo dos campos |

## UX Writing

| Elemento | Escolha | Por quê |
|---|---|---|
| Tom de voz | Serviço público amigável: "você", frases curtas, sem "munícipe", "protocolo" ou "requisição" | Público amplo, inclusive idosos, usando o celular na rua |
| Rótulos | "Relatar um problema", "Também vi isso", "Ver a fila de prioridade", "Encaminhar para" | Descrevem a ação do jeito que a pessoa fala |
| Placeholders | Exemplos reais: "Bueiro sem tampa na calçada em frente à escola municipal", "Jardim São Luís" | Mostram o que escrever sem repetir o rótulo |
| Botões | Verbo + objeto: "Confirmar registro", "Salvar status", "Sim, excluir a #7", "Manter a ocorrência" | O botão diz exatamente o que vai acontecer; na ação destrutiva repete o número |
| Erros de preenchimento | O que houve + como resolver: "Conte um pouco mais: escreva pelo menos 10 letras, com o local." | Nunca culpar a pessoa; sempre dar o próximo passo |
| Erros da API | Mostra a `mensagem` do servidor; sem mensagem, usa um padrão por status ("Não encontramos essa ocorrência. Ela pode ter sido excluída.") | O usuário nunca vê "Error 409" cru |
| Sucesso | "Ocorrência #7 registrada!" + "Guarde este número…"; "Obrigado pelo apoio! A pontuação foi de 85 para 88." | Confirma o resultado e mostra o efeito |
| Estados vazios | Convite em vez de lamento: "Que bom! Se você viu algum problema, seja a primeira pessoa a relatar." | Leva para a próxima ação |
| Demora | "A primeira consulta do dia pode levar até 1 minuto, porque o servidor gratuito está acordando. Pode esperar, os dados já vêm." | Explica a espera do Render e evita que a pessoa desista |
| Privacidade | "Usado só para evitar apoio repetido. Não aparece para ninguém." | Explica por que pedimos o nome (LGPD) |

## Referências de inspiração (sem copiar código)
- **Design System do Governo Federal (gov.br):** clareza de formulários, mensagens de alerta com ícone e foco visível.
- **Colab e SP156:** fluxo de relato de zeladoria por categoria.
- **FixMyStreet:** a ideia de evitar duplicadas. No ZelaCidade, o apoio também soma pontos.
- **Land-book e Dribbble (landing pages de serviço público e cidades inteligentes):** hierarquia do hero, com título forte, duas ações e uma ilustração.

Todos os componentes foram escritos do zero com Tailwind. Não usamos template, tema, Tailwind UI, Flowbite, DaisyUI ou qualquer kit de componentes. O logo e as ilustrações são SVG próprios.
