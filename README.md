# App da Clínica Telarolli — MVP

Ferramenta interna da equipe (fisios, recepção e sócios) para gestão clínica e financeira da clínica de Araraquara.
Mesma stack do LOAD: **um `index.html` sem build + Supabase + Vercel**, em projeto separado.

## O que tem nesta versão (v2)

| Módulo | O que faz |
|---|---|
| **Início** | Agenda do dia, presença do mês, recebido no mês e alertas (parcela atrasada, pacote acabando, paciente sem sessão, presença < 75%) |
| **Pacientes** | Cadastro + coluna de situação financeira (em dia / atraso / sem pacote), filtro "em atraso" e botão **Cobrar no WhatsApp** |
| **Ficha do paciente** | Resumo · Avaliações · Protocolo · Atendimentos & dor · Treinos & casa · Presença · **Financeiro** · Documentos. Botões no topo: **Avaliação clínica**, **Avaliação funcional**, Registrar atendimento |
| **Avaliação clínica** (assistente por etapas) | Anamnese → Inspeção → Exame físico → Palpação e EVA → Perfil da dor → ADM → Mobilidade → Flexibilidade → Força → AVDs → Questionários → Conclusão. Opções clicáveis, regiões selecionáveis, salvamento automático |
| **Avaliação funcional** | Tudo da clínica + Potência → Hop tests → Testes de salto (RSI calculado) → Estabilidade segmentar (Y-Balance composto, FMS) → Testes especiais por região → **Retorno ao esporte** (LCA, tornozelo/ROAST, isquiotibiais, ombro) com critérios preenchidos automaticamente a partir dos testes |
| **LSI / simetria** | Calculada automaticamente (membro lesado ÷ não lesado; tempo invertido) e comparada entre avaliações |
| **Atendimento do dia** | Escolhe o treino (pré-preenche), ajusta exercícios, marca condutas clínicas (recursos terapêuticos e terapia manual com região/parâmetros), condutas educacionais, EVA, evolução e adesão. Marca a presença automaticamente |
| **Presença** | Chamada do dia (Presente / Falta / Justificada / Cancelou), confirmação de sessão pelo WhatsApp, frequência do mês por paciente |
| **Financeiro do paciente** | Contratado, pago, em aberto, em atraso; sessões contratadas × realizadas × pagas; parcelas com Receber e **Lembrar/Cobrar no WhatsApp** (registra quantos lembretes foram enviados); sessão avulsa; extrato pelo WhatsApp |
| **Financeiro (geral)** | Parcelas do mês, atrasos (com WhatsApp), pacotes, resumo 6 meses |
| **Protocolos** | Fases com seus **treinos**. LCA, Tendinopatia patelar, Fratura de fêmur distal, Condropatia + banda IT já vêm com 1 treino por fase |
| **Exercícios & Treinos** | Treinos com **nome obrigatório (objetivo da sessão)**, vínculo a protocolo existente, novo protocolo ou sem protocolo; exercícios + condutas clínicas + condutas educacionais. Biblioteca completa: **3.435 exercícios / 46 abas** com vídeo, objetivo, equipamento, nível |
| **Documentos (PDF)** | Proposta de tratamento, avaliação, relatório de evolução/alta (com LSI e RTS), exercícios para casa |
| **Configurações** | Dados da clínica, valores padrão, chave Pix e **modelos das mensagens de WhatsApp** |

**Permissões (garantidas no banco):** Administrador = tudo · Fisioterapeuta = clínico, agenda, presença (sem financeiro) · Recepção = cadastro, agenda, presença, financeiro (sem prontuário).

**Arquivos:** `index.html` (app), `exercicios.js` (biblioteca de 3.435 exercícios — precisa subir junto), `supabase.sql`, `manifest.json`, `sw.js`, pasta `icons/`.

## Testar antes de configurar (modo demo)
Com `SUPABASE_URL` vazio no `index.html`, o app abre em **modo demonstração** com pacientes fictícios, salvos só no seu navegador. A barra no topo deixa você trocar de papel (admin / fisio / recepção) para ver o que cada um enxerga.

---

## Colocar no ar (≈ 20 minutos, sem programar)

