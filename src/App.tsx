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

const TrashBinWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    left: 20px;
    width: 50px;
    height: 80px;
    background-color: #808080;
    border-radius: 5px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const Lid = styled.div`
    width: 100%;
    height: 10px;
    background-color: #4b4b4b;
    border-radius: 5px 5px 0 0;
`;

const Body = styled.div`
    width: 100%;
    height: 60px;
    background-color: #333;
    border-radius: 0 0 5px 5px;
`;

const Handle = styled.div`
    width: 20px;
    height: 10px;
    background-color: #333;
    margin: 5px auto;
    border-radius: 10px;
`;

function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        const { destination, source, type } = info;
        if (!destination) return;
        // Ordering boards
        if (type === "BOARD") {
            // Handle reordering of boards
            setToDos((allBoards) => {
                const boardIds = Object.keys(allBoards);
                const [movedBoard] = boardIds.splice(source.index, 1);
                boardIds.splice(destination.index, 0, movedBoard);

                // Create a new ordered state object
                const newBoardState = boardIds.reduce((acc, boardId) => {
                    acc[boardId] = allBoards[boardId];
                    return acc;
                }, {} as typeof allBoards);

                return newBoardState;
            });
        }

        // Ordering tasks within a board
        if (destination?.droppableId === source.droppableId) {
            setToDos((allBoard) => {
                const boardCopy = [...allBoard[source.droppableId]];
                const taskObj = boardCopy[source.index];
                boardCopy.splice(source.index, 1);
                boardCopy.splice(destination?.index, 0, taskObj);
                return {
                    ...allBoard,
                    [source.droppableId]: boardCopy,
                };
            });
        }

        // Ordering tasks between boards
        if (destination.droppableId !== source.droppableId) {
            setToDos((allBoard) => {
                const sourceBoard = [...allBoard[source.droppableId]];
                const destinationBoard = [...allBoard[destination.droppableId]];
                const taskObj = sourceBoard[source.index];
                sourceBoard.splice(source.index, 1);
                destinationBoard.splice(destination?.index, 0, taskObj);
                return {
                    ...allBoard,
                    [source.droppableId]: sourceBoard,
                    [destination.droppableId]: destinationBoard,
                };
            });
        }

        // Remove tasks by dragging to a trash bin
        if (type === "TRASH") {
            setToDos((allBoard) => {
                const sourceBoard = [...allBoard[source.droppableId]];
                const destinationBoard = [...allBoard[destination.droppableId]];
                sourceBoard.splice(source.index, 1);
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
            <Droppable droppableId='trash' direction='horizontal' type='TRASH'>
                {(provided) => (
                    <TrashBinWrapper
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        <Lid />
                        <Body />
                        <Handle />
                    </TrashBinWrapper>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default App;
