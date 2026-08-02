import { useState, useEffect, useRef } from "react";
import axios from "axios";

const STORAGE_KEY = "workspace_id";
let interceptorAttached = false;

// Attach workspace ID to every Axios request
function attachWorkspaceInterceptor() {
  if (interceptorAttached) return;

  axios.interceptors.request.use((config) => {
    const id = localStorage.getItem(STORAGE_KEY);

    if (id) {
      config.headers = config.headers || {};
      config.headers["x-workspace-id"] = id;
    }

    return config;
  });

  interceptorAttached = true;
}

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const usernameRef = useRef(null);

  useEffect(() => {
    attachWorkspaceInterceptor();
    usernameRef.current?.focus();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setError("Enter a username.");
      return;
    }

    if (!password) {
      setError("Enter a password.");
      return;
    }

    setError("");

    // Save workspace ID for backend
    localStorage.setItem(STORAGE_KEY, trimmedUsername);

    // Save login state
    localStorage.setItem("loggedIn", "true");

    // Open Dashboard
    onLogin();
  }

  return (
    <div style={styles.body}>
      <style>{fontImport}</style>

      <h1 style={styles.srOnly}>Evalio Login</h1>

      <div style={styles.gate}>
        <div style={styles.brand}>
          <h1 style={styles.brandTitle}>Evalio</h1>
          <p style={styles.brandSub}>
            Log in to your workspace
          </p>
        </div>

        <div style={styles.card}>
          <form onSubmit={handleSubmit} autoComplete="off">

            <div style={styles.field}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>

              <input
                id="username"
                type="text"
                placeholder="Username"
                ref={usernameRef}
                autoComplete="off"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.field}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />
            </div>

            <div style={styles.error}>
              {error || "\u00A0"}
            </div>

            <button
              type="submit"
              style={styles.button}
            >
              Log In
            </button>

          </form>
        </div>

        <p style={styles.footnote}>
          Your username becomes your workspace.
          Every request automatically includes
          <code> x-workspace-id </code>
          in the request header.
        </p>
      </div>
    </div>
  );
}

const fontImport = `
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
`;

const colors = {
  ink: "#16130f",
  panel: "#1d1912",
  hair: "#3a3223",
  amber: "#e8a33d",
  amberBright: "#ffc266",
  text: "#f1e8d8",
  textDim: "#9a8f78",
  err: "#d9614f",
};

const styles = {
  body: {
    background: colors.ink,
    color: colors.text,
    fontFamily: "'IBM Plex Mono', monospace",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },

  srOnly: {
    position: "absolute",
    width: 1,
    height: 1,
    overflow: "hidden",
    clip: "rect(0 0 0 0)",
  },

  gate: {
    width: "100%",
    maxWidth: 380,
  },

  brand: {
    textAlign: "center",
    marginBottom: 28,
  },

  brandTitle: {
    fontFamily: "'Fraunces', serif",
    fontWeight: 600,
    fontSize: 28,
    color: colors.amberBright,
    margin: 0,
  },

  brandSub: {
    marginTop: 6,
    fontSize: 13,
    color: colors.textDim,
  },

  card: {
    background: colors.panel,
    border: `1px solid ${colors.hair}`,
    borderRadius: 8,
    padding: "26px 24px 22px",
  },

  field: {
    marginBottom: 16,
  },

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 12,
    color: colors.textDim,
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    background: colors.ink,
    border: `1px solid ${colors.hair}`,
    borderRadius: 5,
    color: colors.text,
    fontFamily: "'IBM Plex Mono', monospace",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
  },

  error: {
    minHeight: 18,
    fontSize: 12,
    color: colors.err,
    margin: "-6px 0 12px",
  },

  button: {
    width: "100%",
    padding: 11,
    background: colors.amber,
    color: "#241a08",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
    fontFamily: "'IBM Plex Mono', monospace",
    fontWeight: 600,
    fontSize: 13,
  },

  footnote: {
    marginTop: 18,
    textAlign: "center",
    color: colors.textDim,
    fontSize: 11,
    lineHeight: 1.5,
  },
};