import { Droppable } from "@hello-pangea/dnd";
import { useForm } from "react-hook-form";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";
import { IToDo, toDoState } from "../atom";
import { useSetRecoilState } from "recoil";

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

const Form = styled.form`
    width: 100%;
    input {
        width: 100%;
    }
`;

interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}

interface IBoardProps {
    toDos: IToDo[];
    boardId: string;
}

interface IForm {
    toDo: string;
}

function Board({ toDos, boardId }: IBoardProps) {
    const setToDos = useSetRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid = ({ toDo }: IForm) => {
        const newToDo = {
            id: Date.now(),
            text: toDo,
        };
        setToDos((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [...allBoards[boardId], newToDo], //e.g. "Doing": [...allBoards["Doing"], newToDo]
            };
        });
        setValue("toDo", "");
    };

    return (
        <Wrapper>
            <Title>{boardId}</Title>
            <Form onSubmit={handleSubmit(onValid)}>
                <input
                    {...register("toDo", { required: true })}
                    type='text'
                    placeholder={`Add task on ${boardId}`}
                ></input>
            </Form>
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
                                key={toDo.id}
                                index={index}
                                toDoId={toDo.id}
                                toDoText={toDo.text}
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
