import React, { useRef } from "react";
import "./ImportExport.css";

export default function ImportExportButtons({ students, onImport }) {
  const fileInputRef = useRef();

  const handleExport = (format) => {
    if (!students || students.length === 0) return;

    if (format === "json") {
      const dataStr = JSON.stringify(students, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "students.json";
      link.click();
      URL.revokeObjectURL(url);
    } else if (format === "csv") {
      const headers = ["Name", "Grade"];
      const csvRows = [headers.join(",")];
      students.forEach((s) => {
        csvRows.push([s.name, s.grade].join(","));
      });
      const csvStr = csvRows.join("\n");
      const blob = new Blob([csvStr], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "students.csv";
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const text = ev.target.result;
        let imported = [];

        if (file.name.endsWith(".json")) {
          imported = JSON.parse(text);
        } else if (file.name.endsWith(".csv")) {
          const rows = text.trim().split("\n");
          imported = rows.slice(1).map((row) => {
            const [name, grade] = row.split(",");
            return { name: name.trim(), grade: parseFloat(grade) };
          });
        }

        onImport(imported);
      } catch (err) {
        console.error("Failed to import file", err);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="import-export-buttons">
      {/* Import Button */}
      <div className="import-button">
        <button type="button" onClick={() => fileInputRef.current.click()}>Import</button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept=".json,.csv"
            onChange={handleImport}
          />
      </div>

      {/* Export Dropdown */}
      <div className="export-dropdown">
        <button type="button">Export</button>
        <div className="export-options">
          <span onClick={() => handleExport("json")}>JSON</span>
          <span onClick={() => handleExport("csv")}>CSV</span>
        </div>
      </div>
    </div>
  );
}