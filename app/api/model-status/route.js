import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Check if the fine-tuned model files exist
    const modelPath = path.join(process.cwd(), 'public', 'fine-tuned-job-matcher');
    const requiredFiles = [
      'config.json',
      'tokenizer.json',
      'tokenizer_config.json',
      'model.safetensors',
      'modules.json'
    ];

    const fileStatus = {};
    let allFilesExist = true;

    for (const file of requiredFiles) {
      const filePath = path.join(modelPath, file);
      const exists = fs.existsSync(filePath);
      fileStatus[file] = exists;
      if (!exists) {
        allFilesExist = false;
      }
    }

    return NextResponse.json({
      status: 'success',
      modelFiles: {
        path: modelPath,
        exists: allFilesExist,
        files: fileStatus
      },
      message: allFilesExist ? 
        'Fine-tuned model files are available' : 
        'Some fine-tuned model files are missing'
    });
  } catch (error) {
    console.error('Error checking model status:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to check model status',
      error: error.message
    }, { status: 500 });
  }
} 