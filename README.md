# MISANI Nail Spa & Design — Landing Page

Landing page para o estúdio **MISANI Nail Spa & Design**, em Feira de Santana (BA).
Serviços: unhas, sobrancelha, cílios e spa.

## No ar

- Produção: https://misani-landing.vercel.app
- Domínio alternativo: `misani-landing-silvamarcosvinicius1234-5697s-projects.vercel.app`

## Vercel

- Projeto: `misani-landing`
- Project ID: `prj_n2OA29wuGuB07zhkXwUQPMA0AS3f`
- Team: `silvamarcosvinicius1234-5697's projects` (`team_2l1TWWqDdd0PjxK2T3Csmk2R`)
- Node: 24.x
- Framework: nenhum (site estático — HTML/CSS/JS puro, sem build)
- Último deploy: `dpl_4reh4mFcTNfccSy3Yo82hjDPdjnc` (production, READY)

## Stack

- HTML estático (`index.html`)
- `styles.css` / `script.js`
- Fontes: Google Fonts — Fraunces (títulos) e Manrope (texto)
- Sem framework/backend — projeto puramente front-end estático

## Estrutura da página

1. **Header** — logomarca real (`img/logo-misani.png`), navegação (Serviços, Diferenciais, Galeria, Dúvidas, Contato), badge "aberto agora"/"fechado", CTA "Agendar no WhatsApp"
2. **Hero** — chamada principal com palavra rotativa + parallax sutil no visual ao mover o mouse
3. **Faixa de marquee** — Unhas / Sobrancelha / Cílios / Spa
4. **Diferenciais** (`#diferenciais`) — 4 cards de motivos para escolher o MISANI
5. **Serviços** (`#servicos`) — 4 cards: Nail Design, Design & Henna (sobrancelha), Extensão & Lifting (cílios), Ritual Spa
6. **Combos** (`#pacotes`) — banner de combos/pacotes para aumentar o ticket médio
7. **Como funciona** (`#como-funciona`) — 3 passos para agendar
8. **Galeria** (`#galeria`) — 6 fotos com tilt 3D no hover e lightbox ao clicar (imagens ainda placeholder, geradas via Canva)
9. **Depoimentos** — carrossel com 4 avaliações (5 estrelas), pausa no hover
10. **FAQ** (`#faq`) — dúvidas frequentes em acordeão
11. **CTA final / Contato** (`#contato`) — WhatsApp e Instagram
12. **Footer** — logomarca real, links, contato, endereço

## Animações e conversão

- Reveal-on-scroll com blur+scale, com fallback de segurança para não travar em rolagens muito rápidas (ver `script.js`)
- Botão "Ver serviços" com efeito magnético (segue o cursor); tilt 3D + zoom-hint na galeria; parallax no hero
- Barra de progresso de leitura no topo; badge "aberto agora"/"fechado" calculado a partir de `BUSINESS.schedule`
- `schema.org` (`BeautySalon`) injetado via JS a partir dos mesmos dados de `BUSINESS`, para SEO local
- Todos os efeitos de movimento respeitam `prefers-reduced-motion`

## Pendências antes de publicar oficialmente

O próprio site já sinaliza no rodapé: *"Dados de contato ilustrativos — ajustar antes da publicação."*

- [ ] Substituir WhatsApp placeholder `+55 75 99999-0000`
- [ ] Confirmar/ajustar Instagram `@misani.nailspa`
- [ ] Confirmar e-mail `ola@misaninailspa.com.br`
- [ ] Confirmar endereço "Rua Sales Barbosa, 45, Centro, Feira de Santana — BA" e horário real (`BUSINESS.schedule` em `script.js`)
- [x] Logomarca real integrada no header/footer/favicon (`img/logo-misani.png`, `img/logo-icon.png`, extraída de `logotipomisani` fornecida pelo usuário)
- [x] Paleta de cores recalculada a partir da cor real da logomarca (`#7b705e`)
- [x] Hero + galeria com imagens novas geradas via Canva (`gpt_image_2`), mesmo estilo/paleta — ainda são IA, não fotos reais do estúdio; trocar quando houver fotos originais
- [ ] Revisar depoimentos (atualmente fictícios/exemplo)

## Próximos passos

Iteração contínua planejada — ver também o projeto irmão **reata-energia-solar**, no mesmo time Vercel.
