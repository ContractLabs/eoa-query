/**
 * @title GoogleDriveService
 * @dev A class that provides functionality to interact with Google Drive API.
 */
import fs from "fs";
import { drive_v3, google } from "googleapis";

export class GoogleDriveService {
  /**
   * @dev A client to interact with Google Drive API.
   */
  private driveClient: drive_v3.Drive;

  /**
   * @dev Constructor that sets up a drive client for interacting with the API.
   * @param keyFile The path of the file containing the credentials for accessing the API.
   * @param scopes The scopes that the credentials should be authorized for.
   */
  public constructor(keyFile: string, scopes: string[]) {
    this.driveClient = this.createDriveClient(keyFile, scopes);
  }

  /**
   * @dev Creates a drive client instance using the provided credentials.
   * @param keyFile The path of the file containing the credentials for accessing the API.
   * @param scopes The scopes that the credentials should be authorized for.
   * @returns The drive client instance.
   */
  createDriveClient(keyFile: string, scopes: string[]) {
    const client = new google.auth.GoogleAuth({
      keyFile: keyFile,
      scopes: scopes,
    });

    return google.drive({
      version: "v3",
      auth: client,
    });
  }

  /**
   * @dev Grants public permission to view the file and returns the public link.
   * @param fileId The ID of the file to grant public permission to.
   * @returns The public link of the file.
   */
  getPublicLink(fileId: string) {
    this.driveClient.permissions.create({
      fileId: fileId,
      requestBody: {
        role: "reader",
        type: "anyone",
      },
    });

    return this.driveClient.files.get({
      fileId: fileId,
      fields: "webViewLink, webContentLink",
    });
  }

  /**
   * @dev Saves a file to the Google Drive folder.
   * @param fileName The name of the file to be saved.
   * @param filePath The path of the file to be saved.
   * @param folderId The ID of the folder to save the file in (optional).
   * @returns The file creation response.
   */
  saveFile(fileName: string, filePath: string, folderId?: string) {
    return this.driveClient.files.create({
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
