# Publicação do Delivery Max

## Estado atual
- Aplicação extraída do ZIP original, sem substituir dados do banco.
- Supabase: DeliveryMax (`hfjwbevdbuwjygkjngnf`).
- `netlify.toml` define build, pasta `dist`, Node 22 e fallback das rotas SPA.
- Só a URL e a chave **pública** do Supabase estão na configuração versionada.
- Nenhuma chave administrativa deve ser inserida em variáveis `VITE_*`.

## Executar
```sh
npm ci
cp .env.example .env.local
npm run dev -- --host 0.0.0.0
```

## Netlify
Importe este repositório e selecione a branch de trabalho. A configuração de build é lida de `netlify.toml`. Para produção, revise e integre as mudanças por pull request antes de publicar a branch de produção.

## Bloqueios de segurança antes de produção
O projeto original usa `authenticate_user` e guarda o usuário no localStorage, sem sessão Supabase Auth. A tela de alteração de senha usa Supabase Auth, portanto é incompatível com o login original. É necessário migrar o login e as permissões conjuntamente.

As políticas atuais do banco permitem operações públicas em tabelas administrativas, pedidos e perfis. Não disponibilize dados reais antes de restringir RLS e validar os fluxos de checkout e acompanhamento de pedidos. As migrations legadas não devem ser reaplicadas cegamente: incluem autenticação antiga e dados de exemplo.

Existe um administrador `admin@deliverymax.com` na tabela legada. A senha não foi consultada nem alterada. Definir acesso seguro com o proprietário, usando e-mail real e recuperação de senha, faz parte da migração de autenticação pendente.

Não foram removidos projetos, tabelas, pedidos, usuários ou sites externos. A publicação externa e o teste ponta a ponta ainda não foram realizados.

## Atualização de segurança
As notas sobre login legado acima descrevem o estado anterior. Consulte `docs/SECURITY.md`: migração Auth e bloqueios RLS aplicados em 2026-10-28. Checkout/rastreamento público em manutenção preventiva.
