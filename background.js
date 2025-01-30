
// Ajouter l'option "Copier le ALT" sous le menu parent
browser.contextMenus.create({
    id: "copy-alt-text",
    title: "Copier le ALT",
    contexts: ["image"]
});

// Ajouter l'option "Copier le Title" sous le menu parent
browser.contextMenus.create({
    id: "copy-title-text",
    title: "Copier le Title",
    contexts: ["all"]
});

// Ajouter l'option "Copier la meta description" sous le menu parent
browser.contextMenus.create({
    id: "copy-meta-description-text",
    title: "Copier la meta description",
    contexts: ["all"]
});

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "copy-alt-text") {
       browser.tabs.executeScript(tab.id, {
           code: `
               (function() {
                   let images = document.querySelectorAll('img');
                   let targetImg = null;
                   let srcToFind = ${JSON.stringify(info.srcUrl)};

                   images.forEach(img => {
                       if (img.src === srcToFind || img.currentSrc === srcToFind || img.dataset.lazySrc === srcToFind) {
                           targetImg = img;
                       }
                   });

                   if (targetImg && targetImg.alt) {
                       navigator.clipboard.writeText(targetImg.alt).then(() => {
                           alert('ALT copié : ' + targetImg.alt);
                       }).catch(err => console.error('Erreur de copie :', err));
                   } else {
                       alert('Aucun ALT trouvé.');
                   }
               })();
           `
       });
   }

   if (info.menuItemId === "copy-title-text") {
        browser.tabs.executeScript(tab.id, {
            code: `
                (function() {
                    let pageTitle = document.title;
                    navigator.clipboard.writeText(pageTitle || '');
                    alert('Title copié : ' + pageTitle);
                })();
            `
        });
    }

    if (info.menuItemId === "copy-meta-description-text") {
        browser.tabs.executeScript(tab.id, {
            code: `
                (function() {
                    let metaDescription = document.querySelector('meta[name="description"]');
                    let content = metaDescription ? metaDescription.content : '';
                    navigator.clipboard.writeText(content || '');
                    alert('Meta description copiée : ' + content);
                })();
            `
        });
    }
});
