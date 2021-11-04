import { useParams } from "react-router-dom";

interface atype {
    any: string
}

export const Page1 = (_props: any) => {
    const {any} = useParams<atype>();
    return (<>page 404 - {any}</>);
}

export default Page1;
