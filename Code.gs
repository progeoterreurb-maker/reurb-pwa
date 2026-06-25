// ── Google Apps Script — REURB Cadastro ──────────────────────────
// Cole este código em: script.google.com → Novo projeto

const PIN            = '123456';
const FOLDER_ROOT_ID = '1MEkKO64VJQez9sbMhGS6azgrJwk3MuKq';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    if (!data.pin || data.pin !== PIN) {
      return resp({ error: 'PIN inválido' });
    }

    if (data.action === 'criar_pasta') {
      const root  = DriveApp.getFolderById(FOLDER_ROOT_ID);
      const iter  = root.getFoldersByName(data.nomePasta);
      const pasta = iter.hasNext() ? iter.next() : root.createFolder(data.nomePasta);
      return resp({ success: true, folderId: pasta.getId() });
    }

    if (data.action === 'upload_foto') {
      const pasta = DriveApp.getFolderById(data.folderId);
      const blob  = Utilities.newBlob(
        Utilities.base64Decode(data.fileData),
        'image/jpeg',
        data.fileName
      );
      pasta.createFile(blob);
      return resp({ success: true });
    }

    return resp({ error: 'Ação inválida' });

  } catch (err) {
    return resp({ error: err.toString() });
  }
}

function resp(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
