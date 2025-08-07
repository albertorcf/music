// react/src/styles/sharedStyles.ts

// Estilos compartilhados para quadros principais (cards)

export const cardStyle: React.CSSProperties = {
  background: "linear-gradient(90deg, #292424 30%, #393434 100%)",
  color: "#fff",
  padding: "1rem 0.75rem 1rem 0.75rem",
  borderRadius: 16,
  maxWidth: 600,
  margin: "1rem auto 1rem auto",
  boxShadow: "0 4px 24px #0004",
  display: "flex",
  flexDirection: "column",
  gap: "0.5rem",
};

// Variante verde do card, para destaque (ex: Banner)
export const cardStyleGreen: React.CSSProperties = {
  ...cardStyle,
  background: "linear-gradient(90deg, #0da944 30%, #292424 100%)",
};