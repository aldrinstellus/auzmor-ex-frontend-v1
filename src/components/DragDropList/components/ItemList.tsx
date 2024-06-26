import { FC, useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import { ISkillsOption } from 'components/ProfileInfo/components/PersonalDetails';

export interface IItemListProps {
  item: ISkillsOption;
  dataTestIdEdit?: string;
  dataTestIdDelete?: string;
  draggableItems: ISkillsOption[];
  setDraggableItems: (items: ISkillsOption[]) => void;
  isDragging: boolean;
}

const ItemList: FC<IItemListProps> = ({
  item,
  dataTestIdEdit,
  dataTestIdDelete,
  draggableItems,
  setDraggableItems,
  isDragging = false,
}) => {
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [newEnteredValue, setNewEnteredValue] = useState<string>(item.value);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditable) {
      inputRef?.current?.focus();
    }
  }, [isEditable]);

  const updateInitialSkillsets = (id: string, newValue: string) => {
    const updateSkillsets = draggableItems?.map((item) =>
      item.id === id ? { ...item, value: newValue } : item,
    );
    setDraggableItems(updateSkillsets);
  };

  return (
    <>
      <div className="flex items-center space-x-4">
        <Icon name="reorder" />
        <div className="mr-2 w-full" data-testid={`edit-${item.value}`}>
          {isEditable ? (
            <input
              type="text"
              value={newEnteredValue}
              ref={inputRef}
              style={{ border: 'none', outline: 'none' }}
              onChange={(event) => {
                setNewEnteredValue(event?.target?.value);
                updateInitialSkillsets(item.id, event?.target?.value);
              }}
              aria-label="draggable item"
              aria-valuetext={item.value}
            />
          ) : (
            <div>{item.value}</div>
          )}
        </div>
      </div>
      {!isDragging && (
        <div className="flex space-x-4 items-center">
          <div data-testid={`${dataTestIdEdit}-${item.value}`}>
            <Icon
              name="edit"
              size={20}
              onClick={() => {
                setIsEditable(!isEditable);
              }}
            />
          </div>
          <div data-testid={`${dataTestIdDelete}-${item.value}`}>
            <Icon
              name="delete"
              color="text-[#F05252]"
              size={20}
              onClick={() => {
                const updatedValues = draggableItems.filter(
                  (element) => element?.value !== item.value,
                );
                setDraggableItems(updatedValues);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ItemList;
