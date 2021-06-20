import * as fs from 'fs';
const PUBLIC_FOLDER = 'public/uploads/';

interface IUploadResponse {
  success: boolean;
  errors?: any;
  stored_path?: Array<string> | string;
  plain_str_with_splitter?: string;
}

export async function uploadSinglePhoto(file: Express.Multer.File): Promise<IUploadResponse> {
  const cleaned_file_name = file.originalname.replace(/[^\w\s.]/gi, '');
  const new_file_name = Date.now().toString() + '_' + cleaned_file_name;
  const relative_path = PUBLIC_FOLDER + new_file_name;
  return new Promise((resolve, reject) => {
    fs.writeFile(relative_path, file.buffer, (err) => {
      if (err) return resolve({ success: false, errors: err });
      console.log('file saved as ', new_file_name);
      resolve({ success: true, stored_path: relative_path.replace('public/', '') });
    });
  });
}

export function uploadMultiplePhoto(files: Array<Express.Multer.File>): IUploadResponse {
  const stored_path = [];
  files.forEach((file) => {
    const cleaned_file_name = file.originalname.replace(/[^\w\s.]/gi, '');
    const new_file_name = Date.now().toString() + '_' + cleaned_file_name;
    const relative_path = PUBLIC_FOLDER + new_file_name;
    fs.writeFileSync(relative_path, file.buffer);
    stored_path.push(relative_path.replace('public/', ''));
  });
  console.log(`total ${files.length} files were uploaded`);
  return { success: true, stored_path, plain_str_with_splitter: stored_path.join(',splitter-global-final,') };
}
