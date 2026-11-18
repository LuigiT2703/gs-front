# Roteiro do vídeo: Front-End ZelaCidade (até 3 min)

**Regras:**
- Até **3 minutos**.
- YouTube **público ou não listado**.
- Mostrar as funcionalidades e a **integração com a API Java**.
- Colar o link no README (`[LINK DO YOUTUBE]`).

**Antes de gravar:**
- Abra o site na Vercel e faça uma consulta, para "acordar" o Render.
- Deixe o DevTools (F12 → aba *Network*) pronto para mostrar as chamadas.
- Grave em 1440×900. Para mostrar o celular, use o modo responsivo do DevTools (390×844).

| Tempo | Quem | Tela | Fala (resumo) |
|---|---|---|---|
| 0:00-0:20 | Gabriel | Home | "Somos o INOVEX e este é o ZelaCidade: o morador relata problemas do bairro, os vizinhos apoiam e a prefeitura atende por uma fila de prioridade transparente. Só 15,2% dos brasileiros moram em ruas com rampa, então acessibilidade pesa na fila." |
| 0:20-0:50 | Luigi | Fila → filtros → Network | "Esta fila vem da nossa API Java, por um GET em `/ocorrencias`. Ela é ordenada pela pontuação e dá para filtrar por bairro, categoria, status e prioridade." Mostre a chamada na aba Network. |
| 0:50-1:35 | Luigi | Registrar | Clique em "Confirmar registro" vazio para mostrar as **validações**. Preencha: Alagamento, descrição, Jardim São Luís, 200 pessoas, gravidade 5, sim e sim, Ana Lima. A **prévia** mostra 95 pontos, URGENTE. Envie: POST com resposta 201, "Ocorrência #N registrada!". Envie de novo para mostrar o **409** ("Já existe uma ocorrência igual"). |
| 1:35-2:15 | Cauã | Detalhe | "Por que essa prioridade?" com a barra parte por parte. **Apoio** com o nome `joao lima` na #1 mostra o 409 "você já apoiou". Na #3, **atualizar status** para Em andamento: POST em `/atualizacoes` e o histórico aparece. |
| 2:15-2:35 | Cauã | Excluir | "Excluir ocorrência" na que vocês criaram, o diálogo de confirmação, o DELETE com resposta 204 e a volta para a fila com o aviso. |
| 2:35-2:50 | Gabriel | Celular (390×844) | Abra o **menu hambúrguer**, navegue até o Painel e mostre que nada corta nem rola para o lado. |
| 2:50-3:00 | Os três | Integrantes | "Front em React, Vite, TypeScript e Tailwind, com API Java no Render e deploy na Vercel. Obrigado!" |

## Checklist
- [ ] ≤ 3:00
- [ ] Os três falam
- [ ] Aparecem pelo menos um GET, um POST e o DELETE (de preferência na aba Network)
- [ ] Aparecem uma validação de formulário e uma mensagem de erro da API
- [ ] Menu mobile aparece funcionando
- [ ] Link no README e testado numa aba anônima
