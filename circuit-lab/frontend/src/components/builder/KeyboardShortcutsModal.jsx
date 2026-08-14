import React from "react";

export function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "R", description: "Rotate selected component by 90°" },
    { key: "Delete / Backspace", description: "Delete selected component or wire" },
    { key: "Ctrl + Z", description: "Undo last circuit edit" },
    { key: "Ctrl + Y / Ctrl + Shift + Z", description: "Redo previously undone action" },
    { key: "Space + Drag", description: "Pan circuit canvas view" },
    { key: "Scroll Wheel", description: "Zoom in / out on active schematic" },
    { key: "Esc", description: "Deselect active tool or component" },
    { key: "C", description: "Toggle Code Editor drawer (Arduino/ESP32)" },
    { key: "S", description: "Trigger circuit simulation run" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden text-slate-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-800/50">
          <div className="flex items-center space-x-2">
            <span className="text-cyan-400 text-xl font-bold">⌨️</span>
            <h3 className="text-lg font-semibold text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors text-xl font-bold p-1"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-3">
          {shortcuts.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40 border border-slate-800/60 hover:bg-slate-800/80 transition-colors"
            >
              <span className="text-sm text-slate-300 font-medium">{item.description}</span>
              <kbd className="px-2.5 py-1 text-xs font-mono font-semibold text-cyan-300 bg-slate-950 border border-cyan-500/30 rounded shadow-sm">
                {item.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-200 bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow transition-all duration-200"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
