
import { useEffect, useRef, useState } from "react";
import { ImagePlus, Trash2, UploadCloud } from "lucide-react";

interface ImageUploaderProps {
    value: File[];
    onChange: (files: File[]) => void;
    error?: string;
}

export default function ImageUploader({
    value,
    onChange,
    error,
}: ImageUploaderProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [validationError, setValidationError] = useState("");

    useEffect(() => {
        const urls = value.map((file) => URL.createObjectURL(file));
        let active = true;

        queueMicrotask(() => {
            if (active) setPreviews(urls);
        });

        return () => {
            active = false;
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [value]);

    const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(event.target.files ?? []);
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        const validFiles = selectedFiles.filter(
            (file) => allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024,
        );

        if (validFiles.length !== selectedFiles.length) {
            setValidationError(
                "Gunakan JPG, PNG, atau WebP dengan ukuran maksimal 10 MB per foto.",
            );
        } else {
            setValidationError("");
        }

        const combined = [...value, ...validFiles].slice(0, 5);
        onChange(combined);

        if (combined.length >= 5 && value.length + validFiles.length > 5) {
            setValidationError("Maksimal 5 foto untuk satu laporan.");
        }

        event.target.value = "";
    };

    const removeFile = (index: number) => {
        onChange(value.filter((_, fileIndex) => fileIndex !== index));
        setValidationError("");
    };

    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <label className="text-sm font-semibold text-slate-800">
                    Foto kerusakan <span className="text-red-500">*</span>
                </label>
                <span className="text-xs text-slate-500">{value.length}/5 foto</span>
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleFiles}
                className="hidden"
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {value.map((file, index) => (
                    <div
                        key={`${file.name}-${file.lastModified}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                        {previews[index] && (
                            <img
                                src={previews[index]}
                                alt={`Foto kerusakan ${index + 1}`}
                                className="h-full w-full object-cover"
                            />
                        )}

                        <button
                            type="button"
                            aria-label={`Hapus foto ${file.name}`}
                            onClick={() => removeFile(index)}
                            className="absolute right-2 top-2 rounded-lg bg-white/95 p-2 text-red-600 shadow-sm transition hover:bg-red-50"
                        >
                            <Trash2 size={15} />
                        </button>

                        <div className="absolute inset-x-0 bottom-0 truncate bg-slate-950/60 px-2 py-1.5 text-xs text-white">
                            {file.name}
                        </div>
                    </div>
                ))}

                {value.length < 5 && (
                    <button
                        type="button"
                        onClick={() => inputRef.current?.click()}
                        className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-blue-300 bg-blue-50/50 p-4 text-center transition hover:border-blue-500 hover:bg-blue-50"
                    >
                        {value.length === 0 ? (
                            <UploadCloud className="mb-2 text-blue-600" size={25} />
                        ) : (
                            <ImagePlus className="mb-2 text-blue-600" size={25} />
                        )}

                        <span className="text-sm font-semibold text-blue-700">
                            {value.length === 0 ? "Unggah foto" : "Tambah foto"}
                        </span>
                        <span className="mt-1 text-xs text-slate-500">
                            JPG, PNG, WebP
                        </span>
                    </button>
                )}
            </div>

            {(validationError || error) && (
                <p className="mt-2 text-sm text-red-600">
                    {validationError || error}
                </p>
            )}

            <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Unggah foto yang memperlihatkan kondisi kerusakan dengan jelas.
                Maksimal 5 foto, masing-masing 10 MB.
            </p>
        </div>
    );
}
