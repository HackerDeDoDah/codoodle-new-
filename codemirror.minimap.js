// Minimal codemirror-minimap plugin for CodeMirror 5
(function(mod) {
  if (typeof exports == "object" && typeof module == "object") // CommonJS
    mod(require("codemirror"));
  else if (typeof define == "function" && define.amd) // AMD
    define(["codemirror"], mod);
  else // Plain browser env
    mod(window.CodeMirror);
})(function(CodeMirror) {
  CodeMirror.defineOption("minimap", false, function(cm, val, old) {
    if (old && old != CodeMirror.Init) {
      if (cm.state.minimap) {
        cm.state.minimap.remove();
        cm.state.minimap = null;
      }
    }
    if (val) {
      var minimap = document.createElement("div");
      minimap.className = "cm-minimap";
      cm.getWrapperElement().appendChild(minimap);
      cm.state.minimap = minimap;
      function updateMinimap() {
        var code = cm.getValue();
        minimap.innerHTML = "<pre>" + code.replace(/</g, "&lt;") + "</pre>";
        // Scrollbar
        var scrollInfo = cm.getScrollInfo();
        var ratio = minimap.offsetHeight / scrollInfo.height;
        var barHeight = Math.max(20, cm.getWrapperElement().offsetHeight * ratio);
        var barTop = scrollInfo.top * ratio;
        var bar = minimap.querySelector('.cm-minimap-scrollbar');
        if (!bar) {
          bar = document.createElement('div');
          bar.className = 'cm-minimap-scrollbar';
          minimap.appendChild(bar);
        }
        bar.style.height = barHeight + 'px';
        bar.style.top = barTop + 'px';
      }
      cm.on('change', updateMinimap);
      cm.on('scroll', updateMinimap);
      updateMinimap();
    }
  });
});
