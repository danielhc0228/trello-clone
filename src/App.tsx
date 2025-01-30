import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useRecoilState } from "recoil";
import { toDoState } from "./atom";
import TrashCan from "./Components/TrashCan";
import Trello from "./Components/Trello";
import CreateBoard from "./Components/CreateBoard";
import styled from "styled-components";

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
            <Container>
                <Header>Trello Clone</Header>
                <CreateBoard />
                <Trello toDos={toDos} />
                <TrashWrapper>
                    <TrashCan />
                </TrashWrapper>
            </Container>
        </DragDropContext>
    );
}

export default App;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;
    height: 100vh;
    background-color: #34495e;
    padding: 20px;
    gap: 20px;
    overflow: hidden;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 0;
    background-color: #2c3e50;
    color: white;
    font-size: 24px;
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TrashWrapper = styled.div`
    position: fixed;
    bottom: 20px;
    right: 20px;
`;
