(function (options = {}) {
  const mermaidScript = document.createElement("script");
  mermaidScript.src = "https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js";

  const panZoomScript = document.createElement("script");
  panZoomScript.src = "https://unpkg.com/@panzoom/panzoom@4.5.1/dist/panzoom.min.js";

  let modalPanZoom = null;
  const initialHash = window.location.hash;

  function createVendooStyle() {
    const style = document.createElement("style");
    style.textContent = `
.mermaid-expand-icon {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 22px;
  height: 22px;
}

#mermaid-modal-content {
  width: 100%;
  height: 100%;
  background: var(--scalar-background-2);
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;

}
#mermaid-modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  justify-content: center;
  align-items: center;
}

#mermaid-modal .modal-close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  color: var(--scalar-color-1);
  font-size: 32px;
  cursor: pointer;
  z-index: 10000;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
}

#zoom-controls {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 10px;
  z-index: 10001;
  box-sizing: border-box;
  pointer-events: auto;
}

.mermaid-control-button {
  color: var(--scalar-sidebar-color-2,var(--scalar-color-2));
  background: var(--scalar-background-1);
  border-style: var(--tw-border-style);
  border-width: var(--scalar-border-width);
  border-radius: var(--scalar-radius);
  border-color: var(--scalar-border-color);
  color: rgb(255, 255, 255);
  width: 32px;
  height: 32px;
  font-weight: var(--scalar-semibold);
  font-size: var(--scalar-font-size-3);
  cursor: pointer;
  transition: 0.2s;
  box-sizing: border-box;
  padding: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

#mermaid-modal .control-button {
  box-shadow: var(--scalar-background-2) 0px 2px 8px;
  color: var(--scalar-background-2);
  font-family: var(--scalar-font);
  background: var(--scalar-button-1);
  font-size: 1.8em;
}

#mermaid-modal .control-button:hover {
  background: var(--scalar-button-1-hover);
}

#mermaid-modal-content > svg {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
}

.mermaid-rendered {
  background-color: var(--scalar-background-2);
  box-shadow: 0 0 0 var(--scalar-border-width) var(--scalar-border-color);
  border-radius: var(--scalar-radius);
  overflow: hidden;
  padding: var(--markdown-spacing-sm);
  margin: var(--markdown-spacing-sm) 0;
  cursor: pointer;
  position: relative;
}
.mermaid-rendered .mermaid-control-button {
  opacity: 0;
}

.mermaid-rendered:hover .mermaid-control-button {
  opacity: 1;
}

.mermaid-rendered > svg {
  max-width: 100%;
  height: auto;
  display: block;
  margin: auto;
}
    `;
    document.head.appendChild(style);
  }

  function createModal() {
    const modal = document.createElement("div");
    modal.id = "mermaid-modal";

    const closeBtn = document.createElement("button");
    closeBtn.innerHTML = "×";
    closeBtn.className = "modal-close-button";
    closeBtn.onclick = closeModal;

    const content = document.createElement("div");
    content.id = "mermaid-modal-content";

    modal.appendChild(closeBtn);
    modal.appendChild(content);

    // Zoom controls (add to modal, not content, so they're above SVG)
    const controls = document.createElement("div");
    controls.id = "zoom-controls";

    const zoomOutBtn = document.createElement("button");
    zoomOutBtn.innerHTML = "−";
    zoomOutBtn.id = "zoom-out-btn";
    zoomOutBtn.className = "control-button mermaid-control-button";

    const resetBtn = document.createElement("button");
    resetBtn.innerHTML = "⟲";
    resetBtn.id = "reset-btn";
    resetBtn.className = "control-button mermaid-control-button";

    const zoomInBtn = document.createElement("button");
    zoomInBtn.innerHTML = "+";
    zoomInBtn.id = "zoom-in-btn";
    zoomInBtn.className = "control-button mermaid-control-button";

    controls.appendChild(zoomOutBtn);
    controls.appendChild(resetBtn);
    controls.appendChild(zoomInBtn);
    modal.appendChild(controls);

    document.body.appendChild(modal);

    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });

    return modal;
  }

  function openModal(svgContent) {
    let modal = document.getElementById("mermaid-modal");
    if (!modal) modal = createModal();

    const content = document.getElementById("mermaid-modal-content");
    content.innerHTML = svgContent;

    const svgElement = content.querySelector("svg");

    modal.style.display = "flex";

    if (modalPanZoom) {
      modalPanZoom.destroy();
    }

    setTimeout(() => {
      modalPanZoom = Panzoom(svgElement, {
        maxScale: 20,
        minScale: 0.1,
        step: 0.3,
        startScale: 0.8,
        contain: "outside",
        cursor: "move",
        pinchAndPan: true,
        touchAction: "none",
      });

      // Enable zoom with mouse wheel
      svgElement.parentElement.addEventListener("wheel", modalPanZoom.zoomWithWheel);

      // Connect buttons
      const zoomInBtn = document.getElementById("zoom-in-btn");
      const zoomOutBtn = document.getElementById("zoom-out-btn");
      const resetBtn = document.getElementById("reset-btn");

      if (zoomInBtn) zoomInBtn.onclick = () => modalPanZoom.zoomIn();
      if (zoomOutBtn) zoomOutBtn.onclick = () => modalPanZoom.zoomOut();
      if (resetBtn) resetBtn.onclick = () => modalPanZoom.reset();
    }, 50);
  }

  function closeModal() {
    const modal = document.getElementById("mermaid-modal");
    if (modal) {
      modal.style.display = "none";
      if (modalPanZoom) {
        modalPanZoom.destroy();
        modalPanZoom = null;
      }
    }
  }

  function restoreHash(hash) {
    if (!hash || hash === "#" || hash === window.location.hash) return;

    window.location.hash = "";
    requestAnimationFrame(() => {
      window.location.hash = hash;
    });
  }

  panZoomScript.onload = () => {
    mermaidScript.onload = () => {
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
      });

      async function renderMermaidDiagrams() {
        const mermaidBlocks = Array.from(document.querySelectorAll("code.language-mermaid"));
        const renderNext = async () => {
          if (mermaidBlocks.length === 0) return;
          const block = mermaidBlocks.shift();
          if (block.dataset.rendered) return renderNext();

          const code = block.textContent;
          try {
            const diagramId = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2)}`;
            const { svg } = await mermaid.render(diagramId, code);

            const wrapper = document.createElement("div");
            wrapper.className = "mermaid-rendered";
            wrapper.innerHTML = svg;

            const expandIcon = document.createElement("button");
            expandIcon.innerHTML = "⤢";
            expandIcon.className = "mermaid-expand-icon mermaid-control-button";
            wrapper.appendChild(expandIcon);

            wrapper.addEventListener("click", () => {
              openModal(svg);
            });

            block.parentElement.replaceWith(wrapper);
            block.dataset.rendered = true;
          } catch (err) {
            console.error("Mermaid rendering failed:", err);
            block.innerHTML = `<pre>Error rendering diagram: ${err.message}</pre>`;
          } finally {
            requestAnimationFrame(renderNext);
          }
        };
        renderNext();
      }

      let debounceTimeout;
      const observer = new MutationObserver(() => {
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          renderMermaidDiagrams();
        }, 100);
      });

      observer.observe(document.body, { childList: true, subtree: true });
      document.addEventListener("DOMContentLoaded", renderMermaidDiagrams);
    };
    document.head.appendChild(mermaidScript);
  };

  createVendooStyle();

  const initDocs = () => {
    document.head.appendChild(panZoomScript);

    let hashToRestore = initialHash;

    const scalarOptions = Object.assign(
      {},
      {
        persistAuth: true,
        customCss: `.darklight-reference { display: none !important; }`,
        baseServerURL: location.origin,
        onLoaded: () => {
          restoreHash(hashToRestore);
          hashToRestore = null;
        },
        onDocumentSelect: () => {
          hashToRestore = window.location.hash;
        },
      },
      options,
    );

    if (scalarOptions.sources && scalarOptions.sources.length) {
      const replaceRegex = /https?:\/\/k[a-z-]+\.vendoo\.co/gi;
      const newServer = location.protocol.startsWith("http") ? location.origin : null;

      scalarOptions.sources = scalarOptions.sources.map((source) => ({
        ...source,
        servers: source.servers.map((s) => ({ ...s, url: newServer ? s.url.replace(replaceRegex, newServer) : s.url })),
      }));
    }

    Scalar.createApiReference("#app", scalarOptions);
  };
  if (!!!window.Scalar) {
    const scalarScript = document.createElement("script");
    scalarScript.id = "scalar-script";
    scalarScript.src = "https://cdn.jsdelivr.net/npm/@scalar/api-reference";
    scalarScript.onload = initDocs;
    document.head.appendChild(scalarScript);
  } else {
    initDocs();
  }
})(window.serviceOptions || {});
