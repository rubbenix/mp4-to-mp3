import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export const runtime = 'nodejs';

export async function POST(request) {
  try {
    console.log('🔄 Nueva petición de conversión');
    const formData = await request.formData();
    const file = formData.get('video');
    if (!file) {
      console.error('❌ No se recibió ningún archivo');
      return new Response('No file uploaded', { status: 400 });
    }

    // 1) Guardar el MP4
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const tmpDir = path.join(process.cwd(), 'tmp');
    await fs.promises.mkdir(tmpDir, { recursive: true });

    const timestamp = Date.now();
    const safeName  = `${timestamp}-${file.name.replace(/\W+/g, '_')}`;
    const inputPath = path.join(tmpDir, safeName);
    const outputPath = `${inputPath}.mp3`;

    console.log(`📥 Guardando MP4 en  ${inputPath}`);
    await fs.promises.writeFile(inputPath, buffer);

    // 2) Convertir a MP3 (usa el ffmpeg de tu PATH)
    console.log(`⚙️ Convirtiendo ${inputPath} → ${outputPath}`);
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .audioCodec('libmp3lame')
        .audioBitrate('128k')
        .format('mp3')
        .on('start', cmd => console.log('FFmpeg arrancó con:', cmd))
        .on('error', err => {
          console.error('🔥 Error de FFmpeg:', err);
          reject(err);
        })
        .on('end', () => {
          console.log('✅ Conversión terminada');
          resolve();
        })
        .save(outputPath);
    });

    // 3) Leer MP3 y limpiar
    const mp3Buffer = await fs.promises.readFile(outputPath);
    await fs.promises.unlink(inputPath);
    await fs.promises.unlink(outputPath);

    console.log('🚚 Enviando MP3 generado al cliente');
    return new Response(mp3Buffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${path.parse(file.name).name}.mp3"`,
      },
    });

  } catch (err) {
    console.error('💥 Error general en /api/convert:', err);
    return new Response('Internal Server Error', { status: 500 });
  }
}
