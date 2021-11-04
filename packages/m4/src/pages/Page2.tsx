import { useParams } from "react-router-dom";

interface ptype {
    id: string
}

export const Page2 = (_props: any) => {
    const p = useParams<ptype>();
    return (<>page 2 - {p.id}</>);
}

export default Page2;
