import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from 'react';
import { useWatch } from "react-hook-form";

type Props = {
    control: any;
    name: string;
    labelName: string;
    placeholder?: string;
    disabled?: boolean;
    currentImage?: string;
};

export default function _ZodInputImage(props: Props) {
    const { control, name, labelName, placeholder, disabled, currentImage } = props;

    const watchedFile = useWatch({ control, name }); // Pantau perubahan nilai 'file'
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (watchedFile) {
            if (typeof watchedFile === "string") {
                // Jika file adalah string (URL dari API)
                setPreview(watchedFile);
            } else if (watchedFile instanceof File) {
                // Jika file adalah File object (dari input)
                const objectUrl = URL.createObjectURL(watchedFile);
                setPreview(objectUrl);
                return () => URL.revokeObjectURL(objectUrl); // Cleanup URL untuk menghindari memory leak
            }
        } else {
            setPreview(currentImage); // Jika tidak ada file, hapus preview
        }
    }, [watchedFile, currentImage]);

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{labelName}</FormLabel>
                    <FormControl>
                        {!disabled && (
                            <Input
                                placeholder={placeholder}
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]; // Ambil file pertama
                                    field.onChange(file); // Serahkan file ke react-hook-form
                                }}
                                disabled={disabled}
                            />
                        )}
                    </FormControl>

                    {/* Preview Image */}
                    {preview && (
                        <div className="mt-4">
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full max-h-[300px] object-cover overflow-hidden border rounded shadow"
                            />
                        </div>
                    )}

                    <FormMessage />
                </FormItem>
            )}
        />
    );
}