import { Icon } from '@iconify/react/dist/iconify.js';
import React, { useState } from 'react';

const UploadWithImagePreviewList = (props) => {
    const [fileNames, setFileNames] = useState([]);
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        const newFileNames = files.map((file) => file.name);
        setFileNames((prev) => [...prev, ...newFileNames]);
    };

    const removeFileName = (name) => {
        setFileNames((prev) => prev.filter((fileName) => fileName !== name));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        const files = Array.from(event.dataTransfer.files);
        const newFileNames = files.map((file) => file.name);
        setFileNames((prev) => [...prev, ...newFileNames]);
    };

    return (
        <div className="col-md-12">
            <div className="card h-100 p-0">
                <div className="card-header border-bottom bg-base py-16 px-2">
                    <h6 className="text-lg fw-semibold mb-0">Upload {props.img}</h6>
                </div>
                <div className="card-body p-24">
                    <div
                        className={`upload-area ${isDragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <label
                            htmlFor="file-upload-name"
                            className="mb-16 border border-neutral-600 fw-medium text-secondary-light px-16 py-12 radius-12 d-inline-flex align-items-center gap-2 bg-hover-neutral-200"
                        >
                            <Icon icon="solar:upload-linear" className="text-xl" />
                            Click to upload
                            <input
                                type="file"
                                className="form-control w-auto mt-24 form-control-lg"
                                id="file-upload-name"
                                multiple
                                hidden
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {fileNames.length > 0 && (
                        <ul id="uploaded-img-names" className="show-uploaded-img-name justify-items-center">
                            {fileNames.map((fileName, index) => (
                                <li
                                    key={index}
                                    className="uploaded-image-name-list text-primary-600 fw-semibold d-flex align-items-center gap-2"
                                >
                                    <Icon
                                        icon="ph:link-break-light"
                                        className="text-xl text-secondary-light"
                                    />
                                    {fileName}
                                    <Icon
                                        icon="radix-icons:cross-2"
                                        className="remove-image text-xl text-secondary-light text-hover-danger-600"
                                        onClick={() => removeFileName(fileName)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadWithImagePreviewList;
