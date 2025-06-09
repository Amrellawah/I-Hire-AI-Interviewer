import { formidable } from 'formidable';
import fs from 'fs';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  const form = formidable();
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Formidable error:', err);
      return res.status(500).json({ error: 'Upload error' });
    }
    console.log('FILES:', files);
    const file = Array.isArray(files.cv) ? files.cv[0] : files.cv;
    console.log('FILE:', file);
    if (!file) return res.status(400).json({ error: 'No file uploaded' });
    let text = '';
    try {
      if (file.mimetype === 'application/pdf') {
        const dataBuffer = fs.readFileSync(file.filepath);
        const data = await pdfParse(dataBuffer);
        text = data.text;
      } else if (file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const data = await mammoth.extractRawText({ path: file.filepath });
        text = data.value;
      } else {
        return res.status(400).json({ error: 'Unsupported file type' });
      }
      res.status(200).json({ text });
    } catch (e) {
      console.error('CV parse error:', e);
      res.status(500).json({ error: 'Failed to parse CV' });
    }
  });
} 