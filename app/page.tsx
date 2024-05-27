import MapDisplay from "./components/MapDisplay";
import Sidebar from "./components/Sidebar/Sidebar";
import SideBtn from "./components/Sidebar/SideBtn";
import SideLabel from "./components/Sidebar/SideLabel";

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
        <p className=" text-md sm:text-lg md:text-xl lg:text-3xl">Page Under Development, Check Again Later</p>
        <MapDisplay/>
      </div>
    </main>
  );
}
