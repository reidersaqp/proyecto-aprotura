"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

function getVideoEmbedUrl(url: string): string | null {
  if (!url) return null;
  
  // YouTube Check
  const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytReg);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://www.youtube.com/embed/${ytMatch[2]}`;
  }
  
  // TikTok Check
  const ttMatch = url.match(/\/video\/(\d+)/);
  if (ttMatch) {
    return `https://www.tiktok.com/embed/v2/${ttMatch[1]}`;
  }
  
  // Facebook Check
  if (url.includes("facebook.com") || url.includes("fb.watch")) {
    if (url.includes("/share/") || url.includes("fb.watch")) {
      return `https://www.facebook.com/plugins/post.php?href=${encodeURIComponent(url)}&show_text=0&width=500`;
    }
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=0&width=560`;
  }
  
  // Instagram Check
  const igMatch = url.match(/(?:instagram\.com)\/(?:p|reel|tv)\/([A-Za-z0-9-_]+)/);
  if (igMatch) {
    return `https://www.instagram.com/p/${igMatch[1]}/embed/`;
  }

  // Direct video file or stream check
  if (url.match(/\.(mp4|webm|ogg|m3u8)(?:\?.*)?$/i)) {
    return `DIRECT_VIDEO:${url}`;
  }
  
  return null;
}

function getVideoThumbnailUrl(url: string): string | null {
  if (!url) return null;
  
  // YouTube
  const ytReg = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const ytMatch = url.match(ytReg);
  if (ytMatch && ytMatch[2].length === 11) {
    return `https://img.youtube.com/vi/${ytMatch[2]}/hqdefault.jpg`;
  }
  
  // TikTok / Facebook / Instagram / Direct stream fallback
  if (
    url.includes("tiktok.com") || 
    url.includes("facebook.com") || 
    url.includes("fb.watch") || 
    url.includes("instagram.com") ||
    url.match(/\.(mp4|webm|ogg|m3u8)(?:\?.*)?$/i)
  ) {
    return "VIDEO_PLACEHOLDER";
  }
  
  return null;
}


