import React, { useEffect, useRef } from "react";
import Icon from "components/Icon";

interface LinkPopupProps {
  url: string;
  position: { top: number; left: number; };
  onEdit: () => void;
  onClose: () => void;
}

const LinkPopup = ({ url, position, onEdit, onClose }: LinkPopupProps) => {
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  return (
    <div
      ref={popupRef}
      className="absolute z-50 max-w-[400px] bg-white border rounded shadow p-2 flex items-center gap-2 rounded-9xl
      before:content-[''] before:absolute before:-top-1.5 before:left-4
      before:block before:w-3 before:h-3 before:bg-white
       before:border-l before:border-t before:border-gray-300
      before:rotate-45"
      style={{
        top: position.top,
        left: position.left,
      }}
    >
      <span className="text-sm font-medium text-neutral-600 truncate w-[95%]">{url}</span>
      <Icon name="edit" size={16} onClick={onEdit} />
    </div>
  );
};

export default LinkPopup