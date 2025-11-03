import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import SMB2 from "@marsaud/smb2";

interface StorageConfig {
  type: "local" | "smb";
  localPath?: string;
  smb?: {
    host: string;
    share: string;
    path: string;
    domain?: string;
    username: string;
    password: string;
  };
}

function getStorageConfig(): StorageConfig {
  const storageType = process.env.STORAGE_TYPE || "local";

  if (storageType === "smb") {
    const host = process.env.SMB_HOST;
    const share = process.env.SMB_SHARE;
    const username = process.env.SMB_USERNAME;
    const password = process.env.SMB_PASSWORD;

    if (!host || !share || !username || !password) {
      throw new Error(
        "SMB storage requires SMB_HOST, SMB_SHARE, SMB_USERNAME, and SMB_PASSWORD environment variables"
      );
    }

    return {
      type: "smb",
      smb: {
        host,
        share,
        path: process.env.SMB_PATH || "/",
        domain: process.env.SMB_DOMAIN,
        username,
        password,
      },
    };
  }

  return {
    type: "local",
    localPath: process.env.LOCAL_STORAGE_PATH || "public/uploads",
  };
}

async function saveToLocal(buffer: Buffer, filename: string, localPath: string): Promise<void> {
  const uploadsDir = join(process.cwd(), localPath);
  await mkdir(uploadsDir, { recursive: true });
  const filepath = join(uploadsDir, filename);
  await writeFile(filepath, buffer);
}

async function saveToSMB(
  buffer: Buffer,
  filename: string,
  smbConfig: NonNullable<StorageConfig["smb"]>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const smb2Client = new SMB2({
      share: `\\\\${smbConfig.host}\\${smbConfig.share}`,
      domain: smbConfig.domain || "",
      username: smbConfig.username,
      password: smbConfig.password,
    });

    const remotePath = join(smbConfig.path, filename).replace(/\\/g, "/");

    smb2Client.writeFile(remotePath, buffer, (err) => {
      if (err) {
        reject(new Error(`Failed to write file to SMB: ${err.message}`));
      } else {
        resolve();
      }
    });
  });
}

export async function saveImageBuffer(buffer: Buffer, filename: string): Promise<void> {
  const config = getStorageConfig();

  if (config.type === "smb" && config.smb) {
    await saveToSMB(buffer, filename, config.smb);
    console.log(`Image saved to SMB: ${filename}`);
  } else if (config.type === "local" && config.localPath) {
    await saveToLocal(buffer, filename, config.localPath);
    console.log(`Image saved locally: ${filename}`);
  } else {
    throw new Error("Invalid storage configuration");
  }
}

export async function saveBase64Image(base64Data: string, filename: string): Promise<void> {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Image = base64Data.split(",")[1];
  const buffer = Buffer.from(base64Image, "base64");
  await saveImageBuffer(buffer, filename);
}
