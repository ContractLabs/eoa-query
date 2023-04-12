import fs from "fs";
import { google } from "googleapis";

export class GoogleDriveService {
  private driveClient;

  public constructor() {
    this.driveClient = this.createDriveClient();
  }

  createDriveClient() {
    const client = new google.auth.GoogleAuth({
      keyFile: "./key/eoa-query-upload-25837671b731.json",
      scopes: ["https://www.googleapis.com/auth/drive"],
    });

    return google.drive({
      version: "v3",
      auth: client,
    });
  }

  getPublicLink(fileId: string) {
    this.driveClient.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    const link = this.driveClient.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });

    return link;
  }

  saveFile(fileName: string, filePath: string, folderId?: string) {
    return this.driveClient.files.create({
      uploadType: "media",
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : [],
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });
  }
}
