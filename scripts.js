// Initialize CodeMirror editors
const htmlEditor = CodeMirror.fromTextArea(document.getElementById('html'), {
    mode: 'htmlmixed',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseTags: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    lineWrapping: true,
    tabSize: 2,
    scrollbarStyle: null,
    keyMap: 'sublime',
    extraKeys: {
        "Shift-Ctrl-1": insertBasicTemplate,
        "Shift-Ctrl-2": insertEmailTemplate
    }
});

const cssEditor = CodeMirror.fromTextArea(document.getElementById('css'), {
    mode: 'css',
    theme: 'dracula',
    lineNumbers: true,
    autoCloseBrackets: true,
    matchBrackets: true,
    lineWrapping: true,
    tabSize: 2,
    scrollbarStyle: null
});

// Menu functionality
const menuButton = document.querySelector('.menu-button');
const menuDropdown = document.querySelector('.menu-dropdown');

menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('active');
});

// Tips functionality
const tipsButton = document.querySelector('.tips-button');
const tipsDropdown = document.querySelector('.tips-dropdown');

tipsButton.addEventListener('click', () => {
    tipsDropdown.classList.toggle('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target)) {
        menuDropdown.classList.remove('active');
    }
    if (!tipsButton.contains(e.target) && !tipsDropdown.contains(e.target)) {
        tipsDropdown.classList.remove('active');
    }
});

// Save and Load functionality
document.getElementById('saveButton').addEventListener('click', () => {
    const content = {
        html: htmlEditor.getValue(),
        css: cssEditor.getValue()
    };
    
    const blob = new Blob([JSON.stringify(content)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'editor-content.json';
    document.body.appendChild(a);
    a.click();
    
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    menuDropdown.classList.remove('active');
});

document.getElementById('loadButton').addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        
        reader.addEventListener('load', () => {
            try {
                const content = JSON.parse(reader.result);
                htmlEditor.setValue(content.html || '');
                cssEditor.setValue(content.css || '');
                updatePreview();
            } catch (err) {
                alert('Error loading file: Invalid format');
            }
        });
        
        reader.readAsText(file);
    });
    
    input.click();
    menuDropdown.classList.remove('active');
});

// document.getElementById('saveHTMLButton').addEventListener('click', () => {
//     const htmlContent = htmlEditor.getValue();
//     const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
//     const htmlUrl = URL.createObjectURL(htmlBlob);

