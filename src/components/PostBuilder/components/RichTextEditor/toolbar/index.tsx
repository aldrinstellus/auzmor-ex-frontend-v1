import Icon from 'components/Icon';
import { FC, RefObject } from 'react';
import ReactQuill from 'react-quill';

interface IToolbarProps {
  isCharLimit: boolean;
  dataTestId?: string;
  quillRef: RefObject<ReactQuill>;
}

const Toolbar: FC<IToolbarProps> = ({ isCharLimit, dataTestId, quillRef }) => {
  return (
    <div id="toolbar">
      <div className="relative">
        {isCharLimit && (
          <div
            className="bg-red-50 border-y-1 border-red-300 px-4 py-2 flex justify-between w-full bottom-full items-center"
            data-testid="createpost-content-charlimitreached-error"
          >
            <div className="flex items-center">
              <Icon
                name="infoCircleOutline"
                size={32}
                color="text-red-500"
                className="p-1.5 bg-red-100 rounded-7xl mr-2"
              />
              <div className="truncate text-red-500 text-sm">
                You have reached maximum character limit.
              </div>
            </div>
            <div className="text-sm font-bold text-red-500">
              3000+ characters
            </div>
          </div>
        )}
        <div className="flex justify-between items-center px-6 py-4 border-t-1">
          <div className="flex items-center">
            <span className="flex items-center gap-4">
              <button
                className="ql-bold ql-bold-button !h-[16px] !w-[16px] !m-0"
                data-testid={`${dataTestId}-content-bold`}
              />
              <button
                className="ql-italic ql-italic-button !h-[16px] !w-[16px] !m-0"
                data-testid={`${dataTestId}-content-italic`}
              />
              <button
                className="ql-underline ql-underline-button !h-[16px] !w-[16px] !m-0"
                data-testid={`${dataTestId}-content-underline`}
              />
              <button
                className="ql-emoji mt-[2px] text-neutral-900 !h-[16px] !w-[16px] !mr-0"
                data-testid={`${dataTestId}-content-emoji`}
              />
            </span>
          </div>
          <div className="font-bold text-sm text-neutral-900">
            <div
              className="text-sm font-bold cursor-pointer text-neutral-900 hover:text-primary-500"
              onClick={() =>
                quillRef?.current
                  ?.getEditor()
                  ?.getModule('mention')
                  ?.openMenu('#')
              }
              data-testid="createpost-addhashtag-cta"
            >
              Add Hashtag
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
