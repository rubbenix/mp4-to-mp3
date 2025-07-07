'use client';
import React, { useState, useRef, useCallback } from 'react';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const [filename, setFilename] = useState<string>('output.mp3');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dragActive, setDragActive] = useState<boolean>(false);
  // Explicit generic with null initial to ensure proper typing
  const inputRef = useRef<HTMLInputElement | null>(null);

  const validateFile = useCallback((file: File) => {
    if (file.type !== 'video/mp4') {
      setError('Formato no válido. Sube un MP4.');
      return false;
    }
    setError('');
    return true;
  }, []);

  const handleSelection = useCallback((selected: File) => {
    if (!validateFile(selected)) return;
    setFile(selected);
    setDownloadUrl('');
    setFilename(selected.name.replace(/\.mp4$/i, '.mp3'));
  }, [validateFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const chosen = e.target.files?.[0];
    if (chosen) handleSelection(chosen);
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, active: boolean) => {
    e.preventDefault();
    setDragActive(active);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleSelection(dropped);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('video', file);

      const res = await fetch('/api/convert', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Conversión fallida');

      const disposition = res.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="(.+)"/);
      const outName = match ? match[1] : filename;
      setFilename(outName);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError('Error durante la conversión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-white p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow-xl max-w-lg w-full flex flex-col items-center"
      >
        <h1 className="text-4xl font-bold mb-6 text-purple-700">MP4 → MP3</h1>

        <div
          onDragOver={(e) => handleDrag(e, true)}
          onDragLeave={(e) => handleDrag(e, false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            dragActive ? 'border-purple-600 bg-purple-50' : 'border-gray-300 hover:border-purple-500'
          }`}
        >
          {file ? (
            <div>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <p className="text-gray-400">Arrastra tu MP4 aquí o haz clic para seleccionar</p>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && <p className="mt-4 text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!file || loading}
          className="mt-6 w-full py-3 bg-purple-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-purple-700 transition"
        >
          {loading ? (
            <svg
              className="animate-spin h-6 w-6 text-white"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : (
            'Convertir Ahora'
          )}
        </button>

        {downloadUrl && (
          <a
            href={downloadUrl}
            download={filename}
            className="mt-4 text-purple-600 hover:underline"
          >
            ⬇️ Descargar {filename}
          </a>
        )}
      </form>
    </main>
  );
}