//     const a = document.createElement('a');
//     a.href = htmlUrl;
//     a.download = 'index.html';
//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(htmlUrl);
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('saveCSSButton').addEventListener('click', () => {
//     const cssContent = cssEditor.getValue();
//     const cssBlob = new Blob([cssContent], { type: 'text/css' });
//     const cssUrl = URL.createObjectURL(cssBlob);

//     const a = document.createElement('a');
//     a.href = cssUrl;
//     a.download = 'styles.css';
//     document.body.appendChild(a);
//     a.click();

//     document.body.removeChild(a);
//     URL.revokeObjectURL(cssUrl);
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('loadHTMLButton').addEventListener('click', () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.html';

//     input.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.addEventListener('load', () => {
//             try {
//                 htmlEditor.setValue(reader.result);
//                 updatePreview();
//             } catch (err) {
//                 alert('Error loading file: Invalid format');
//             }
//         });

//         reader.readAsText(file);
//     });

//     input.click();
//     menuDropdown.classList.remove('active');
// });

// document.getElementById('loadCSSButton').addEventListener('click', () => {
//     const input = document.createElement('input');
//     input.type = 'file';
//     input.accept = '.css';

//     input.addEventListener('change', (e) => {
//         const file = e.target.files[0];
//         const reader = new FileReader();

//         reader.addEventListener('load', () => {
//             try {
//                 cssEditor.setValue(reader.result);
//                 updatePreview();
//             } catch (err) {
//                 alert('Error loading file: Invalid format');
//             }
//         });

//         reader.readAsText(file);
//     });

//     input.click();
//     menuDropdown.classList.remove('active');
// });

// Template definitions
const basicTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    
</body>
</html>`;

const emailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center;">
                <h1>Email Heading</h1>
                <p>Your email content here</p>
            </td>
        </tr>
    </table>
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 20px; text-align: center; font-size: 12px;">
                <p>Footer &copy; 2025</p>
            </td>
        </tr>
    </table>
</body>
</html>`;

// Template insertion functions
function insertBasicTemplate() {
    htmlEditor.setValue(basicTemplate);
    showBothEditors();
    // Position cursor inside the body tag
    htmlEditor.setCursor({line: 8, ch: 4});
}

function insertEmailTemplate() {
    htmlEditor.setValue(emailTemplate);
    showEmailEditor();
    // Position cursor after the email heading
    htmlEditor.setCursor({line: 12, ch: 42});
}

function showEmailEditor() {
    const htmlFolder = document.querySelector('.editor-folder:first-child');
    const cssFolder = document.querySelector('.editor-folder:last-child');
    
    htmlFolder.classList.add('expanded');
    cssFolder.classList.add('hidden');
    cssEditor.setValue('');
    htmlEditor.refresh();
}

function showBothEditors() {
    const htmlFolder = document.querySelector('.editor-folder:first-child');
    const cssFolder = document.querySelector('.editor-folder:last-child');
    
    htmlFolder.classList.remove('expanded');
    cssFolder.classList.remove('hidden');
    htmlEditor.refresh();
    cssEditor.refresh();
}

// Update preview function
function updatePreview() {
    const html = htmlEditor.getValue();
    const css = cssEditor.getValue();
    const previewContent = `
        <!DOCTYPE html>
        <html>
            <head>
                <style>${css}</style>
            </head>
            <body>${html}</body>
        </html>
    `;
    document.getElementById('preview').srcdoc = previewContent;
}

// Event listeners for editor changes
htmlEditor.on('change', updatePreview);
cssEditor.on('change', updatePreview);

// Initialize preview
updatePreview();

// Check if user has already accepted cookies
document.addEventListener('DOMContentLoaded', function() {
    const cookieConsent = document.getElementById('cookie-consent');
    const cookieOverlay = document.getElementById('cookie-overlay');
    const acceptButton = document.getElementById('accept-cookies');

    // Check if user has already accepted cookies
    if (!localStorage.getItem('cookiesAccepted')) {
        cookieConsent.style.display = 'block';
        cookieOverlay.style.display = 'block';
    }

    // Handle accept button click
    acceptButton.addEventListener('click', function() {
        localStorage.setItem('cookiesAccepted', 'true');
        cookieConsent.style.display = 'none';
        cookieOverlay.style.display = 'none';
    });
});

// CSS Art Modal functionality
const cssArtButton = document.querySelector('.css-art-button');
const cssArtModal = document.getElementById('cssArtModal');
const closeCssArt = document.querySelector('.close-css-art');
const copyHtmlBtn = document.querySelector('.copy-css-art-html');
const copyCssBtn = document.querySelector('.copy-css-art-css');
const cssArtHtmlCode = document.getElementById('cssArtHtmlCode');
const cssArtCssCode = document.getElementById('cssArtCssCode');
const cssArtShapeSelect = document.getElementById('cssArtShapeSelect');
const cssArtSampleContainer = document.getElementById('cssArtSampleContainer');

const cssArtExamples = {
    circle: {
        html: '<div class="art-circle"></div>',
        css: `.art-circle {\n  width: 100px;\n  height: 100px;\n  background:  #8be9fd;\n  border-radius: 50%;\n  margin: 20px auto;\n  box-shadow: 0 4px 24px #4442;\n}`,
        render: '<div class="art-circle"></div>'
    },
    square: {
        html: '<div class="art-square"></div>',
        css: `.art-square {\n  width: 100px;\n  height: 100px;\n  background:  #50fa7b;\n  border-radius: 16px;\n  margin: 20px auto;\n  box-shadow: 0 4px 24px #4442;\n}`,
        render: '<div class="art-square"></div>'
    },
    triangle: {
        html: '<div class="art-triangle"></div>',
        css: `.art-triangle {\n  width: 0;\n  height: 0;\n  border-left: 60px solid transparent;\n  border-right: 60px solid transparent;\n  border-bottom: 100px solid #f1fa8c;\n  margin: 20px auto;\n}`,
        render: '<div class="art-triangle"></div>'
    },
    heart: {
        html: '<div class="art-heart"></div>',
        css: `.art-heart {\n  position: relative;\n  width: 100px;\n  height: 90px;\n  background-color: red;\n  transform: rotate(-45deg);\n  margin: 50px auto;\n}\n\n.art-heart::before,\n.art-heart::after {\n  content: "";\n  position: absolute;\n  width: 100px;\n  height: 90px;\n  background-color: red;\n  border-radius: 50%;\n}\n\n.art-heart::before {\n  top: -50px;\n  left: 0;\n}\n\n.art-heart::after {\n  top: 0;\n  left: 50px;\n}\n`,
        render: '<div class="art-heart"></div>'
    },
    star: {
        html: '<div class="art-star"></div>',
        css: `.art-star {\n  width: 100px;\n  height: 100px;\n  background: #ffe066;\n  margin: 20px auto;\n  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);\n}\n`,
        render: '<div class="art-star"></div>'
    },
    diamond: {
        html: '<div class="art-diamond"></div>',
        css: `.art-diamond {\n  width: 60px;\n  height: 60px;\n  background: #00e6e6;\n  transform: rotate(45deg);\n  margin: 40px auto;\n  box-shadow: 0 4px 24px #4442;\n}\n`,
        render: '<div class="art-diamond"></div>'
    },
    moon: {
        html: '<div class="art-moon"></div>',
        css: `.art-moon {\n  width: 80px;\n  height: 80px;\n  background: #f1fa8c;\n  border-radius: 50%;\n  margin: 30px auto;\n  position: relative;\n  box-shadow: 0 4px 24px #4442;\n}\n.art-moon::after {\n  content: "";\n  position: absolute;\n  top: 10px;\n  left: 25px;\n  width: 80px;\n  height: 80px;\n  background: #282a36;\n  border-radius: 50%;\n}\n`,
        render: '<div class="art-moon"></div>'
    }
};

if (cssArtShapeSelect) {
    cssArtShapeSelect.addEventListener('change', function() {
        const val = cssArtShapeSelect.value;
        cssArtSampleContainer.innerHTML = cssArtExamples[val].render;
        cssArtHtmlCode.textContent = cssArtExamples[val].html;
        cssArtCssCode.textContent = cssArtExamples[val].css;
    });
}

if (cssArtButton && cssArtModal && closeCssArt) {
    cssArtButton.addEventListener('click', () => {
        cssArtModal.style.display = 'block';
    });
    closeCssArt.addEventListener('click', () => {
        cssArtModal.style.display = 'none';
    });
    window.addEventListener('click', (e) => {
        if (e.target === cssArtModal) {
            cssArtModal.style.display = 'none';
        }
    });
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text);
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
}

if (copyHtmlBtn && cssArtHtmlCode) {
    copyHtmlBtn.addEventListener('click', () => {
        copyToClipboard(cssArtHtmlCode.textContent);
        copyHtmlBtn.textContent = 'Copied!';
        setTimeout(() => copyHtmlBtn.textContent = 'Copy HTML', 1200);
    });
}
if (copyCssBtn && cssArtCssCode) {
    copyCssBtn.addEventListener('click', () => {
        copyToClipboard(cssArtCssCode.textContent);
        copyCssBtn.textContent = 'Copied!';
        setTimeout(() => copyCssBtn.textContent = 'Copy CSS', 1200);
    });
}