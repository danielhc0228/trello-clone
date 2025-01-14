import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function App() {
    const onDragEnd = () => {};
    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div>
                <Droppable droppableId='one'>
                    {() => (
                        <ul>
                            <Draggable draggableId='first' index={0}>
                                {() => <li>One</li>}
                            </Draggable>
                            <Draggable draggableId='second' index={1}>
                                {() => <li>Two</li>}
                            </Draggable>
                        </ul>
                    )}
                </Droppable>
            </div>
        </DragDropContext>
    );
}

export default App;