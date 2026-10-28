# Revisão emergencial de segurança — 2026-10-28

## Aplicado no Supabase
Migration: `restrict_admin_and_migrate_auth`.

- Administrador legado migrado para Supabase Auth, com senha bcrypt, preservando ID e senha anteriormente definida.
- Único ID autorizado: `54bafcda-12bd-4796-9183-b84e37c5c282`.
- A autorização usa `auth.uid()`, não e-mail, metadados do usuário ou localStorage.
- Revogada execução pública das RPCs `authenticate_user` e `create_user`.
- Senhas legadas invalidadas; coluna password inacessível a anon/authenticated.
- Cadastro público Supabase Auth desativado.
- Removidas políticas permissivas em todas as tabelas públicas atuais; escrita e dados privados exigem administrador.
- Catálogo e dados públicos de funcionamento permanecem com leitura pública.
- Perfil administrativo permite atualizar apenas nome/sobrenome, não papel ou senha legada.
- Conta staff preservada, sem acesso administrativo. Nenhum pedido ou usuário excluído.

## Testes no banco
- Um único administrador e um usuário Auth correspondente confirmado.
- anon não pode executar cadastro/login legado nem ler tabela users.
- anon vê zero pedidos.
- JWT simulado da conta staff: is_delivery_admin=false; zero pedidos e zero usuários visíveis.

## Frontend
- Login via signInWithPassword, sessão Supabase e checagem de papel no banco.
- Remoção do cache legado @delivery-pro:user.
- Rotas aguardam validação e exigem administrador.
- Cadastro removido da tela e desativado no contexto.
- CSS de produção incorporado ao HTML para evitar dependência de download separado do stylesheet. Removido import remoto de fontes.

## Limitações / pendências
- Checkout público e rastreamento bloqueados preventivamente. Implementar endpoint transacional com validação de preços no servidor, limites de abuso e token de acompanhamento por pedido antes de reativar. Não reabrir RLS de pedidos como solução.
- Login real via API e validação visual mobile em produção ainda não executados neste ambiente.
- Revisão de Storage, dependências, logs, integrações de pagamento e testes completos de abuso ainda pendentes. Não se trata de auditoria completa.
- Credencial temporária entregue em conversa deve ser alterada após entrar, em Usuários → Senha. Não reutilizar em outros serviços.

Também aplicada migration `enforce_single_delivery_admin`: índice único parcial impede mais de uma linha com papel admin, inclusive em gravações diretas do banco.
