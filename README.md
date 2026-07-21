# Botujuru Trail Experience 2026

Landing page oficial da **Botujuru Trail Experience**, prova de trail running em duas
modalidades (6km e 12km) no Parque do Botujuru, São Bernardo do Campo/SP, em 27/09/2026.

Organização: Verde e Azul Saúde e Movimento, em parceria com a Prefeitura de São
Bernardo do Campo.

## Stack

Site estático, sem build: HTML, CSS e JavaScript puros.

- `index.html` — estrutura da página
- `styles.css` — estilos
- `script.js` — contador de lotes, FAQ (acordeão) e menu mobile
- `assets/` — imagens e documentos (regulamento em PDF)

Inscrições processadas externamente pelo [Ticket Sports](https://site.ticketsports.com.br/).

## Deploy

Publicado via Cloudflare Pages, com deploy automático a cada push na branch `main`.
Sem comando de build — o diretório raiz é publicado diretamente.

Cabeçalhos de segurança (CSP, HSTS, etc.) estão definidos em `_headers`.

## Desenvolvimento local

Não há dependências. Basta abrir `index.html` no navegador ou servir a pasta com
qualquer servidor estático (ex.: `npx serve .`).
