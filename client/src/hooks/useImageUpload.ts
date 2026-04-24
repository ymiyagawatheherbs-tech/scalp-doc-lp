/**
 * デバイスから画像を選択してS3にアップロードする共通フック
 */
import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UseImageUploadOptions {
  maxSizeMB?: number;
  folder?: string;
}

export function useImageUpload(options: UseImageUploadOptions = {}) {
  const { maxSizeMB = 10, folder = "uploads" } = options;
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadMutation = trpc.storage.uploadContentImage.useMutation({
    onError: (err: { message?: string }) => {
      toast.error(err.message || "アップロードに失敗しました");
      setUploading(false);
    },
  });

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`ファイルサイズは${maxSizeMB}MB以下にしてください`);
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      try {
        const result = await uploadMutation.mutateAsync({
          dataUrl,
          originalName: file.name,
          folder,
        });
        onSuccess(result.url);
        toast.success("画像をアップロードしました");
      } finally {
        setUploading(false);
        if (inputRef.current) inputRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  return {
    inputRef,
    uploading,
    openPicker,
    handleFileChange,
  };
}
