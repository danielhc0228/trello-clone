import { Draggable } from "@hello-pangea/dnd";
import styled from "styled-components";
import { memo } from "react";

const Card = styled.div`
    border-radius: 5px;
    margin-bottom: 5px;
    padding: 10px 10px;
    background-color: ${(props) => props.theme.cardColor};
`;

interface IDraggableCardProps {
    toDo: string;
    index: number;
}

function DraggableCard({ toDo, index }: IDraggableCardProps) {
    console.log(toDo, "has been rendered");
    return (
        <Draggable draggableId={toDo} index={index}>
            {(magic) => (
                <Card
                    ref={magic.innerRef}
                    {...magic.dragHandleProps}
                    {...magic.draggableProps}
                >
                    {toDo}
                </Card>
            )}
        </Draggable>
    );
}

export default memo(DraggableCard);
