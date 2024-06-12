import MapDisplay from "./components/MapDisplay";
import Sidebar from "./components/Sidebar/Sidebar";
import SideBtn from "./components/Sidebar/SideBtn";
import SideLabel from "./components/Sidebar/SideLabel";

/*
interface FloorData {
    [Surface: string]: {
        x: number,
        y: number,
        sx: number,
        sy: number,
        r: number,
        z: number,
        desc: string,
        id: string,
        displayName: string[],
        negate: boolean}
}
*/

export default function Home() {
  return (
    <main className="pt-2 pl-4 fixed top-24 left-0 h-100vh-Navrem w-screen">
      <Sidebar>
          <SideLabel extraCss="hidden sm:block">Placeholder</SideLabel>
          <SideLabel >Placeholder2</SideLabel>
          <SideLabel extraCss="hidden sm:block">Placeholder3</SideLabel>
          <SideLabel >Placeholder4</SideLabel>
          <SideBtn>Button</SideBtn>
        </Sidebar>
      <div className="absolute top-24 left-0 -z-20 w-screen">
        <MapDisplay/>
      </div>
    </main>
  );
}
