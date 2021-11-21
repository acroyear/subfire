import { GridOn, ViewList } from "@mui/icons-material";
import { Switch } from "@mui/material";
import { useSessionStorage } from "react-use";
import { B } from "../components/ui/TGB";

export const useGridListSelector = () => {
    const [useGrid, setUseGrid] = useSessionStorage(
        "subfire.grid-over-list",
        true
      );
      const useList = !useGrid;
    
      const handleChange = (event: any) => {
        setUseGrid(event.target.checked);
      };
    
      const gridListSwitch = (
        <B className="grid-list-select" alignItems="center">
          <ViewList />
          <Switch checked={useGrid} onChange={handleChange} />
          <GridOn />
        </B>
      );

      return {
        gridListSwitch, useGrid, useList, setUseGrid
      };
}
