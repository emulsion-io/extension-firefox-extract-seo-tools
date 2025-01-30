browser.contextMenus.create({
   id: "copy-alt-text",
   title: "Copier le ALT",
   contexts: ["image"],
      icons: {
      "16": "icons/copy-alt-16.png",
      "32": "icons/copy-alt-32.png"
   }
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
});
