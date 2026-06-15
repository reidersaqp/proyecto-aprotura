"use client";

import React, { useState, useRef, useEffect } from "react";

export default function MesaPartesPage() {
  // Session User
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [authStep, setAuthStep] = useState<"login" | "register" | "change-password" | "dashboard">("login");
  const [activeTab, setActiveTab] = useState<"inicio" | "mesa-de-partes" | "mis-expedientes" | "buscar-expedientes">("inicio");
  const [rememberMe, setRememberMe] = useState(true);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Register inputs
  const [regNombre, setRegNombre] = useState("");
  const [regDocumentoTipo, setRegDocumentoTipo] = useState("DNI");
  const [regDocumentoNumero, setRegDocumentoNumero] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCelular, setRegCelular] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Change password inputs
  const [cpEmail, setCpEmail] = useState("");
  const [cpPassword, setCpPassword] = useState("");
  const [cpNewPassword, setCpNewPassword] = useState("");
  const [cpConfirmNewPassword, setCpConfirmNewPassword] = useState("");
  const [cpError, setCpError] = useState("");
  const [cpSuccess, setCpSuccess] = useState("");
  const [cpLoading, setCpLoading] = useState(false);

  // Filing Form Inputs
  const [formData, setFormData] = useState({
    remitente: "",
    documentoTipo: "DNI",
    documentoNumero: "",
    email: "",
    celular: "",
    tramiteTipo: "Otros",
    asunto: "",
    mensaje: "",
  });

  const [file, setFile] = useState<File | null>(null);
  const [adjuntoUrl, setAdjuntoUrl] = useState("");
  const [adjuntoNombre, setAdjuntoNombre] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successData, setSuccessData] = useState<any | null>(null);

  // Expedientes (all for tracking, and filtered for user history)
  const [filings, setFilings] = useState<any[]>([]);
  const [filingsLoading, setFilingsLoading] = useState(false);
  const [searchCode, setSearchCode] = useState("");
  const [searchResult, setSearchResult] = useState<any | null>(null);
  const [searched, setSearched] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load user session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("aprotura_user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setCurrentUser(user);
        setAuthStep("dashboard");
      } catch (e) {
        localStorage.removeItem("aprotura_user");
      }
    } else {
      const tempUser = sessionStorage.getItem("aprotura_user");
      if (tempUser) {
        try {
          const user = JSON.parse(tempUser);
          setCurrentUser(user);
          setAuthStep("dashboard");
        } catch (e) {
          sessionStorage.removeItem("aprotura_user");
        }
      }
    }
  }, []);

  // Sync user details to form inputs when logged in
  useEffect(() => {
    if (currentUser) {
      setFormData(prev => ({
        ...prev,
        remitente: currentUser.nombre || "",
        documentoTipo: currentUser.documento_tipo || currentUser.documentoTipo || "DNI",
        documentoNumero: currentUser.documento_numero || currentUser.documentoNumero || "",
        email: currentUser.email || "",
        celular: currentUser.celular || "",
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        remitente: "",
        documentoTipo: "DNI",
        documentoNumero: "",
        email: "",
        celular: "",
      }));
    }
  }, [currentUser]);

  // Fetch all filings for stats and table
  const fetchFilings = async () => {
    if (!currentUser) return;
    setFilingsLoading(true);
    try {
      const res = await fetch("/api/mesa-de-partes");
      if (res.ok) {
        const data = await res.json();
        setFilings(data);
      }
    } catch (err) {
      console.error("Error fetching filings:", err);
    } finally {
      setFilingsLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser && (activeTab === "inicio" || activeTab === "mis-expedientes" || activeTab === "buscar-expedientes")) {
      fetchFilings();
    }
  }, [activeTab, currentUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg("El archivo excede el tamaño máximo permitido de 10MB.");
      return;
    }

    setFile(selectedFile);
    setErrorMsg("");
    setUploading(true);

    const uploadFormData = new FormData();
    uploadFormData.append("file", selectedFile);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setAdjuntoUrl(data.url);
          setAdjuntoNombre(selectedFile.name);
        } else {
          setErrorMsg("Error al procesar la respuesta del servidor de carga.");
        }
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Error al subir el documento.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al subir el archivo.");
    } finally {
      setUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setFile(null);
    setAdjuntoUrl("");
    setAdjuntoNombre("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjuntoUrl) {
      setErrorMsg("Debe adjuntar un documento obligatorio que sustente su trámite.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/mesa-de-partes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          adjuntoUrl,
          adjuntoNombre,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          setSuccessData(result.data);
          // Reset editable form fields
          setFormData((prev) => ({
            ...prev,
            tramiteTipo: "Otros",
            asunto: "",
            mensaje: "",
          }));
          setFile(null);
          setAdjuntoUrl("");
          setAdjuntoNombre("");
          // Refetch filings to update stats and list
          fetchFilings();
        } else {
          setErrorMsg("Error en el formato de respuesta al guardar el trámite.");
        }
      } else {
        const errData = await res.json();
        setErrorMsg(errData.error || "Ocurrió un error al enviar el formulario.");
      }
    } catch (err) {
      setErrorMsg("Error de conexión al enviar la solicitud.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setSuccessData(null);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentUser(data.user);
        if (rememberMe) {
          localStorage.setItem("aprotura_user", JSON.stringify(data.user));
        } else {
          sessionStorage.setItem("aprotura_user", JSON.stringify(data.user));
        }
        setAuthStep("dashboard");
        setActiveTab("inicio");
        setLoginEmail("");
        setLoginPassword("");
      } else {
        setAuthError(data.error || "Usuario o contraseña incorrectos");
      }
    } catch (err) {
      setAuthError("Error de conexión con el servidor");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");

    if (regPassword !== regConfirmPassword) {
      setRegError("Las contraseñas no coinciden");
      return;
    }

    setRegLoading(true);

    try {
      const res = await fetch("/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: regNombre,
          documentoTipo: regDocumentoTipo,
          documentoNumero: regDocumentoNumero,
          email: regEmail,
          celular: regCelular,
          password: regPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setRegSuccess("Usuario registrado con éxito. Redirigiendo a inicio de sesión...");
        setRegNombre("");
        setRegDocumentoNumero("");
        setRegEmail("");
        setRegCelular("");
        setRegPassword("");
        setRegConfirmPassword("");
        setTimeout(() => {
          setAuthStep("login");
          setRegSuccess("");
        }, 2000);
      } else {
        setRegError(data.error || "Error al registrar el usuario");
      }
    } catch (err) {
      setRegError("Error de conexión con el servidor");
    } finally {
      setRegLoading(false);
    }
  };

  const handlePasswordChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCpError("");
    setCpSuccess("");

    if (cpNewPassword !== cpConfirmNewPassword) {
      setCpError("Las contraseñas nuevas no coinciden");
      return;
    }

    setCpLoading(true);

    try {
      const res = await fetch("/api/usuarios", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: cpEmail,
          password: cpPassword,
          newPassword: cpNewPassword,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setCpSuccess("Contraseña restablecida con éxito. Redirigiendo...");
        setCpEmail("");
        setCpPassword("");
        setCpNewPassword("");
        setCpConfirmNewPassword("");
        setTimeout(() => {
          setAuthStep("login");
          setCpSuccess("");
        }, 2000);
      } else {
        setCpError(data.error || "Error al actualizar la contraseña");
      }
    } catch (err) {
      setCpError("Error de conexión con el servidor");
    } finally {
      setCpLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("aprotura_user");
    sessionStorage.removeItem("aprotura_user");
    setAuthStep("login");
    setActiveTab("inicio");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setSearchLoading(true);
    setSearched(true);

    const codeToSearch = searchCode.trim().toUpperCase();
    const found = filings.find(
      (f) => f.codigo.toUpperCase() === codeToSearch
    );
    setSearchResult(found || null);
    setSearchLoading(false);
  };

  // Filter filings belonging to active user
  const userFilings = filings.filter((f) => {
    if (!currentUser) return false;
    const userEmail = currentUser.email?.toLowerCase().trim();
    const userDoc = (currentUser.documento_numero || currentUser.documentoNumero)?.trim();
    return (
      f.email?.toLowerCase().trim() === userEmail ||
      f.documentoNumero?.trim() === userDoc
    );
  });

  const totalFilings = userFilings.length;
  const pendingFilings = userFilings.filter((f) => f.status === "Pendiente").length;
  const resolvedFilings = userFilings.filter((f) => f.status !== "Pendiente").length;

  return (
    <div className="mesa-page-wrapper" style={{ background: "var(--white)", minHeight: "100vh" }}>
      {/* 1. HERO BANNER */}
      <section className="mesa-hero">
        <img 
          src="/img/mesa_partes_banner.png" 
          alt="Mesa de Partes Virtual" 
          style={{
            width: "100%",
            height: "auto",
            display: "block"
          }}
        />
      </section>

      {/* 2. MAIN CONTENT AREA */}
      <section style={{ padding: "4rem 0 6rem 0" }}>
        <div className="container">
          {currentUser === null ? (
            /* ========================================================= */
            /* AUTHENTICATION VIEW                                       */
            /* ========================================================= */
            <div className="auth-card-container">
              {authStep === "login" && (
                <div className="auth-card animate-fadeIn">
                  <h3 className="auth-title">Iniciar Sesión</h3>
                  <p className="auth-subtitle">Accede a la Mesa de Partes Virtual de APROTURA</p>

                  {authError && <div className="error-alert">{authError}</div>}

                  <form onSubmit={handleLoginSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="correo@gmail.com"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contraseña *</label>
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Contraseña"
                        className="form-input"
                      />
                    </div>

                    <div className="auth-options">
                      <label className="remember-me-label">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="remember-checkbox"
                        />
                        <span>Recordarme</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setAuthStep("change-password")}
                        className="auth-link-btn"
                      >
                        Cambiar clave
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={authLoading}
                      className="btn-submit-form"
                    >
                      {authLoading ? "Ingresando..." : "Ingresar"}
                    </button>
                  </form>

                  <div className="auth-footer">
                    <span>¿No tienes una cuenta?</span>{" "}
                    <button
                      onClick={() => setAuthStep("register")}
                      className="auth-action-link"
                    >
                      Registrar nuevo usuario
                    </button>
                  </div>
                </div>
              )}

              {authStep === "register" && (
                <div className="auth-card reg-card animate-fadeIn">
                  <h3 className="auth-title">Crear Cuenta</h3>
                  <p className="auth-subtitle">Regístrate para presentar y ver tus expedientes</p>

                  {regError && <div className="error-alert">{regError}</div>}
                  {regSuccess && <div className="success-alert">{regSuccess}</div>}

                  <form onSubmit={handleRegisterSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label">Nombre Completo *</label>
                      <input
                        type="text"
                        required
                        value={regNombre}
                        onChange={(e) => setRegNombre(e.target.value)}
                        placeholder="Nombre"
                        className="form-input"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Tipo Documento *</label>
                        <select
                          value={regDocumentoTipo}
                          onChange={(e) => setRegDocumentoTipo(e.target.value)}
                          className="form-select"
                        >
                          <option value="DNI">DNI</option>
                          <option value="CE">C.E.</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                      </div>
                      <div className="form-group flex-2">
                        <label className="form-label">Número de Documento *</label>
                        <input
                          type="text"
                          required
                          value={regDocumentoNumero}
                          onChange={(e) => setRegDocumentoNumero(e.target.value)}
                          placeholder="Número de identidad"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Correo Electrónico *</label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="correo@gmail.com"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label className="form-label">Celular / Teléfono *</label>
                        <input
                          type="tel"
                          required
                          value={regCelular}
                          onChange={(e) => setRegCelular(e.target.value)}
                          placeholder="999999999"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group flex-1">
                        <label className="form-label">Contraseña *</label>
                        <input
                          type="password"
                          required
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="Contraseña"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group flex-1">
                        <label className="form-label">Confirmar Contraseña *</label>
                        <input
                          type="password"
                          required
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="Repite la contraseña"
                          className="form-input"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={regLoading}
                      className="btn-submit-form"
                    >
                      {regLoading ? "Registrando..." : "Registrar Cuenta"}
                    </button>
                  </form>

                  <div className="auth-footer">
                    <span>¿Ya tienes cuenta?</span>{" "}
                    <button
                      onClick={() => setAuthStep("login")}
                      className="auth-action-link"
                    >
                      Inicia Sesión
                    </button>
                  </div>
                </div>
              )}

              {authStep === "change-password" && (
                <div className="auth-card animate-fadeIn">
                  <h3 className="auth-title">Cambiar Contraseña</h3>
                  <p className="auth-subtitle">Restablece la contraseña de acceso a tu cuenta</p>

                  {cpError && <div className="error-alert">{cpError}</div>}
                  {cpSuccess && <div className="success-alert">{cpSuccess}</div>}

                  <form onSubmit={handlePasswordChangeSubmit} className="auth-form">
                    <div className="form-group">
                      <label className="form-label">Correo Electrónico *</label>
                      <input
                        type="email"
                        required
                        value={cpEmail}
                        onChange={(e) => setCpEmail(e.target.value)}
                        placeholder="correo@gmail.com"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contraseña Actual *</label>
                      <input
                        type="password"
                        required
                        value={cpPassword}
                        onChange={(e) => setCpPassword(e.target.value)}
                        placeholder="Contraseña Actual"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Nueva Contraseña *</label>
                      <input
                        type="password"
                        required
                        value={cpNewPassword}
                        onChange={(e) => setCpNewPassword(e.target.value)}
                        placeholder="Nueva contraseña"
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Confirmar Nueva Contraseña *</label>
                      <input
                        type="password"
                        required
                        value={cpConfirmNewPassword}
                        onChange={(e) => setCpConfirmNewPassword(e.target.value)}
                        placeholder="Confirmar nueva contraseña"
                        className="form-input"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={cpLoading}
                      className="btn-submit-form"
                    >
                      {cpLoading ? "Actualizando..." : "Cambiar Contraseña"}
                    </button>
                  </form>

                  <div className="auth-footer">
                    <span>Volver al</span>{" "}
                    <button
                      onClick={() => setAuthStep("login")}
                      className="auth-action-link"
                    >
                      Inicio de Sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ========================================================= */
            /* LOGGED IN DASHBOARD VIEW                                  */
            /* ========================================================= */
            <div className="dashboard-grid animate-fadeIn">
              
              {/* Sidebar */}
              <aside className="dashboard-sidebar">
                <div className="user-profile-widget">
                  <div className="avatar-circle">
                    {currentUser.nombre ? currentUser.nombre.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="user-details">
                    <h4 className="user-name">{currentUser.nombre}</h4>
                    <span className="user-role">
                      {currentUser.documento_tipo || currentUser.documentoTipo}: {currentUser.documento_numero || currentUser.documentoNumero}
                    </span>
                  </div>
                </div>

                <nav className="sidebar-nav">
                  <button
                    onClick={() => setActiveTab("inicio")}
                    className={`nav-item ${activeTab === "inicio" ? "active" : ""}`}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    <span>INICIO</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mesa-de-partes")}
                    className={`nav-item ${activeTab === "mesa-de-partes" ? "active" : ""}`}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>MESA DE PARTES</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("mis-expedientes")}
                    className={`nav-item ${activeTab === "mis-expedientes" ? "active" : ""}`}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                    <span>VER MIS EXPEDIENTES</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("buscar-expedientes")}
                    className={`nav-item ${activeTab === "buscar-expedientes" ? "active" : ""}`}
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <span>BUSCAR EXPEDIENTES</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="nav-item nav-logout"
                  >
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>CERRAR SESIÓN</span>
                  </button>
                </nav>
              </aside>

              {/* Main Panel Content */}
              <main className="dashboard-content">
                
                {/* ─── TAB: INICIO ─── */}
                {activeTab === "inicio" && (
                  <div className="tab-view animate-fadeIn">
                    <div className="view-header">
                      <h2 className="view-title">Bienvenido(a), {currentUser.nombre}</h2>
                      <p className="view-subtitle">Resumen general y estadísticas de tus solicitudes</p>
                    </div>

                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-icon-box">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="stat-info">
                          <span className="stat-value">{filingsLoading ? "..." : totalFilings}</span>
                          <span className="stat-label">Total Solicitudes</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon-box orange">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="stat-info">
                          <span className="stat-value text-orange">{filingsLoading ? "..." : pendingFilings}</span>
                          <span className="stat-label">Trámites Pendientes</span>
                        </div>
                      </div>

                      <div className="stat-card">
                        <div className="stat-icon-box green">
                          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="stat-info">
                          <span className="stat-value text-green">{filingsLoading ? "..." : resolvedFilings}</span>
                          <span className="stat-label">Trámites Atendidos</span>
                        </div>
                      </div>
                    </div>

                    <div className="welcome-actions-card">
                      <h4 className="actions-title">¿Qué deseas hacer hoy?</h4>
                      <p className="actions-text">Selecciona una de las opciones rápidas para comenzar a interactuar con la plataforma.</p>
                      
                      <div className="actions-button-row">
                        <button
                          onClick={() => setActiveTab("mesa-de-partes")}
                          className="btn-primary"
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                          </svg>
                          Iniciar Nuevo Trámite
                        </button>
                        <button
                          onClick={() => setActiveTab("mis-expedientes")}
                          className="btn-outline"
                        >
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                          </svg>
                          Historial de Expedientes
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB: MESA DE PARTES ─── */}
                {activeTab === "mesa-de-partes" && (
                  <div className="tab-view animate-fadeIn">
                    <div className="view-header">
                      <h2 className="view-title">Registrar Trámite</h2>
                      <p className="view-subtitle">Ingresa una nueva solicitud formal. Tus datos personales han sido bloqueados para tu seguridad.</p>
                    </div>

                    {successData ? (
                      <div className="success-container animate-fadeIn">
                        <div className="success-icon-wrapper">
                          <svg width="48" height="48" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        
                        <h3 className="success-title">¡Trámite Registrado con Éxito!</h3>
                        <p className="success-subtitle">
                          Su solicitud ha sido enviada correctamente al sistema administrativo de APROTURA.
                        </p>

                        <div className="success-details-card">
                          <div className="detail-row">
                            <span className="detail-label">Código de Trámite:</span>
                            <span className="detail-value highlight">{successData.codigo}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Fecha de Envío:</span>
                            <span className="detail-value">{successData.fecha}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Asunto:</span>
                            <span className="detail-value">{successData.asunto}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-label">Tipo de Trámite:</span>
                            <span className="detail-value">{successData.tramiteTipo}</span>
                          </div>
                          {successData.adjuntoNombre && (
                            <div className="detail-row">
                              <span className="detail-label">Documento:</span>
                              <span className="detail-value truncate" title={successData.adjuntoNombre}>
                                {successData.adjuntoNombre}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="success-notice">
                          <p>
                            Por favor guarde su código de trámite para referencias futuras. Se ha enviado un registro interno con sus datos para su pronta revisión.
                          </p>
                        </div>

                        <button onClick={handleResetSuccess} className="btn-success-action">
                          Ingresar Otro Trámite
                        </button>
                      </div>
                    ) : (
                      <div className="form-card">
                        {errorMsg && (
                          <div className="error-alert">
                            <span>{errorMsg}</span>
                          </div>
                        )}

                        <form onSubmit={handleSubmit} className="form-container">
                          
                          {/* Remitente (Locked) */}
                          <div className="form-group">
                            <label className="form-label">Nombre Completo o Razón Social (Protegido) *</label>
                            <input 
                              type="text" 
                              name="remitente" 
                              disabled 
                              value={formData.remitente}
                              className="form-input form-input-locked"
                            />
                          </div>

                          {/* Documento Tipo y Numero (Locked) */}
                          <div className="form-row">
                            <div className="form-group flex-1">
                              <label className="form-label">Tipo Documento</label>
                              <input
                                type="text"
                                disabled
                                value={formData.documentoTipo}
                                className="form-input form-input-locked"
                              />
                            </div>
                            <div className="form-group flex-2">
                              <label className="form-label">Número de Documento</label>
                              <input 
                                type="text" 
                                disabled 
                                value={formData.documentoNumero}
                                className="form-input form-input-locked"
                              />
                            </div>
                          </div>

                          {/* Email y Celular (Locked) */}
                          <div className="form-row">
                            <div className="form-group flex-1">
                              <label className="form-label">Correo Electrónico</label>
                              <input 
                                type="email" 
                                disabled 
                                value={formData.email}
                                className="form-input form-input-locked"
                              />
                            </div>
                            <div className="form-group flex-1">
                              <label className="form-label">Celular / Teléfono</label>
                              <input 
                                type="tel" 
                                disabled 
                                value={formData.celular}
                                className="form-input form-input-locked"
                              />
                            </div>
                          </div>

                          {/* Tipo de Trámite */}
                          <div className="form-group">
                            <label className="form-label">Tipo de Solicitud / Trámite *</label>
                            <select 
                              name="tramiteTipo" 
                              value={formData.tramiteTipo}
                              onChange={handleInputChange}
                              className="form-select"
                            >
                              <option value="Otros">Otros</option>
                              <option value="Emisión de Certificados / Constancias">Emisión de Certificados / Constancias</option>
                              <option value="Presentación de Oficios / Documentos varios">Presentación de Oficios / Documentos varios</option>
                              <option value="Sugerencias, Consultas y Reclamos">Sugerencias, Consultas y Reclamos</option>
                            </select>
                          </div>

                          {/* Asunto */}
                          <div className="form-group">
                            <label className="form-label">Asunto del Trámite *</label>
                            <input 
                              type="text" 
                              name="asunto" 
                              required 
                              value={formData.asunto}
                              onChange={handleInputChange}
                              placeholder="Ej. Solicitud de incorporación como miembro activo"
                              className="form-input"
                            />
                          </div>

                          {/* Mensaje */}
                          <div className="form-group">
                            <label className="form-label">Detalle de la Solicitud / Sumilla *</label>
                            <textarea 
                              name="mensaje" 
                              required 
                              rows={4}
                              value={formData.mensaje}
                              onChange={handleInputChange}
                              placeholder="Describe el sustento o sumilla de los documentos presentados..."
                              className="form-textarea"
                            />
                          </div>

                          {/* File Attachment */}
                          <div className="form-group">
                            <label className="form-label">Documento de Sustento (Adjunto) *</label>
                            <input 
                              type="file" 
                              ref={fileInputRef}
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                              onChange={handleFileChange}
                              style={{ display: "none" }}
                            />
                            
                            {!adjuntoUrl ? (
                              <div 
                                onClick={triggerFileInput}
                                className={`file-upload-dropzone ${uploading ? "uploading" : ""}`}
                              >
                                <svg className="upload-dropzone-icon" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="upload-dropzone-text">
                                  {uploading ? "Subiendo archivo..." : "Selecciona o sube tu documento"}
                                </span>
                                <span className="upload-dropzone-sub">PDF, Word o imagen de hasta 10MB</span>
                              </div>
                            ) : (
                              <div className="file-attached-preview">
                                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" style={{ color: "var(--crimson)", flexShrink: 0 }}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span className="file-name-attached truncate">{adjuntoNombre}</span>
                                <button 
                                  type="button" 
                                  onClick={handleRemoveFile} 
                                  className="btn-remove-file"
                                  title="Quitar archivo"
                                >
                                  ✕
                                </button>
                              </div>
                            )}
                          </div>

                          <button 
                            type="submit" 
                            disabled={submitting || uploading || !adjuntoUrl}
                            className="btn-submit-form"
                          >
                            {submitting ? "Procesando Envío..." : "Enviar Solicitud de Trámite"}
                          </button>
                        </form>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── TAB: VER MIS EXPEDIENTES ─── */}
                {activeTab === "mis-expedientes" && (
                  <div className="tab-view animate-fadeIn">
                    <div className="view-header">
                      <h2 className="view-title">Mis Expedientes</h2>
                      <p className="view-subtitle">Historial de solicitudes presentadas en la plataforma</p>
                    </div>

                    {filingsLoading ? (
                      <div className="loading-container">
                        <div className="spinner"></div>
                        <p>Cargando expedientes...</p>
                      </div>
                    ) : userFilings.length === 0 ? (
                      <div className="empty-state-card">
                        <svg className="empty-icon" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <h4>No se registraron expedientes</h4>
                        <p>Aún no has enviado ninguna solicitud en línea a través de esta cuenta.</p>
                        <button
                          onClick={() => setActiveTab("mesa-de-partes")}
                          className="btn-primary"
                          style={{ marginTop: "1rem" }}
                        >
                          Iniciar Primer Trámite
                        </button>
                      </div>
                    ) : (
                      <div className="table-responsive-card">
                        <table className="expedientes-table">
                          <thead>
                            <tr>
                              <th>Código</th>
                              <th>Fecha</th>
                              <th>Tipo de Trámite</th>
                              <th>Asunto</th>
                              <th>Estado</th>
                              <th>Archivo</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userFilings.map((f) => (
                              <tr key={f.id}>
                                <td className="td-code font-bold">{f.codigo}</td>
                                <td className="td-date">{f.fecha}</td>
                                <td className="td-type">{f.tramiteTipo}</td>
                                <td className="td-subject">{f.asunto}</td>
                                <td className="td-status">
                                  <span className={`status-badge badge-${f.status ? f.status.toLowerCase() : "pendiente"}`}>
                                    {f.status || "Pendiente"}
                                  </span>
                                </td>
                                <td className="td-file">
                                  {f.adjuntoUrl ? (
                                    <a
                                      href={f.adjuntoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="file-link-action"
                                      title={f.adjuntoNombre}
                                    >
                                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      <span>Ver</span>
                                    </a>
                                  ) : (
                                    <span className="no-file-label">Sin archivo</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* ─── TAB: BUSCAR EXPEDIENTES ─── */}
                {activeTab === "buscar-expedientes" && (
                  <div className="tab-view animate-fadeIn">
                    <div className="view-header">
                      <h2 className="view-title">Buscador de Expedientes</h2>
                      <p className="view-subtitle">Ingresa un código de seguimiento para consultar el estado actual en tiempo real</p>
                    </div>

                    <div className="search-engine-box">
                      <form onSubmit={handleSearch} className="search-form-row">
                        <input
                          type="text"
                          required
                          value={searchCode}
                          onChange={(e) => setSearchCode(e.target.value)}
                          placeholder="Ej. APROTURA-2026-1234"
                          className="form-input search-input"
                        />
                        <button
                          type="submit"
                          disabled={searchLoading}
                          className="btn-primary search-btn"
                        >
                          {searchLoading ? "Buscando..." : "Buscar"}
                        </button>
                      </form>
                    </div>

                    {searched && (
                      <div className="search-results-area animate-fadeIn">
                        {searchResult ? (
                          <div className="search-result-card">
                            <div className="result-card-header">
                              <div>
                                <span className="result-code-label">Código de Seguimiento</span>
                                <h3 className="result-code-value">{searchResult.codigo}</h3>
                              </div>
                              <span className={`status-badge badge-${searchResult.status ? searchResult.status.toLowerCase() : "pendiente"}`}>
                                {searchResult.status || "Pendiente"}
                              </span>
                            </div>

                            {/* Stepper progress bar */}
                            <div className="tracking-stepper">
                              <div className="step-item completed">
                                <div className="step-circle">
                                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <span className="step-label">Registrado</span>
                                <span className="step-sub">{searchResult.fecha}</span>
                              </div>

                              <div className={`step-item ${searchResult.status !== "Pendiente" ? "completed" : "active"}`}>
                                <div className="step-circle">
                                  {searchResult.status !== "Pendiente" ? (
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <div className="step-pulse"></div>
                                  )}
                                </div>
                                <span className="step-label">En Evaluación</span>
                                <span className="step-sub">{searchResult.status === "Pendiente" ? "En proceso..." : "Evaluado"}</span>
                              </div>

                              <div className={`step-item ${searchResult.status !== "Pendiente" ? "completed" : ""}`}>
                                <div className="step-circle">
                                  {searchResult.status !== "Pendiente" ? (
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                  ) : (
                                    <span>3</span>
                                  )}
                                </div>
                                <span className="step-label">Finalizado</span>
                                <span className="step-sub">
                                  {searchResult.status !== "Pendiente" ? "Trámite Atendido" : "Pendiente"}
                                </span>
                              </div>
                            </div>

                            <div className="result-details-grid">
                              <div className="result-detail-item">
                                <span className="r-label">Remitente:</span>
                                <span className="r-value">{searchResult.remitente}</span>
                              </div>
                              <div className="result-detail-item">
                                <span className="r-label">Documento:</span>
                                <span className="r-value">
                                  {searchResult.documentoTipo}: {searchResult.documentoNumero}
                                </span>
                              </div>
                              <div className="result-detail-item">
                                <span className="r-label">Tipo de Solicitud:</span>
                                <span className="r-value">{searchResult.tramiteTipo}</span>
                              </div>
                              <div className="result-detail-item">
                                <span className="r-label">Asunto:</span>
                                <span className="r-value">{searchResult.asunto}</span>
                              </div>
                              <div className="result-detail-item full-width">
                                <span className="r-label">Sumilla/Mensaje:</span>
                                <span className="r-value">{searchResult.mensaje}</span>
                              </div>
                              {searchResult.adjuntoUrl && (
                                <div className="result-detail-item full-width">
                                  <span className="r-label">Documento Adjunto:</span>
                                  <span className="r-value">
                                    <a
                                      href={searchResult.adjuntoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="file-download-link"
                                    >
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      {searchResult.adjuntoNombre || "Ver Documento"}
                                    </a>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="empty-state-card">
                            <svg className="empty-icon" width="64" height="64" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1" style={{ color: "var(--crimson)" }}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            <h4>Expediente No Encontrado</h4>
                            <p>No se pudo localizar ninguna solicitud asociada al código "{searchCode}".</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </main>

            </div>
          )}
        </div>
      </section>

      <style>{`
        .mesa-page-wrapper {
          padding-top: 7.5rem;
        }

        /* Hero Banner Styles (Nosotros-Style Curved Banner) */
        .mesa-hero {
          position: relative;
          overflow: hidden;
          border-bottom-right-radius: 80px;
          width: 100%;
          background: #ffffff;
        }

        /* ─── AUTHENTICATION STYLES ───────────────────────────────── */
        .auth-card-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .auth-card {
          width: 100%;
          max-width: 460px;
          background: var(--white);
          border-radius: 24px;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-md);
          padding: 2.5rem;
          text-align: left;
        }

        .auth-card.reg-card {
          max-width: 600px;
        }

        .auth-title {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 850;
          color: black;
          margin-bottom: 0.35rem;
          letter-spacing: -0.01em;
        }

        .auth-subtitle {
          font-size: 0.85rem;
          color: var(--graphite-light);
          margin-bottom: 2rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .auth-options {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.82rem;
        }

        .remember-me-label {
          display: flex;
          align-items: center;
          gap: 0.45rem;
          font-weight: 600;
          color: var(--graphite);
          cursor: pointer;
        }

        .remember-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--crimson);
          cursor: pointer;
        }

        .auth-link-btn {
          background: none;
          border: none;
          color: var(--crimson);
          font-weight: 700;
          cursor: pointer;
          font-size: 0.82rem;
        }

        .auth-link-btn:hover {
          text-decoration: underline;
        }

        .auth-footer {
          margin-top: 1.5rem;
          text-align: center;
          font-size: 0.85rem;
          color: var(--graphite-light);
        }

        .auth-action-link {
          background: none;
          border: none;
          color: var(--crimson);
          font-weight: 800;
          cursor: pointer;
          font-size: 0.85rem;
        }

        .auth-action-link:hover {
          text-decoration: underline;
        }

        .success-alert {
          background-color: rgba(40, 167, 69, 0.08);
          color: #28a745;
          border: 1px solid rgba(40, 167, 69, 0.15);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          font-size: 0.82rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        /* ─── DASHBOARD LAYOUT ───────────────────────────────────── */
        .dashboard-grid {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 2.5rem;
          align-items: start;
        }

        /* Sidebar Widget & Profile */
        .dashboard-sidebar {
          background: var(--white);
          border-radius: 20px;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .user-profile-widget {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--chalk-dark);
        }

        .avatar-circle {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: var(--crimson);
          color: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 1.25rem;
          flex-shrink: 0;
          border: 2px solid var(--gold);
        }

        .user-details {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .user-name {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--graphite);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-role {
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--graphite-light);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Sidebar Navigation */
        .sidebar-nav {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.85rem;
          padding: 0.75rem 1rem;
          background: transparent;
          border: none;
          color: var(--graphite-light);
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 700;
          border-radius: 10px;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          width: 100%;
        }

        .nav-item svg {
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .nav-item:hover {
          background-color: rgba(158, 27, 27, 0.04);
          color: var(--crimson);
        }

        .nav-item:hover svg {
          opacity: 1;
        }

        .nav-item.active {
          background-color: var(--crimson);
          color: var(--white);
        }

        .nav-item.active svg {
          opacity: 1;
        }

        .nav-item.nav-logout {
          color: var(--graphite-light);
          margin-top: 1.5rem;
          border-top: 1px solid var(--chalk-dark);
          padding-top: 1.25rem;
          border-radius: 0;
        }

        .nav-item.nav-logout:hover {
          background-color: rgba(0, 0, 0, 0.02);
          color: var(--crimson);
        }

        /* ─── TAB VIEW CONTENT ────────────────────────────────────── */
        .dashboard-content {
          background: var(--white);
          border-radius: 24px;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
          padding: 2.5rem;
          min-height: 500px;
        }

        .view-header {
          margin-bottom: 2rem;
          text-align: left;
        }

        .view-title {
          font-family: var(--font-display);
          font-size: 1.45rem;
          font-weight: 850;
          color: black;
          letter-spacing: -0.01em;
          margin-bottom: 0.3rem;
        }

        .view-subtitle {
          font-size: 0.85rem;
          color: var(--graphite-light);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          margin-bottom: 2.5rem;
        }

        .stat-card {
          background: var(--white);
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          padding: 1.25rem 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
          box-shadow: var(--shadow-sm);
        }

        .stat-icon-box {
          background: rgba(158, 27, 27, 0.06);
          color: var(--crimson);
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-icon-box.orange {
          background: rgba(235, 149, 42, 0.08);
          color: #eb952a;
        }

        .stat-icon-box.green {
          background: rgba(40, 167, 69, 0.08);
          color: #28a745;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }

        .stat-value {
          font-family: var(--font-display);
          font-size: 1.75rem;
          font-weight: 850;
          line-height: 1.1;
          color: var(--graphite);
        }

        .stat-value.text-orange { color: #eb952a; }
        .stat-value.text-green { color: #28a745; }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--graphite-light);
          text-transform: uppercase;
          letter-spacing: 0.02em;
          margin-top: 0.25rem;
        }

        /* Actions Card */
        .welcome-actions-card {
          background-color: var(--chalk);
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          padding: 2rem;
          text-align: left;
        }

        .actions-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--graphite);
          margin-bottom: 0.5rem;
        }

        .actions-text {
          font-size: 0.85rem;
          color: var(--graphite-light);
          margin-bottom: 1.5rem;
        }

        .actions-button-row {
          display: flex;
          gap: 1rem;
        }

        /* ─── WORK FORM (MESA TAB) OVERWRITES ──────────────────────── */
        .form-card {
          border: none;
          box-shadow: none;
          padding: 0;
          background: transparent;
        }

        .form-input-locked {
          background-color: #f7f7f9 !important;
          color: var(--graphite-light) !important;
          border-color: var(--chalk-dark) !important;
          cursor: not-allowed;
          font-weight: 600;
        }

        /* Loading / Spinner */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 0;
          gap: 1rem;
          color: var(--graphite-light);
          font-size: 0.85rem;
        }

        .spinner {
          width: 32px;
          height: 32px;
          border: 3px solid rgba(158, 27, 27, 0.1);
          border-top: 3px solid var(--crimson);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Empty State */
        .empty-state-card {
          border: 2px dashed var(--chalk-dark);
          border-radius: 16px;
          padding: 3.5rem 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.85rem;
        }

        .empty-icon {
          color: var(--graphite-light);
          opacity: 0.5;
        }

        .empty-state-card h4 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--graphite);
          margin: 0;
        }

        .empty-state-card p {
          font-size: 0.82rem;
          color: var(--graphite-light);
          margin: 0;
          max-width: 340px;
          line-height: 1.5;
        }

        /* ─── EXPEDIENTES TABLE ──────────────────────────────────── */
        .table-responsive-card {
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          overflow-x: auto;
          width: 100%;
        }

        .expedientes-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.82rem;
        }

        .expedientes-table th {
          background-color: var(--chalk);
          color: var(--graphite);
          font-weight: 750;
          padding: 1rem 1.25rem;
          border-bottom: 1.5px solid var(--chalk-dark);
        }

        .expedientes-table td {
          padding: 1.1rem 1.25rem;
          border-bottom: 1px solid var(--chalk-dark);
          color: var(--graphite-light);
          white-space: nowrap;
        }

        .expedientes-table tr:last-child td {
          border-bottom: none;
        }

        .td-code {
          color: var(--crimson);
          font-family: monospace;
          font-size: 0.85rem;
        }

        .td-subject {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          padding: 0.3rem 0.6rem;
          border-radius: 6px;
          font-size: 0.72rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .badge-pendiente {
          background-color: rgba(235, 149, 42, 0.08);
          color: #eb952a;
        }

        .badge-aprobado, .badge-resuelto, .badge-atendido {
          background-color: rgba(40, 167, 69, 0.08);
          color: #28a745;
        }

        .badge-observado {
          background-color: rgba(0, 123, 255, 0.08);
          color: #007bff;
        }

        .badge-rechazado {
          background-color: rgba(220, 53, 69, 0.08);
          color: #dc3545;
        }

        .file-link-action {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          color: var(--crimson);
          font-weight: 750;
          transition: color 0.2s;
        }

        .file-link-action:hover {
          color: var(--gold);
        }

        .no-file-label {
          color: #c0c0c0;
          font-style: italic;
        }

        /* ─── SEARCH TICKET ENGINE ───────────────────────────────── */
        .search-engine-box {
          background: var(--chalk);
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .search-form-row {
          display: flex;
          gap: 1rem;
        }

        .search-input {
          flex: 1;
          background: var(--white);
        }

        .search-btn {
          padding: 0 2rem !important;
          height: 100%;
        }

        .search-results-area {
          margin-top: 1.5rem;
        }

        .search-result-card {
          background: var(--white);
          border: 1px solid var(--chalk-dark);
          border-radius: 16px;
          padding: 2rem;
          text-align: left;
          box-shadow: var(--shadow-sm);
        }

        .result-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid var(--chalk-dark);
          padding-bottom: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .result-code-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--graphite-light);
          text-transform: uppercase;
        }

        .result-code-value {
          font-family: var(--font-display);
          font-size: 1.35rem;
          font-weight: 850;
          color: var(--crimson);
          margin-top: 0.1rem;
        }

        /* Tracking Stepper */
        .tracking-stepper {
          display: flex;
          justify-content: space-between;
          position: relative;
          margin: 2rem 0 2.5rem 0;
          padding: 0 1rem;
        }

        .tracking-stepper::before {
          content: "";
          position: absolute;
          top: 16px;
          left: 2rem;
          right: 2rem;
          height: 3px;
          background-color: var(--chalk-dark);
          z-index: 1;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          width: 100px;
        }

        .step-circle {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          background-color: var(--white);
          border: 3px solid var(--chalk-dark);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.8rem;
          font-weight: 800;
          color: var(--graphite-light);
          transition: all 0.3s;
        }

        .step-label {
          font-size: 0.78rem;
          font-weight: 750;
          color: var(--graphite-light);
          margin-top: 0.75rem;
          text-align: center;
          white-space: nowrap;
        }

        .step-sub {
          font-size: 0.68rem;
          color: #a0a0a0;
          margin-top: 0.15rem;
        }

        /* Active & Completed step status */
        .step-item.completed .step-circle {
          background-color: var(--crimson);
          border-color: var(--crimson);
          color: var(--white);
        }

        .step-item.completed .step-label {
          color: var(--crimson);
        }

        .step-item.active .step-circle {
          border-color: var(--crimson);
          color: var(--crimson);
        }

        .step-item.active .step-label {
          color: var(--graphite);
        }

        .step-pulse {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: var(--crimson);
          animation: pulse 1.5s infinite ease-in-out;
        }

        @keyframes pulse {
          0% { transform: scale(0.8); opacity: 0.5; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.8); opacity: 0.5; }
        }

        .result-details-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
          background-color: var(--chalk);
          border: 1px solid var(--chalk-dark);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .result-detail-item {
          display: flex;
          flex-direction: column;
          text-align: left;
          gap: 0.25rem;
        }

        .result-detail-item.full-width {
          grid-column: 1 / span 2;
        }

        .r-label {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--graphite-light);
          text-transform: uppercase;
        }

        .r-value {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--graphite);
          line-height: 1.5;
        }

        .file-download-link {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          color: var(--crimson);
          text-decoration: none;
          font-weight: 750;
        }

        .file-download-link:hover {
          color: var(--gold);
        }

        /* ─── GENERAL FORM FIELDS ────────────────────────────────── */
        .form-card {
          background: var(--white);
          border-radius: 24px;
          border: 1px solid var(--chalk-dark);
          box-shadow: var(--shadow-sm);
          padding: 2.5rem;
          text-align: left;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.45rem;
        }

        .form-row {
          display: flex;
          gap: 1.2rem;
        }

        .flex-1 { flex: 1; }
        .flex-2 { flex: 2; }

        .form-label {
          font-size: 0.76rem;
          font-weight: 700;
          color: var(--graphite);
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          border: 1.5px solid var(--chalk-dark);
          border-radius: 8px;
          padding: 0.65rem 0.85rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          color: var(--graphite);
          background-color: var(--white);
          outline: none;
          transition: border-color 0.2s;
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: #b0b0b0;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: var(--crimson);
        }

        .form-textarea {
          resize: vertical;
        }

        /* Dropzone Upload */
        .file-upload-dropzone {
          border: 1.5px dashed var(--chalk-dark);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.2s;
          background: #fbf9f9;
        }

        .file-upload-dropzone:hover {
          border-color: var(--crimson);
          background: #fffafa;
        }

        .file-upload-dropzone.uploading {
          opacity: 0.7;
          cursor: not-allowed;
          background: var(--chalk);
        }

        .upload-dropzone-icon {
          color: var(--graphite-light);
          transition: color 0.2s;
        }

        .file-upload-dropzone:hover .upload-dropzone-icon {
          color: var(--crimson);
        }

        .upload-dropzone-text {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--graphite);
        }

        .upload-dropzone-sub {
          font-size: 0.72rem;
          color: var(--graphite-light);
        }

        /* Attached preview */
        .file-attached-preview {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background-color: #fffafa;
          border: 1.5px solid rgba(158, 27, 27, 0.15);
          padding: 0.65rem 1rem;
          border-radius: 8px;
        }

        .file-name-attached {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--graphite);
          flex: 1;
        }

        .btn-remove-file {
          background: none;
          border: none;
          color: var(--graphite-light);
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.2rem 0.4rem;
          border-radius: 4px;
          transition: background 0.2s, color 0.2s;
        }

        .btn-remove-file:hover {
          background: rgba(158, 27, 27, 0.05);
          color: var(--crimson);
        }

        /* Submit Button */
        .btn-submit-form {
          width: 100%;
          background-color: var(--crimson);
          color: var(--white);
          border: none;
          font-size: 0.88rem;
          font-weight: 700;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s, transform 0.1s;
          text-align: center;
          margin-top: 0.5rem;
        }

        .btn-submit-form:hover:not(:disabled) {
          background-color: var(--gold-dark);
        }

        .btn-submit-form:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Success Container */
        .success-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .success-icon-wrapper {
          background-color: rgba(40, 167, 69, 0.1);
          color: #28a745;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }

        .success-details-card {
          width: 100%;
          background-color: var(--chalk);
          border: 1px solid var(--chalk-dark);
          border-radius: 12px;
          padding: 1.25rem 1.5rem;
          margin: 1.5rem 0;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          font-size: 0.82rem;
          border-bottom: 1px dashed rgba(0,0,0,0.05);
          padding-bottom: 0.5rem;
        }

        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-label {
          color: var(--graphite-light);
          font-weight: 500;
        }

        .detail-value {
          color: var(--graphite);
          font-weight: 700;
          text-align: right;
        }

        .detail-value.highlight {
          color: var(--crimson);
          font-size: 0.95rem;
        }

        .success-notice {
          font-size: 0.78rem;
          line-height: 1.5;
          color: var(--graphite-light);
          margin-bottom: 2rem;
        }

        .btn-success-action {
          width: 100%;
          background-color: var(--graphite);
          color: var(--white);
          border: none;
          font-size: 0.85rem;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .btn-success-action:hover {
          background-color: var(--crimson);
        }

        /* ─── RESPONSIVE UTILITIES ────────────────────────────────── */
        @media (max-width: 991px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .dashboard-sidebar {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 1.25rem;
          }
          .user-profile-widget {
            border-bottom: none;
            padding-bottom: 0;
          }
          .sidebar-nav {
            flex-direction: row;
            flex-wrap: wrap;
            width: 100%;
            gap: 0.5rem;
            margin-top: 1rem;
          }
          .nav-item {
            width: auto;
            flex: 1;
            min-width: 130px;
            justify-content: center;
          }
          .nav-item.nav-logout {
            margin-top: 0;
            border-top: none;
            padding-top: 0.75rem;
          }
          .stats-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
          .mesa-page-wrapper {
            padding-top: 5.5rem;
          }
          .mesa-hero {
            border-bottom-right-radius: 50px;
          }
        }

        @media (max-width: 768px) {
          .result-details-grid {
            grid-template-columns: 1fr;
          }
          .result-detail-item.full-width {
            grid-column: 1;
          }
          .tracking-stepper {
            flex-direction: column;
            gap: 1.5rem;
            align-items: flex-start;
            padding-left: 2.5rem;
          }
          .tracking-stepper::before {
            top: 0;
            bottom: 0;
            left: 2.1rem;
            width: 3px;
            height: auto;
          }
          .step-item {
            flex-direction: row;
            align-items: center;
            width: 100%;
            gap: 1.5rem;
            text-align: left;
          }
          .step-label {
            margin-top: 0;
            text-align: left;
          }
        }

        @media (max-width: 576px) {
          .form-row {
            flex-direction: column;
            gap: 1.2rem;
          }
          .form-card, .success-container, .auth-card {
            padding: 1.5rem;
          }
          .actions-button-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
