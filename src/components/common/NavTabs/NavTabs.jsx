import React from "react";
import "./NavTabs.css";

const ICONOS = {
  dashboard: "🎯",
  entrenar: "💪",
  historial: "📊",
  plan: "📅",
  nutricion: "🥗",
  perfil: "👤",
};

export const NavTabs = ({ tabs, activo, onChange }) => {
  return (
    <nav
      className="nav-tabs"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tabs__item ${activo === tab.id ? "nav-tabs__item--activo" : ""}`}
          onClick={() => onChange(tab.id)}
          type="button"
        >
          <span className="nav-tabs__icono" aria-hidden="true">
            {ICONOS[tab.id] || "•"}
          </span>
          <span className="nav-tabs__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};
