import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "@/config/axiosInstance";
import styles from "./DatabaseManagement.module.css";

interface Backup {
  name: string;
  size: number;
  createdAt: string;
}

interface RenameForm {
  fileName: string;
  newName: string;
}

const DatabaseManagement: React.FC = () => {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processing, setProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"backups" | "operations">("backups");
  const [showRenameModal, setShowRenameModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedBackup, setSelectedBackup] = useState<string>("");
  const [renameForm, setRenameForm] = useState<RenameForm>({
    fileName: "",
    newName: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch backups list
  useEffect(() => {
    fetchBackups();
  }, []);

  const fetchBackups = async () => {
    try {
      setLoading(true);
      const response: any = await axiosInstance.get("/api/db/list");

      if (response.data.backups) {
        setBackups(response.data.backups);
      }

      setError("");
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al cargar los backups";
      setError(errorMessage);
      console.error("Error fetching backups:", err);
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.post("/api/db/backup");

      if (response.data.success !== false) {
        setSuccess("Backup creado exitosamente");
        // Refresh the backups list
        await fetchBackups();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al crear el backup";
      setError(errorMessage);
      console.error("Error creating backup:", err);
    } finally {
      setProcessing(false);
    }
  };

  const restoreBackup = async (fileName: string) => {
    if (
      !confirm(
        `¿Estás seguro de que quieres restaurar el backup "${fileName}"? Esta acción reemplazará la base de datos actual.`
      )
    ) {
      return;
    }

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.patch(`/api/db/restoreNodeJS/${fileName}`);

      if (response.data.success !== false) {
        setSuccess(`Base de datos restaurada desde "${fileName}" exitosamente`);
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al restaurar el backup";
      setError(errorMessage);
      console.error("Error restoring backup:", err);
    } finally {
      setProcessing(false);
    }
  };

  const downloadBackup = async (fileName: string) => {
    try {
      setProcessing(true);
      const response: any = await axiosInstance.get(`/api/db/download/${fileName}`, {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setSuccess(`Backup "${fileName}" descargado exitosamente`);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al descargar el backup";
      setError(errorMessage);
      console.error("Error downloading backup:", err);
    } finally {
      setProcessing(false);
    }
  };

  const uploadBackup = async (file: File) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.post("/api/db/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success !== false) {
        setSuccess(`Archivo "${file.name}" subido exitosamente`);
        // Refresh the backups list
        await fetchBackups();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al subir el archivo";
      setError(errorMessage);
      console.error("Error uploading backup:", err);
    } finally {
      setProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const openRenameModal = (fileName: string) => {
    setSelectedBackup(fileName);
    setRenameForm({
      fileName,
      newName: fileName.replace(".sql", ""), // Remove extension for easier editing
    });
    setShowRenameModal(true);
  };

  const renameBackup = async () => {
    if (!renameForm.newName.trim()) {
      setError("El nuevo nombre es requerido");
      return;
    }

    const newName = renameForm.newName.endsWith(".sql") ? renameForm.newName : `${renameForm.newName}.sql`;

    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.patch(`/api/db/rename/${renameForm.fileName}`, {
        newName,
      });

      if (response.data.success !== false) {
        setSuccess(`Backup renombrado a "${newName}" exitosamente`);
        setShowRenameModal(false);
        // Refresh the backups list
        await fetchBackups();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al renombrar el backup";
      setError(errorMessage);
      console.error("Error renaming backup:", err);
    } finally {
      setProcessing(false);
    }
  };

  const openDeleteModal = (fileName: string) => {
    setSelectedBackup(fileName);
    setShowDeleteModal(true);
  };

  const deleteBackup = async () => {
    setProcessing(true);
    setError("");
    setSuccess("");

    try {
      const response: any = await axiosInstance.delete(`/api/db/delete/${selectedBackup}`);

      if (response.data.success !== false) {
        setSuccess(`Backup "${selectedBackup}" eliminado exitosamente`);
        setShowDeleteModal(false);
        // Refresh the backups list
        await fetchBackups();
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || "Error al eliminar el backup";
      setError(errorMessage);
      console.error("Error deleting backup:", err);
    } finally {
      setProcessing(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString("es-CO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith(".sql")) {
        setError("Por favor selecciona un archivo .sql válido");
        return;
      }
      uploadBackup(file);
    }
  };

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Gestión de Base de Datos</h1>
        <div className={styles.refreshBtn} onClick={fetchBackups} title="Actualizar lista">
          <i className="fas fa-sync-alt"></i>
        </div>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <i className="fas fa-exclamation-triangle"></i>
          {error}
          <button onClick={clearMessages} className={styles.closeBtn}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {success && (
        <div className={styles.successMessage}>
          <i className="fas fa-check-circle"></i>
          {success}
          <button onClick={clearMessages} className={styles.closeBtn}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab("backups")}
          className={`${styles.tab} ${activeTab === "backups" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-database"></i>
          Lista de Backups
        </button>
        <button
          onClick={() => setActiveTab("operations")}
          className={`${styles.tab} ${activeTab === "operations" ? styles.activeTab : ""}`}
        >
          <i className="fas fa-cogs"></i>
          Operaciones
        </button>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {/* Backups List Tab */}
        {activeTab === "backups" && (
          <div className={styles.backupsTab}>
            {loading ? (
              <div className={styles.loading}>
                <i className="fas fa-spinner fa-spin"></i>
                <p>Cargando backups...</p>
              </div>
            ) : backups.length > 0 ? (
              <div className={styles.backupsList}>
                <div className={styles.backupsHeader}>
                  <span>Archivo</span>
                  <span>Tamaño</span>
                  <span>Fecha de Creación</span>
                  <span>Acciones</span>
                </div>

                {backups.map((backup) => (
                  <div key={backup.name} className={styles.backupItem}>
                    <div className={styles.backupInfo}>
                      <i className="fas fa-file-archive"></i>
                      <span className={styles.fileName}>{backup.name}</span>
                    </div>
                    <div className={styles.fileSize}>{formatFileSize(backup.size)}</div>
                    <div className={styles.fileDate}>{formatDate(backup.createdAt)}</div>
                    <div className={styles.actions}>
                      <button
                        onClick={() => downloadBackup(backup.name)}
                        className={`${styles.actionBtn} ${styles.downloadBtn}`}
                        disabled={processing}
                        title="Descargar"
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button
                        onClick={() => restoreBackup(backup.name)}
                        className={`${styles.actionBtn} ${styles.restoreBtn}`}
                        disabled={processing}
                        title="Restaurar"
                      >
                        <i className="fas fa-undo"></i>
                      </button>
                      <button
                        onClick={() => openRenameModal(backup.name)}
                        className={`${styles.actionBtn} ${styles.renameBtn}`}
                        disabled={processing}
                        title="Renombrar"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        onClick={() => openDeleteModal(backup.name)}
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        disabled={processing}
                        title="Eliminar"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noBackups}>
                <i className="fas fa-database"></i>
                <p>No hay backups disponibles</p>
                <button onClick={createBackup} className={styles.createFirstBtn} disabled={processing}>
                  Crear Primer Backup
                </button>
              </div>
            )}
          </div>
        )}

        {/* Operations Tab */}
        {activeTab === "operations" && (
          <div className={styles.operationsTab}>
            <div className={styles.operationsGrid}>
              {/* Create Backup */}
              <div className={styles.operationCard}>
                <div className={styles.operationHeader}>
                  <i className="fas fa-plus-circle"></i>
                  <h3>Crear Backup</h3>
                </div>
                <p>Genera un backup completo de la base de datos actual</p>
                <button
                  onClick={createBackup}
                  className={`${styles.operationBtn} ${styles.createBtn}`}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Creando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus-circle"></i>
                      Crear Backup
                    </>
                  )}
                </button>
              </div>

              {/* Upload Backup */}
              <div className={styles.operationCard}>
                <div className={styles.operationHeader}>
                  <i className="fas fa-upload"></i>
                  <h3>Subir Backup</h3>
                </div>
                <p>Sube un archivo de backup (.sql) al servidor</p>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".sql"
                  style={{ display: "none" }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`${styles.operationBtn} ${styles.uploadBtn}`}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-upload"></i>
                      Seleccionar Archivo
                    </>
                  )}
                </button>
              </div>

              {/* Refresh List */}
              <div className={styles.operationCard}>
                <div className={styles.operationHeader}>
                  <i className="fas fa-sync-alt"></i>
                  <h3>Actualizar Lista</h3>
                </div>
                <p>Recarga la lista de backups disponibles</p>
                <button
                  onClick={fetchBackups}
                  className={`${styles.operationBtn} ${styles.refreshBtnLarge}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Cargando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-sync-alt"></i>
                      Actualizar
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Warning Section */}
            <div className={styles.warningSection}>
              <div className={styles.warningCard}>
                <i className="fas fa-exclamation-triangle"></i>
                <div className={styles.warningContent}>
                  <h4>Advertencias Importantes</h4>
                  <ul>
                    <li>
                      <strong>Restaurar:</strong> Reemplaza completamente la base de datos actual
                    </li>
                    <li>
                      <strong>Eliminar:</strong> Los backups eliminados no se pueden recuperar
                    </li>
                    <li>
                      <strong>Backups:</strong> Se recomienda crear backups regularmente
                    </li>
                    <li>
                      <strong>Archivos:</strong> Solo archivos .sql son válidos para subir
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rename Modal */}
      {showRenameModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Renombrar Backup</h3>
              <button onClick={() => setShowRenameModal(false)} className={styles.modalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <p>
                Archivo actual: <strong>{renameForm.fileName}</strong>
              </p>
              <div className={styles.formGroup}>
                <label htmlFor="newName">Nuevo nombre:</label>
                <input
                  type="text"
                  id="newName"
                  value={renameForm.newName}
                  onChange={(e) => setRenameForm((prev) => ({ ...prev, newName: e.target.value }))}
                  placeholder="nuevo-nombre"
                  className={styles.input}
                />
                <small>La extensión .sql se agregará automáticamente</small>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowRenameModal(false)} className={styles.cancelBtn} disabled={processing}>
                Cancelar
              </button>
              <button
                onClick={renameBackup}
                className={styles.confirmBtn}
                disabled={processing || !renameForm.newName.trim()}
              >
                {processing ? "Renombrando..." : "Renombrar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Confirmar Eliminación</h3>
              <button onClick={() => setShowDeleteModal(false)} className={styles.modalClose}>
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.deleteWarning}>
                <i className="fas fa-exclamation-triangle"></i>
                <p>¿Estás seguro de que quieres eliminar el backup:</p>
                <strong>{selectedBackup}</strong>
                <p>Esta acción no se puede deshacer.</p>
              </div>
            </div>

            <div className={styles.modalActions}>
              <button onClick={() => setShowDeleteModal(false)} className={styles.cancelBtn} disabled={processing}>
                Cancelar
              </button>
              <button onClick={deleteBackup} className={styles.deleteConfirmBtn} disabled={processing}>
                {processing ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabaseManagement;
