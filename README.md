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

1. **Header** — logo, navegação (Serviços, Experiência, Galeria, Dúvidas), badge "aberto agora", CTA "Agendar horário"
2. **Hero com sangria** — foto full-bleed (`img/hero-desktop.*` e `img/hero-mobile.*`, WebP + JPG, pré-carregadas), título, CTA principal WhatsApp + microcopy
3. **Faixa de confiança** (`#provas`) — 4 provas: esterilização, hora marcada, durabilidade, tudo em um lugar
4. **Serviços** (`#servicos`) — 4 cards com foto e CTA próprio com mensagem pré-preenchida
5. **Combos** (`#pacotes`) — faixa escura de ponta a ponta
6. **Experiência** (`#experiencia`) — imagem com sangria + 4 diferenciais
7. **Como agendar** (`#como-funciona`) — 3 passos + CTA
8. **Galeria** (`#galeria`) — mosaico com lightbox (imagens ainda ilustrativas)
9. **Depoimentos** (`#depoimentos`) — carrossel (ainda ilustrativos)
10. **FAQ** (`#faq`) — 6 objeções + CTA "tirar dúvida"
11. **CTA final** (`#contato`) — imagem com sangria, WhatsApp, Instagram, endereço e horário
12. **Footer**

## Conversão

- Todos os CTAs `.js-wa` abrem o WhatsApp com mensagem específica; cada clique dispara `dataLayer.push({event:"whatsapp_click"})` e `fbq("track","Contact")` se GA4/GTM/Meta Pixel forem instalados
- Barra fixa (celular) e botão flutuante (desktop) aparecem só depois do hero e somem no CTA final
- `schema.org` `BeautySalon` gerado a partir de `BUSINESS` em `script.js`; tudo respeita `prefers-reduced-motion`

## Pendências antes de publicar oficialmente

O próprio site já sinaliza no rodapé: *"Dados de contato ilustrativos — ajustar antes da publicação."*

- [ ] Substituir WhatsApp placeholder `+55 75 99999-0000`
- [ ] Confirmar/ajustar Instagram `@misani.nailspa`
- [ ] Confirmar e-mail `ola@misaninailspa.com.br`
- [ ] Confirmar endereço "Rua Sales Barbosa, 45, Centro, Feira de Santana — BA" e horário real (`BUSINESS.schedule` em `script.js`)
- [x] Logomarca real integrada no header/footer/favicon (`img/logo-misani.png`, `img/logo-icon.png`, extraída de `logotipomisani` fornecida pelo usuário)
- [x] Paleta de cores recalculada a partir da cor real da logomarca (`#7b705e`)
- [x] Hero + galeria com imagens novas geradas via Canva (`gpt_image_2`), mesmo estilo/paleta — ainda são IA, não fotos reais do estúdio; trocar quando houver fotos originais
- [ ] Trocar hero provisório (`hero-visual.jpg` reenquadrado) pela imagem nova em alta
- [ ] Revisar depoimentos (atualmente fictícios/exemplo)

## Próximos passos

Iteração contínua planejada — ver também o projeto irmão **reata-energia-solar**, no mesmo time Vercel.
