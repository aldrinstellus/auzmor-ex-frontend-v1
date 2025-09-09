import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Button, { Size, Variant } from "components/Button";
import Layout, { FieldType } from "components/Form";
import Icon from "components/Icon";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useEffect, useRef } from "react";

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkText: string, url: string) => void;
  selectedText: string;
  url: string;
}

enum AddFlow {
  CreateLink = 'CREATE_LINK',
  EditLink = 'EDIT_LINK',
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, onSave, selectedText, url }) => {
  const { t } = useTranslation('postBuilder');
  const modalRef = useRef<HTMLDivElement>(null);

  const schema = yup.object().shape({
    linkText: yup.string().required(t('hyperlink.emptyTextMsg')),
    textUrl: yup
      .string()
      .required(t('hyperlink.emptyUrlMsg'))
      .test("is-url-valid", t('hyperlink.invalidUrlMsg'), (value) => {
        if (!value) return false;
        try {
          new URL(value.startsWith('http') ? value : `https://${value}`);
          return value.trim().length > 0 && (value.includes('.') || value.startsWith('http'));
        } catch {
          return false;
        }
      }),
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
    clearErrors,
  } = useForm<any>({
    defaultValues: {
      linkText: selectedText || "",
      textUrl: url || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const linkFlow = false ? AddFlow.EditLink : AddFlow.CreateLink;
  const dataTestId = linkFlow === AddFlow.CreateLink ? "create-link" : "edit-link";

  useEffect(() => {
    if (isOpen) {
      reset({
        linkText: selectedText || "",
        textUrl: url || "",
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pt-[270px]">
      <div ref={modalRef} className="bg-white rounded-9xl shadow-xl border border-neutral-100 w-[460px] h-[340px]">
        <div className="flex justify-between items-center p-4 border-b-2 border-neutral-100">
          <h2 className="text-lg font-bold">{t('hyperlink.modalTitle')}</h2>
          <Icon name="close" size={20} onClick={() => onClose()} />
        </div>
        <div className="px-4 pt-2 h-[57.5%]">
          <Layout
            className="w-full flex flex-col gap-5"
            fields={[
              {
                type: FieldType.Input,
                control,
                name: "linkText",
                label: t("hyperlink.linkTextLabel"),
                placeholder: t("hyperlink.textPlaceholder"),
                dataTestId: `${dataTestId}-text`,
                required: true,
                autoFocus: selectedText ? false : true,
                error: errors.linkText?.message,
              },
              {
                type: FieldType.Input,
                control,
                name: "textUrl",
                label: t("hyperlink.pasteUrl"),
                placeholder: t("hyperlink.placeholder"),
                dataTestId: `${dataTestId}-url`,
                required: true,
                clearErrors,
                error: errors.textUrl?.message,
                autofocus: selectedText ? true : false,
              },
            ]}
          />
        </div>
        <div className="flex justify-end items-center px-4 h-[24%] gap-2 bg-blue-50 rounded-b-9xl">
          <Button
            variant={Variant.Secondary}
            size={Size.Small}
            className = 'h-[36px]'
            label={t('hyperlink.cancelLabel')}
            onClick={() => onClose()}
          />
          <Button
            size={Size.Small}
            label={t('hyperlink.saveLabel')}
            className = 'h-[36px]'
            disabled={!isValid}
            onClick={handleSubmit((values) => {
              onSave(values?.linkText?.trim(), values?.textUrl?.trim());
            })}
          />
        </div>
      </div>
    </div>
  );
}

export default AddLinkModal;