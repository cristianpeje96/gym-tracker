import React from "react";
import {
  Target,
  Dumbbell,
  BarChart3,
  Calendar,
  Salad,
  User,
} from "lucide-react";
import "./NavTabs.css";

const ICONOS = {
  dashboard: Target,
  entrenar: Dumbbell,
  historial: BarChart3,
  plan: Calendar,
  nutricion: Salad,
  perfil: User,
};

export const NavTabs = ({ tabs, activo, onChange }) => {
  return (
    <nav
      className="nav-tabs"
      style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
    >
      {tabs.map((tab) => {
        const Icono = ICONOS[tab.id];
        const esActivo = activo === tab.id;
        return (
          <button
            key={tab.id}
            className={`nav-tabs__item ${esActivo ? "nav-tabs__item--activo" : ""}`}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {Icono && (
              <Icono
                size={20}
                strokeWidth={esActivo ? 2 : 1.75}
                className="nav-tabs__icono"
              />
            )}
            <span className="nav-tabs__label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
