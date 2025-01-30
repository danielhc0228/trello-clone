import styled from "styled-components";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toDoState } from "../atom";

interface IForm {
    board: string;
}

function CreateBoard() {
    const [boards, setBoards] = useRecoilState(toDoState);
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const onValid: SubmitHandler<IForm> = ({ board }) => {
        if (!board) return;
        if (boards[board]) return; // Prevent duplicate boards

        setBoards((allBoards) => ({
            ...allBoards,
            [board]: [], // Add an empty board
        }));

        setValue("board", ""); // Clear input field
    };
    return (
        <Form onSubmit={handleSubmit(onValid)}>
            <Input
                {...register("board", { required: true })}
                type='text'
                placeholder={`Add new board here`}
            />
        </Form>
    );
}

export default CreateBoard;

const Form = styled.form`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    width: 100%;
    padding: 15px;
    background: #2d3e50;
    border-radius: 8px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
    width: 70%;
    padding: 12px 15px;
    font-size: 16px;
    border: 2px solid #ccc;
    border-radius: 6px;
    transition: all 0.3s ease-in-out;
    outline: none;

    &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 6px rgba(76, 175, 80, 0.5);
    }

    &::placeholder {
        color: #aaa;
        font-style: italic;
    }
`;
