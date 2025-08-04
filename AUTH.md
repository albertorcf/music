# Resumo da Refatoração do Módulo de Autenticação

## 1. Planejamento Inicial (O Objetivo)

O objetivo principal era refatorar a lógica de autenticação do Spotify, que estava espalhada por vários componentes e utilitários, em um módulo coeso, reutilizável e extensível.

Os pontos do plano eram:

*   **Centralizar:** Mover toda a lógica de autenticação para a pasta `src/auth`.
*   **Abstrair:** Criar uma interface `AuthProvider` genérica para definir um "contrato" que qualquer provedor de login (Spotify, Google, etc.) deveria seguir.
*   **Generalizar:** Transformar o `AuthContext` em um componente agnóstico que gerencia a sessão do usuário (`AuthSession`), sem conhecer os detalhes do provedor específico.
*   **Encapsular:** Isolar toda a lógica específica do Spotify (endpoints, client ID, escopos) dentro de um `SpotifyProvider` que implementa a interface `AuthProvider`.
*   **Simplificar:** Refatorar os componentes da UI (`LoginButton`, `Callback`, `Header`, `SpotifyStatus`) para que eles consumissem o `useAuth` hook, tornando-os mais limpos e independentes da lógica de negócio.

## 2. Implementação Final (O Resultado)

A implementação final resultou em uma arquitetura robusta e desacoplada, onde:

*   **`AuthContext.tsx`**: É o coração do sistema. Ele gerencia o estado da sessão (`session`), que contém o `accessToken` e os dados do usuário. Ele também expõe as funções de `login`, `logout` e `handleLoginCallback`.
*   **`useAuth.ts`**: É o hook customizado que os componentes da UI usam para acessar o `AuthContext` de forma simples e segura.
*   **`SpotifyProvider.ts`**: Contém toda a lógica específica do Spotify. Ele sabe como construir a URL de autorização e como chamar o nosso backend para trocar o código de autorização por uma sessão de usuário.
*   **`backend/server.js`**: O servidor de backend agora é responsável por:
    1.  Receber o código de autorização do frontend.
    2.  Trocá-lo por um `access_token` junto ao Spotify (usando o Client ID e o Client Secret de forma segura).
    3.  Usar esse `access_token` para buscar os dados do perfil do usuário (`/v1/me`).
    4.  Retornar um objeto de sessão (`AuthSession`) completo e já formatado para o frontend.
*   **Componentes da UI**: Agora são "burros". Eles não contêm mais lógica de autenticação; apenas chamam as funções (`login`, `logout`) ou leem os dados (`session`) do hook `useAuth`.

## 3. Estrutura de Arquivos

### Estrutura de Pastas

A principal mudança foi a criação e organização da pasta `src/auth/`:

```
src/
└── auth/
    ├── AuthContext.tsx
    ├── useAuth.ts
    ├── types.ts
    └── providers/
        └── SpotifyProvider.ts
```

### Arquivos Criados

*   `react/src/auth/types.ts`: Define as interfaces `AuthProvider` e `AuthSession`.
*   `react/src/auth/useAuth.ts`: Fornece o hook `useAuth` para os componentes.
*   `react/src/utils/getSpotifyApiToken.ts`: Restaura a lógica para obter o token de API público para buscas não autenticadas.
*   `react/src/utils/fetchSpotifyPlayback.ts`: Isola a lógica para buscar o estado de reprodução do usuário.

### Arquivos Modificados Significativamente

*   `react/src/auth/AuthContext.tsx`: Criado do zero para ser o provedor de contexto de autenticação genérico.
*   `react/src/auth/providers/SpotifyProvider.ts`: Criado para encapsular toda a lógica do Spotify.
*   `react/src/pages/Callback.tsx`: Completamente refatorado para delegar a lógica ao `AuthContext`.
*   `react/src/pages/Home.tsx`: Modificado para usar o hook `useAuth` em vez de receber props.
*   `react/src/components/SpotifyStatus.tsx`: Refatorado múltiplas vezes, agora usa o `useAuth` e faz polling para buscar o status da música.
*   `react/src/components/Header.tsx`: Simplificado para usar o `useAuth` para exibir o botão de Login/Logout.
*   `react/src/components/SpotifyLoginButton.tsx`: Simplificado para apenas chamar a função `login` do `useAuth`.
*   `react/src/hooks/useArtistSearch.ts`: Corrigido para usar o token de API público, desacoplando a busca do login do usuário.
*   `react/src/main.tsx`: Atualizado para usar o novo `AuthProviderComponent`.
*   `react/backend/server.js`: Modificado para buscar os dados do perfil do usuário no Spotify e retornar um objeto de sessão completo.

### Arquivos Removidos

*   `react/src/context/SpotifyTokenContext.tsx`
*   `react/src/utils/getSpotifyToken.ts`
*   `react/src/utils/checkSpotifyAuth.ts`

## 4. Principais Desafios e Soluções

Durante o sprint, encontramos vários problemas críticos que foram resolvidos:

1.  **Problema: `invalid_grant` (Código de Autorização Inválido)**
    *   **Causa:** O `StrictMode` do React fazia com que o `useEffect` na página de `Callback` executasse duas vezes, enviando o mesmo código de autorização para o backend duas vezes. Códigos de autorização só podem ser usados uma vez.
    *   **Solução:** Centralizamos a lógica de callback no `AuthContext` e usamos uma `ref` (`effectRan.current`) no componente `Callback` para garantir que a chamada à API fosse executada apenas uma vez, mesmo no `StrictMode`.

2.  **Problema: `INVALID_CLIENT` (Cliente Inválido)**
    *   **Causa:** Durante a refatoração, o `CLIENT_ID` do Spotify foi substituído por um valor fixo e incorreto no código, em vez de ser lido do arquivo de ambiente `.env`.
    *   **Solução:** Corrigimos o `SpotifyProvider.ts` para ler a variável de ambiente `import.meta.env.VITE_SPOTIFY_CLIENT_ID`, garantindo que a chave correta seja usada.

3.  **Problema: Busca de Artista Exigindo Login**
    *   **Causa:** O hook `useArtistSearch` foi incorretamente refatorado para usar o token da sessão do usuário, quebrando a funcionalidade de busca pública.
    *   **Solução:** Restauramos a lógica original criando a função `getSpotifyApiToken` para buscar um token de API público (Client Credentials) e ajustamos o `useArtistSearch` para usar este token, desacoplando a busca da autenticação do usuário.

4.  **Problema: "Música Tocando" Não Funcionava (`401 Unauthorized`)**
    *   **Causa:** A requisição de login não incluía os escopos de permissão necessários (`user-read-playback-state`, `user-read-currently-playing`) para ler o status do player do usuário.
    *   **Solução:** Adicionamos os escopos corretos à variável `scope` dentro do `SpotifyProvider.ts`.

5.  **Problema: Loop Infinito de Requisições**
    *   **Causa:** No `SpotifyStatus.tsx`, o `useEffect` para buscar o status da música tinha uma dependência de uma variável de estado (`isFetching`) que ele mesmo modificava, criando um loop infinito.
    *   **Solução:** Refatoramos o `useEffect` para depender apenas do `session.accessToken` e usar `setInterval` para fazer polling periódico, com uma função de limpeza (`clearInterval`) para evitar vazamentos de memória.
