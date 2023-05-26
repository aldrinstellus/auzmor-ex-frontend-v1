import React from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import Icon from 'components/Icon';

type DragDropListProps = {
  draggableItems: Record<string, string>[];
  setDraggableItems: (items: Record<string, string>[]) => void;
  dataTestIdEdit?: string;
  dataTestIdDelete?: string;
};

const DragDropList: React.FC<DragDropListProps> = ({
  draggableItems,
  setDraggableItems,
  dataTestIdEdit,
  dataTestIdDelete,
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const updatedItems = [...draggableItems];
    const [removed] = updatedItems.splice(source.index, 1);
    updatedItems.splice(destination.index, 0, removed);
    setDraggableItems(updatedItems);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId={'skils-list'}>
        {(provided) => (
          <ul
            className="mt-3 space-y-1"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {draggableItems?.map((item, index) => (
              <Draggable key={index} draggableId={item.id} index={index}>
                {(provided) => (
                  <li
                    className="flex items-center justify-between border border-solid border-neutral-200 rounded-17xl py-2 px-4"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={item.id}
                  >
                    <div className="flex items-center space-x-4">
                      <Icon name="reorder" />
                      <span className="mr-2" data-testid={`edit-${item.value}`}>
                        {item.value}
                      </span>
                    </div>
                    <div className="flex space-x-4 items-center">
                      <div data-testid={`${dataTestIdEdit}-${item.value}`}>
                        <Icon name="edit" size={20} />
                      </div>
                      <div data-testid={`${dataTestIdDelete}-${item.value}`}>
                        <Icon
                          name="delete"
                          stroke="#F05252"
                          hover={false}
                          fill="#F05252"
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
                  </li>
                )}
              </Draggable>
            ))}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropList;
