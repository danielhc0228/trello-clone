import { Draggable, Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import Board from "./Board";
import { IToDo } from "../atom";

interface IToDoProps {
    toDos: { [key: string]: IToDo[] };
}

function Trello({ toDos }: IToDoProps) {
    return (
        <Droppable droppableId='all-boards' direction='horizontal' type='BOARD'>
            {(provided) => (
                <BoardsWrapper
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                >
                    {Object.keys(toDos).map((boardId, index) => (
                        <Draggable
                            key={boardId}
                            draggableId={boardId}
                            index={index}
                        >
                            {(magic) => (
                                <BoardWrapper
                                    ref={magic.innerRef}
                                    {...magic.dragHandleProps}
                                    {...magic.draggableProps}
                                >
                                    <Board
                                        toDos={toDos[boardId]}
                                        boardId={boardId}
                                    />
                                </BoardWrapper>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </BoardsWrapper>
            )}
        </Droppable>
    );
}

export default Trello;

const BoardsWrapper = styled.div`
    display: flex;
    overflow-x: auto; /* Enable horizontal scrolling */
    padding: 20px 0; /* Optional: Add some padding to top and bottom */
    gap: 16px; /* Space between the boards */
    flex-wrap: nowrap; /* Prevent the boards from wrapping to the next line */
    width: 100%; /* Ensure it takes up full width available */
    scroll-snap-type: x mandatory; /* Snap to boards when scrolling */
    scrollbar-width: thin; /* Firefox scrollbar width */
    scrollbar-color: #ff6b6b #121212;
`;

const BoardWrapper = styled.div`
    min-width: 250px; /* Adjust the width of each board */
    flex-shrink: 0; /* Prevent boards from shrinking */
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;
