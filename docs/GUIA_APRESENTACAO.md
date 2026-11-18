# Guia da apresentação presencial: Front-End (30% da nota)

**Leve:**
- o site da Vercel aberto, com o Render já "acordado";
- o VS Code com o projeto aberto;
- o DevTools pronto para o modo responsivo.

> O professor pode perguntar **qualquer coisa a qualquer um**. Os três leem este guia inteiro.

## Divisão
| Item da rubrica | Quem | O que mostrar |
|---|---|---|
| Problema e contexto | Gabriel | Morador sem retorno, pedidos duplicados, falta de rampa (15,2%, IBGE). ODS 11 e 10. |
| Solução | Gabriel | Relatar → ver a prioridade → apoiar → acompanhar. A regra é pública (página Home e "Por que essa prioridade?"). |
| Demonstração das páginas e navegação | Luigi | Home → Fila (filtros) → Detalhe → Registrar → Painel → Sobre, Integrantes, FAQ, Contato → uma URL errada (404). |
| Responsividade nos 3 tamanhos | Cauã | DevTools: 390×844, 768×1024 e 1440×900. A grade de cards muda de 1 para 2 e para 3 colunas, e não há rolagem lateral. |
| Menu mobile, interações, validação e feedback ao vivo | Cauã | Abrir e fechar o hambúrguer (também com Esc); enviar o Registrar vazio; descrição curta; apoio repetido (409); confirmar exclusão. |
| Domínio técnico | Luigi (estrutura e API), Cauã (estilo e responsividade), Gabriel (formulários e UX) | Ver abaixo. |

## Pontos técnicos que cada um precisa saber explicar

### Estrutura (Luigi)
- **`src/services/api.ts`:** a função `requisicao<T>()` faz o `fetch`, lê o `VITE_API_URL`, converte o JSON e transforma qualquer falha em `ErroApi` com uma mensagem em português. O 204 do DELETE não tem corpo, por isso devolve `undefined`.
- **`ocorrenciasService.ts`:** uma função por rota (listar, buscar, cadastrar, excluir, listar e registrar atualizações, apoiar).
- **`types/ocorrencia.ts`:** a interface `Ocorrencia` e os tipos de união `Categoria`, `StatusOcorrencia` e `ClassePrioridade`. A API usa códigos (ex.: `EM_ANDAMENTO`) e a tela mostra os rótulos ("Em andamento").
- **Estados de tela:** cada página que usa a API tem 3 `useState` (`ocorrencias`, `carregando` e `erro`) e uma função `carregar()`. O `useEffect(() => { carregar() }, [])` chama a API quando a página abre, e o botão "Tentar de novo" chama `carregar()` de novo.
- **Detalhe da ocorrência:** a página só organiza a tela. Os formulários ficam em `components/FormApoio.tsx` e `components/FormStatus.tsx`, e o histórico em `components/HistoricoAtualizacoes.tsx`. Depois de apoiar ou mudar o status, o formulário avisa a página (`onSucesso`) e ela busca os dados de novo.
- **`utils/prioridade.ts`:** a mesma regra do Python. Serve para a prévia antes de enviar e para a barra de pontos.
- **Rotas (`routes.tsx`):** usa `createBrowserRouter`, com o `Layout` (Header + Outlet + Footer). `/ocorrencias/:id` é a rota com parâmetro, lida com `useParams`, e `*` é o 404.
- **`vercel.json`:** sem o rewrite para `/index.html`, o F5 em `/ocorrencias/3` daria 404 na Vercel.

### Estilo e responsividade (Cauã)
- O Tailwind 4 está configurado no `index.css` com `@theme`, que define as cores (`petroleo-*`, `ambar-*`) e as fontes (Sora e Inter).
- O projeto é **mobile first**: a classe sem prefixo vale para o celular, e `sm:`, `md:` e `lg:` mudam a partir de 640, 768 e 1024 px. Exemplo: `grid md:grid-cols-2 lg:grid-cols-3`.
- O menu mobile aparece abaixo de `lg` (`lg:hidden`) e o menu desktop a partir de `lg` (`hidden lg:flex`). O botão tem `aria-expanded` e `aria-controls`, e o menu fecha ao trocar de rota ou com Esc.
- Para evitar rolagem lateral: o `Container` tem largura máxima com padding, os textos longos usam `min-w-0` e `break-words`, e o layout usa `overflow-x-clip`.
- As cores de prioridade são fixas e têm contraste AA (texto escuro sobre fundo claro). O foco visível é âmbar.

