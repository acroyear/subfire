import {
  SubsonicLoader
} from "@subfire/core";
import { useEffect } from "react";

export default {
  title: "api/Loader",
};

export const loader = () => {
  const apply = () => {
    const params = {
      type: (document.getElementById('loader_type') as HTMLInputElement).value,
      id: (document.getElementById('loader_id') as HTMLInputElement).value,
      mode: (document.getElementById('loader_mode') as HTMLInputElement).value,
    };
    SubsonicLoader(params).then(sl => {
      console.log(sl);
      const s = JSON.stringify(sl, null, 2);
      document.getElementById('result').innerText = s;
    })
  }

  return <>
    <p>
      type: <input id="loader_type"></input><br />
      id: <input id="loader_id"></input><br />
      mode: <input id="loader_mode"></input><br />
      <button onClick={apply}>Apply</button>
    </p>
    <hr />
    <pre id="result"></pre>
  </>
}
