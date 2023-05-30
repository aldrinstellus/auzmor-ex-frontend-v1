import React, { useState } from 'react';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import ItemList from './components/ItemList';
import { ISkillsOption } from 'components/ProfileInfo/components/PersonalDetails';

type DragDropListProps = {
  draggableItems: ISkillsOption[];
  setDraggableItems: (items: ISkillsOption[]) => void;
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
            {draggableItems?.map((item: ISkillsOption, index) => (
              <Draggable key={index} draggableId={item.id} index={index}>
                {(provided) => (
                  <li
                    className="flex items-center justify-between border border-solid border-neutral-200 rounded-17xl py-2 px-4"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    key={item.id}
                  >
                    <ItemList
                      draggableItems={draggableItems}
                      item={item}
                      setDraggableItems={setDraggableItems}
                      dataTestIdDelete={dataTestIdDelete}
                      dataTestIdEdit={dataTestIdEdit}
                    />
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
