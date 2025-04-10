import { Icon } from '@iconify/react/dist/iconify.js';
import { TbCameraPlus } from "react-icons/tb";

import React, { useEffect, useRef, useState } from 'react';

const ImageUpload = (props) => {
    const { onImageChange } = props; // Destructure onImageChange from props
    const [imagePreview, setImagePreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files.length) {
            const src = URL.createObjectURL(e.target.files[0]);
            setImagePreview(src);
            if (onImageChange) onImageChange(e.target.files[0]); // Notify parent
        }
    };

    const removeImage = () => {
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        if (onImageChange) onImageChange(null); // Notify parent
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        if (files.length) {
            const src = URL.createObjectURL(files[0]);
            setImagePreview(src);
        }
    };

    const handleUploadClick = () => {
        // Simuler un clic sur le champ de fichier pour ouvrir l'onglet de sélection d'image
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

    return (
        <div className="col-md-12">
            <div className=" h-100 p-0">
                <div className=" p-24">
                    <div
                        className={`flex-row-reverse upload-image-wrapper d-flex align-items-center gap-3 ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <div className="card col-10 p-3">
                            <h5 className='fs-6'> <span onClick={handleUploadClick} className='text-primary cursor-pointer'>Cliquez</span> ou glissez-déposez un fichier ici pour l'importer</h5>
                            <h5 className='fs-6'>SVG, PNG, JPG ou WEBP (max. 2 mb)</h5>
                        </div>
                        <div className="col-2 mr-1">
                        {/* Section d'aperçu de l'image */}
                        {imagePreview ? (
                            <div className="uploaded-img position-relative h-120-px w-120-px border input-form-light radius-8 overflow-hidden border-dashed bg-neutral-50">
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="uploaded-img__remove position-absolute top-0 end-0 z-1 text-2xxl line-height-1 me-8 mt-8 d-flex"
                                    aria-label="Supprimer l'image téléversée"
                                >
                                    <Icon
                                        icon="radix-icons:cross-2"
                                        className="text-xl text-danger-600"
                                    />
                                </button>
                                <img
                                    id="uploaded-img__preview"
                                    className="w-100 h-100 object-fit-cover"
                                    src={imagePreview}
                                    alt="Aperçu"
                                />
                            </div>
                        ) : (
                            <label
  className="upload-file h-60-px w-60-px border input-form-light rounded-full overflow-hidden border-dashed bg-neutral-50 bg-hover-neutral-200 d-flex items-center justify-center gap-1"
  htmlFor="upload-file"
>
  <TbCameraPlus className="text-2xl" />
</label>

                        )}

                        {/* L'input est toujours présent mais caché */}
                        <input
                            id="upload-file"
                            type="file"
                            onChange={handleFileChange}
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                        />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageUpload;