### 1. Supabase (banco de dados + login)
1. Entre em supabase.com → **New project** (nome: `clinica-telarolli`, região: São Paulo). Guarde a senha do banco.
2. Menu **SQL Editor → New query** → cole todo o conteúdo de `supabase.sql` → **Run**. Deve aparecer "Success".
3. Menu **Project Settings → API**: copie **Project URL** e a chave **anon public**.
4. Abra o `index.html` num editor de texto (Bloco de Notas serve) e cole no topo do script:
   ```js
   const CONFIG = {
     SUPABASE_URL: 'https://xxxxx.supabase.co',
     SUPABASE_ANON_KEY: 'eyJ...'
   };
   ```

### 2. GitHub + Vercel
1. Crie um repositório **novo e privado** no GitHub (ex.: `app-clinica-telarolli`) e faça upload de todos os arquivos desta pasta (incluindo a pasta `icons`).
2. Na Vercel: **Add New → Project → Import** o repositório → **Deploy** (sem configurar nada; não tem build).
3. Copie o endereço gerado (ex.: `app-clinica-telarolli.vercel.app`).
4. Volte ao Supabase → **Authentication → URL Configuration** → em **Site URL** cole esse endereço (é para onde vão os links de confirmação e de "esqueci a senha").

### 3. Primeiro acesso — a ordem importa
1. **Você cria a conta primeiro** (botão "Criar acesso"). O primeiro cadastro vira **Administrador** automaticamente.
2. Depois o Thiago cria a conta dele → aparece em **Equipe** como "Aguardando aprovação" → você muda o papel para Administrador.
3. Mesma coisa para cada fisio ou recepcionista que entrar.
4. Em **Equipe → Meu perfil**, preencha CREFITO e mini currículo — é o texto do "Quem sou eu?" da proposta.
5. Em **Configurações**, confira endereço, telefone, valor padrão da sessão e se falta consome sessão do pacote.

> Se o Supabase pedir confirmação de e-mail, cada pessoa precisa clicar no link recebido antes do primeiro login.

### 4. Biblioteca de exercícios
A biblioteca completa (3.435 exercícios) já vem no arquivo `exercicios.js`. Exercícios novos ou editados pela equipe ficam salvos no banco e somam com ela. Para trazer mais exercícios em lote: **Exercícios & Treinos → Biblioteca → Importar** (JSON ou CSV com `nome`, `regiao`, `categoria`, `video`).

### WhatsApp
Os botões abrem o WhatsApp (Web ou app) com a mensagem pronta para o número do paciente — você só confere e envia. Os textos e a chave Pix ficam em **Configurações**.

### 5. Instalar no celular
Abra o endereço no celular → menu do navegador → **Adicionar à tela de início**. Ele abre como app, com o ícone da clínica.

---

## Como os dados ficam guardados
Mesmo padrão do LOAD: uma tabela `documents (path, data jsonb)`.

| Caminho | Conteúdo |
|---|---|
| `pacientes/<id>` | cadastro, diagnóstico, protocolo, fase, status |
| `clinico/<id>` | anamnese, dor, evoluções, escalas, avaliações, prescrição, adesão |
| `agenda/<id>` | sessão (paciente, fisio, data, hora, status) |
| `financeiro/<id>` | pacote + parcelas |
| `config/clinica`, `config/protocolos`, `config/exercicios` | configurações compartilhadas |

Campo novo = nenhuma migração de banco. A tabela `equipe` guarda os papéis.

**Backup:** Configurações → Baixar backup (JSON). O Supabase gratuito também faz backup diário, mas vale baixar o seu uma vez por semana.

## Atualizar o app depois
Edite o arquivo no GitHub (ou suba o novo `index.html`) → a Vercel publica sozinha em ~30 s. Se mudar arquivos do "casco" (ícones, manifest), aumente `telarolli-v1` para `v2` no `sw.js` para os celulares pegarem a versão nova.

## Próximas fases (do escopo)
- Mais escalas: DASH (ombro), IKDC, VISA-P, Kujala
- Envio automático de lembretes (hoje é um clique por mensagem)
- Indicadores para a gestão (taxa de renovação de pacote, ocupação por fisio, tempo médio até a alta por protocolo)
- Repasse/comissão por fisioterapeuta
