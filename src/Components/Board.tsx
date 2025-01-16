import { Droppable } from "@hello-pangea/dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
    width: 300px;
    padding: 20px 10px;
    padding-top: 30px;
    background-color: ${(props) =>
        props.theme.boardColor || "#f5f7fa"}; // Soft light gray
    border-radius: 8px; // Slightly rounded corners
    min-height: 300px;
    display: flex;
    flex-direction: column;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); // Subtle shadow for depth
`;

const Title = styled.h2`
    text-align: center;
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 20px;
    color: "#333"; // Darker gray for contrast
`;

const Area = styled.div<IAreaProps>`
    background-color: ${(props) =>
        props.isDraggingOver
            ? "#e0ffe6" // Light green for drag-over
            : props.isDraggingFromThis
            ? "#ffe4e1" // Light coral for dragging from this area
            : "transparent"};
    flex-grow: 1; // Stretches to available space
    transition: background-color 0.3s ease-in-out;
    border: ${(props) =>
        props.isDraggingOver || props.isDraggingFromThis
            ? "2px dashed #ccc"
            : "none"}; // Add a dashed border for emphasis
`;

interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}

interface IBoardProps {
    toDos: string[];
    boardId: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {(magic, snapshot) => (
                    <Area
                        isDraggingOver={snapshot.isDraggingOver}
                        isDraggingFromThis={Boolean(
                            snapshot.draggingFromThisWith
                        )}
                        ref={magic.innerRef}
                        {...magic.droppableProps}
                    >
                        {toDos.map((toDo, index) => (
                            <DraggableCard
                                key={toDo}
                                index={index}
                                toDo={toDo}
                            />
                        ))}
                        {magic.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
}

export default Board;
