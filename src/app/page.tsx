'use client';
import { useState, useRef } from 'react';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [filename, setFilename] = useState('output.mp3');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dropRef = useRef(null);
  const inputRef = useRef(null);

  const handleFile = (chosenFile: File) => {
    if (chosenFile && chosenFile.type === 'video/mp4') {
      setFile(chosenFile);
      setDownloadUrl('');
      setError('');
    } else {
      setError('Por favor selecciona un archivo MP4 válido.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files![0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('video', file);

    try {
      const res = await fetch('/api/convert', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Error en la conversión');

      const disposition = res.headers.get('Content-Disposition');
      const match = disposition?.match(/filename="(.+)"/);
      const outName = match ? match[1] : filename;
      setFilename(outName);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      setError('Hubo un error al convertir');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-center mb-6 text-purple-700">MP4 a MP3</h1>
        <div
          ref={dropRef}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            file ? 'border-purple-500 bg-purple-50' : 'border-gray-300 bg-white hover:bg-purple-50'
          }`}
        >
          {file ? (
            <>
              <p className="font-medium text-gray-800">{file.name}</p>
              <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </>
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
        {error && <p className="mt-4 text-red-600 text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          disabled={!file || loading}
          className="mt-6 w-full flex items-center justify-center bg-purple-600 text-white py-2 rounded-lg disabled:opacity-50 transition-colors hover:bg-purple-700"
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
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
            className="mt-4 block text-center text-purple-600 hover:underline"
          >
            ⬇️ Descargar {filename}
          </a>
        )}
      </div>
    </main>
  );
}
