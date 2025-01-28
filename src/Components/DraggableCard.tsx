import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { memo } from "react";

const Card = styled.div<{ isDragging: boolean }>`
    border-radius: 8px; // Uniform border-radius
    margin-bottom: 8px; // Better spacing between cards
    padding: 12px;
    background-color: ${(props) =>
        props.isDragging
            ? "#f0f9ff"
            : "#ffffff"}; // Light blue for dragging state
    box-shadow: ${(props) =>
        props.isDragging
            ? "0px 4px 8px rgba(0, 0, 0, 0.15)" // More noticeable shadow when dragging
            : "0px 2px 4px rgba(0, 0, 0, 0.05)"}; // Subtle shadow for non-dragging
    color: ${(props) =>
        props.theme.cardTextColor || "#555"}; // Text color for readability
    border: 1px solid #ddd; // Light border for subtle separation
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {
    return (
        <Draggable draggableId={toDoId + ""} index={index}>
            {(magic, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={magic.innerRef}
                    {...magic.dragHandleProps}
                    {...magic.draggableProps}
                >
                    {toDoText}
                </Card>
            )}
        </Draggable>
    );
}

export default memo(DraggableCard);