export default function AdminDashboardPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState("banners"); // default to banners manager
  const [modalImage, setModalImage] = useState<string | null>(null);

  // Banners state
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementLink, setAnnouncementLink] = useState("");
  const [announcementLinkText, setAnnouncementLinkText] = useState("");
  const [announcementStatus, setAnnouncementStatus] = useState("Sin publicar");

  // Slides state
  const [slides, setSlides] = useState<any[]>([]);
  const [newSlide, setNewSlide] = useState({
    badge: "",
    title: "",
    highlightText: "",
    description: "",
    ctaText: "Ver más",
    ctaLink: "/contacto",
    btnStyle: "primary",
    image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
    onlyImage: true,
  });

  // Noticias state
  const [noticias, setNoticias] = useState<any[]>([]);
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [mensajes, setMensajes] = useState<any[]>([]);
  const [newNoticia, setNewNoticia] = useState<{
    titulo: string;
    categoria: string;
    resumen: string;
    lugar: string;
    fecha: string;
    imagen: string;
    imagenes: string[];
    link: string;
    contenido: string;
  }>({
    titulo: "",
    categoria: "Eventos",
    resumen: "",
    lugar: "Arequipa",
    fecha: "",
    imagen: "",
    imagenes: [],
    link: "",
    contenido: "",
  });

  // Galería state
  const [galeriaItems, setGaleriaItems] = useState<any[]>([]);
  const [newGaleria, setNewGaleria] = useState<{
    titulo: string;
    categoria: string;
    descripcion: string;
    ubicacion: string;
    fecha: string;
    imagen: string;
    imagenes: string[];
  }>({
    titulo: "",
    categoria: "Eventos",
    descripcion: "",
    ubicacion: "Arequipa",
    fecha: "",
    imagen: "",
    imagenes: [],
  });
  const [galeriaUploading, setGaleriaUploading] = useState(false);

  // Edit Galería state
  const [editingGaleria, setEditingGaleria] = useState<any | null>(null);
  const [editGaleriaForm, setEditGaleriaForm] = useState<{
    titulo: string;
    categoria: string;
    descripcion: string;
    ubicacion: string;
    fecha: string;
    imagen: string;
    imagenes: string[];
    ids: string[];
  }>({
    titulo: "",
    categoria: "Eventos",
    descripcion: "",
    ubicacion: "Arequipa",
    fecha: "",
    imagen: "",
    imagenes: [],
    ids: [],
  });
  const [editGaleriaUploading, setEditGaleriaUploading] = useState(false);

  // Edit Noticia state
  const [editingNoticia, setEditingNoticia] = useState<any | null>(null);
  const [editNoticiaForm, setEditNoticiaForm] = useState<{
    id: string;
    titulo: string;
    categoria: string;
    resumen: string;
    lugar: string;
    fecha: string;
    imagen: string;
    imagenes: string[];
    contenido: string;
  }>({
    id: "",
    titulo: "",
    categoria: "Eventos",
    resumen: "",
    lugar: "Arequipa",
    fecha: "",
    imagen: "",
    imagenes: [],
    contenido: "",
  });
  const [editNoticiaUploading, setEditNoticiaUploading] = useState(false);


  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setNotification("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.url) {
          setNewSlide((prev) => ({ ...prev, image: data.url }));
          showNotification("¡Imagen subida y enlazada con éxito!");
        } else {
          showNotification("Error en el formato de respuesta de subida.");
        }
      } else {
        const errorData = await res.json();
        showNotification(errorData.error || "Error al subir la imagen.");
      }
    } catch (err) {
      showNotification("Error de red al subir archivo.");
    } finally {
      setUploading(false);
    }
  };

  // Check auth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const logged = localStorage.getItem("admin_logged");
      if (logged !== "true") {
        router.push("/control-secreto");
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  // Auto-resolve redirect URLs for Galería
  useEffect(() => {
    if (!newGaleria.imagen) return;
    const isFacebookShare = newGaleria.imagen.includes("facebook.com") || newGaleria.imagen.includes("fb.watch");
    
    // Only resolve if it's a share/redirect link
    if (isFacebookShare && (newGaleria.imagen.includes("/share/") || newGaleria.imagen.includes("fb.watch"))) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`/api/resolve-url?url=${encodeURIComponent(newGaleria.imagen)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.resolvedUrl && data.resolvedUrl !== newGaleria.imagen) {
              setNewGaleria((prev) => ({ ...prev, imagen: data.resolvedUrl }));
            }
          }
        } catch (err) {
          console.error("Error auto-resolving gallery URL:", err);
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(delayDebounce);
    }
  }, [newGaleria.imagen]);

  // Auto-resolve redirect URLs for Noticias
  useEffect(() => {
    if (!newNoticia.imagen) return;
    const isFacebookShare = newNoticia.imagen.includes("facebook.com") || newNoticia.imagen.includes("fb.watch");
    
    if (isFacebookShare && (newNoticia.imagen.includes("/share/") || newNoticia.imagen.includes("fb.watch"))) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`/api/resolve-url?url=${encodeURIComponent(newNoticia.imagen)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.resolvedUrl && data.resolvedUrl !== newNoticia.imagen) {
              setNewNoticia((prev) => ({ ...prev, imagen: data.resolvedUrl }));
            }
          }
        } catch (err) {
          console.error("Error auto-resolving news URL:", err);
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(delayDebounce);
    }
  }, [newNoticia.imagen]);

  // Auto-resolve redirect URLs for Edit Galería
  useEffect(() => {
    if (!editGaleriaForm.imagen) return;
    const isFacebookShare = editGaleriaForm.imagen.includes("facebook.com") || editGaleriaForm.imagen.includes("fb.watch");
    
    if (isFacebookShare && (editGaleriaForm.imagen.includes("/share/") || editGaleriaForm.imagen.includes("fb.watch"))) {
      const delayDebounce = setTimeout(async () => {
        try {
          const res = await fetch(`/api/resolve-url?url=${encodeURIComponent(editGaleriaForm.imagen)}`);
          if (res.ok) {
            const data = await res.json();
            if (data.resolvedUrl && data.resolvedUrl !== editGaleriaForm.imagen) {
              setEditGaleriaForm((prev) => ({ ...prev, imagen: data.resolvedUrl }));
            }
          }
        } catch (err) {
          console.error("Error auto-resolving edit gallery URL:", err);
        }
      }, 500); // 500ms debounce
      return () => clearTimeout(delayDebounce);
    }
  }, [editGaleriaForm.imagen]);

  // Fetch current database values
  useEffect(() => {
    if (!authorized) return;

    const fetchCurrentConfig = async () => {
      try {
        // Fetch active announcement
        const annRes = await fetch("/api/active-announcement");
        if (annRes.ok) {
          const annData = await annRes.json();
          if (annData && annData.text) {
            setAnnouncementText(annData.text);
            setAnnouncementLink(annData.link || "");
            setAnnouncementLinkText(annData.linkText || "");
            setAnnouncementStatus("Publicado");
          }
        }

        // Fetch slides
        const slidesRes = await fetch("/api/active-slides");
        if (slidesRes.ok) {
          const slidesData = await slidesRes.json();
          setSlides(slidesData || []);
        }

        // Fetch news/noticias
        const newsRes = await fetch("/api/active-news");
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          setNoticias(newsData || []);
        }

        // Fetch solicitudes/mesa-de-partes
        const solRes = await fetch("/api/mesa-de-partes");
        if (solRes.ok) {
          const solData = await solRes.json();
          setSolicitudes(solData || []);
        }

        // Fetch galeria items
        const galRes = await fetch("/api/galeria");
        if (galRes.ok) {
          const galData = await galRes.json();
          setGaleriaItems(galData || []);
        }

        // Fetch contact messages
        const msgRes = await fetch("/api/contacto");
        if (msgRes.ok) {
          const msgData = await msgRes.json();
          setMensajes(msgData || []);
        }
      } catch (err) {
        console.error("Error fetching admin configurations:", err);
      }
    };

    fetchCurrentConfig();
  }, [authorized]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_logged");
    }
    router.push("/control-secreto");
  };

  // Save top announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    try {
      const response = await fetch("/api/active-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: announcementText,
          link: announcementLink,
          linkText: announcementLinkText,
        }),
      });

      if (response.ok) {
        setAnnouncementStatus(announcementText ? "Publicado" : "Deshabilitado");
        showNotification("¡Anuncio de barra superior actualizado con éxito!");
      } else {
        showNotification("Error al guardar el anuncio.");
      }
    } catch (err) {
      showNotification("Error en la petición de red.");
    } finally {
      setLoading(false);
    }
  };

  // Clear top announcement
  const handleClearAnnouncement = async () => {
    setLoading(true);
    setNotification("");
    setAnnouncementText("");
    setAnnouncementLink("");
    setAnnouncementLinkText("");

    try {
      const response = await fetch("/api/active-announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(null),
      });

      if (response.ok) {
        setAnnouncementStatus("Deshabilitado");
        showNotification("¡Anuncio superior deshabilitado con éxito!");
      }
    } catch (err) {
      showNotification("Error al deshabilitar el anuncio.");
    } finally {
      setLoading(false);
    }
  };

  // Add slide banner
  const handleAddSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    const slideToAdd = {
      ...newSlide,
      id: "slide_" + Date.now(),
      waves: [
        { color: "var(--crimson)", size: 400, top: -100, right: -100, opacity: 0.06 },
        { color: "var(--gold)", size: 300, bottom: -50, right: 150, opacity: 0.04 }
      ]
    };

    const updatedSlides = [...slides, slideToAdd];

    try {
      const response = await fetch("/api/active-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlides),
      });

      if (response.ok) {
        setSlides(updatedSlides);
        showNotification("¡Nueva diapositiva añadida al carrusel de inicio!");
        // Reset slide form to default placeholders
        setNewSlide({
          badge: "",
          title: "",
          highlightText: "",
          description: "",
          ctaText: "Ver más",
          ctaLink: "/contacto",
          btnStyle: "primary",
          image: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=600&q=80",
          onlyImage: true,
        });
      } else {
        showNotification("Error al guardar diapositiva.");
      }
    } catch (err) {
      showNotification("Error en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  // Delete slide banner
  const handleDeleteSlide = async (idToDelete: string) => {
    setLoading(true);
    setNotification("");
    const updatedSlides = slides.filter(s => s.id !== idToDelete);

    try {
      const response = await fetch("/api/active-slides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlides),
      });

      if (response.ok) {
        setSlides(updatedSlides);
        showNotification("¡Diapositiva eliminada con éxito!");
      } else {
        showNotification("Error al guardar cambios de eliminación.");
      }
    } catch (err) {
      showNotification("Error al eliminar.");
    } finally {
      setLoading(false);
    }
  };

  // Noticias handlers
  const [newsUploading, setNewsUploading] = useState(false);

  const handleNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setNewsUploading(true);
    setNotification("");

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Error uploading news file", file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      setNewNoticia((prev) => {
        const newUrls = [...(prev.imagenes || []), ...uploadedUrls];
        return {
          ...prev,
          imagenes: newUrls,
          imagen: prev.imagen || newUrls[0] || "",
        };
      });
      showNotification(`¡${uploadedUrls.length} imagen(es) subida(s) con éxito!`);
    } else {
      showNotification("Error al subir las imágenes.");
    }
    setNewsUploading(false);
  };

  const handleAddNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let formattedNoticiaDate = newNoticia.fecha;
    if (formattedNoticiaDate) {
      const parts = formattedNoticiaDate.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        formattedNoticiaDate = `${day} ${months[monthIndex]} ${year}`;
      }
    } else {
      const today = new Date();
      formattedNoticiaDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    }

    const noticiaToAdd = {
      ...newNoticia,
      id: "news_" + Date.now(),
      fecha: formattedNoticiaDate,
    };

    const updatedNoticias = [...noticias, noticiaToAdd];

    try {
      const response = await fetch("/api/active-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNoticias),
      });

      if (response.ok) {
        setNoticias(updatedNoticias);
        showNotification("¡Noticia publicada con éxito!");
        // Reset form
        setNewNoticia({
          titulo: "",
          categoria: "Eventos",
          resumen: "",
          lugar: "Arequipa",
          fecha: "",
          imagen: "",
          imagenes: [],
          link: "",
          contenido: "",
        });
      } else {
        showNotification("Error al publicar la noticia.");
      }
    } catch (err) {
      showNotification("Error en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNoticia = async (idToDelete: string) => {
    setLoading(true);
    setNotification("");
    const updatedNoticias = noticias.filter(n => n.id !== idToDelete);

    try {
      const response = await fetch("/api/active-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNoticias),
      });

      if (response.ok) {
        setNoticias(updatedNoticias);
        showNotification("¡Noticia eliminada con éxito!");
      } else {
        showNotification("Error al guardar cambios de eliminación.");
      }
    } catch (err) {
      showNotification("Error al eliminar la noticia.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setLoading(true);
    setNotification("");
    try {
      const response = await fetch("/api/mesa-de-partes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSolicitudes((prev) =>
            prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
          );
          showNotification("¡Estado del trámite actualizado con éxito!");
        } else {
          showNotification("Error al actualizar el estado del trámite.");
        }
      } else {
        showNotification("Error del servidor al actualizar.");
      }
    } catch (err) {
      showNotification("Error de red al actualizar.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSolicitud = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar permanentemente este trámite?")) return;
    setLoading(true);
    setNotification("");
    try {
      const response = await fetch(`/api/mesa-de-partes?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setSolicitudes((prev) => prev.filter((s) => s.id !== id));
        showNotification("¡Trámite de mesa de partes eliminado!");
      } else {
        showNotification("Error al eliminar el trámite.");
      }
    } catch (err) {
      showNotification("Error de red al eliminar.");
    } finally {
      setLoading(false);
    }
  };

  // Galería handlers
  const handleGaleriaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setGaleriaUploading(true);
    setNotification("");

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Error uploading gallery file", file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      setNewGaleria((prev) => {
        const newUrls = [...(prev.imagenes || []), ...uploadedUrls];
        return {
          ...prev,
          imagenes: newUrls,
          imagen: prev.imagen || newUrls[0] || "",
        };
      });
      showNotification(`¡${uploadedUrls.length} imagen(es) subida(s) con éxito!`);
    } else {
      showNotification("Error al subir las imágenes.");
    }
    setGaleriaUploading(false);
  };

  const handleAddGaleria = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    const today = new Date();
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    let finalFecha = formattedDate;
    if (newGaleria.fecha) {
      const parts = newGaleria.fecha.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        finalFecha = `${day} ${months[monthIndex]} ${year}`;
      }
    }

    const urlsToSave = [...(newGaleria.imagenes || [])];
    if (newGaleria.imagen && !urlsToSave.includes(newGaleria.imagen)) {
      urlsToSave.unshift(newGaleria.imagen);
    }

    try {
      const results: any[] = [];
      let successCount = 0;

      for (const imgUrl of urlsToSave) {
        if (!imgUrl) continue;

        const galeriaToAdd = {
          titulo: newGaleria.titulo,
          categoria: newGaleria.categoria,
          imagen: imgUrl,
          descripcion: newGaleria.descripcion,
          ubicacion: newGaleria.ubicacion,
          fecha: finalFecha,
        };

        const response = await fetch("/api/galeria", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(galeriaToAdd),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            results.push(result.data);
            successCount++;
          }
        }
      }

      if (successCount > 0) {
        setGaleriaItems((prev) => [...results, ...prev]);
        showNotification(`¡${successCount} foto(s) publicada(s) en la galería!`);
        setNewGaleria({
          titulo: "",
          categoria: "Eventos",
          descripcion: "",
          ubicacion: "Arequipa",
          fecha: "",
          imagen: "",
          imagenes: [],
        });
      } else {
        showNotification("Error al publicar fotos en la galería.");
      }
    } catch (err) {
      showNotification("Error en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGaleria = async (idOrIds: string | string[]) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    if (!confirm("¿Está seguro de que desea eliminar esta publicación de la galería?")) return;
    setLoading(true);
    setNotification("");
    try {
      let success = true;
      for (const id of ids) {
        const response = await fetch(`/api/galeria?id=${id}`, {
          method: "DELETE",
        });
        if (!response.ok) success = false;
      }
      if (success) {
        setGaleriaItems((prev) => prev.filter((g) => !ids.includes(g.id)));
        showNotification("Publicación eliminada de la galería.");
      } else {
        showNotification("Error al eliminar algunos elementos de la galería.");
      }
    } catch (err) {
      showNotification("Error de red al eliminar.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditGaleriaImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEditGaleriaUploading(true);
    setNotification("");

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Error uploading gallery file during edit", file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      setEditGaleriaForm((prev) => {
        const newUrls = [...(prev.imagenes || []), ...uploadedUrls];
        return {
          ...prev,
          imagenes: newUrls,
          imagen: prev.imagen || newUrls[0] || "",
        };
      });
      showNotification(`¡${uploadedUrls.length} imagen(es) subida(s) con éxito!`);
    } else {
      showNotification("Error al subir las imágenes.");
    }
    setEditGaleriaUploading(false);
  };

  const handleUpdateGaleria = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    const urlsToSave = [...(editGaleriaForm.imagenes || [])];
    if (editGaleriaForm.imagen && !urlsToSave.includes(editGaleriaForm.imagen)) {
      urlsToSave.unshift(editGaleriaForm.imagen);
    }

    const today = new Date();
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const formattedDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;

    let finalFecha = formattedDate;
    if (editGaleriaForm.fecha) {
      const parts = editGaleriaForm.fecha.split("-");
      if (parts.length === 3) {
        const year = parts[0];
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        finalFecha = `${day} ${months[monthIndex]} ${year}`;
      } else {
        finalFecha = editGaleriaForm.fecha;
      }
    }

    try {
      const response = await fetch("/api/galeria", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: editGaleriaForm.ids,
          titulo: editGaleriaForm.titulo,
          categoria: editGaleriaForm.categoria,
          descripcion: editGaleriaForm.descripcion,
          ubicacion: editGaleriaForm.ubicacion,
          fecha: finalFecha,
          images: urlsToSave,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          const galRes = await fetch("/api/galeria");
          if (galRes.ok) {
            const galData = await galRes.json();
            setGaleriaItems(galData || []);
          }
          setEditingGaleria(null);
          showNotification("¡Publicación de la galería actualizada con éxito!");
        } else {
          showNotification("Error al actualizar la galería.");
        }
      } else {
        showNotification("Error del servidor al actualizar.");
      }
    } catch (err) {
      console.error(err);
      showNotification("Error en la conexión.");
    } finally {
      setLoading(false);
    }
  };

  const parseFechaForInput = (fechaStr: string) => {
    if (!fechaStr) return "";
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const parts = fechaStr.split(" ");
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      const monthIndex = months.indexOf(parts[1]);
      if (monthIndex !== -1) {
        const month = String(monthIndex + 1).padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    return "";
  };

  const startEditGaleria = (g: any) => {
    setEditingGaleria(g);
    const filteredImages = (g.images || [])
      .filter((img: string) => img && img.trim() !== "" && img !== g.imagen);
    
    setEditGaleriaForm({
      titulo: g.titulo,
      categoria: g.categoria,
      descripcion: g.descripcion,
      ubicacion: g.ubicacion,
      fecha: parseFechaForInput(g.fecha),
      imagen: g.imagen,
      imagenes: filteredImages,
      ids: g.ids,
    });
  };

  const parseNewsFechaForInput = (fechaStr: string) => {
    if (!fechaStr) return "";
    const monthsLong = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const monthsShort = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    
    if (fechaStr.includes("/")) {
      const parts = fechaStr.split("/");
      if (parts.length === 3) {
        const day = parts[0].padStart(2, "0");
        const month = parts[1].padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    const parts = fechaStr.trim().split(/\s+/);
    if (parts.length === 3) {
      const day = parts[0].padStart(2, "0");
      let monthIndex = monthsLong.findIndex(m => m.toLowerCase() === parts[1].toLowerCase());
      if (monthIndex === -1) {
        monthIndex = monthsShort.findIndex(m => m.toLowerCase() === parts[1].toLowerCase());
      }
      if (monthIndex !== -1) {
        const month = String(monthIndex + 1).padStart(2, "0");
        const year = parts[2];
        return `${year}-${month}-${day}`;
      }
    }
    return "";
  };

  const startEditNoticia = (n: any) => {
    setEditingNoticia(n);
    setEditNoticiaForm({
      id: n.id,
      titulo: n.titulo,
      categoria: n.categoria || "Eventos",
      resumen: n.resumen || "",
      lugar: n.lugar || "Arequipa",
      fecha: parseNewsFechaForInput(n.fecha),
      imagen: n.imagen || "",
      imagenes: n.imagenes || [],
      contenido: n.contenido || "",
    });
  };

  const handleUpdateNoticia = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification("");

    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    let formattedNoticiaDate = editNoticiaForm.fecha;
    if (formattedNoticiaDate) {
      const parts = formattedNoticiaDate.split("-");
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const monthIndex = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        formattedNoticiaDate = `${day} ${months[monthIndex]} ${year}`;
      }
    } else {
      const today = new Date();
      formattedNoticiaDate = `${today.getDate()} ${months[today.getMonth()]} ${today.getFullYear()}`;
    }

    const updatedNoticia = {
      ...editNoticiaForm,
      fecha: formattedNoticiaDate,
    };

    const updatedNoticias = noticias.map((n) =>
      n.id === editNoticiaForm.id ? updatedNoticia : n
    );

    try {
      const response = await fetch("/api/active-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNoticias),
      });

      if (response.ok) {
        setNoticias(updatedNoticias);
        setEditingNoticia(null);
        showNotification("¡Noticia actualizada con éxito!");
      } else {
        showNotification("Error al guardar los cambios de la noticia.");
      }
    } catch (err) {
      showNotification("Error de red al actualizar la noticia.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditNewsImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setEditNoticiaUploading(true);
    setNotification("");

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (err) {
        console.error("Error uploading edit news file", file.name, err);
      }
    }

    if (uploadedUrls.length > 0) {
      setEditNoticiaForm((prev) => {
        const newUrls = [...(prev.imagenes || []), ...uploadedUrls];
        return {
          ...prev,
          imagenes: newUrls,
          imagen: prev.imagen || newUrls[0] || "",
        };
      });
      showNotification(`¡${uploadedUrls.length} imagen(es) subida(s) con éxito!`);
    } else {
      showNotification("Error al subir las imágenes.");
    }
    setEditNoticiaUploading(false);
  };



  const handleDeleteMensaje = async (id: string) => {
    if (!confirm("¿Está seguro de que desea eliminar permanentemente este mensaje de contacto?")) return;
    setLoading(true);
    setNotification("");
    try {
      const response = await fetch(`/api/contacto?id=${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMensajes((prev) => prev.filter((m) => m.id !== id));
        showNotification("¡Mensaje de contacto eliminado con éxito!");
      } else {
        showNotification("Error al eliminar el mensaje.");
      }
    } catch (err) {
      showNotification("Error de red al eliminar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  if (!authorized) {
    return <div style={{ padding: "2rem", fontFamily: "var(--font-body)", color: "var(--graphite)" }}>Cargando administrador...</div>;
  }

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "var(--chalk)",
        fontFamily: "var(--font-body)",
        overflow: "hidden",
      }}
    >
      {/* 1. LEFT SIDEBAR */}
      <aside
        style={{
          width: "260px",
          background: "var(--graphite)",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "2rem 1.5rem",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <div>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
            <img src="/logo.png" alt="Logo" style={{ width: "32px", height: "32px", objectFit: "contain", filter: "brightness(1.1)" }} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.05em" }}>APROTURA</span>
              <span style={{ fontSize: "0.5rem", color: "var(--gold)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>Panel de Control</span>
            </div>
          </div>

          {/* Nav links */}
          <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {[
              {
                id: "banners",
                label: "Inicio y Portadas",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                )
              },
              {
                id: "noticias",
                label: "Noticias y Alertas",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M16 8h2"/><path d="M16 12h2"/><path d="M16 16h2"/><path d="M6 8h6v8H6z"/></svg>
                )
              },
              {
                id: "galeria",
                label: "Galería de Fotos",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                )
              },
              {
                id: "mesa",
                label: "Mesa de Partes",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                )
              },
              {
                id: "mensajes",
                label: "Mensajes de Contacto",
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                )
              },
            ].map((t) => {
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    width: "100%",
                    padding: "0.8rem 1rem",
                    borderRadius: "8px",
                    background: isSelected ? "var(--crimson)" : "transparent",
                    color: isSelected ? "white" : "rgba(255, 255, 255, 0.7)",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                    fontWeight: isSelected ? 700 : 500,
                    textAlign: "left",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "rgba(255, 255, 255, 0.7)";
                    }
                  }}
                >
                  <span style={{ fontSize: "1.1rem", display: "flex", alignItems: "center" }}>{t.icon}</span>
                  {t.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            background: "none",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "rgba(255,255,255,0.8)",
            padding: "0.6rem 1rem",
            borderRadius: "100px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 600,
            justifyContent: "center",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--crimson)";
            e.currentTarget.style.color = "white";
            e.currentTarget.style.background = "rgba(158, 27, 27, 0.1)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
            e.currentTarget.style.color = "rgba(255,255,255,0.8)";
            e.currentTarget.style.background = "none";
          }}
        >
          Cerrar sesión
        </button>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Main Header */}
        <header
          style={{
            background: "white",
            padding: "1.2rem 2.5rem",
            borderBottom: "1px solid var(--chalk-dark)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <div>
            <h1 style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--graphite)" }}>
              Hola, Administrador
            </h1>
            <span style={{ fontSize: "0.75rem", color: "var(--graphite-light)" }}>
              Gestión del Portal Oficial APROTURA
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <Link
              href="/"
              target="_blank"
              style={{
                fontSize: "0.8rem",
                fontWeight: 700,
                background: "var(--crimson)",
                color: "white",
                textDecoration: "none",
                padding: "0.55rem 1.25rem",
                borderRadius: "100px",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                boxShadow: "0 2px 6px rgba(158, 27, 27, 0.15)",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--burgundy)";
                e.currentTarget.style.transform = "translateY(-1px)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(158, 27, 27, 0.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--crimson)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 6px rgba(158, 27, 27, 0.15)";
              }}
            >
              Ver sitio web
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2rem 2.5rem",
          }}
        >
          {notification && (
            <div
              className="animate-fadeIn"
              style={{
                background: "var(--burgundy)",
                color: "white",
                padding: "0.8rem 1.2rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                marginBottom: "1.5rem",
                boxShadow: "var(--shadow-sm)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span>{notification}</span>
              <button
                onClick={() => setNotification("")}
                style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontWeight: 700 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* TAB 1: BANNERS MANAGER */}
          {activeTab === "banners" && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--graphite)", marginBottom: "0.3rem" }}>
                  Gestión de Avisos e Inicio
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--graphite-light)" }}>
                  Publica avisos urgentes en la barra superior o administra las diapositivas de noticias del carrusel de inicio.
                </p>
              </div>

              {/* Grid 2 Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
                
                {/* Column Left: Announcement Form */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem", color: "var(--graphite)" }}>
                    Barra de Aviso Superior
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--graphite-light)", marginBottom: "1.25rem" }}>
                    Aviso destacado de una línea en la cabecera del portal (Ej. Avisos de interés general).
                  </p>

                  <div style={{ marginBottom: "1rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700 }}>
                      Estado actual:{" "}
                      <span
                        style={{
                          background: announcementStatus === "Publicado" ? "rgba(30,126,52,0.1)" : "rgba(26,26,26,0.06)",
                          color: announcementStatus === "Publicado" ? "#1E7E34" : "var(--graphite-light)",
                          padding: "0.2rem 0.6rem",
                          borderRadius: "99px",
                          fontSize: "0.7rem",
                          fontWeight: 700,
                          marginLeft: "0.25rem",
                        }}
                      >
                        {announcementStatus}
                      </span>
                    </span>
                  </div>

                  <form onSubmit={handleSaveAnnouncement}>
                    <div style={{ marginBottom: "1rem" }}>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.3rem" }}>
                        Texto del Anuncio
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Comunicado: Nueva mesa de partes activa."
                        value={announcementText}
                        onChange={(e) => setAnnouncementText(e.target.value)}
                        style={{
                          width: "100%",
                          padding: "0.65rem 0.85rem",
                          borderRadius: "6px",
                          border: "1.5px solid var(--chalk-dark)",
                          fontSize: "0.85rem",
                          outline: "none",
                        }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.3rem" }}>
                          Texto del Enlace (Opcional)
                        </label>
                        <input
                          type="text"
                          placeholder="Ej. Inscríbete aquí →"
                          value={announcementLinkText}
                          onChange={(e) => setAnnouncementLinkText(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "6px",
                            border: "1.5px solid var(--chalk-dark)",
                            fontSize: "0.85rem",
                            outline: "none",
                          }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.3rem" }}>
                          Ruta del Enlace (Opcional)
                        </label>
                        <select
                          value={announcementLink}
                          onChange={(e) => setAnnouncementLink(e.target.value)}
                          style={{
                            width: "100%",
                            padding: "0.65rem 0.85rem",
                            borderRadius: "6px",
                            border: "1.5px solid var(--chalk-dark)",
                            fontSize: "0.85rem",
                            outline: "none",
                            background: "white",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Ninguno (Sin enlace)</option>
                          <option value="/contacto">Contacto</option>
                          <option value="/nosotros">Sobre Nosotros</option>
                          <option value="/noticias">Noticias</option>
                          <option value="/galeria">Galería</option>
                          <option value="/mesa-de-partes">Mesa de Partes</option>
                          <option value="/cursos">Cursos y Capacitación</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "flex", gap: "0.75rem" }}>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn-primary"
                        style={{ fontSize: "0.8rem", padding: "0.6rem 1.5rem" }}
                      >
                        Publicar Aviso
                      </button>
                      {announcementStatus === "Publicado" && (
                        <button
                          type="button"
                          onClick={handleClearAnnouncement}
                          disabled={loading}
                          style={{
                            background: "transparent",
                            border: "1.5px solid var(--crimson)",
                            color: "var(--crimson)",
                            padding: "0.6rem 1.5rem",
                            borderRadius: "100px",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            cursor: "pointer",
                          }}
                        >
                          Quitar Aviso
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* Column Right: Slider Manager */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.3rem", color: "var(--graphite)" }}>
                    Banners de Portada (Inicio)
                  </h3>
                  <p style={{ fontSize: "0.78rem", color: "var(--graphite-light)", marginBottom: "1.25rem" }}>
                    Crea o elimina banners en el carrusel superior. Si la lista está vacía, se mostrará la portada de bienvenida permanente.
                  </p>

                  {/* Add Slide Form */}
                  <form onSubmit={handleAddSlide} style={{ borderBottom: "1px solid var(--chalk-dark)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "0.75rem", color: "var(--crimson)" }}>
                      Agregar Diapositiva:
                    </span>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "0.8rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Texto Botón (CTA)
                        </label>
                        <input
                          type="text"
                          required
                          value={newSlide.ctaText}
                          onChange={(e) => setNewSlide({ ...newSlide, ctaText: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Enlace Botón (Destino)
                        </label>
                        <select
                          value={newSlide.ctaLink}
                          onChange={(e) => setNewSlide({ ...newSlide, ctaLink: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                        >
                          <option value="/contacto">Contacto</option>
                          <option value="/nosotros">Sobre Nosotros</option>
                          <option value="/noticias">Noticias</option>
                          <option value="/galeria">Galería</option>
                          <option value="/mesa-de-partes">Mesa de Partes</option>
                          <option value="/cursos">Cursos y Capacitación</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.2rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Estilo Botón
                        </label>
                        <select
                          value={newSlide.btnStyle}
                          onChange={(e) => setNewSlide({ ...newSlide, btnStyle: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        >
                          <option value="primary">Carmesí (Rojo)</option>
                          <option value="gold">Dorado (Amarillo)</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          URL de Imagen
                        </label>
                        <input
                          type="text"
                          required
                          value={newSlide.image}
                          onChange={(e) => setNewSlide({ ...newSlide, image: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "1.25rem",
                        background: "var(--chalk)",
                        padding: "1.25rem",
                        borderRadius: "8px",
                        border: "1.5px dashed var(--chalk-dark)",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--crimson)";
                        e.currentTarget.style.background = "rgba(126, 27, 27, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--chalk-dark)";
                        e.currentTarget.style.background = "var(--chalk)";
                      }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploading}
                        style={{ display: "none" }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--graphite-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem auto", display: "block" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)" }}>
                        {uploading ? "Subiendo imagen..." : "Sube una imagen desde tu PC"}
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-gold"
                      style={{ fontSize: "0.8rem", padding: "0.6rem 1.5rem", width: "100%", justifyContent: "center" }}
                    >
                      Guardar y Publicar Diapositiva
                    </button>
                  </form>

                  {/* List Current Slides */}
                  <div>
                    <span style={{ fontSize: "0.82rem", fontWeight: 700, display: "block", marginBottom: "0.75rem" }}>
                      Diapositivas Activas ({slides.length}):
                    </span>
                    {slides.length === 0 ? (
                      <div style={{ fontSize: "0.8rem", color: "var(--graphite-light)", fontStyle: "italic", padding: "0.75rem", background: "var(--chalk)", borderRadius: "6px", border: "1px dashed var(--chalk-dark)" }}>
                        No hay diapositivas activas. Se está mostrando la portada institucional fija de bienvenida.
                      </div>
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                        {slides.map((s, idx) => (
                          <div
                            key={s.id || idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.6rem 0.85rem",
                              background: "var(--chalk)",
                              borderRadius: "8px",
                              border: "1px solid var(--chalk-dark)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
                              <img src={s.image} alt={s.title} style={{ width: "48px", height: "36px", objectFit: "cover", borderRadius: "4px" }} />
                              <div style={{ overflow: "hidden" }}>
                                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {s.title}
                                </span>
                                <span style={{ fontSize: "0.68rem", color: "var(--crimson)", fontWeight: 700 }}>
                                  {s.badge}
                                </span>
                              </div>
                            </div>

                            <button
                              onClick={() => handleDeleteSlide(s.id)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--crimson)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.25rem",
                              }}
                              title="Eliminar diapositiva"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </div>
          )}



          {/* TAB 3: NOTICIAS */}
          {activeTab === "noticias" && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--graphite)", marginBottom: "0.3rem" }}>
                  Gestión de Noticias y Comunicados
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--graphite-light)" }}>
                  Publica las últimas novedades y comunicados de la asociación. Si no hay noticias registradas, la sección se ocultará del inicio de forma automática.
                </p>
              </div>

              {/* Grid 2 Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
                
                {/* Column Left: Add News Form */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--graphite)" }}>
                    Redactar Nueva Noticia
                  </h3>

                  <form onSubmit={handleAddNoticia} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                        Título de la Noticia *
                      </label>
                      <input
                        type="text"
                        required
                        value={newNoticia.titulo}
                        onChange={(e) => setNewNoticia({ ...newNoticia, titulo: e.target.value })}
                        placeholder="Ej. APROTURA firma convenio de cooperación..."
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Categoría *
                        </label>
                        <select
                          value={newNoticia.categoria}
                          onChange={(e) => setNewNoticia({ ...newNoticia, categoria: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                        >
                          <option value="Eventos">Eventos</option>
                          <option value="Educación">Educación</option>
                          <option value="Alianzas">Alianzas</option>
                          <option value="Institucional">Institucional</option>
                          <option value="Comunicado">Comunicado</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Lugar/Ubicación
                        </label>
                        <input
                          type="text"
                          value={newNoticia.lugar}
                          onChange={(e) => setNewNoticia({ ...newNoticia, lugar: e.target.value })}
                          placeholder="Ej. Plaza de Armas, Arequipa"
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                        Resumen corto (Aparece en la tarjeta) *
                      </label>
                      <textarea
                        required
                        rows={2}
                        value={newNoticia.resumen}
                        onChange={(e) => setNewNoticia({ ...newNoticia, resumen: e.target.value })}
                        placeholder="Escribe una breve descripción del artículo..."
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit", resize: "none" }}
                      />
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                        Contenido completo (Aparece al presionar Leer Más)
                      </label>
                      <textarea
                        rows={4}
                        value={newNoticia.contenido}
                        onChange={(e) => setNewNoticia({ ...newNoticia, contenido: e.target.value })}
                        placeholder="Escribe el contenido completo del artículo. Puedes usar saltos de línea para separar párrafos..."
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Fecha de publicación (Opcional)
                        </label>
                        <input
                          type="date"
                          value={newNoticia.fecha}
                          onChange={(e) => setNewNoticia({ ...newNoticia, fecha: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          URL de Imagen o Video Principal (YouTube, Facebook, TikTok, Instagram, Directo, etc.) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newNoticia.imagen}
                          onChange={(e) => setNewNoticia({ ...newNoticia, imagen: e.target.value })}
                          placeholder="Sube archivos o pega URL"
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "1rem",
                        background: "var(--chalk)",
                        padding: "1.25rem",
                        borderRadius: "8px",
                        border: "1.5px dashed var(--chalk-dark)",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--crimson)";
                        e.currentTarget.style.background = "rgba(126, 27, 27, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--chalk-dark)";
                        e.currentTarget.style.background = "var(--chalk)";
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleNewsImageUpload}
                        disabled={newsUploading}
                        style={{ display: "none" }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--graphite-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem auto", display: "block" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)" }}>
                        {newsUploading ? "Subiendo imágenes..." : "Sube fotos de tu PC para la noticia (puedes elegir varias)"}
                      </span>
                    </label>

                    {/* Multi-image preview */}
                    {newNoticia.imagenes && newNoticia.imagenes.length > 0 && (
                      <div style={{ margin: "0.5rem 0" }}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.5rem" }}>
                          Imágenes de la Galería de la Noticia ({newNoticia.imagenes.length}):
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {newNoticia.imagenes.map((imgUrl, i) => (
                            <div key={i} style={{ position: "relative", width: "60px", height: "60px", border: "1px solid var(--chalk-dark)", borderRadius: "6px", overflow: "hidden" }}>
                              <img 
                                src={imgUrl} 
                                alt="Preview" 
                                onClick={() => setModalImage(imgUrl)}
                                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} 
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setNewNoticia(prev => {
                                    const filtered = prev.imagenes.filter((_, idx) => idx !== i);
                                    return {
                                      ...prev,
                                      imagenes: filtered,
                                      imagen: prev.imagen === imgUrl ? (filtered[0] || "") : prev.imagen
                                    };
                                  });
                                }}
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "2px",
                                  background: "rgba(0,0,0,0.6)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Single image/video preview fallback */}
                    {(!newNoticia.imagenes || newNoticia.imagenes.length === 0) && newNoticia.imagen && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--graphite-light)", display: "block", marginBottom: "0.3rem" }}>Vista previa:</span>
                        {(() => {
                          const embed = getVideoEmbedUrl(newNoticia.imagen);
                          if (embed?.startsWith("DIRECT_VIDEO:")) {
                            const videoUrl = embed.replace("DIRECT_VIDEO:", "");
                            return (
                              <video
                                src={videoUrl}
                                controls
                                style={{ width: "100%", height: "180px", borderRadius: "8px", backgroundColor: "#000" }}
                              />
                            );
                          }
                          return embed ? (
                            <iframe
                              src={embed}
                              title="Vista previa video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              style={{ width: "100%", height: "180px", border: "none", borderRadius: "8px" }}
                            />
                          ) : (
                            <img
                              src={newNoticia.imagen}
                              alt="Vista previa"
                              onClick={() => setModalImage(newNoticia.imagen)}
                              style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--chalk-dark)", cursor: "zoom-in", backgroundColor: "#f3f4f6" }}
                            />
                          );
                        })()}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || newsUploading}
                      className="btn-gold"
                      style={{ fontSize: "0.8rem", padding: "0.6rem 1.5rem", width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
                    >
                      Guardar y Publicar Noticia
                    </button>
                  </form>
                </div>

                {/* Column Right: List Current News */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--graphite)" }}>
                    Noticias Publicadas ({noticias.length})
                  </h3>

                  {noticias.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--graphite-light)", fontStyle: "italic", padding: "1rem", background: "var(--chalk)", borderRadius: "8px", border: "1px dashed var(--chalk-dark)", textAlign: "center" }}>
                      No hay noticias publicadas. La sección está oculta en la página de inicio.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "600px", overflowY: "auto", paddingRight: "0.25rem" }}>
                      {noticias.map((n, idx) => (
                        <div
                          key={n.id || idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.75rem",
                            background: "var(--chalk)",
                            borderRadius: "8px",
                            border: "1px solid var(--chalk-dark)",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden" }}>
                            <img src={n.imagen || "/placeholder-news.jpg"} alt={n.titulo} style={{ width: "60px", height: "45px", objectFit: "cover", borderRadius: "4px", background: "white" }} />
                            <div style={{ overflow: "hidden" }}>
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--graphite)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {n.titulo}
                              </span>
                              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                                <span style={{ fontSize: "0.65rem", background: "var(--crimson)", color: "white", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                                  {n.categoria}
                                </span>
                                <span style={{ fontSize: "0.68rem", color: "var(--graphite-light)" }}>
                                  {n.fecha}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                            <button
                              onClick={() => startEditNoticia(n)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--crimson)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.25rem",
                              }}
                              title="Editar noticia"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            </button>

                            <button
                              onClick={() => handleDeleteNoticia(n.id)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--crimson)",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.25rem",
                              }}
                              title="Eliminar noticia"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 4: MESA DE PARTES */}
          {activeTab === "mesa" && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--graphite)", marginBottom: "0.3rem" }}>
                  Revisión de Mesa de Partes
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--graphite-light)" }}>
                  Revisa y gestiona las solicitudes oficiales y documentos sustentatorios cargados por los ciudadanos.
                </p>
              </div>

              {solicitudes.length === 0 ? (
                <div style={{ padding: "4rem 2rem", textAlign: "center", background: "white", borderRadius: "12px", border: "1.5px dashed var(--chalk-dark)", boxShadow: "var(--shadow-sm)", display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ color: "var(--graphite-light)", marginBottom: "1rem" }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  </div>
                  <span style={{ fontSize: "0.95rem", color: "var(--graphite-light)", fontWeight: 700 }}>
                    No hay solicitudes ingresadas en la mesa de partes por el momento.
                  </span>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {solicitudes.map((sol) => {
                    const isPending = sol.status === "Pendiente";
                    const isInProgress = sol.status === "En Proceso";
                    const isCompleted = sol.status === "Atendido";

                    let badgeBg = "rgba(240, 173, 78, 0.1)";
                    let badgeColor = "#F0AD4E";
                    if (isInProgress) {
                      badgeBg = "rgba(2, 117, 216, 0.1)";
                      badgeColor = "#0275D8";
                    } else if (isCompleted) {
                      badgeBg = "rgba(92, 184, 92, 0.1)";
                      badgeColor = "#5CB85C";
                    }

                    return (
                      <div
                        key={sol.id}
                        style={{
                          background: "white",
                          padding: "1.75rem",
                          borderRadius: "12px",
                          border: "1px solid var(--chalk-dark)",
                          boxShadow: "var(--shadow-sm)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "1.25rem",
                        }}
                      >
                        {/* Solicitud Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", borderBottom: "1px solid var(--chalk)", paddingBottom: "1rem" }}>
                          <div>
                            <span style={{ fontSize: "0.95rem", fontWeight: 800, color: "var(--crimson)" }}>
                              {sol.codigo}
                            </span>
                            <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", marginTop: "0.25rem", fontSize: "0.76rem", color: "var(--graphite-light)" }}>
                              <span>Fecha: {sol.fecha}</span>
                              <span>•</span>
                              <span>Tipo: {sol.tramiteTipo}</span>
                            </div>
                          </div>

                          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                            {/* Status Badge */}
                            <span
                              style={{
                                background: badgeBg,
                                color: badgeColor,
                                padding: "0.3rem 0.75rem",
                                borderRadius: "100px",
                                fontSize: "0.76rem",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.03em",
                              }}
                            >
                              {sol.status}
                            </span>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDeleteSolicitud(sol.id)}
                              disabled={loading}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--crimson)",
                                cursor: "pointer",
                                display: "flex",
                                alignSelf: "center",
                                alignItems: "center",
                                justifyContent: "center",
                                padding: "0.25rem",
                              }}
                              title="Eliminar solicitud"
                            >
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                          </div>
                        </div>

                        {/* Solicitud Body Details */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "2rem", alignItems: "start" }}>
                          {/* Sender details */}
                          <div style={{ background: "var(--chalk)", padding: "1rem", borderRadius: "8px", fontSize: "0.8rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                            <div>
                              <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.68rem", fontWeight: 700 }}>REMITENTE</span>
                              <span style={{ fontWeight: 700, color: "var(--graphite)" }}>{sol.remitente}</span>
                            </div>
                            <div>
                              <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.68rem", fontWeight: 700 }}>DOCUMENTO</span>
                              <span style={{ fontWeight: 600 }}>{sol.documentoTipo}: {sol.documentoNumero}</span>
                            </div>
                            <div>
                              <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.68rem", fontWeight: 700 }}>CONTACTO</span>
                              <a href={`mailto:${sol.email}`} style={{ display: "block", color: "var(--crimson)", textDecoration: "underline" }}>{sol.email}</a>
                              <span style={{ display: "block", marginTop: "0.1rem" }}>Cel: {sol.celular}</span>
                            </div>
                          </div>

                          {/* Message/Asunto details */}
                          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                            <div>
                              <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.7rem", fontWeight: 700 }}>ASUNTO</span>
                              <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--graphite)", margin: "0.15rem 0 0 0" }}>
                                {sol.asunto}
                              </h4>
                            </div>
                            <div>
                              <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.7rem", fontWeight: 700 }}>DETALLE DE LA SOLICITUD</span>
                              <p style={{ fontSize: "0.85rem", lineHeight: 1.5, color: "var(--graphite-light)", margin: "0.25rem 0 0 0", whiteSpace: "pre-wrap" }}>
                                {sol.mensaje}
                              </p>
                            </div>

                            {/* Attachment */}
                            {sol.adjuntoUrl && (
                              <div style={{ marginTop: "0.5rem" }}>
                                <span style={{ display: "block", color: "var(--graphite-light)", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.25rem" }}>DOCUMENTO ADJUNTO</span>
                                <a
                                  href={sol.adjuntoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: "0.5rem",
                                    background: "#fffafa",
                                    border: "1px solid rgba(158, 27, 27, 0.15)",
                                    padding: "0.45rem 1rem",
                                    borderRadius: "6px",
                                    color: "var(--crimson)",
                                    fontSize: "0.8rem",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    transition: "background 0.2s",
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(158, 27, 27, 0.03)"}
                                  onMouseLeave={(e) => e.currentTarget.style.background = "#fffafa"}
                                >
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.25rem" }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                                  <span style={{ textDecoration: "underline" }}>
                                    {sol.adjuntoNombre || "Ver documento cargado"}
                                  </span>
                                </a>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Status update controls */}
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.75rem", borderTop: "1px dashed var(--chalk-dark)", paddingTop: "1rem", marginTop: "0.25rem" }}>
                          <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "var(--graphite-light)" }}>
                            Cambiar Estado:
                          </span>
                          <select
                            value={sol.status}
                            onChange={(e) => handleUpdateStatus(sol.id, e.target.value)}
                            disabled={loading}
                            style={{
                              padding: "0.35rem 0.75rem",
                              borderRadius: "6px",
                              border: "1.5px solid var(--chalk-dark)",
                              fontSize: "0.78rem",
                              fontWeight: 600,
                              background: "white",
                              outline: "none",
                              cursor: "pointer",
                            }}
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Atendido">Atendido</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: GALERÍA */}
          {activeTab === "galeria" && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--graphite)", marginBottom: "0.3rem" }}>
                  Gestión de Galería de Fotos
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--graphite-light)" }}>
                  Publica y administra las fotografías que se muestran en la sección de galería del portal. Todas las imágenes se guardan en la base de datos.
                </p>
              </div>

              {/* Grid 2 Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", alignItems: "start" }}>
                
                {/* Column Left: Add Photo Form */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--graphite)" }}>
                    Publicar Nueva Foto
                  </h3>

                  <form onSubmit={handleAddGaleria} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                        Título de la Foto *
                      </label>
                      <input
                        type="text"
                        required
                        value={newGaleria.titulo}
                        onChange={(e) => setNewGaleria({ ...newGaleria, titulo: e.target.value })}
                        placeholder="Ej. Danzas Tradicionales de Arequipa"
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Categoría *
                        </label>
                        <select
                          value={newGaleria.categoria}
                          onChange={(e) => setNewGaleria({ ...newGaleria, categoria: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                        >
                          <option value="Eventos">Eventos</option>
                          <option value="Capacitaciones">Capacitaciones</option>
                          <option value="Cultura">Cultura</option>
                          <option value="Guiados">Guiados</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Ubicación *
                        </label>
                        <input
                          type="text"
                          required
                          value={newGaleria.ubicacion}
                          onChange={(e) => setNewGaleria({ ...newGaleria, ubicacion: e.target.value })}
                          placeholder="Ej. Plaza de Armas, Arequipa"
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                        Descripción de la foto *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newGaleria.descripcion}
                        onChange={(e) => setNewGaleria({ ...newGaleria, descripcion: e.target.value })}
                        placeholder="Escribe una descripción de la actividad o evento fotografiado..."
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit", resize: "none" }}
                      />
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          Fecha (Opcional)
                        </label>
                        <input
                          type="date"
                          value={newGaleria.fecha}
                          onChange={(e) => setNewGaleria({ ...newGaleria, fecha: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                          URL de Imagen o Video Principal (YouTube, Facebook, TikTok, Instagram, Directo, etc.) *
                        </label>
                        <input
                          type="text"
                          required
                          value={newGaleria.imagen}
                          onChange={(e) => setNewGaleria({ ...newGaleria, imagen: e.target.value })}
                          placeholder="Sube archivo o pega URL"
                          style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                        />
                      </div>
                    </div>

                    <label
                      style={{
                        display: "block",
                        marginBottom: "1rem",
                        background: "var(--chalk)",
                        padding: "1.25rem",
                        borderRadius: "8px",
                        border: "1.5px dashed var(--chalk-dark)",
                        textAlign: "center",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "var(--crimson)";
                        e.currentTarget.style.background = "rgba(126, 27, 27, 0.02)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "var(--chalk-dark)";
                        e.currentTarget.style.background = "var(--chalk)";
                      }}
                    >
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGaleriaImageUpload}
                        disabled={galeriaUploading}
                        style={{ display: "none" }}
                      />
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--graphite-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem auto", display: "block" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)" }}>
                        {galeriaUploading ? "Subiendo imágenes..." : "Sube fotos de tu PC para la galería (puedes elegir varias)"}
                      </span>
                    </label>

                    {/* Preview of main URL (image or video) */}
                    {newGaleria.imagen && (
                      <div style={{ marginTop: "0.5rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--graphite-light)", display: "block", marginBottom: "0.3rem" }}>Vista previa de URL Principal:</span>
                        {(() => {
                          const embed = getVideoEmbedUrl(newGaleria.imagen);
                          if (embed?.startsWith("DIRECT_VIDEO:")) {
                            const videoUrl = embed.replace("DIRECT_VIDEO:", "");
                            return (
                              <video
                                src={videoUrl}
                                controls
                                style={{ width: "100%", height: "180px", borderRadius: "8px", backgroundColor: "#000" }}
                              />
                            );
                          }
                          return embed ? (
                            <iframe
                              src={embed}
                              title="Vista previa video"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              style={{ width: "100%", height: "180px", border: "none", borderRadius: "8px" }}
                            />
                          ) : (
                            <img
                              src={newGaleria.imagen}
                              alt="Vista previa principal"
                              onClick={() => setModalImage(newGaleria.imagen)}
                              style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--chalk-dark)", cursor: "zoom-in", backgroundColor: "#f3f4f6" }}
                            />
                          );
                        })()}
                      </div>
                    )}

                    {/* Multi-image preview */}
                    {newGaleria.imagenes && newGaleria.imagenes.length > 0 && (
                      <div style={{ margin: "0.75rem 0 0.5rem 0" }}>
                        <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.5rem" }}>
                          Imágenes Subidas ({newGaleria.imagenes.length}):
                        </label>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                          {newGaleria.imagenes.map((imgUrl, i) => (
                            <div key={i} style={{ position: "relative", width: "60px", height: "60px", border: "1px solid var(--chalk-dark)", borderRadius: "6px", overflow: "hidden" }}>
                              <img 
                                src={imgUrl} 
                                alt="Preview" 
                                onClick={() => setModalImage(imgUrl)}
                                style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} 
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setNewGaleria(prev => {
                                    const filtered = prev.imagenes.filter((_, idx) => idx !== i);
                                    return {
                                      ...prev,
                                      imagenes: filtered,
                                    };
                                  });
                                }}
                                style={{
                                  position: "absolute",
                                  top: "2px",
                                  right: "2px",
                                  background: "rgba(0,0,0,0.6)",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "50%",
                                  width: "16px",
                                  height: "16px",
                                  fontSize: "10px",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: 0
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || galeriaUploading}
                      className="btn-gold"
                      style={{ fontSize: "0.8rem", padding: "0.6rem 1.5rem", width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
                    >
                      Publicar Foto en Galería
                    </button>
                  </form>
                </div>

                {/* Column Right: List Published Photos */}
                <div className="card" style={{ background: "white", padding: "1.75rem", borderRadius: "12px", boxShadow: "var(--shadow-sm)" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "1.25rem", color: "var(--graphite)" }}>
                    Fotos Publicadas ({galeriaItems.length})
                  </h3>

                  {galeriaItems.length === 0 ? (
                    <div style={{ fontSize: "0.8rem", color: "var(--graphite-light)", fontStyle: "italic", padding: "1rem", background: "var(--chalk)", borderRadius: "8px", border: "1px dashed var(--chalk-dark)", textAlign: "center" }}>
                      No hay fotos publicadas en la galería. Agrega una para que aparezca en la sección pública.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", maxHeight: "650px", overflowY: "auto", paddingRight: "0.25rem" }}>
                      {(() => {
                        const grouped: { [key: string]: any } = {};
                        galeriaItems.forEach((item: any) => {
                          if (!item.imagen || item.imagen.trim() === "") return;
                          const key = `${item.titulo}-${item.descripcion}-${item.categoria}-${item.ubicacion}-${item.fecha}`;
                          if (!grouped[key]) {
                            grouped[key] = {
                              ...item,
                              images: [item.imagen],
                              ids: [item.id],
                            };
                          } else {
                            if (!grouped[key].images.includes(item.imagen)) {
                              grouped[key].images.push(item.imagen);
                            }
                            if (!grouped[key].ids.includes(item.id)) {
                              grouped[key].ids.push(item.id);
                            }
                          }
                        });
                        const groupedItems = Object.values(grouped);
                        
                        return groupedItems.map((g: any, idx) => (
                          <div
                            key={g.id || idx}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              padding: "0.75rem",
                              background: "var(--chalk)",
                              borderRadius: "8px",
                              border: "1px solid var(--chalk-dark)",
                            }}
                          >
                            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", overflow: "hidden", flex: 1 }}>
                              {(() => {
                                const videoThumb = getVideoThumbnailUrl(g.imagen);
                                const isVideoPlaceholder = videoThumb === "VIDEO_PLACEHOLDER";
                                const imgSrc = isVideoPlaceholder ? "" : (videoThumb || g.imagen);
                                return isVideoPlaceholder ? (
                                  <div style={{
                                    width: "64px",
                                    height: "48px",
                                    background: "linear-gradient(135deg, #120205 0%, #1c0307 40%, #2a050a 100%)",
                                    borderRadius: "6px",
                                    flexShrink: 0,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "var(--crimson)",
                                    fontSize: "10px",
                                    fontWeight: "bold"
                                  }}>
                                    VIDEO
                                  </div>
                                ) : (
                                  <img src={imgSrc} alt={g.titulo} style={{ width: "64px", height: "48px", objectFit: "cover", borderRadius: "6px", background: "white", flexShrink: 0 }} />
                                );
                              })()}
                              <div style={{ overflow: "hidden", minWidth: 0 }}>
                                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "var(--graphite)", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {g.titulo}
                                </span>
                                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginTop: "0.15rem" }}>
                                  <span style={{ fontSize: "0.65rem", background: "var(--crimson)", color: "white", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                                    {g.categoria}
                                  </span>
                                  <span style={{ fontSize: "0.68rem", color: "var(--graphite-light)" }}>
                                    {g.fecha}
                                  </span>
                                </div>
                                <span style={{ fontSize: "0.68rem", color: "var(--graphite-light)", display: "block", marginTop: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                  {g.ubicacion} {g.images.length > 1 ? `(${g.images.length} archivos)` : ""}
                                </span>
                              </div>
                            </div>

                            <div style={{ display: "flex", gap: "0.25rem", flexShrink: 0 }}>
                              <button
                                onClick={() => startEditGaleria(g)}
                                disabled={loading}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "var(--crimson)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0.25rem",
                                }}
                                title="Editar publicación"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                              </button>

                              <button
                                onClick={() => handleDeleteGaleria(g.ids)}
                                disabled={loading}
                                style={{
                                  background: "none",
                                  border: "none",
                                  color: "var(--crimson)",
                                  cursor: "pointer",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  padding: "0.25rem",
                                }}
                                title="Eliminar publicación"
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                              </button>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 6: MENSAJES DE CONTACTO */}
          {activeTab === "mensajes" && (
            <div>
              <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--graphite)", marginBottom: "0.3rem" }}>
                  Mensajes de Contacto
                </h2>
                <p style={{ fontSize: "0.88rem", color: "var(--graphite-light)" }}>
                  Revisa los mensajes enviados por los usuarios a través del formulario de contacto del portal web.
                </p>
              </div>

              {mensajes.length === 0 ? (
                <div style={{ fontSize: "0.88rem", color: "var(--graphite-light)", fontStyle: "italic", padding: "2rem", background: "white", borderRadius: "12px", border: "1px dashed var(--chalk-dark)", textAlign: "center", boxShadow: "var(--shadow-sm)" }}>
                  No se han recibido mensajes de contacto todavía.
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                  {mensajes.map((m, idx) => (
                    <div
                      key={m.id || idx}
                      className="card"
                      style={{
                        background: "white",
                        padding: "1.75rem",
                        borderRadius: "12px",
                        boxShadow: "var(--shadow-sm)",
                        border: "1px solid rgba(0,0,0,0.02)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "1rem",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
                        <div>
                          <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--graphite)" }}>
                            {m.asunto}
                          </h3>
                          <span style={{ fontSize: "0.78rem", color: "var(--graphite-light)" }}>
                            Enviado el: {new Date(m.created_at || Date.now()).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteMensaje(m.id)}
                          disabled={loading}
                          style={{
                            background: "rgba(158, 27, 27, 0.06)",
                            border: "none",
                            color: "var(--crimson)",
                            padding: "0.5rem 1rem",
                            borderRadius: "100px",
                            cursor: "pointer",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.3rem",
                            transition: "all 0.2s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "var(--crimson)";
                            e.currentTarget.style.color = "white";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "rgba(158, 27, 27, 0.06)";
                            e.currentTarget.style.color = "var(--crimson)";
                          }}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "0.2rem" }}><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg> Eliminar Mensaje
                        </button>
                      </div>

                      <div style={{
                        background: "var(--chalk)",
                        padding: "1rem 1.25rem",
                        borderRadius: "8px",
                        fontSize: "0.88rem",
                        color: "var(--graphite-mid)",
                        lineHeight: 1.6,
                        whiteSpace: "pre-wrap",
                      }}>
                        {m.mensaje}
                      </div>

                      <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", borderTop: "1px dashed var(--chalk-dark)", paddingTop: "0.85rem", fontSize: "0.82rem" }}>
                        <div>
                          <strong style={{ color: "var(--graphite)" }}>Remitente:</strong>{" "}
                          <span style={{ color: "var(--graphite-light)" }}>{m.nombre}</span>
                        </div>
                        <div>
                          <strong style={{ color: "var(--graphite)" }}>Email:</strong>{" "}
                          <a href={`mailto:${m.email}`} style={{ color: "var(--crimson)", textDecoration: "underline" }}>
                            {m.email}
                          </a>
                        </div>
                        {m.telefono && (
                          <div>
                            <strong style={{ color: "var(--graphite)" }}>Teléfono:</strong>{" "}
                            <a href={`tel:${m.telefono}`} style={{ color: "var(--graphite-light)" }}>
                              {m.telefono}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Edit Gallery Modal */}
      {editingGaleria && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--graphite)" }}>
                Editar Publicación de Galería
              </h3>
              <button
                onClick={() => setEditingGaleria(null)}
                style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold", color: "var(--graphite-light)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateGaleria} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                  Título de la Foto *
                </label>
                <input
                  type="text"
                  required
                  value={editGaleriaForm.titulo}
                  onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, titulo: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Categoría *
                  </label>
                  <select
                    value={editGaleriaForm.categoria}
                    onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, categoria: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                  >
                    <option value="Eventos">Eventos</option>
                    <option value="Capacitaciones">Capacitaciones</option>
                    <option value="Cultura">Cultura</option>
                    <option value="Guiados">Guiados</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    required
                    value={editGaleriaForm.ubicacion}
                    onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, ubicacion: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                  Descripción de la foto *
                </label>
                <textarea
                  required
                  rows={3}
                  value={editGaleriaForm.descripcion}
                  onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, descripcion: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit", resize: "none" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Fecha (Opcional)
                  </label>
                  <input
                    type="date"
                    value={editGaleriaForm.fecha}
                    onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, fecha: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    URL de Imagen o Video Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editGaleriaForm.imagen}
                    onChange={(e) => setEditGaleriaForm({ ...editGaleriaForm, imagen: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  background: "var(--chalk)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  border: "1.5px dashed var(--chalk-dark)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditGaleriaImageUpload}
                  disabled={editGaleriaUploading}
                  style={{ display: "none" }}
                />
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)" }}>
                  {editGaleriaUploading ? "Subiendo imágenes..." : "Sube fotos de tu PC para la galería (puedes elegir varias)"}
                </span>
              </label>

              {/* Preview of main URL (image or video) */}
              {editGaleriaForm.imagen && (
                <div style={{ marginTop: "0.5rem" }}>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "var(--graphite-light)", display: "block", marginBottom: "0.3rem" }}>Vista previa de URL Principal:</span>
                  {(() => {
                    const embed = getVideoEmbedUrl(editGaleriaForm.imagen);
                    if (embed?.startsWith("DIRECT_VIDEO:")) {
                      const videoUrl = embed.replace("DIRECT_VIDEO:", "");
                      return (
                        <video
                          src={videoUrl}
                          controls
                          style={{ width: "100%", height: "180px", borderRadius: "8px", backgroundColor: "#000", objectFit: "contain" }}
                        />
                      );
                    }
                    return embed ? (
                      <iframe
                        src={embed}
                        title="Vista previa video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        style={{ width: "100%", height: "180px", border: "none", borderRadius: "8px" }}
                      />
                    ) : (
                      <img
                        src={editGaleriaForm.imagen}
                        alt="Vista previa principal"
                        onClick={() => setModalImage(editGaleriaForm.imagen)}
                        style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--chalk-dark)", cursor: "zoom-in", backgroundColor: "#f3f4f6" }}
                      />
                    );
                  })()}
                </div>
              )}

              {/* Multi-image preview */}
              {editGaleriaForm.imagenes && editGaleriaForm.imagenes.length > 0 && (
                <div style={{ margin: "0.75rem 0 0.5rem 0" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.5rem" }}>
                    Imágenes Adicionales ({editGaleriaForm.imagenes.length}):
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {editGaleriaForm.imagenes.map((imgUrl, i) => (
                      <div key={i} style={{ position: "relative", width: "60px", height: "60px", border: "1px solid var(--chalk-dark)", borderRadius: "6px", overflow: "hidden" }}>
                        <img 
                          src={imgUrl} 
                          alt="Preview" 
                          onClick={() => setModalImage(imgUrl)}
                          style={{ width: "100%", height: "100%", objectFit: "cover", cursor: "zoom-in" }} 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditGaleriaForm(prev => ({
                              ...prev,
                              imagenes: prev.imagenes.filter((_, idx) => idx !== i)
                            }));
                          }}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            fontSize: "10px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: 0
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading || editGaleriaUploading}
                  className="btn-gold"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingGaleria(null)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1.5px solid var(--chalk-dark)",
                    color: "var(--graphite-light)",
                    borderRadius: "100px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit News Modal */}
      {editingNoticia && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "2rem",
              borderRadius: "12px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
              width: "100%",
              maxWidth: "600px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--graphite)" }}>
                Editar Noticia o Comunicado
              </h3>
              <button
                onClick={() => setEditingNoticia(null)}
                style={{ background: "none", border: "none", fontSize: "1.1rem", cursor: "pointer", fontWeight: "bold", color: "var(--graphite-light)" }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateNoticia} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                  Título de la Noticia *
                </label>
                <input
                  type="text"
                  required
                  value={editNoticiaForm.titulo}
                  onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, titulo: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Categoría *
                  </label>
                  <select
                    value={editNoticiaForm.categoria}
                    onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, categoria: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                  >
                    <option value="Eventos">Eventos</option>
                    <option value="Educación">Educación</option>
                    <option value="Alianzas">Alianzas</option>
                    <option value="Institucional">Institucional</option>
                    <option value="Comunicado">Comunicado</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Lugar/Ubicación
                  </label>
                  <input
                    type="text"
                    value={editNoticiaForm.lugar}
                    onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, lugar: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                  Resumen corto (Aparece en la tarjeta) *
                </label>
                <textarea
                  required
                  rows={2}
                  value={editNoticiaForm.resumen}
                  onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, resumen: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit", resize: "none" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                  Contenido completo (Aparece al presionar Leer Más)
                </label>
                <textarea
                  rows={4}
                  value={editNoticiaForm.contenido}
                  onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, contenido: e.target.value })}
                  style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", fontFamily: "inherit" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    Fecha de publicación (Opcional)
                  </label>
                  <input
                    type="date"
                    value={editNoticiaForm.fecha}
                    onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, fecha: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem", background: "white" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.2rem" }}>
                    URL de Imagen o Video Principal *
                  </label>
                  <input
                    type="text"
                    required
                    value={editNoticiaForm.imagen}
                    onChange={(e) => setEditNoticiaForm({ ...editNoticiaForm, imagen: e.target.value })}
                    style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1.5px solid var(--chalk-dark)", fontSize: "0.82rem" }}
                  />
                </div>
              </div>

              <label
                style={{
                  display: "block",
                  marginBottom: "1rem",
                  background: "var(--chalk)",
                  padding: "1.25rem",
                  borderRadius: "8px",
                  border: "1.5px dashed var(--chalk-dark)",
                  textAlign: "center",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--crimson)";
                  e.currentTarget.style.background = "rgba(126, 27, 27, 0.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--chalk-dark)";
                  e.currentTarget.style.background = "var(--chalk)";
                }}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleEditNewsImageUpload}
                  disabled={editNoticiaUploading}
                  style={{ display: "none" }}
                />
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--graphite-light)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 0.5rem auto", display: "block" }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--graphite)" }}>
                  {editNoticiaUploading ? "Subiendo imágenes..." : "Sube fotos de tu PC para la noticia (puedes elegir varias)"}
                </span>
              </label>

              {/* Multi-image preview */}
              {editNoticiaForm.imagenes && editNoticiaForm.imagenes.length > 0 && (
                <div style={{ margin: "0.5rem 0" }}>
                  <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)", marginBottom: "0.5rem" }}>
                    Imágenes de la Galería de la Noticia ({editNoticiaForm.imagenes.length}):
                  </label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                    {editNoticiaForm.imagenes.map((imgUrl, i) => (
                      <div key={i} style={{ position: "relative", width: "60px", height: "60px", border: "1px solid var(--chalk-dark)", borderRadius: "6px", overflow: "hidden" }}>
                        <img 
                          src={imgUrl} 
                          alt="Preview" 
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditNoticiaForm({
                              ...editNoticiaForm,
                              imagenes: editNoticiaForm.imagenes.filter((_, idx) => idx !== i)
                            });
                          }}
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            background: "rgba(0,0,0,0.6)",
                            color: "white",
                            border: "none",
                            borderRadius: "50%",
                            width: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            cursor: "pointer",
                            fontWeight: "bold",
                          }}
                          title="Eliminar esta foto"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Media Preview Box */}
              {editNoticiaForm.imagen && (
                <div style={{ margin: "0.5rem 0", display: "flex", flexDirection: "column", gap: "0.3rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--graphite-light)" }}>Vista Previa del Archivo Principal:</span>
                  {(() => {
                    const embedUrl = getVideoEmbedUrl(editNoticiaForm.imagen);
                    const isVideo = embedUrl !== null;
                    const isDirectVideo = embedUrl?.startsWith("DIRECT_VIDEO:");
                    
                    if (isVideo) {
                      if (isDirectVideo) {
                        const directUrl = embedUrl.substring("DIRECT_VIDEO:".length);
                        return (
                          <video 
                            src={directUrl} 
                            controls 
                            style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--chalk-dark)", backgroundColor: "#f3f4f6" }}
                          />
                        );
                      }
                      return (
                        <iframe
                          src={embedUrl}
                          style={{ width: "100%", height: "180px", borderRadius: "8px", border: "1px solid var(--chalk-dark)", backgroundColor: "#f3f4f6" }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      );
                    }
                    
                    return (
                      <img
                        src={editNoticiaForm.imagen}
                        alt="Vista previa"
                        onClick={() => setModalImage(editNoticiaForm.imagen)}
                        style={{ width: "100%", height: "180px", objectFit: "contain", borderRadius: "8px", border: "1px solid var(--chalk-dark)", cursor: "zoom-in", backgroundColor: "#f3f4f6" }}
                      />
                    );
                  })()}
                </div>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="submit"
                  disabled={loading || editNoticiaUploading}
                  className="btn-gold"
                  style={{ flex: 1, justifyContent: "center" }}
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setEditingNoticia(null)}
                  style={{
                    flex: 1,
                    background: "transparent",
                    border: "1.5px solid var(--chalk-dark)",
                    color: "var(--graphite-light)",
                    borderRadius: "100px",
                    fontWeight: 700,
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Preview Modal for Full Size Photos */}
      {modalImage && (
        <div
          onClick={() => setModalImage(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.85)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            padding: "2rem",
          }}
        >
          <div style={{ position: "relative", maxWidth: "90%", maxHeight: "90%" }} onClick={(e) => e.stopPropagation()}>
            <img
              src={modalImage}
              alt="Preview original"
              style={{
                maxWidth: "100%",
                maxHeight: "85vh",
                objectFit: "contain",
                borderRadius: "8px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
              }}
            />
            <button
              onClick={() => setModalImage(null)}
              style={{
                position: "absolute",
                top: "-40px",
                right: "0px",
                background: "none",
                border: "none",
                color: "white",
                fontSize: "1.2rem",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "0.25rem",
              }}
            >
              ✕ Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
