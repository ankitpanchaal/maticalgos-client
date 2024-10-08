import Navbar from "./_components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar name="Ankit" isActive={true} />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
