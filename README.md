# music

- [Troubleshooting](#troubleshooting)
  - [Erro de Autenticação com Novos Usuários Spotify](#erro-de-autenticação-com-novos-usuários-spotify)

## Troubleshooting

### Erro de Autenticação com Novos Usuários Spotify

**Sintoma:**

Ao tentar autenticar um novo usuário do Spotify no aplicativo, o processo falha após a autorização. O usuário principal (dono do app) funciona, mas novos usuários não. O log do backend pode mostrar um erro como:
```
FetchError: invalid json response body at https://api.spotify.com/v1/me reason: Unexpected token 'C', "Check sett"... is not valid JSON
```

**Causa:**

Quando um aplicativo Spotify está em **Modo de Desenvolvimento** (o padrão), ele só permite que usuários explicitamente cadastrados no painel de desenvolvedor se autentiquem. A falha ocorre porque a API do Spotify não retorna os dados do usuário para contas não autorizadas.

**Solução:**

Você precisa adicionar o e-mail do novo usuário à lista de permissões do seu aplicativo no Spotify Developer Dashboard.

1.  Acesse o seu **[Spotify Developer Dashboard](https://developer.spotify.com/dashboard)**.
2.  Selecione o seu aplicativo.
3.  Vá para a seção **"Users and Access"**.
4.  Clique em **"Add New User"**.
5.  Adicione o nome e o **e-mail exato** da conta Spotify que você deseja autorizar.
6.  Salve as alterações.

Depois de adicionar o novo usuário no painel, faça o seguinte para garantir:

1.  Faça logout novamente em https://accounts.spotify.com/logout.
2.  Reinicie o backend e o frontend.
3.  Tente fazer o login com o novo usuário.

Isso deve resolver o problema, permitindo que a chamada para /v1/me retorne os dados do usuário corretamente.