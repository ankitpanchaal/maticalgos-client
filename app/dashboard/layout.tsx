import Navbar from "./_components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-gray-100" >
      <Navbar  />
      <main className="h-screen pt-20 md:pt-24" >{children}</main>
    </div>
  );
};

export default Layout;
