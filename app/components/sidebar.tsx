"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    {
      id: "recommended",
      label: "Recetas Recomendadas",
      href: "/dashboard",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      id: "add",
      label: "Agregar Receta",
      href: "/dashboard/add",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      ),
    },

    {
      id: "delete",
      label: "Eliminar Recetas",
      href: "/dashboard/delete",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40
        ${isOpen ? "w-72" : "w-24"}
        bg-white/80 dark:bg-black/20 backdrop-blur-md
        border-r border-black/[.08] dark:border-white/[.145]
        transition-[width] duration-300 ease-in-out
        flex flex-col relative
      `}
    >
      {/* Pestaña: ahora por fuera del borde */}
      <button
        onClick={onToggle}
        className="
          absolute top-1/2 -translate-y-1/2 -right-6
          w-6 h-16 rounded-r-lg
          bg-blue-600 text-white shadow-md
          hover:bg-blue-700 transition-colors
          flex items-center justify-center
        "
        aria-label={isOpen ? "Contraer menú" : "Expandir menú"}
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d={isOpen ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"}
          />
        </svg>
      </button>

      {/* Header fijo */}
      <div className="h-16 px-4 border-b border-black/[.08] dark:border-white/[.145] flex items-center justify-center">
        {isOpen ? (
          <div
            className={`
              flex flex-col text-center
              opacity-0 transition-opacity duration-200 delay-150
              ${isOpen ? "opacity-100" : ""}
            `}
          >
            <h2 className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
              VibeCooking
            </h2>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Gestión de Recetas
            </p>
          </div>
        ) : (
          <span className="text-sm font-bold tracking-widest uppercase bg-blue-600 text-white px-2 py-1 rounded-md shadow-sm">
            VC
          </span>
        )}
      </div>

      {/* Menú */}
      <nav className="flex-1 px-3 py-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  className={`
                    h-12 flex items-center gap-3 px-3 rounded-lg text-sm font-medium
                    transition-colors
                    border
                    ${
                      isActive
                        ? "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                        : "text-gray-700 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-white/5 border-transparent"
                    }
                  `}
                >
                  <div
                    className={`
                      w-10 h-10 flex-shrink-0 rounded-md
                      flex items-center justify-center
                      ${
                        isActive
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }
                    `}
                  >
                    {item.icon}
                  </div>
                  {isOpen && <span className="truncate">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
