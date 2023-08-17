import React, { useRef, useState } from 'react';
import { getBlobUrl } from 'utils/misc';
import ImageUploader from './components/ImageUploader';
import ImagePicker from './components/ImagePicker';

const DynamicImagePreview = () => {
  const [imageFile, setImageFile] = useState<any>(null);
  const [selectedTemplateImage, setSelectedTemplateImage] = useState<any>(null);
  return (
    <div>
      <div className="bg-blue-50 max-h-[210px] mb-6">
        {imageFile ? (
          <img
            src={getBlobUrl(imageFile)}
            className="object-contain w-full h-full max-h-[210px]"
          />
        ) : (
          <ImageUploader setImageFile={setImageFile} />
        )}
      </div>
      {/* Template Image Picker */}
      <ImagePicker
        onSelect={setSelectedTemplateImage}
        selectedTemplate={selectedTemplateImage}
        setImageFile={setImageFile}
      />
    </div>
  );
};

export default DynamicImagePreview;
