import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "../../contexts/database";
import { Factory } from "../../types/factory";

export function FactoryPage() {
    const { id } = useParams();
    const nav = useNavigate();
    const factory = useQuery<Factory, "one">("project", "factories", {
        query: { id },
        mode: "one",
    });

    return <></>;
}
