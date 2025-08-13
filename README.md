# Sistema Bancario Digital - React TypeScript

## 🏦 Descripción

Sistema bancario digital completo desarrollado con React TypeScript, Zustand para gestión de estado, y CSS con nesting. Permite gestión de usuarios, operaciones bancarias, préstamos y administración completa.

## 🚀 Características

### **Para Usuarios:**
- ✅ Inicio de sesión seguro
- ✅ Dashboard personalizado con balance
- ✅ Depósitos y retiros
- ✅ Solicitud de préstamos (hasta $1000)
- ✅ Historial de transacciones
- ✅ Gestión de préstamos activos
- ✅ Cálculo automático de intereses

### **Para Administradores:**
- ✅ Panel de administración completo
- ✅ Gestión de usuarios (crear, editar, eliminar)
- ✅ Estadísticas del sistema
- ✅ Vista de cuentas de usuarios
- ✅ Operaciones bancarias por usuarios
- ✅ Modal de detalles completos
- ✅ Ajuste de balances y contraseñas

## 📁 Estructura del Proyecto

```
src/
├── types/
│   └── index.ts              # Interfaces TypeScript
├── stores/
│   └── authStore.ts          # Store de Zustand
├── hooks/
│   ├── useAuth.ts            # Hook de autenticación
│   ├── useBanking.ts         # Hook de operaciones bancarias
│   └── useLoans.ts           # Hook de préstamos
├── components/
│   ├── LoginForm.tsx         # Formulario de login
│   ├── UserDashboard.tsx     # Dashboard del usuario
│   ├── AdminPanel.tsx        # Panel de administración
│   ├── AdminUserView.tsx     # Vista de usuario desde admin
│   ├── UserDetailsModal.tsx  # Modal de detalles
│   ├── TransactionHistory.tsx # Historial de transacciones
│   ├── LoansList.tsx         # Lista de préstamos
│   ├── OperationCard.tsx     # Tarjetas de operaciones
│   ├── UserCard.tsx          # Tarjetas de usuario
│   ├── StatsGrid.tsx         # Grid de estadísticas
│   ├── LogoutButton.tsx      # Botón de logout
│   └── LoanSummaryDisplay.tsx # Resumen de préstamos
├── utils/
│   ├── loanCalculations.ts   # Cálculos de préstamos
│   └── validators.ts         # Validaciones
├── styles/
│   └── global.css           # Estilos con CSS nesting
└── App.tsx                  # Componente principal
```

## 🛠️ Tecnologías Utilizadas

- **React 18** - Biblioteca de UI
- **TypeScript** - Tipado estático
- **Zustand** - Gestión de estado
- **CSS Nesting** - Estilos organizados
- **Vite** - Herramienta de build

## 🔧 Instalación y Uso

### Prerequisitos
- Node.js 18+ 
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <repository-url>
cd banking-system-react

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🔐 Credenciales de Acceso

### **Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

### **Usuarios del Sistema:**
- Usuario: `user1` a `user20` (ej: ALIRIO MANRIQUE - 10001)
- Contraseña: `password123`

## 💡 Funcionalidades Principales

### **Sistema de Préstamos:**
- Monto máximo: $1000
- Plazos: 1-6 meses
- Interés: 1.5% por mes
- Máximo 2 préstamos activos por usuario
- Pagos de cuotas automáticos

### **Gestión de Transacciones:**
- Depósitos ilimitados
- Retiros con validación de saldo
- Historial completo con timestamps
- Categorización por tipo de operación

### **Panel de Administración:**
- Estadísticas en tiempo real
- Gestión completa de usuarios
- Vista detallada de cada cuenta
- Operaciones administrativas

## 🎨 Diseño y UX

- **Responsive Design** - Adaptable a todos los dispositivos
- **CSS Nesting** - Estilos organizados y mantenibles
- **Animaciones Suaves** - Transiciones y hover effects
- **Tema Moderno** - Gradientes y sombras atractivas
- **Accesibilidad** - Navegación por teclado y contrastes

## 🔒 Seguridad

- Validación de inputs en cliente y lógica
- Gestión segura de estado con Zustand
- Separación de roles (admin/usuario)
- Validaciones de negocio (límites de préstamos, saldos)

## 📱 Responsive Features

- **Mobile First** - Diseño optimizado para móviles
- **Grid Layouts** - Distribución automática
- **Touch Friendly** - Botones y controles táctiles
- **Performance** - Carga rápida y smooth scrolling

## 🚀 Deploy

Para deployar en producción:

```bash
npm run build
# Los archivos estáticos estarán en la carpeta 'dist'
```

Compatible con:
- Vercel
- Netlify  
- GitHub Pages
- Cualquier servidor estático

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para detalles.

---

**Desarrollado con ❤️ usando React TypeScript + Zustand**
