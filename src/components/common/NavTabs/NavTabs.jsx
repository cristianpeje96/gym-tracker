import React from "react";
import "./NavTabs.css";

export const NavTabs = ({ tabs, activo, onChange }) => {
  return (
    <nav className="nav-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tabs__item ${activo === tab.id ? "nav-tabs__item--activo" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