### Formulários e UX (Gabriel)
- O React Hook Form faz a validação com `required`, `minLength`, `pattern` (e-mail) e `validate` (ex.: número entre 1 e 100.000, status diferente do atual).
- Cada campo tem `label` (`htmlFor`), `aria-invalid` e `aria-describedby`, que liga o campo à dica ou ao erro.
- O **feedback da API** aparece no componente `Mensagem` (verde ou vermelha). Ele mostra a `mensagem` do 400 ou do 409, e no 409 do registro sugere apoiar.
- Os estados vazios têm ilustração e próxima ação. O carregando avisa da demora do Render depois de 4 s.

## Perguntas prováveis (com resposta)
1. **Por que React com Vite e não CRA ou Next?**
   - O CRA foi descontinuado e o Next é proibido no trabalho.
   - O Vite é rápido no `npm run dev` e gera um build estático simples de publicar na Vercel.
2. **Onde estão as chamadas da API? Por que fetch?**
   - Estão em `src/services/`. A regra proíbe axios.
   - O `fetch` é nativo e a nossa função `requisicao` já trata o JSON e os erros num lugar só.
3. **Como vocês tratam erro de requisição?**
   - Se o `response.ok` vier falso, lemos `{ status, mensagem }` e lançamos `ErroApi`.
   - Falha de rede vira "Não conseguimos falar com o servidor".
   - A tela mostra o `ErroRequisicao` com "Tentar de novo".
4. **Qual a diferença entre o 400, o 404 e o 409 no ZelaCidade?**
   - **400** são dados inválidos (ex.: gravidade 9).
   - **404** é uma ocorrência que não existe.
   - **409** é conflito com o estado atual: já apoiou, registro duplicado ou tentar excluir uma resolvida.
5. **Por que tipar as respostas?**
   - O TypeScript avisa se usarmos um campo que não existe (ex.: `pessoas_afetadas` em vez de `pessoasAfetadas`) e o editor completa os nomes.
   - O modo `strict` está ligado.
6. **O que é a rota com parâmetro?**
   - É `/ocorrencias/:id`. O `useParams` lê o id. Se não for um número inteiro positivo, mostramos "Número de ocorrência inválido".
7. **Como funciona o F5 em uma rota interna na Vercel?**
   - O `vercel.json` reescreve todas as rotas para o `index.html`, e o React Router decide qual página mostrar.
8. **Como a página fica responsiva sem rolagem lateral?**
   - Mobile first com as classes `sm:`, `md:` e `lg:` e grid que muda o número de colunas.
   - Testamos com Playwright nos 3 tamanhos, conferindo `scrollWidth <= clientWidth`.
9. **Quais componentes vocês reaproveitam?**
   - O `CardOcorrencia` (Home e fila).
   - O `BadgePrioridade` (card, detalhe, painel, Home e prévia).
   - O `Carregando`, o `ErroRequisicao` e o `EstadoVazio` (todas as telas com API).
   - O `Mensagem` (formulários), o `Campo` (3 formulários), o `TituloPagina` e o `Container` (todas as páginas).
10. **Usaram algum template ou biblioteca de componentes?**
    - Não. Todos os componentes foram escritos com Tailwind, e o logo e as ilustrações são SVG próprios.
    - As referências (gov.br, Colab, FixMyStreet) foram só inspiração e estão documentadas em `docs/TELAS_E_UX.md`.
11. **Como a prioridade é calculada e onde isso está no código?**
    - Gravidade×10, +1 a cada 10 pessoas (máx. 20), +2 por dia (máx. 20), +15 escola ou saúde, +10 acessibilidade, +3 por apoio (máx. 15).
    - Fica em `utils/prioridade.ts`, igual ao motor Python.
12. **Por que o carregando fala do servidor "acordando"?**
    - O Render gratuito desliga a API sem uso, e a primeira chamada leva cerca de 50 s.
    - Depois de 4 s mostramos o aviso, para a pessoa não achar que travou.
13. **Como a API sabe onde está o front (CORS)?**
    - A API Java libera as origens da Vercel e do `localhost:5173`. Sem isso, o navegador bloqueia a resposta.
14. **O que acontece com o formulário de contato?**
    - Ele valida tudo e mostra a confirmação, mas nesta versão não envia para um servidor de e-mail.
    - O texto de sucesso deixa isso claro.
15. **Como é o GitFlow de vocês?**
    - `main` (o que vai para a Vercel), `develop` (integração) e `feature/...` para cada parte, com merge `--no-ff` em `develop`.

## Checklist do dia
- [ ] Render "acordado" 5 minutos antes
- [ ] Os 3 tamanhos testados no DevTools
- [ ] Uma ocorrência de teste para excluir ao vivo
- [ ] Os três sabem responder as perguntas 2, 4, 6, 8 e 9
