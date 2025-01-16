import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atom";
import Board from "./Components/Board";

const Wrapper = styled.div`
    display: flex;
    width: 100vw;
    margin: 0 auto;
    justify-content: center;
    align-items: center;
    height: 100vh;
`;
const Boards = styled.div`
    display: flex;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    gap: 10px;
`;

function App() {
    const [toDos, setToDos] = useRecoilState(toDoState);
    const onDragEnd = (info: DropResult) => {
        const { destination, draggableId, source } = info;
        if (destination?.droppableId === source.droppableId) {
            setToDos((allBoard) => {
                const boardCopy = [...allBoard[source.droppableId]];
                boardCopy.splice(source.index, 1);
                boardCopy.splice(destination?.index, 0, draggableId);
                return {
                    ...allBoard,
                    [source.droppableId]: boardCopy,
                };
            });
        }
    };
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Wrapper>
                <Boards>
                    {Object.keys(toDos).map((boardId) => (
                        <Board
                            toDos={toDos[boardId]}
                            boardId={boardId}
                            key={boardId}
                        />
                    ))}
                </Boards>
            </Wrapper>
        </DragDropContext>
    );
}

export default App;
