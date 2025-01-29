import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { memo } from "react";
import { useState } from "react";

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
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const ButtonGroup = styled.div`
    display: flex;
    gap: 5px;
`;

const EditButton = styled.button`
    background: #feca57;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 3px;
`;

const DeleteButton = styled.button`
    background: #ff6b6b;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 3px;
`;

interface IDraggableCardProps {
    toDoId: number;
    toDoText: string;
    index: number;
    onDelete: (id: number) => void;
    onEdit: (id: number, newText: string) => void;
}

function DraggableCard({
    toDoId,
    toDoText,
    index,
    onDelete,
    onEdit,
}: IDraggableCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(toDoText);

    const handleEdit = () => {
        if (isEditing) {
            onEdit(toDoId, newText); // Save changes
        }
        setIsEditing(!isEditing); // Toggle edit mode
    };

    return (
        <Draggable draggableId={toDoId + ""} index={index}>
            {(magic, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={magic.innerRef}
                    {...magic.dragHandleProps}
                    {...magic.draggableProps}
                >
                    {isEditing ? (
                        <input
                            type='text'
                            value={newText}
                            onChange={(e) => setNewText(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleEdit()} // Save on Enter key
                            autoFocus
                        />
                    ) : (
                        <span>{toDoText}</span>
                    )}
                    <ButtonGroup>
                        <EditButton onClick={handleEdit}>
                            {isEditing ? "✅" : "✏️"}
                        </EditButton>
                        <DeleteButton onClick={() => onDelete(toDoId)}>
                            ❌
                        </DeleteButton>
                    </ButtonGroup>
                </Card>
            )}
        </Draggable>
    );
}

export default memo(DraggableCard);
