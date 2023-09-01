import React, { useEffect, useRef, useState } from 'react';
import ImageUploader from './components/ImageUploader';
import ImagePicker from './components/ImagePicker';
import ImagePreview from './components/ImagePreview';
import { toBlob } from 'html-to-image';

interface IDynamicImagePreview {
  onSubmit: (param: any) => void;
  setIsFileAdded: (flag: boolean) => void;
  triggerSubmit: boolean;
  users?: any[];
}

const DynamicImagePreview: React.FC<IDynamicImagePreview> = ({
  onSubmit,
  triggerSubmit,
  setIsFileAdded,
  users,
}) => {
  const templateImageRef = useRef<HTMLInputElement>(null);
  const imageUploaderRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<any>(null);
  const [selectedTemplateImage, setSelectedTemplateImage] = useState<any>(null);

  const getFile = async () => {
    if (selectedTemplateImage && templateImageRef.current) {
      const newFile = await toBlob(templateImageRef.current, {
        canvasHeight: 500,
        canvasWidth: 1090,
      });
      let data = null;
      if (newFile) {
        data = [
          new File([newFile], 'kudos.png', {
            type: newFile.type,
          }),
        ];
      }
      onSubmit(data && data[0]);
      return;
    }
    onSubmit(new File([imageFile], 'kudos.png', { type: imageFile.type }));
    return;
  };

  const handleSelectTemplate = (template: any) => {
    setImageFile(null);
    setSelectedTemplateImage(template);
  };

  useEffect(() => {
    if (triggerSubmit) {
      getFile();
    }
  }, [triggerSubmit]);

  useEffect(() => {
    if (selectedTemplateImage || imageFile) {
      setIsFileAdded(true);
    } else {
      setIsFileAdded(false);
    }
  }, [selectedTemplateImage, imageFile]);

  return (
    <div>
      <div className={`bg-blue-50 min-h-[209px] mb-6`}>
        {(imageFile || selectedTemplateImage) && (
          <ImagePreview
            templateImageRef={templateImageRef}
            imageUploaderRef={imageUploaderRef}
            selectedTemplate={selectedTemplateImage}
            imageFile={imageFile}
            onRemove={() => {
              setImageFile(null);
              setSelectedTemplateImage(null);
            }}
            users={users || []}
          />
        )}
        <ImageUploader
          isImageAdded={selectedTemplateImage || imageFile}
          setImageFile={setImageFile}
          imageUploaderRef={imageUploaderRef}
        />
      </div>
      {/* Template Image Picker */}
      <ImagePicker
        onSelect={handleSelectTemplate}
        selectedTemplate={selectedTemplateImage}
      />
    </div>
  );
};

export default DynamicImagePreview;
