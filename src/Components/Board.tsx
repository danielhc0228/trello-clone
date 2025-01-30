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
    display: flex;
    justify-content: space-between; /* Pushes title to left and button to right */
    align-items: center; /* Vertically center the items */
    font-weight: 600;
    margin-bottom: 15px;
    font-size: 20px;
    color: #ecf0f1; /* Darker gray for contrast */
    width: 100%; /* Ensure it takes up the full width */
`;

const DeleteButton = styled.button`
    background: transparent;
    border: none;
    padding: 5px;
    cursor: pointer;
    border-radius: 3px;
    font-size: 16px;
    margin-left: 10px; /* Optional: Space between the title and the button */
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
    function handleDelete(toDoId: number) {
        setToDos((allBoards) => {
            const updatedBoards = Object.keys(allBoards).reduce(
                (acc, boardId) => {
                    acc[boardId] = allBoards[boardId].filter(
                        (task) => task.id !== toDoId
                    );
                    return acc;
                },
                {} as typeof allBoards
            );
            return updatedBoards;
        });
    }

    function handleEdit(toDoId: number, newText: string) {
        setToDos((allBoards) => {
            const updatedBoards = Object.keys(allBoards).reduce(
                (acc, boardId) => {
                    acc[boardId] = allBoards[boardId].map((task) =>
                        task.id === toDoId ? { ...task, text: newText } : task
                    );
                    return acc;
                },
                {} as typeof allBoards
            );
            return updatedBoards;
        });
    }

    function handleDeleteBoard(boardId: string) {
        setToDos((allBoards) => {
            const updatedBoards = { ...allBoards };
            delete updatedBoards[boardId];
            return updatedBoards;
        });
    }

    return (
        <Wrapper>
            <Title>
                {boardId}
                <DeleteButton onClick={() => handleDeleteBoard(boardId)}>
                    ❌
                </DeleteButton>
            </Title>

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
                                onDelete={handleDelete}
                                onEdit={handleEdit}
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
