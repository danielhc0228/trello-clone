import {
    DragDropContext,
    Droppable,
    DropResult,
    Draggable,
} from "@hello-pangea/dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./Components/Board";
import TrashCan from "./Components/TrashCan";

const BoardsWrapper = styled.div`
    display: flex;
    width: 100vw;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;
const BoardWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
`;

function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        const { destination, source, type } = info;

        // If dropped outside any valid target, do nothing
        if (!destination) return;

        // If dragging a board (not a task), handle reordering
        if (type === "BOARD") {
            setToDos((allBoards) => {
                const boardIds = Object.keys(allBoards);
                const [movedBoard] = boardIds.splice(source.index, 1);
                boardIds.splice(destination.index, 0, movedBoard);

                const newBoardState = boardIds.reduce((acc, boardId) => {
                    acc[boardId] = allBoards[boardId];
                    return acc;
                }, {} as typeof allBoards);

                return newBoardState;
            });
            return;
        }

        // If a task is dragged into the trash, delete it permanently
        if (destination.droppableId === "trashcan") {
            setToDos((allBoard) => {
                const sourceBoard = [...allBoard[source.droppableId]];
                sourceBoard.splice(source.index, 1); // Remove the dragged task
                return {
                    ...allBoard,
                    [source.droppableId]: sourceBoard, // Update the board without the deleted task
                };
            });
            return;
        }

        // Moving tasks within the same board
        if (destination.droppableId === source.droppableId) {
            setToDos((allBoard) => {
                const boardCopy = [...allBoard[source.droppableId]];
                const taskObj = boardCopy[source.index];

                boardCopy.splice(source.index, 1);
                boardCopy.splice(destination.index, 0, taskObj);

                return {
                    ...allBoard,
                    [source.droppableId]: boardCopy,
                };
            });
            return;
        }

        // Moving tasks between boards
        if (destination.droppableId !== source.droppableId) {
            setToDos((allBoard) => {
                const sourceBoard = [...allBoard[source.droppableId]];
                const destinationBoard = [...allBoard[destination.droppableId]];
                const taskObj = sourceBoard[source.index];

                sourceBoard.splice(source.index, 1);
                destinationBoard.splice(destination.index, 0, taskObj);

                return {
                    ...allBoard,
                    [source.droppableId]: sourceBoard,
                    [destination.droppableId]: destinationBoard,
                };
            });
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable
                droppableId='all-boards'
                direction='horizontal'
                type='BOARD'
            >
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
            <TrashCan />
        </DragDropContext>
    );
}

export default App;
