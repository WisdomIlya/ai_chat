import { Skeleton } from "../skeleton/Skeleton";

interface Props {
    question: string;
    answer: string | null;
    isLoading: boolean;
}

export const ChatWindow = ({question, answer, isLoading}: Props) => (
    <div className="border border-white/80 rounded-md flex flex-col p-4 gap-4">
        <div className="bg-white/30 max-w-[calc(100%-40px)] p-4 rounded-md border-white/50 hover:border-white-80 transition-all cursor-pointer">
            <b>Вы: </b> {question}
        </div>
        <div className="bg-white/30 max-w-[calc(100%-40px)] p-4 rounded-md self-end border-white/50 hover:border-white-80 transition-all cursor-pointer">
            <b>AI: </b> {answer ? answer : isLoading ? <Skeleton className="w-16 h-4"/> : ""}
        </div>
    </div>
)