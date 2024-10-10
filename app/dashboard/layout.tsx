import Navbar from "./_components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100" >
      <Navbar  />
      <main className="h-screen pt-[7%]" >{children}</main>
    </div>
  );
};

export default Layout;
